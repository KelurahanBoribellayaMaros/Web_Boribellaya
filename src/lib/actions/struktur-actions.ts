"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB, stays well under Firestore's 1MiB doc limit once base64-encoded

export async function updateLeaderAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const nip = String(formData.get("nip") ?? "").trim();

  const data: Record<string, unknown> = {
    name,
    position,
    nip,
    updatedAt: new Date().toISOString(),
  };

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
      throw new Error("Foto harus berformat JPG, PNG, atau WEBP.");
    }
    if (photo.size > MAX_PHOTO_SIZE) {
      throw new Error("Ukuran foto maksimal 600KB.");
    }
    const buffer = Buffer.from(await photo.arrayBuffer());
    data.photo = `data:${photo.type};base64,${buffer.toString("base64")}`;
  }

  await adminDb.collection("settings").doc("leader").set(data, { merge: true });

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "leader",
    details: name,
  });

  redirect(
    toastRedirectUrl(
      "/admin/struktur-organisasi",
      "Profil pimpinan berhasil diperbarui."
    )
  );
}

type OrgPositionInput = {
  id: string;
  name: string;
  position: string;
  nip: string;
  order: number;
  parentId: string | null;
  photo?: string;
};

export async function updateOrgPositionsAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  let rows: {
    id?: string;
    name: string;
    position: string;
    nip?: string;
    photo?: string;
    parentId?: string | null;
  }[];
  try {
    rows = JSON.parse(String(formData.get("positionsJson") ?? "[]"));
  } catch {
    throw new Error("Data struktur tidak valid.");
  }

  const positions: OrgPositionInput[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row.name ?? "").trim();
    const position = String(row.position ?? "").trim();
    if (!name || !position) continue;

    let photo = row.photo ? String(row.photo) : undefined;
    const newPhoto = formData.get(`photo-${i}`);
    if (newPhoto instanceof File && newPhoto.size > 0) {
      if (!ALLOWED_PHOTO_TYPES.has(newPhoto.type)) {
        throw new Error(`Foto untuk "${name}" harus berformat JPG, PNG, atau WEBP.`);
      }
      if (newPhoto.size > MAX_PHOTO_SIZE) {
        throw new Error(`Ukuran foto untuk "${name}" maksimal 600KB.`);
      }
      const buffer = Buffer.from(await newPhoto.arrayBuffer());
      photo = `data:${newPhoto.type};base64,${buffer.toString("base64")}`;
    }

    positions.push({
      id: String(row.id ?? "").trim() || randomUUID(),
      name,
      position,
      nip: String(row.nip ?? "").trim(),
      order: positions.length,
      parentId: row.parentId ? String(row.parentId) : null,
      ...(photo && { photo }),
    });
  }

  // A parent that got dropped this save (its own row was left blank and
  // skipped above) would otherwise leave a dangling reference — fall back
  // those orphaned rows to reporting directly to the Lurah instead.
  const validIds = new Set(positions.map((p) => p.id));
  for (const p of positions) {
    if (p.parentId && !validIds.has(p.parentId)) p.parentId = null;
  }

  // Reject cycles (e.g. A reports to B, B reports to A) with a clear error
  // naming the position to fix, rather than silently breaking the tree.
  for (const start of positions) {
    const seen = new Set<string>();
    let current: OrgPositionInput | undefined = start;
    while (current?.parentId) {
      if (seen.has(current.id)) {
        throw new Error(
          `Struktur "${start.position}" membentuk lingkaran (atasan saling menunjuk). Perbaiki pilihan Atasan-nya.`
        );
      }
      seen.add(current.id);
      current = positions.find((p) => p.id === current!.parentId);
    }
  }

  await adminDb.collection("settings").doc("org_positions").set(
    { positions, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "org_position",
    details: `${positions.length} posisi`,
  });

  redirect(
    toastRedirectUrl("/admin/struktur-organisasi", "Struktur organisasi berhasil disimpan.")
  );
}

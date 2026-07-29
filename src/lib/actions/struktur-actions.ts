"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { toastRedirectUrl } from "@/lib/toast-redirect";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB, stays well under Firestore's 1MiB doc limit once base64-encoded

export async function updateLeaderAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const nip = String(formData.get("nip") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const term = String(formData.get("term") ?? "").trim();

  const data: Record<string, unknown> = {
    name,
    position,
    nip,
    bio,
    email,
    term,
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

  redirect(
    toastRedirectUrl(
      "/admin/struktur-organisasi",
      "Profil pimpinan berhasil diperbarui."
    )
  );
}

function readPositionInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    position: String(formData.get("position") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };
}

export async function createOrgPositionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const input = readPositionInput(formData);

  await adminDb.collection("org_positions").add(input);

  redirect(
    toastRedirectUrl("/admin/struktur-organisasi", "Posisi berhasil ditambahkan.")
  );
}

export async function updateOrgPositionAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const input = readPositionInput(formData);

  await adminDb.collection("org_positions").doc(id).set(input, { merge: true });

  redirect(
    toastRedirectUrl("/admin/struktur-organisasi", "Posisi berhasil diubah.")
  );
}

export async function deleteOrgPositionAction(id: string): Promise<void> {
  await requireAdmin();
  await adminDb.collection("org_positions").doc(id).delete();
  redirect(
    toastRedirectUrl("/admin/struktur-organisasi", "Posisi berhasil dihapus.")
  );
}

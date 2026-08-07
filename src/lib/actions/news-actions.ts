"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import type { NewsCategory } from "@/types/home";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB, stays well under Firestore's 1MiB doc limit once base64-encoded

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readNewsInput(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  if (!date) {
    throw new Error("Tanggal wajib diisi.");
  }

  const source = String(formData.get("source") ?? "").trim();

  return {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    date,
    category: (formData.get("category") === "pengumuman"
      ? "pengumuman"
      : "berita") satisfies NewsCategory,
    source: source || null,
  };
}

async function readCoverImage(formData: FormData): Promise<string | undefined> {
  const photo = formData.get("coverImage");
  if (!(photo instanceof File) || photo.size === 0) return undefined;

  if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
    throw new Error("Foto sampul harus berformat JPG, PNG, atau WEBP.");
  }
  if (photo.size > MAX_PHOTO_SIZE) {
    throw new Error("Ukuran foto sampul maksimal 600KB.");
  }

  const buffer = Buffer.from(await photo.arrayBuffer());
  return `data:${photo.type};base64,${buffer.toString("base64")}`;
}

export async function createNewsAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const input = readNewsInput(formData);
  const coverImage = await readCoverImage(formData);
  const now = new Date().toISOString();

  const docRef = await adminDb.collection("news").add({
    ...input,
    ...(coverImage && { coverImage }),
    slug: slugify(input.title),
    createdAt: now,
    updatedAt: now,
  });

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "create",
    target: "berita",
    targetId: docRef.id,
    details: input.title,
  });

  redirect(toastRedirectUrl("/admin/berita", "Berita berhasil ditambahkan."));
}

export async function updateNewsAction(
  id: string,
  formData: FormData
): Promise<void> {
  const session = await requireAdmin();
  const input = readNewsInput(formData);
  const coverImage = await readCoverImage(formData);

  await adminDb
    .collection("news")
    .doc(id)
    .set(
      {
        ...input,
        ...(coverImage && { coverImage }),
        slug: slugify(input.title),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "berita",
    targetId: id,
    details: input.title,
  });

  redirect(toastRedirectUrl("/admin/berita", "Berita berhasil diperbarui."));
}

export async function deleteNewsAction(id: string): Promise<void> {
  const session = await requireAdmin();
  await adminDb.collection("news").doc(id).delete();

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "delete",
    target: "berita",
    targetId: id,
  });

  redirect(toastRedirectUrl("/admin/berita", "Berita berhasil dihapus."));
}

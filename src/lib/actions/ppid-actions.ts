"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { supabaseAdmin, PPID_BUCKET } from "@/lib/supabase/client";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import type { PpidCategory } from "@/types/ppid";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export async function createPpidUploadUrlAction(input: {
  fileType: string;
  fileSize: number;
}): Promise<{ path: string; token: string }> {
  await requireAdmin();

  const extension = ALLOWED_MIME_TYPES[input.fileType];
  if (!extension) {
    throw new Error("Hanya file PDF atau DOCX yang diperbolehkan.");
  }
  if (input.fileSize > MAX_FILE_SIZE) {
    throw new Error("Ukuran file maksimal 3MB.");
  }

  const path = `${randomUUID()}.${extension}`;
  const { data, error } = await supabaseAdmin.storage
    .from(PPID_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error("Gagal membuat URL unggah. Silakan coba lagi.");
  }

  return { path: data.path, token: data.token };
}

export async function createPpidDocumentAction(input: {
  path: string;
  title: string;
  description: string;
  category: PpidCategory;
  date: string;
}): Promise<void> {
  await requireAdmin();

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(PPID_BUCKET)
    .getPublicUrl(input.path);

  const now = new Date().toISOString();
  await adminDb.collection("ppid_documents").add({
    title: input.title,
    description: input.description,
    category: input.category,
    year: new Date(input.date).getFullYear(),
    date: input.date,
    fileUrl: publicUrlData.publicUrl,
    filePath: input.path,
    createdAt: now,
    updatedAt: now,
  });

  redirect(toastRedirectUrl("/admin/ppid", "Dokumen berhasil diunggah."));
}

export async function deletePpidDocumentAction(id: string): Promise<void> {
  await requireAdmin();

  const doc = await adminDb.collection("ppid_documents").doc(id).get();
  const filePath = doc.data()?.filePath as string | undefined;

  if (filePath) {
    await supabaseAdmin.storage
      .from(PPID_BUCKET)
      .remove([filePath])
      .catch(() => {});
  }

  await adminDb.collection("ppid_documents").doc(id).delete();
  redirect(toastRedirectUrl("/admin/ppid", "Dokumen berhasil dihapus."));
}

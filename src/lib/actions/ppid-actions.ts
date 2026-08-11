"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { supabaseAdmin, PPID_BUCKET } from "@/lib/supabase/client";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import {
  getPpidDocuments,
  getPpidDocumentsByCategory,
} from "@/lib/firebase/ppid-repository";
import type { PpidCategory, PpidDocument } from "@/types/ppid";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
    throw new Error("Ukuran file maksimal 2MB.");
  }

  const path = `${randomUUID()}.${extension}`;
  const { data, error } = await supabaseAdmin.storage
    .from(PPID_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error("Gagal membuat URL unggah. Silakan coba lagi.");
  }

  return { path, token: data.token };
}

export async function createPpidDocumentAction(input: {
  path?: string;
  title: string;
  description: string;
  category: PpidCategory;
  date: string;
  websiteUrl?: string;
}): Promise<void> {
  const session = await requireAdmin();

  if (!input.date) {
    throw new Error("Tanggal wajib diisi.");
  }
  if (input.websiteUrl && !input.websiteUrl.startsWith("/")) {
    throw new Error("Link halaman website harus dimulai dengan / (mis. /profil).");
  }

  const now = new Date().toISOString();
  const data: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    category: input.category,
    year: new Date(input.date).getFullYear(),
    date: input.date,
    createdAt: now,
    updatedAt: now,
  };

  if (input.path) {
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(PPID_BUCKET)
      .getPublicUrl(input.path);
    data.fileUrl = publicUrlData.publicUrl;
    data.filePath = input.path;
  }
  if (input.websiteUrl) {
    data.websiteUrl = input.websiteUrl;
  }

  const docRef = await adminDb.collection("ppid_documents").add(data);

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "create",
    target: "ppid_document",
    targetId: docRef.id,
    details: input.title,
  });

  redirect(toastRedirectUrl("/admin/ppid", "Dokumen berhasil diunggah."));
}

export async function updatePpidDocumentAction(
  id: string,
  input: {
    path?: string;
    title: string;
    description: string;
    category: PpidCategory;
    date: string;
    websiteUrl?: string;
  }
): Promise<void> {
  const session = await requireAdmin();

  if (!input.date) {
    throw new Error("Tanggal wajib diisi.");
  }
  if (input.websiteUrl && !input.websiteUrl.startsWith("/")) {
    throw new Error("Link halaman website harus dimulai dengan / (mis. /profil).");
  }

  const data: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    category: input.category,
    year: new Date(input.date).getFullYear(),
    date: input.date,
    websiteUrl: input.websiteUrl || null,
    updatedAt: new Date().toISOString(),
  };

  if (input.path) {
    const existing = await adminDb.collection("ppid_documents").doc(id).get();
    const oldPath = existing.data()?.filePath as string | undefined;
    if (oldPath) {
      await supabaseAdmin.storage.from(PPID_BUCKET).remove([oldPath]).catch(() => { });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(PPID_BUCKET)
      .getPublicUrl(input.path);
    data.fileUrl = publicUrlData.publicUrl;
    data.filePath = input.path;
  }

  await adminDb.collection("ppid_documents").doc(id).set(data, { merge: true });

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "ppid_document",
    targetId: id,
    details: input.title,
  });

  redirect(toastRedirectUrl("/admin/ppid", "Dokumen berhasil diperbarui."));
}

export async function deletePpidDocumentAction(id: string): Promise<void> {
  const session = await requireAdmin();

  const doc = await adminDb.collection("ppid_documents").doc(id).get();
  const filePath = doc.data()?.filePath as string | undefined;
  const title = doc.data()?.title as string | undefined;

  if (filePath) {
    const cleanPath = filePath.replace(/^ppid-documents\//, "");
    await supabaseAdmin.storage
      .from(PPID_BUCKET)
      .remove([cleanPath])
      .catch(() => { });
  }

  await adminDb.collection("ppid_documents").doc(id).delete();

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "delete",
    target: "ppid_document",
    targetId: id,
    details: title,
  });

  redirect(toastRedirectUrl("/admin/ppid", "Dokumen berhasil dihapus."));
}

export async function loadMorePpidCategoryAction(
  category: PpidCategory
): Promise<PpidDocument[]> {
  return getPpidDocumentsByCategory(category);
}

export async function searchPpidDocumentsAction(query: string): Promise<PpidDocument[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const documents = await getPpidDocuments();
  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q)
  );
}

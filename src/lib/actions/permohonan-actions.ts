"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getAdminEmails } from "@/lib/firebase/users-repository";
import { logAudit } from "@/lib/firebase/audit-repository";
import { getSiteUrl, sendEmail } from "@/lib/email";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { supabaseAdmin, PERMOHONAN_BUCKET } from "@/lib/supabase/client";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus, PermohonanType } from "@/types/permohonan";
import { permohonanSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";
import { verifyTurnstileToken } from "@/lib/turnstile";

const ALLOWED_BERKAS_MIME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const MAX_BERKAS_SIZE = 2 * 1024 * 1024; // 2MB

export async function createPermohonanUploadUrlAction(input: {
  fileType: string;
  fileSize: number;
}): Promise<{ path: string; token: string }> {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const allowed = await checkRateLimit(`upload_permohonan:${ip}`, 30, 60 * 60 * 1000);
  if (!allowed) {
    throw new Error("Terlalu banyak permintaan unggah. Silakan coba lagi nanti.");
  }
  const extension = ALLOWED_BERKAS_MIME_TYPES[input.fileType];
  if (!extension) {
    throw new Error("Hanya file PDF, JPG, atau PNG yang diperbolehkan.");
  }
  if (input.fileSize > MAX_BERKAS_SIZE) {
    throw new Error("Ukuran file maksimal 2MB.");
  }

  const path = `${randomUUID()}.${extension}`;
  const { data, error } = await supabaseAdmin.storage
    .from(PERMOHONAN_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error("Gagal membuat URL unggah. Silakan coba lagi.");
  }

  return { path: data.path, token: data.token };
}

// A short, human-readable reference shown to citizens (the Firestore doc id
// itself is never displayed). Purely a display label, not a lookup key, so
// no transaction/counter is needed to guarantee uniqueness — collision odds
// are negligible at a single kelurahan's realistic submission volume.
function generatePermohonanNumber(type: PermohonanType): string {
  const prefix = type === "informasi" ? "INF" : "LYN";
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

const emailFooter = `
  <p style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
    Email ini dikirim oleh sistem Kelurahan Boribellaya. Ada pertanyaan?
    Silakan balas email ini, kami akan membacanya.
  </p>
`;

function newPermohonanEmailHtml(params: {
  id: string;
  type: PermohonanType;
  categoryLabel: string;
  name: string;
  email: string;
}): string {
  const jenis = params.type === "informasi" ? "Permohonan Informasi (PPID)" : "Permohonan Layanan";
  const detailUrl = `${getSiteUrl()}/admin/permohonan/${params.id}`;

  return `
    <p>Ada permohonan baru masuk dari warga.</p>
    <ul>
      <li><strong>Jenis:</strong> ${jenis}</li>
      <li><strong>Kategori:</strong> ${params.categoryLabel}</li>
      <li><strong>Nama:</strong> ${params.name}</li>
      <li><strong>Email:</strong> ${params.email}</li>
    </ul>
    <p><a href="${detailUrl}">Lihat &amp; proses permohonan ini</a></p>
    ${emailFooter}
  `;
}

function statusChangeEmailHtml(params: {
  type: PermohonanType;
  categoryLabel: string;
  status: PermohonanStatus;
}): string {
  const jenis = params.type === "informasi" ? "permohonan informasi" : "permohonan layanan";

  return `
    <p>Status ${jenis} Anda telah diperbarui.</p>
    <ul>
      <li><strong>Kategori:</strong> ${params.categoryLabel}</li>
      <li><strong>Status baru:</strong> ${statusLabels[params.status]}</li>
    </ul>
    <p>Masuk ke akun Anda di <a href="${getSiteUrl()}">${getSiteUrl()}</a> untuk melihat detailnya.</p>
    ${emailFooter}
  `;
}

export async function submitPermohonanAction(
  type: PermohonanType,
  category: string,
  categoryLabel: string,
  formData: FormData
): Promise<void> {
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  if (!phoneRaw) {
    throw new Error("Nomor WhatsApp wajib diisi.");
  }

  const allowed = await checkRateLimit(`submit_permohonan:${phoneRaw}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    throw new Error(
      "Anda telah mengirim terlalu banyak permohonan. Silakan coba lagi dalam satu jam ke depan."
    );
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      throw new Error("Sistem mendeteksi aktivitas yang mencurigakan. Silakan muat ulang halaman dan coba lagi.");
    }
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
      throw new Error("Verifikasi keamanan gagal. Silakan coba lagi.");
    }
  }

  const parseResult = permohonanSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    description: formData.get("description"),
    nik: formData.get("nik"),
    identityCategory: formData.get("identityCategory"),
    address: formData.get("address"),
    occupation: formData.get("occupation"),
    usagePurpose: formData.get("usagePurpose"),
    email: formData.get("email"),
    berkasJson: formData.get("berkasJson"),
  });

  if (!parseResult.success) {
    throw new Error(parseResult.error.issues[0].message);
  }

  const {
    name,
    phone,
    email,
    description,
    nik,
    identityCategory,
    address,
    occupation,
    usagePurpose,
    copyFormat,
    berkasJson,
  } = parseResult.data;
  
  // Only sent by layanan forms that require document uploads — absent
  // (and skipped) for the informasi form.
  const berkas = berkasJson ? JSON.parse(berkasJson) : undefined;

  const now = new Date().toISOString();
  const number = generatePermohonanNumber(type);
  const docRef = await adminDb.collection("permohonan").add({
    number,
    type,
    category,
    categoryLabel,
    name,
    email: email || undefined,
    phone,
    description,
    status: "baru",
    createdAt: now,
    updatedAt: now,
    ...(nik && { nik }),
    ...(identityCategory && { identityCategory }),
    ...(address && { address }),
    ...(occupation && { occupation }),
    ...(usagePurpose && { usagePurpose }),
    ...(copyFormat && { copyFormat }),
    ...(berkas && berkas.length > 0 && { berkas }),
  });

  // Best-effort: a citizen's request is already saved regardless of whether
  // this email succeeds, so failures here must never block the submission.
  try {
    const adminEmails = await getAdminEmails();
    if (adminEmails.length > 0) {
      await sendEmail({
        to: adminEmails,
        subject: `Permohonan baru: ${categoryLabel}`,
        html: newPermohonanEmailHtml({ id: docRef.id, type, categoryLabel, name, email: email || "-" }),
      });
    }
  } catch (error) {
    console.error("Gagal mengirim notifikasi email ke admin:", error);
  }

  redirect(`/permohonan/terkirim?nomor=${encodeURIComponent(number)}`);
}

export async function updatePermohonanStatusAction(
  id: string,
  formData: FormData
): Promise<void> {
  const session = await requireAdmin();

  const status = formData.get("status") as PermohonanStatus;
  const item = await getPermohonanById(id);

  await adminDb.collection("permohonan").doc(id).set(
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "status_change",
    target: "permohonan",
    targetId: id,
    details: `${item?.categoryLabel ?? ""} -> ${statusLabels[status]}`,
  });



  redirect(
    toastRedirectUrl("/admin/permohonan", "Status permohonan berhasil diperbarui.")
  );
}

export async function deletePermohonanAction(id: string): Promise<void> {
  const session = await requireAdmin();

  const item = await getPermohonanById(id);

  if (item?.berkas && item.berkas.length > 0) {
    await supabaseAdmin.storage
      .from(PERMOHONAN_BUCKET)
      .remove(item.berkas.map((b) => b.path))
      .catch(() => {});
  }

  await adminDb.collection("permohonan").doc(id).delete();

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "delete",
    target: "permohonan",
    targetId: id,
    details: item?.categoryLabel,
  });

  redirect(toastRedirectUrl("/admin/permohonan", "Permohonan berhasil dihapus."));
}

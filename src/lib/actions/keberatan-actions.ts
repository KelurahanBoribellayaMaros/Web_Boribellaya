"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByPermohonanId, getKeberatanById } from "@/lib/firebase/keberatan-repository";
import { getAdminEmails } from "@/lib/firebase/users-repository";
import { logAudit } from "@/lib/firebase/audit-repository";
import { getSiteUrl, sendEmail } from "@/lib/email";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";
import { keberatanReasonLabels } from "@/types/keberatan";
import { keberatanSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";
import { verifyTurnstileToken } from "@/lib/turnstile";

const emailFooter = `
  <p style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
    Email ini dikirim oleh sistem Kelurahan Boribellaya. Ada pertanyaan?
    Silakan balas email ini, kami akan membacanya.
  </p>
`;

function newKeberatanEmailHtml(params: {
  id: string;
  categoryLabel: string;
  name: string;
  email: string;
}): string {
  const detailUrl = `${getSiteUrl()}/admin/keberatan/${params.id}`;

  return `
    <p>Ada pengajuan keberatan informasi publik baru dari warga.</p>
    <ul>
      <li><strong>Permohonan asal:</strong> ${params.categoryLabel}</li>
      <li><strong>Nama:</strong> ${params.name}</li>
      <li><strong>Email:</strong> ${params.email}</li>
    </ul>
    <p><a href="${detailUrl}">Lihat &amp; proses keberatan ini</a></p>
    ${emailFooter}
  `;
}

function keberatanStatusChangeEmailHtml(params: {
  categoryLabel: string;
  status: PermohonanStatus;
  catatan?: string;
}): string {
  return `
    <p>Status keberatan informasi publik Anda telah diperbarui.</p>
    <ul>
      <li><strong>Permohonan asal:</strong> ${params.categoryLabel}</li>
      <li><strong>Status baru:</strong> ${statusLabels[params.status]}</li>
    </ul>
    ${params.catatan ? `<p><strong>Catatan dari petugas:</strong><br>${params.catatan}</p>` : ""}
    <p>Masuk ke akun Anda di <a href="${getSiteUrl()}">${getSiteUrl()}</a> untuk melihat detailnya.</p>
    ${emailFooter}
  `;
}

const VALID_REASONS = new Set<string>(Object.keys(keberatanReasonLabels));

export async function submitKeberatanAction(
  permohonanId: string,
  formData: FormData
): Promise<void> {
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const nameRaw = String(formData.get("name") ?? "").trim();
  
  if (!phoneRaw || !nameRaw) {
    throw new Error("Nama dan Nomor WhatsApp wajib diisi.");
  }

  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    redirect("/permohonan/terkirim");
  }

  const allowed = await checkRateLimit(`submit_keberatan:${phoneRaw}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    throw new Error("Terlalu banyak percobaan. Silakan coba lagi dalam satu jam ke depan.");
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

  const item = await getPermohonanById(permohonanId);
  if (!item) {
    throw new Error("Permohonan tidak ditemukan.");
  }
  if (item.type !== "informasi") {
    throw new Error("Keberatan hanya bisa diajukan untuk permohonan informasi publik.");
  }
  if (item.phone && item.phone !== phoneRaw) {
    throw new Error("Nomor WhatsApp tidak cocok dengan data permohonan.");
  }
  const existing = await getKeberatanByPermohonanId(permohonanId);
  if (existing) {
    throw new Error("Keberatan untuk permohonan ini sudah pernah diajukan.");
  }

  const parseResult = keberatanSchema.safeParse({
    reasons: formData.getAll("reasons").map(String),
    kronologi: formData.get("kronologi"),
    isKuasa: formData.get("isKuasa") === "on",
    kuasaName: formData.get("kuasaName"),
  });

  if (!parseResult.success) {
    throw new Error(parseResult.error.issues[0].message);
  }

  const { reasons, kronologi, isKuasa, kuasaName } = parseResult.data;

  const now = new Date().toISOString();
  const docRef = await adminDb.collection("keberatan").add({
    permohonanId,
    permohonanNumber: item.number ?? null,
    permohonanCategoryLabel: item.categoryLabel,
    name: nameRaw,
    email: formData.get("email")?.toString() || null,
    phone: phoneRaw,
    reasons,
    kronologi,
    isKuasa,
    ...(isKuasa && kuasaName && { kuasaName }),
    status: "baru",
    createdAt: now,
    updatedAt: now,
  });

  // Best-effort: the objection is already saved regardless of whether this
  // email succeeds.
  try {
    const adminEmails = await getAdminEmails();
    if (adminEmails.length > 0) {
      await sendEmail({
        to: adminEmails,
        subject: `Keberatan baru: ${item.categoryLabel}`,
        html: newKeberatanEmailHtml({
          id: docRef.id,
          categoryLabel: item.categoryLabel,
          name: item.name,
          email: item.email ?? "-",
        }),
      });
    }
  } catch (error) {
    console.error("Gagal mengirim notifikasi email ke admin:", error);
  }

  await logAudit({
    uid: "warga",
    email: formData.get("email")?.toString() || "warga@public",
    action: "create",
    target: "keberatan",
    targetId: docRef.id,
    details: item.categoryLabel,
  });

  redirect("/permohonan/terkirim");
}

export async function updateKeberatanStatusAction(
  id: string,
  formData: FormData
): Promise<void> {
  const session = await requireAdmin();

  const status = formData.get("status") as PermohonanStatus;
  const catatan = String(formData.get("catatan") ?? "").trim();
  const item = await getKeberatanById(id);

  await adminDb.collection("keberatan").doc(id).set(
    {
      status,
      catatan: catatan || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "status_change",
    target: "keberatan",
    targetId: id,
    details: `${item?.permohonanCategoryLabel ?? ""} -> ${statusLabels[status]}`,
  });



  redirect(toastRedirectUrl("/admin/keberatan", "Status keberatan berhasil diperbarui."));
}

export async function deleteKeberatanAction(id: string): Promise<void> {
  const session = await requireAdmin();

  const item = await getKeberatanById(id);

  await adminDb.collection("keberatan").doc(id).delete();

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "delete",
    target: "keberatan",
    targetId: id,
    details: item?.permohonanCategoryLabel,
  });

  redirect(toastRedirectUrl("/admin/keberatan", "Keberatan berhasil dihapus."));
}

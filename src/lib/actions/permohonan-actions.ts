"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, requireSession } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getAdminEmails } from "@/lib/firebase/users-repository";
import { getSiteUrl, sendEmail } from "@/lib/email";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus, PermohonanType } from "@/types/permohonan";

const emailFooter = `
  <p style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
    Email otomatis dari sistem Kelurahan Boribellaya. Mohon tidak membalas email ini.
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
  // Requires login so every request is tied to a real account email —
  // never trust a client-submitted email field for this.
  const session = await requireSession();
  if (!session.email) {
    throw new Error("Email akun tidak ditemukan. Silakan masuk kembali.");
  }

  // Honeypot: real users never fill this hidden field; bots that
  // auto-fill every input will, so we silently drop the submission.
  if (String(formData.get("website") ?? "").trim() !== "") {
    redirect("/permohonan/terkirim");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = session.email;
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !description) {
    throw new Error("Nama dan keperluan wajib diisi.");
  }

  // PPID-specific fields — only sent by the informasi request form, so
  // these are simply absent (and skipped below) for layanan submissions.
  const nik = String(formData.get("nik") ?? "").trim();
  const identityCategory = String(formData.get("identityCategory") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const occupation = String(formData.get("occupation") ?? "").trim();
  const usagePurpose = String(formData.get("usagePurpose") ?? "").trim();
  const copyFormat = String(formData.get("copyFormat") ?? "").trim();

  const now = new Date().toISOString();
  const docRef = await adminDb.collection("permohonan").add({
    type,
    category,
    categoryLabel,
    name,
    email,
    phone: phone || null,
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
  });

  // Best-effort: a citizen's request is already saved regardless of whether
  // this email succeeds, so failures here must never block the submission.
  try {
    const adminEmails = await getAdminEmails();
    if (adminEmails.length > 0) {
      await sendEmail({
        to: adminEmails,
        subject: `Permohonan baru: ${categoryLabel}`,
        html: newPermohonanEmailHtml({ id: docRef.id, type, categoryLabel, name, email }),
      });
    }
  } catch (error) {
    console.error("Gagal mengirim notifikasi email ke admin:", error);
  }

  redirect("/permohonan/terkirim");
}

export async function updatePermohonanStatusAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const status = formData.get("status") as PermohonanStatus;
  const item = await getPermohonanById(id);

  await adminDb.collection("permohonan").doc(id).set(
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Best-effort: the status is already saved regardless of whether this
  // email succeeds. Only notify when the status actually changed.
  if (item && item.status !== status) {
    try {
      await sendEmail({
        to: item.email,
        subject: `Status permohonan Anda: ${statusLabels[status]}`,
        html: statusChangeEmailHtml({
          type: item.type,
          categoryLabel: item.categoryLabel,
          status,
        }),
      });
    } catch (error) {
      console.error("Gagal mengirim notifikasi email ke warga:", error);
    }
  }

  redirect(
    toastRedirectUrl("/admin/permohonan", "Status permohonan berhasil diperbarui.")
  );
}

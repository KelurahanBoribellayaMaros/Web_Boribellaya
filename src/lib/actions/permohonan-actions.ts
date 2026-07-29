"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import type { PermohonanStatus, PermohonanType } from "@/types/permohonan";

export async function submitPermohonanAction(
  type: PermohonanType,
  category: string,
  categoryLabel: string,
  formData: FormData
): Promise<void> {
  // Honeypot: real users never fill this hidden field; bots that
  // auto-fill every input will, so we silently drop the submission.
  if (String(formData.get("website") ?? "").trim() !== "") {
    redirect("/permohonan/terkirim");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !email || !description) {
    throw new Error("Nama, email, dan keperluan wajib diisi.");
  }

  const now = new Date().toISOString();
  await adminDb.collection("permohonan").add({
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
  });

  redirect("/permohonan/terkirim");
}

export async function updatePermohonanStatusAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const status = formData.get("status") as PermohonanStatus;

  await adminDb.collection("permohonan").doc(id).set(
    {
      status,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  redirect(
    toastRedirectUrl("/admin/permohonan", "Status permohonan berhasil diperbarui.")
  );
}

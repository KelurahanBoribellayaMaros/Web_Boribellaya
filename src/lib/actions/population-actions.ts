"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";

export async function updatePopulationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const totalPenduduk = Number(formData.get("totalPenduduk"));
  const kepalaKeluarga = Number(formData.get("kepalaKeluarga"));
  const lakiLaki = Number(formData.get("lakiLaki"));
  const perempuan = Number(formData.get("perempuan"));

  await adminDb.collection("settings").doc("population").set(
    {
      totalPenduduk,
      kepalaKeluarga,
      lakiLaki,
      perempuan,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "population",
  });

  redirect(
    toastRedirectUrl("/admin/data-penduduk", "Data penduduk berhasil diperbarui.")
  );
}

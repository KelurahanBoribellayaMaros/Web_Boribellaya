"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import type { PopulationRw } from "@/types/population";

export async function updatePopulationDetailAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  let rwsInput: PopulationRw[];
  try {
    rwsInput = JSON.parse(String(formData.get("rwsJson") ?? "[]"));
  } catch {
    throw new Error("Data tabel tidak valid.");
  }

  const rws: PopulationRw[] = rwsInput
    .map((rw) => ({
      name: String(rw.name ?? "").trim(),
      rts: (Array.isArray(rw.rts) ? rw.rts : []).map((rt) => ({
        rt: String(rt.rt ?? "").trim(),
        laki: Number(rt.laki) || 0,
        perempuan: Number(rt.perempuan) || 0,
        kk: Number(rt.kk) || 0,
        rumah: Number(rt.rumah) || 0,
      })),
    }))
    .filter((rw) => rw.name);

  await adminDb.collection("settings").doc("population_detail").set(
    { rws, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "population_detail",
  });

  redirect(
    toastRedirectUrl("/admin/data-penduduk", "Tabel data penduduk berhasil diperbarui.")
  );
}

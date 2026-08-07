"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { layananItems } from "@/lib/layanan-data";

export async function updateLayananStatusAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  // Unchecked checkboxes are simply absent from FormData, so every slug is
  // checked explicitly here rather than only writing what's present —
  // otherwise turning a service back OFF-then-ON-then-OFF again could
  // silently no-op on a merge write.
  const data: Record<string, boolean> = {};
  for (const item of layananItems) {
    data[item.slug] = formData.get(`enabled-${item.slug}`) === "on";
  }

  await adminDb.collection("settings").doc("layanan_status").set(data);

  const disabled = layananItems.filter((item) => !data[item.slug]).map((item) => item.title);

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "layanan_status",
    details: disabled.length > 0 ? `Nonaktif: ${disabled.join(", ")}` : "Semua layanan aktif",
  });

  redirect(toastRedirectUrl("/admin/layanan", "Status layanan berhasil diperbarui."));
}

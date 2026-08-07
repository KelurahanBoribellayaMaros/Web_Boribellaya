"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";

const ALLOWED_MAPS_EMBED_PREFIX = "https://www.google.com/maps/embed";

/** Admins often paste the whole <iframe> snippet Google Maps gives them, not just the src URL. */
function extractMapsEmbedUrl(input: string): string {
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  return (iframeMatch ? iframeMatch[1] : input).trim();
}

export async function updateKontakAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const address = String(formData.get("address") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const mapsEmbedUrl = extractMapsEmbedUrl(String(formData.get("mapsEmbedUrl") ?? ""));

  if (mapsEmbedUrl && !mapsEmbedUrl.startsWith(ALLOWED_MAPS_EMBED_PREFIX)) {
    throw new Error(
      "URL peta harus berupa link embed resmi Google Maps (diawali https://www.google.com/maps/embed)."
    );
  }

  await adminDb.collection("settings").doc("kontak").set(
    {
      address,
      whatsapp,
      email,
      hours,
      mapsEmbedUrl: mapsEmbedUrl || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "kontak",
  });

  redirect(toastRedirectUrl("/admin/kontak", "Info kontak berhasil diperbarui."));
}

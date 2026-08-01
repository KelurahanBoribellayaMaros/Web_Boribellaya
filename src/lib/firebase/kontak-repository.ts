import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { KontakInfo } from "@/types/kontak";

// Shown only if settings/kontak hasn't been configured yet — deliberately
// generic placeholder text, never a fabricated address/number. Silently
// falling back to made-up contact details would mislead citizens.
const EMPTY_KONTAK: KontakInfo = {
  address: "Data belum tersedia",
  whatsapp: "",
  email: "",
  hours: "08:00 - 16:00 WITA",
  mapsEmbedUrl: undefined,
};

export async function getKontakInfo(): Promise<KontakInfo> {
  const doc = await adminDb.collection("settings").doc("kontak").get();
  if (!doc.exists) return EMPTY_KONTAK;

  const data = doc.data()!;
  return {
    address: data.address || EMPTY_KONTAK.address,
    whatsapp: data.whatsapp ?? EMPTY_KONTAK.whatsapp,
    email: data.email ?? EMPTY_KONTAK.email,
    hours: data.hours || EMPTY_KONTAK.hours,
    mapsEmbedUrl: data.mapsEmbedUrl || undefined,
  };
}

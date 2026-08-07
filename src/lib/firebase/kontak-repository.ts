import "server-only";
import { cache } from "react";
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

// Called from both the root layout (footer, on every page) and specific
// pages (/kontak, /layanan) — wrapping in React's cache() means those calls
// within the same request dedupe to a single Firestore read instead of one
// per call site.
export const getKontakInfo = cache(async (): Promise<KontakInfo> => {
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
});

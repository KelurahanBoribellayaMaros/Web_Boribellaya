import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import type { KontakInfo, KontakPerson } from "@/types/kontak";

// Shown only if settings/kontak hasn't been configured yet — deliberately
// generic placeholder text, never a fabricated address/number. Silently
// falling back to made-up contact details would mislead citizens.
const EMPTY_KONTAK: KontakInfo = {
  address: "Data belum tersedia",
  contacts: [],
  email: "",
  hours: "08:00 - 16:00 WITA",
  mapsEmbedUrl: undefined,
};

// Reads either the current `contacts` array, or migrates the older
// single-number `whatsapp` field (from before multiple contacts were
// supported) into a one-item list so existing data doesn't just disappear.
function readContacts(data: FirebaseFirestore.DocumentData): KontakPerson[] {
  if (Array.isArray(data.contacts)) {
    return data.contacts
      .map((c) => ({
        jabatan: String(c?.jabatan ?? "").trim(),
        whatsapp: String(c?.whatsapp ?? "").trim(),
      }))
      .filter((c) => c.whatsapp);
  }
  if (typeof data.whatsapp === "string" && data.whatsapp.trim()) {
    return [{ jabatan: "Kontak", whatsapp: data.whatsapp.trim() }];
  }
  return [];
}

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
    contacts: readContacts(data),
    email: data.email ?? EMPTY_KONTAK.email,
    hours: data.hours || EMPTY_KONTAK.hours,
    mapsEmbedUrl: data.mapsEmbedUrl || undefined,
  };
});

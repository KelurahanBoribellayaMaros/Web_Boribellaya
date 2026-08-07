import "server-only";
import { adminDb } from "@/lib/firebase/admin";

// Maps layanan slug -> enabled. A slug with no entry (admin never touched
// this page, or a newly-added service) is treated as enabled — toggling
// only ever needs to happen to turn something OFF.
export async function getLayananStatus(): Promise<Record<string, boolean>> {
  const doc = await adminDb.collection("settings").doc("layanan_status").get();
  if (!doc.exists) return {};
  return doc.data() as Record<string, boolean>;
}

export function isLayananEnabled(
  status: Record<string, boolean>,
  slug: string
): boolean {
  return status[slug] !== false;
}

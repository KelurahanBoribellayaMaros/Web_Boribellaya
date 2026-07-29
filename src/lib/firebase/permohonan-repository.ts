import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Permohonan, PermohonanStatus, PermohonanType } from "@/types/permohonan";

function toPermohonan(id: string, data: FirebaseFirestore.DocumentData): Permohonan {
  return {
    id,
    type: data.type,
    category: data.category,
    categoryLabel: data.categoryLabel,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    description: data.description,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getPermohonanList(filters?: {
  status?: PermohonanStatus;
  type?: PermohonanType;
}): Promise<Permohonan[]> {
  // Filtered in-memory (not via Firestore .where()) so we never need a
  // composite index for the status+type+orderBy combination — this
  // collection stays small for a single kelurahan, so the extra reads
  // are negligible.
  const snapshot = await adminDb
    .collection("permohonan")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs
    .map((doc) => toPermohonan(doc.id, doc.data()))
    .filter((item) => {
      if (filters?.status && item.status !== filters.status) return false;
      if (filters?.type && item.type !== filters.type) return false;
      return true;
    });
}

export async function getPermohonanById(id: string): Promise<Permohonan | null> {
  const doc = await adminDb.collection("permohonan").doc(id).get();
  if (!doc.exists) return null;
  return toPermohonan(doc.id, doc.data()!);
}

export async function getPermohonanBaruCount(): Promise<number> {
  const snapshot = await adminDb
    .collection("permohonan")
    .where("status", "==", "baru")
    .count()
    .get();
  return snapshot.data().count;
}

const URGENT_AFTER_MS = 24 * 60 * 60 * 1000;

export function countUrgentBaru(list: Permohonan[]): number {
  const cutoff = Date.now() - URGENT_AFTER_MS;
  return list.filter((p) => p.status === "baru" && new Date(p.createdAt).getTime() < cutoff)
    .length;
}

import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Permohonan, PermohonanStatus, PermohonanType } from "@/types/permohonan";

function toPermohonan(id: string, data: FirebaseFirestore.DocumentData): Permohonan {
  return {
    id,
    number: data.number ?? undefined,
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
    nik: data.nik ?? undefined,
    identityCategory: data.identityCategory ?? undefined,
    address: data.address ?? undefined,
    occupation: data.occupation ?? undefined,
    usagePurpose: data.usagePurpose ?? undefined,
    copyFormat: data.copyFormat ?? undefined,
    berkas: data.berkas ?? undefined,
  };
}

// Filtered in-memory (not via Firestore .where()) so we never need a
// composite index for the status+type+orderBy combination — fine for a
// single kelurahan's realistic data volume. FETCH_CAP is a pure safety net
// (not real pagination) so a runaway/spammed collection can never balloon a
// single page load into reading tens of thousands of documents.
const FETCH_CAP = 2000;

export async function getPermohonanList(filters?: {
  status?: PermohonanStatus;
  type?: PermohonanType;
}): Promise<Permohonan[]> {
  const snapshot = await adminDb
    .collection("permohonan")
    .orderBy("createdAt", "desc")
    .limit(FETCH_CAP)
    .get();

  return snapshot.docs
    .map((doc) => toPermohonan(doc.id, doc.data()))
    .filter((item) => {
      if (filters?.status && item.status !== filters.status) return false;
      if (filters?.type && item.type !== filters.type) return false;
      return true;
    });
}

export async function getPermohonanByEmail(email: string): Promise<Permohonan[]> {
  // A real .where() filter here (unlike getPermohonanList's in-memory
  // approach) — this runs on every page load for every logged-in citizen
  // (root layout -> notification bell), so fetching the whole collection
  // just to find one person's own requests would multiply reads by however
  // many documents exist, on every single navigation. A single equality
  // filter needs no composite index; sorting the (small, per-person) result
  // in memory is effectively free.
  const snapshot = await adminDb.collection("permohonan").where("email", "==", email).get();

  return snapshot.docs
    .map((doc) => toPermohonan(doc.id, doc.data()))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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

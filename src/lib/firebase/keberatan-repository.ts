import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Keberatan } from "@/types/keberatan";
import type { PermohonanStatus } from "@/types/permohonan";

function toKeberatan(id: string, data: FirebaseFirestore.DocumentData): Keberatan {
  return {
    id,
    permohonanId: data.permohonanId,
    permohonanNumber: data.permohonanNumber ?? undefined,
    permohonanCategoryLabel: data.permohonanCategoryLabel,
    name: data.name,
    email: data.email,
    reasons: data.reasons ?? [],
    kronologi: data.kronologi,
    isKuasa: data.isKuasa ?? false,
    kuasaName: data.kuasaName ?? undefined,
    status: data.status,
    catatan: data.catatan ?? undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// Pure safety net (not real pagination), mirrors permohonan-repository.ts.
const FETCH_CAP = 2000;

export async function getKeberatanByPermohonanId(
  permohonanId: string
): Promise<Keberatan | null> {
  // Single-field equality filter — no composite index needed.
  const snapshot = await adminDb
    .collection("keberatan")
    .where("permohonanId", "==", permohonanId)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return toKeberatan(doc.id, doc.data());
}

// Used to render objection status on /akun/permohonan without an N+1 query
// per permohonan card.
export async function getKeberatanByEmail(email: string): Promise<Keberatan[]> {
  const snapshot = await adminDb.collection("keberatan").where("email", "==", email).get();
  return snapshot.docs.map((doc) => toKeberatan(doc.id, doc.data()));
}

// Filtered in-memory (not via Firestore .where()) so listing by status never
// needs a composite index — same rationale as getPermohonanList.
export async function getKeberatanList(filters?: {
  status?: PermohonanStatus;
}): Promise<Keberatan[]> {
  const snapshot = await adminDb
    .collection("keberatan")
    .orderBy("createdAt", "desc")
    .limit(FETCH_CAP)
    .get();

  return snapshot.docs
    .map((doc) => toKeberatan(doc.id, doc.data()))
    .filter((item) => !filters?.status || item.status === filters.status);
}

export async function getKeberatanById(id: string): Promise<Keberatan | null> {
  const doc = await adminDb.collection("keberatan").doc(id).get();
  if (!doc.exists) return null;
  return toKeberatan(doc.id, doc.data()!);
}

export async function getKeberatanBaruCount(): Promise<number> {
  const snapshot = await adminDb
    .collection("keberatan")
    .where("status", "==", "baru")
    .count()
    .get();
  return snapshot.data().count;
}

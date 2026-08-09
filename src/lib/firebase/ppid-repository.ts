import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { PpidCategory, PpidDocument } from "@/types/ppid";

const PPID_CATEGORIES: PpidCategory[] = ["berkala", "setiap-saat", "serta-merta"];

function toPpidDocument(id: string, data: FirebaseFirestore.DocumentData): PpidDocument {
  return {
    id,
    title: data.title,
    description: data.description,
    category: data.category,
    year: data.year,
    date: data.date,
    fileUrl: data.fileUrl ?? undefined,
    filePath: data.filePath ?? undefined,
    websiteUrl: data.websiteUrl ?? undefined,
    createdAt: data.createdAt,
  };
}

// Pure safety net (not real pagination) so a collection that grows for years
// can never balloon a single page load — mirrors the same cap on
// getPermohonanList in permohonan-repository.ts.
const FETCH_CAP = 2000;

export async function getPpidDocuments(): Promise<PpidDocument[]> {
  const snapshot = await adminDb
    .collection("ppid_documents")
    .orderBy("date", "desc")
    .limit(FETCH_CAP)
    .get();
  return snapshot.docs.map((doc) => toPpidDocument(doc.id, doc.data()));
}

// Public "Informasi Publik" page default view: only the N most recent docs
// per category, via one bounded query per category — so a collection that
// grows for years never costs more reads than what's actually shown.
export async function getPpidDocumentsPreview(perCategory = 5): Promise<PpidDocument[]> {
  const snapshots = await Promise.all(
    PPID_CATEGORIES.map((category) =>
      adminDb
        .collection("ppid_documents")
        .where("category", "==", category)
        .orderBy("date", "desc")
        .limit(perCategory)
        .get()
    )
  );
  return snapshots.flatMap((snapshot) =>
    snapshot.docs.map((doc) => toPpidDocument(doc.id, doc.data()))
  );
}

// "Lihat Selengkapnya" — fetched only for the one category the admin/user
// actually asked to expand, not the other two.
export async function getPpidDocumentsByCategory(
  category: PpidCategory
): Promise<PpidDocument[]> {
  const snapshot = await adminDb
    .collection("ppid_documents")
    .where("category", "==", category)
    .orderBy("date", "desc")
    .limit(FETCH_CAP)
    .get();
  return snapshot.docs.map((doc) => toPpidDocument(doc.id, doc.data()));
}

export async function getPpidDocumentById(id: string): Promise<PpidDocument | null> {
  const doc = await adminDb.collection("ppid_documents").doc(id).get();
  if (!doc.exists) return null;
  return toPpidDocument(doc.id, doc.data()!);
}

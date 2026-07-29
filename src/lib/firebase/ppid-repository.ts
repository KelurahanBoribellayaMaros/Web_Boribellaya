import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { PpidDocument } from "@/types/ppid";

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
    createdAt: data.createdAt,
  };
}

export async function getPpidDocuments(): Promise<PpidDocument[]> {
  const snapshot = await adminDb
    .collection("ppid_documents")
    .orderBy("date", "desc")
    .get();
  return snapshot.docs.map((doc) => toPpidDocument(doc.id, doc.data()));
}

export async function getPpidDocumentById(id: string): Promise<PpidDocument | null> {
  const doc = await adminDb.collection("ppid_documents").doc(id).get();
  if (!doc.exists) return null;
  return toPpidDocument(doc.id, doc.data()!);
}

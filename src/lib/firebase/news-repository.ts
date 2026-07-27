import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { NewsItem } from "@/types/home";

function toNewsItem(id: string, data: FirebaseFirestore.DocumentData): NewsItem {
  return {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    category: data.category,
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const snapshot = await adminDb.collection("news").orderBy("date", "desc").get();
  return snapshot.docs.map((doc) => toNewsItem(doc.id, doc.data()));
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const doc = await adminDb.collection("news").doc(id).get();
  if (!doc.exists) return null;
  return toNewsItem(doc.id, doc.data()!);
}

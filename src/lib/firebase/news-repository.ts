import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { NewsItem } from "@/types/home";

function toNewsItem(id: string, data: FirebaseFirestore.DocumentData): NewsItem {
  return {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content ?? data.excerpt,
    date: data.date,
    category: data.category,
    coverImage: data.coverImage ?? undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
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

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const snapshot = await adminDb
    .collection("news")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return toNewsItem(doc.id, doc.data());
}

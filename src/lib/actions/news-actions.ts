"use server";

import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import type { NewsCategory } from "@/types/home";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readNewsInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    date: String(formData.get("date") ?? ""),
    category: (formData.get("category") === "pengumuman"
      ? "pengumuman"
      : "berita") satisfies NewsCategory,
  };
}

export async function createNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const input = readNewsInput(formData);
  const now = new Date().toISOString();

  await adminDb.collection("news").add({
    ...input,
    slug: slugify(input.title),
    createdAt: now,
    updatedAt: now,
  });

  redirect("/admin/berita");
}

export async function updateNewsAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const input = readNewsInput(formData);

  await adminDb
    .collection("news")
    .doc(id)
    .set(
      {
        ...input,
        slug: slugify(input.title),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

  redirect("/admin/berita");
}

export async function deleteNewsAction(id: string): Promise<void> {
  await requireAdmin();
  await adminDb.collection("news").doc(id).delete();
  redirect("/admin/berita");
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ImageIcon } from "lucide-react";
import { getNewsBySlug } from "@/lib/firebase/news-repository";
import { formatDate } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return { title: "Berita Tidak Ditemukan | Kelurahan Boribellaya" };
  }

  return {
    title: `${item.title} | Kelurahan Boribellaya`,
    description: item.excerpt,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <Link
        href="/berita"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Berita & Pengumuman
      </Link>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          {item.category === "pengumuman" && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              Pengumuman
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="size-3.5" />
            <time>{formatDate(item.date)}</time>
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {item.title}
        </h1>
      </div>

      {item.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.coverImage}
          alt={item.title}
          className="mt-6 aspect-video w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-[#003459]/40">
          <ImageIcon className="size-12" />
        </div>
      )}

      <div className="mt-6 space-y-4 text-sm leading-relaxed whitespace-pre-line text-gray-700 sm:text-base">
        {item.content}
      </div>
    </div>
  );
}

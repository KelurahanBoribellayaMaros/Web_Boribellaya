import type { Metadata } from "next";
import { getNews } from "@/lib/firebase/news-repository";
import { BeritaListClient } from "@/components/berita/BeritaListClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita & Pengumuman | Kelurahan Boribellaya",
  description:
    "Informasi terbaru seputar kegiatan, kebijakan, dan program Kelurahan Boribellaya.",
};

export default async function BeritaPage() {
  const news = await getNews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Berita & Pengumuman
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
          Informasi terbaru seputar kegiatan, kebijakan, dan program
          Kelurahan Boribellaya.
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        <BeritaListClient items={news} />
      </div>
    </div>
  );
}

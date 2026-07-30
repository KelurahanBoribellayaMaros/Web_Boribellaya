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
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Informasi Terkini
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Berita & Pengumuman
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
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

import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Newspaper, Search, Wrench } from "lucide-react";
import { getNews } from "@/lib/firebase/news-repository";
import { getPpidDocuments } from "@/lib/firebase/ppid-repository";
import { getLayananStatus, isLayananEnabled } from "@/lib/firebase/layanan-repository";
import { layananItems } from "@/lib/layanan-data";
import { syaratLayananItems } from "@/lib/syarat-layanan-data";
import { NewsCard } from "@/components/ui/NewsCard";
import { LayananCard } from "@/components/layanan/LayananCard";
import { PpidDocumentCard } from "@/components/ppid/PpidDocumentCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hasil Pencarian | Kelurahan Boribellaya",
};

function matches(query: string, ...fields: string[]): boolean {
  const q = query.trim().toLowerCase();
  return fields.some((field) => field.toLowerCase().includes(q));
}

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl px-2 py-16 text-center sm:px-3 lg:px-4">
        <Search className="mx-auto size-10 text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">
          Masukkan kata kunci untuk mulai mencari.
        </p>
      </div>
    );
  }

  const [news, documents, layananStatus] = await Promise.all([
    getNews(),
    getPpidDocuments(),
    getLayananStatus(),
  ]);

  const newsResults = news.filter((item) => matches(query, item.title, item.excerpt));
  const layananResults = layananItems
    .filter((item) => matches(query, item.title, item.description))
    .map((item) => ({ ...item, enabled: isLayananEnabled(layananStatus, item.slug) }));
  const documentResults = documents.filter((doc) =>
    matches(query, doc.title, doc.description)
  );
  const sopResults = syaratLayananItems.filter((item) => matches(query, item.name));

  const totalResults =
    newsResults.length + layananResults.length + documentResults.length + sopResults.length;

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Pencarian
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Hasil untuk &quot;{query}&quot;
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          {totalResults} hasil ditemukan di seluruh situs.
        </p>
      </div>

      <div className="mt-8 space-y-8 sm:mt-10">
        {totalResults === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Search className="size-8" />
            <p className="text-sm">
              Tidak ada hasil yang cocok. Coba kata kunci lain.
            </p>
          </div>
        )}

        {newsResults.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
              <Newspaper className="size-4 text-[#003459]" />
              Berita ({newsResults.length})
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newsResults.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        )}

        {layananResults.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
              <Wrench className="size-4 text-[#003459]" />
              Layanan ({layananResults.length})
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layananResults.map((item) => (
                <LayananCard key={item.slug} {...item} />
              ))}
            </div>
          </section>
        )}

        {documentResults.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
              <FileText className="size-4 text-[#003459]" />
              Informasi Publik ({documentResults.length})
            </h2>
            <div className="mt-3 space-y-3">
              {documentResults.map((doc) => (
                <PpidDocumentCard key={doc.id} {...doc} />
              ))}
            </div>
          </section>
        )}

        {sopResults.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
              <FileText className="size-4 text-[#003459]" />
              SOP Pelayanan ({sopResults.length})
            </h2>
            <div className="mt-3 space-y-3">
              {sopResults.map((item) => (
                <Link
                  key={item.no}
                  href="/layanan#sop-pelayanan"
                  className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Lihat syarat &amp; alur di SOP Pelayanan
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

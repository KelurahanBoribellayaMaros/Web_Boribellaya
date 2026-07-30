import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getNews } from "@/lib/firebase/news-repository";
import { NewsCard } from "@/components/ui/NewsCard";
import { Reveal } from "@/components/ui/Reveal";

export async function NewsSection() {
  const news = await getNews();

  return (
    <section
      id="berita"
      className="mx-auto max-w-6xl scroll-mt-20 px-2 py-10 sm:px-3 sm:py-12 lg:px-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Berita & Pengumuman
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Informasi terbaru seputar kegiatan dan program kelurahan.
          </p>
        </div>
        <Link
          href="/berita"
          className="hidden shrink-0 items-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:inline-flex"
        >
          Lihat Semua Berita
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {news.slice(0, 3).map((item, index) => (
          <Reveal key={item.id} delay={index * 100}>
            <NewsCard {...item} />
          </Reveal>
        ))}
      </div>

      <Link
        href="/berita"
        className="mt-6 flex items-center justify-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:hidden"
      >
        Lihat Semua Berita
        <ChevronRight className="size-4" />
      </Link>
    </section>
  );
}

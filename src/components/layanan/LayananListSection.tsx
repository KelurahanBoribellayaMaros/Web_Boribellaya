import type { LayananItem } from "@/types/layanan";
import { pengajuanInformasiCard, keberatanInformasiCard } from "@/lib/ppid-data";
import { LayananCard } from "@/components/layanan/LayananCard";
import { Reveal } from "@/components/ui/Reveal";

export function LayananListSection({ items }: { items: LayananItem[] }) {
  const allItems = [...items, pengajuanInformasiCard, keberatanInformasiCard];

  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        Layanan Online
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Pilih kategori layanan yang Anda butuhkan di bawah ini.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allItems.map((item, index) => (
          <Reveal key={item.slug} delay={(index % 3) * 100}>
            <LayananCard {...item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

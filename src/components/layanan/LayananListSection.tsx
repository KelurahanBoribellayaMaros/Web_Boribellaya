import type { LayananItem } from "@/types/layanan";
import { LayananCard } from "@/components/layanan/LayananCard";

export function LayananListSection({ items }: { items: LayananItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        Layanan Online
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Pilih kategori layanan yang Anda butuhkan di bawah ini.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <LayananCard key={item.slug} {...item} />
        ))}
      </div>
    </section>
  );
}

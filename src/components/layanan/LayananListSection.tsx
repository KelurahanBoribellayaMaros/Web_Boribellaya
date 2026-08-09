import { FileQuestion, Scale } from "lucide-react";
import type { LayananItem } from "@/types/layanan";
import { LayananCard } from "@/components/layanan/LayananCard";
import { Reveal } from "@/components/ui/Reveal";

// Both are rights guaranteed by UU KIP, not admin-toggleable digital
// services — shown here alongside the real services but never gated by
// settings/layanan_status (mirrors how "Informasi Publik" itself is
// excluded from that toggle).
const pengajuanInformasiCard: LayananItem = {
  slug: "pengajuan-informasi",
  icon: FileQuestion,
  title: "Ajukan Permohonan Informasi",
  description:
    "Ajukan permohonan informasi publik yang belum tersedia di daftar informasi publik.",
  cta: "Ajukan Permohonan",
  href: "/informasi-publik/ajukan",
  variant: "outline",
  enabled: true,
};

const keberatanCard: LayananItem = {
  slug: "keberatan-informasi",
  icon: Scale,
  title: "Ajukan Keberatan Informasi",
  description:
    "Ajukan keberatan jika permohonan informasi publik Anda ditolak, tidak ditanggapi, atau tidak dipenuhi.",
  cta: "Ajukan Keberatan",
  href: "/informasi-publik/keberatan",
  variant: "outline",
  enabled: true,
};

export function LayananListSection({ items }: { items: LayananItem[] }) {
  const allItems = [...items, pengajuanInformasiCard, keberatanCard];

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

import { ChevronRight, Mars, Users, UsersRound, Venus } from "lucide-react";
import { getPopulationStats } from "@/lib/firebase/population-repository";
import { StatCard } from "@/components/ui/StatCard";

export async function PopulationSection() {
  const stats = await getPopulationStats();

  const items = [
    { icon: Users, label: "Total Penduduk", value: stats.totalPenduduk },
    { icon: UsersRound, label: "Kepala Keluarga", value: stats.kepalaKeluarga },
    { icon: Mars, label: "Laki-laki", value: stats.lakiLaki },
    { icon: Venus, label: "Perempuan", value: stats.perempuan },
  ];

  return (
    <section
      id="data-penduduk"
      className="mx-auto max-w-6xl scroll-mt-20 px-2 py-10 sm:px-3 sm:py-12 lg:px-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Data Penduduk
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Statistik terkini demografi Kelurahan Boribellaya.
          </p>
        </div>
        <a
          href="#"
          className="hidden shrink-0 items-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:inline-flex"
        >
          Lihat Selengkapnya
          <ChevronRight className="size-4" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <a
        href="#"
        className="mt-6 flex items-center justify-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:hidden"
      >
        Lihat Selengkapnya
        <ChevronRight className="size-4" />
      </a>
    </section>
  );
}

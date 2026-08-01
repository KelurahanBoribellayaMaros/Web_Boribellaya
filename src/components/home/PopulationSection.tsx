import { Mars, Users, UsersRound, Venus } from "lucide-react";
import { getPopulationStats } from "@/lib/firebase/population-repository";
import { StatCard } from "@/components/ui/StatCard";
import { Reveal } from "@/components/ui/Reveal";

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
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Data Penduduk
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Statistik terkini demografi Kelurahan Boribellaya.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 100}>
            <StatCard {...stat} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

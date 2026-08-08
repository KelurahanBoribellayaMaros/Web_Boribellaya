import type { Metadata } from "next";
import { BookOpen, Eye, Target, CheckCircle2, Mars, Users, UsersRound, Venus } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { OrgChart } from "@/components/profil/OrgChart";
import { PopulationTable } from "@/components/profil/PopulationTable";
import { StatCard } from "@/components/ui/StatCard";
import { history, vision, missions } from "@/lib/profile-data";
import { getOrgChart } from "@/lib/firebase/struktur-repository";
import { computePopulationStats, getPopulationDetail } from "@/lib/firebase/population-repository";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil Kelurahan | Kelurahan Boribellaya",
  description:
    "Sejarah, visi, misi, dan struktur pemerintahan Kelurahan Boribellaya.",
};

export default async function ProfilPage() {
  const [orgChart, populationRws] = await Promise.all([
    getOrgChart(),
    getPopulationDetail(),
  ]);
  const populationStats = computePopulationStats(populationRws);

  const statItems = [
    { icon: Users, label: "Total Penduduk", value: populationStats.totalPenduduk },
    { icon: UsersRound, label: "Kepala Keluarga", value: populationStats.kepalaKeluarga },
    { icon: Mars, label: "Laki-laki", value: populationStats.lakiLaki },
    { icon: Venus, label: "Perempuan", value: populationStats.perempuan },
  ];

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Profil Pemerintahan
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Profil Kelurahan
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Mengenal lebih dekat sejarah, visi, misi, dan struktur pemerintahan
          Kelurahan Boribellaya.
        </p>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <Reveal>
          <ProfileCard icon={BookOpen} title="Sejarah Singkat">
            <div className="space-y-4 text-justify text-sm leading-relaxed text-gray-600 sm:text-base sm:leading-loose">
              {history.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </ProfileCard>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <ProfileCard icon={Eye} title="Visi">
              <p className="text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{vision}&rdquo;
              </p>
            </ProfileCard>
          </Reveal>

          <Reveal delay={100}>
            <ProfileCard icon={Target} title="Misi">
              <ul className="space-y-3">
                {missions.map((mission) => (
                  <li key={mission.slice(0, 24)} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#003459]" />
                    <span className="text-sm leading-relaxed text-gray-600">
                      {mission}
                    </span>
                  </li>
                ))}
              </ul>
            </ProfileCard>
          </Reveal>
        </div>

        <Reveal>
          <section id="data-penduduk" className="scroll-mt-20">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Data Penduduk
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Rincian jumlah penduduk per RW/RT Kelurahan Boribellaya.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {statItems.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mt-6">
              <PopulationTable rws={populationRws} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Struktur Organisasi
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Susunan aparatur pemerintahan Kelurahan Boribellaya.
            </p>
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <OrgChart root={orgChart} />
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

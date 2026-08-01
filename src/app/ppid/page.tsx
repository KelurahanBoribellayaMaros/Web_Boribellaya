import type { Metadata } from "next";
import { FileText, Scale } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { OrgChart } from "@/components/profil/OrgChart";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ppidAbout } from "@/lib/ppid-data";
import { getLeader, getPpidPelaksana } from "@/lib/firebase/struktur-repository";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil PPID | Kelurahan Boribellaya",
  description:
    "Profil dan struktur Pejabat Pengelola Informasi dan Dokumentasi (PPID) Kelurahan Boribellaya.",
};

export default async function PpidPage() {
  const [leader, ppidPelaksana] = await Promise.all([
    getLeader(),
    getPpidPelaksana(),
  ]);

  const ppidStructure = {
    name: leader.name,
    position: "Atasan PPID",
    children: [{ name: ppidPelaksana.name, position: ppidPelaksana.position }],
  };

  return (
    <div className="mx-auto max-w-5xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Keterbukaan Informasi
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Profil PPID
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Profil, struktur, dan dasar hukum Pejabat Pengelola Informasi dan
          Dokumentasi Kelurahan Boribellaya.
        </p>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <Reveal>
          <ProfileCard icon={Scale} title="Profil PPID">
            <p className="text-sm leading-relaxed text-gray-600">{ppidAbout}</p>
          </ProfileCard>
        </Reveal>

        <Reveal>
          <section>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Struktur PPID
            </h2>
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
              <OrgChart root={ppidStructure} variant="blue" />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <ServiceCard
            slug="daftar-informasi-publik"
            icon={FileText}
            title="Daftar Informasi Publik"
            description="Telusuri dokumen resmi yang wajib disediakan dan diumumkan sesuai Undang-Undang Keterbukaan Informasi Publik."
            href="/ppid/informasi"
          />
        </Reveal>
      </div>
    </div>
  );
}

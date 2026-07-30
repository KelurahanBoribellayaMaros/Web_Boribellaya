import type { Metadata } from "next";
import { BookOpen, Eye, Target, CheckCircle2 } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { LeadershipCard } from "@/components/profil/LeadershipCard";
import { OrgChart } from "@/components/profil/OrgChart";
import { history, vision, missions } from "@/lib/profile-data";
import { getLeader, getOrgChart } from "@/lib/firebase/struktur-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Kelurahan | Kelurahan Boribellaya",
  description:
    "Sejarah, visi, misi, dan struktur pemerintahan Kelurahan Boribellaya.",
};

export default async function ProfilPage() {
  const [leader, orgChart] = await Promise.all([getLeader(), getOrgChart()]);

  return (
    <div className="mx-auto max-w-5xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#2b9348]" />
          <span className="text-xs font-semibold tracking-widest text-[#2b9348] uppercase">
            Profil Pemerintahan
          </span>
          <span className="h-px w-8 bg-[#2b9348]" />
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
        <ProfileCard icon={BookOpen} title="Sejarah Singkat">
          <div className="space-y-3 text-sm leading-relaxed text-gray-600">
            {history.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </ProfileCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProfileCard icon={Eye} title="Visi">
            <p className="text-sm leading-relaxed text-gray-600 italic">
              &ldquo;{vision}&rdquo;
            </p>
          </ProfileCard>

          <ProfileCard icon={Target} title="Misi">
            <ul className="space-y-3">
              {missions.map((mission) => (
                <li key={mission.slice(0, 24)} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    {mission}
                  </span>
                </li>
              ))}
            </ul>
          </ProfileCard>
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Profil Pimpinan
          </h2>
          <div className="mt-4">
            <LeadershipCard {...leader} />
          </div>
        </section>

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
      </div>
    </div>
  );
}

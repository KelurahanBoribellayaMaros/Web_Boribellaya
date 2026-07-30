import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion, Scale } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { OrgChart } from "@/components/profil/OrgChart";
import { PpidDocumentList } from "@/components/ppid/PpidDocumentList";
import { ppidAbout } from "@/lib/ppid-data";
import { getPpidDocuments } from "@/lib/firebase/ppid-repository";
import { getLeader, getPpidPelaksana } from "@/lib/firebase/struktur-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PPID | Kelurahan Boribellaya",
  description:
    "Informasi publik yang wajib disediakan dan diumumkan sesuai Undang-Undang Keterbukaan Informasi Publik.",
};

export default async function PpidPage() {
  const [documents, leader, ppidPelaksana] = await Promise.all([
    getPpidDocuments(),
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
          Informasi Publik (PPID)
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Dokumen resmi yang wajib disediakan dan diumumkan sesuai
          Undang-Undang Keterbukaan Informasi Publik.
        </p>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <ProfileCard icon={Scale} title="Profil PPID">
          <p className="text-sm leading-relaxed text-gray-600">{ppidAbout}</p>
        </ProfileCard>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Struktur PPID
          </h2>
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <OrgChart root={ppidStructure} variant="blue" />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Daftar Informasi Publik
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Telusuri dokumen berdasarkan kategori keterbukaan informasi.
              </p>
            </div>
            <Link
              href="/ppid/ajukan"
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#003459] px-4 py-2 text-sm font-semibold text-[#003459] transition-colors hover:bg-blue-50"
            >
              <FileQuestion className="size-4" />
              Ajukan Permohonan Informasi
            </Link>
          </div>
          <div className="mt-4">
            <PpidDocumentList documents={documents} />
          </div>
        </section>
      </div>
    </div>
  );
}

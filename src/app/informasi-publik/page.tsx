import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion, Lock, Scale } from "lucide-react";
import { PpidDocumentList } from "@/components/ppid/PpidDocumentList";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { getPpidDocumentsPreview } from "@/lib/firebase/ppid-repository";
import { dasarHukum, informasiDikecualikan, informasiDikecualikanNote } from "@/lib/ppid-data";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daftar Informasi Publik | Kelurahan Boribellaya",
  description:
    "Telusuri dokumen resmi yang wajib disediakan dan diumumkan sesuai Undang-Undang Keterbukaan Informasi Publik.",
};

export default async function InformasiPublikPage() {
  const previewDocuments = await getPpidDocumentsPreview();

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Keterbukaan Informasi
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Daftar Informasi Publik
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Dokumen resmi yang wajib disediakan dan diumumkan sesuai
          Undang-Undang Keterbukaan Informasi Publik.
        </p>
      </div>

      <div className="mt-8 space-y-6 sm:mt-10">
        <Reveal>
          <ProfileCard icon={Scale} title="Dasar Hukum">
            <div className="space-y-4">
              {dasarHukum.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </ProfileCard>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Telusuri Dokumen
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Telusuri dokumen berdasarkan kategori keterbukaan informasi.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/informasi-publik/ajukan"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#003459] px-4 py-2 text-sm font-semibold text-[#003459] transition-colors hover:bg-blue-50"
              >
                <FileQuestion className="size-4" />
                Ajukan Permohonan Informasi
              </Link>
              <Link
                href="/informasi-publik/keberatan"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Scale className="size-4" />
                Ajukan Keberatan
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <PpidDocumentList previewDocuments={previewDocuments} />
          </div>
        </Reveal>

        <Reveal>
          <ProfileCard icon={Lock} title="Informasi Dikecualikan">
            <p className="text-sm leading-relaxed text-gray-600">
              Beberapa jenis informasi tidak dapat diakses publik karena
              sifatnya rahasia, meliputi:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {informasiDikecualikan.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              {informasiDikecualikanNote}
            </p>
          </ProfileCard>
        </Reveal>
      </div>
    </div>
  );
}

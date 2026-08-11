import type { Metadata } from "next";
import { Lock, Scale, Search } from "lucide-react";
import { PpidDocumentList } from "@/components/ppid/PpidDocumentList";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { LayananCard } from "@/components/layanan/LayananCard";
import { getPpidDocumentsPreview } from "@/lib/firebase/ppid-repository";
import { getPpidStatistics } from "@/lib/firebase/permohonan-repository";
import { PpidStatisticsWidget } from "@/components/ppid/PpidStatistics";
import {
  dasarHukum,
  informasiDikecualikan,
  informasiDikecualikanNote,
  pengajuanInformasiCard,
  keberatanInformasiCard,
} from "@/lib/ppid-data";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daftar Informasi Publik | Kelurahan Boribellaya",
  description:
    "Telusuri dokumen resmi yang wajib disediakan dan diumumkan sesuai Undang-Undang Keterbukaan Informasi Publik.",
};

export default async function InformasiPublikPage() {
  const [previewDocuments, ppidStats] = await Promise.all([
    getPpidDocumentsPreview(),
    getPpidStatistics(),
  ]);

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <LayananCard {...pengajuanInformasiCard} />
            <LayananCard {...keberatanInformasiCard} />
            <LayananCard 
              slug="cek-status"
              icon={Search} 
              title="Cek Status Permohonan" 
              description="Pantau progres permohonan atau keberatan informasi publik Anda menggunakan nomor WhatsApp."
              cta="Cek Status"
              href="/cek-status"
              variant="outline"
              enabled={true}
            />
          </div>
        </Reveal>

        <Reveal>
          <div id="laporan-statistik" className="scroll-mt-24">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Laporan Layanan Akses Informasi Publik
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Rekapitulasi jumlah dan tindak lanjut permohonan informasi publik.
            </p>
          </div>
          <div className="mt-4">
            <PpidStatisticsWidget stats={ppidStats} />
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              Telusuri Dokumen
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Telusuri dokumen berdasarkan kategori keterbukaan informasi.
            </p>
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

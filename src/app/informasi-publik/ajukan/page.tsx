import type { Metadata } from "next";
import { PermohonanInformasiForm } from "@/components/permohonan/PermohonanInformasiForm";
import { SopRequirementBox } from "@/components/layanan/SopRequirementBox";
import { sopPengajuanInformasi } from "@/lib/syarat-layanan-data";

export const metadata: Metadata = {
  title: "Ajukan Permohonan Informasi | Kelurahan Boribellaya",
};

export default async function AjukanInformasiPage() {

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Layanan Informasi Publik
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Permohonan Informasi Publik
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Untuk informasi publik yang belum tersedia di daftar informasi
          publik, ajukan permohonan melalui formulir ini.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-4 sm:mt-10">
        <SopRequirementBox sop={sopPengajuanInformasi} />
        <PermohonanInformasiForm />
      </div>
    </div>
  );
}

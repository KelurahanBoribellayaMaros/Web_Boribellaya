import type { Metadata } from "next";
import { requireSession } from "@/lib/firebase/session";
import { PermohonanInformasiForm } from "@/components/permohonan/PermohonanInformasiForm";

export const metadata: Metadata = {
  title: "Ajukan Permohonan Informasi | Kelurahan Boribellaya",
};

export default async function AjukanInformasiPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-4xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#2b9348]" />
          <span className="text-xs font-semibold tracking-widest text-[#2b9348] uppercase">
            Layanan Informasi Publik
          </span>
          <span className="h-px w-8 bg-[#2b9348]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          Permohonan Informasi Publik
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
          Untuk informasi publik yang belum tersedia di daftar dokumen PPID,
          ajukan permohonan melalui formulir ini.
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        <PermohonanInformasiForm
          accountEmail={session.email ?? ""}
          prefillName={session.name ?? undefined}
        />
      </div>
    </div>
  );
}

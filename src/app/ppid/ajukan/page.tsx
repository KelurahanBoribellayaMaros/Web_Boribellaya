import type { Metadata } from "next";
import { getSession } from "@/lib/firebase/session";
import { PermohonanForm } from "@/components/permohonan/PermohonanForm";

export const metadata: Metadata = {
  title: "Ajukan Permohonan Informasi | Kelurahan Boribellaya",
};

export default async function AjukanInformasiPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-md px-3 py-10 sm:px-4 sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Ajukan Permohonan Informasi
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Untuk informasi publik yang belum tersedia di daftar dokumen PPID,
          ajukan permohonan melalui formulir ini.
        </p>
      </div>

      <div className="mt-8">
        <PermohonanForm
          type="informasi"
          category="informasi-publik"
          categoryLabel="Permohonan Informasi Publik"
          prefillName={session?.name ?? undefined}
          prefillEmail={session?.email ?? undefined}
        />
      </div>
    </div>
  );
}

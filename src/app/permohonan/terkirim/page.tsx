import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PermohonanSuccessToast } from "@/components/permohonan/PermohonanSuccessToast";

export const metadata: Metadata = {
  title: "Permohonan Terkirim | Kelurahan Boribellaya",
};

export default function PermohonanTerkirimPage() {
  return (
    <div className="mx-auto max-w-md px-3 py-16 text-center sm:px-4">
      <PermohonanSuccessToast />
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 text-[#003459]">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Permohonan Terkirim
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Terima kasih, permohonan Anda telah kami terima dan akan segera
        diproses oleh petugas kelurahan. Kami akan menghubungi Anda melalui
        email atau nomor HP yang Anda cantumkan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#003459] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

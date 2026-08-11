import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PermohonanSuccessToast } from "@/components/permohonan/PermohonanSuccessToast";

export const metadata: Metadata = {
  title: "Permohonan Terkirim | Kelurahan Boribellaya",
};

export default async function PermohonanTerkirimPage({
  searchParams,
}: {
  searchParams: Promise<{ nomor?: string }>;
}) {
  const { nomor } = await searchParams;

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
      {nomor && (
        <div className="mt-4 inline-flex flex-col items-center gap-1 rounded-xl bg-gray-50 px-5 py-3">
          <span className="text-xs text-gray-500">Nomor Permohonan Anda</span>
          <span className="font-mono text-sm font-semibold text-gray-900">{nomor}</span>
        </div>
      )}

      <div className="mx-auto mt-5 max-w-sm rounded-xl border border-amber-200/80 bg-amber-50/80 p-3.5 text-left text-xs text-amber-900 shadow-sm">
        <p className="font-semibold">📌 Catatan Notifikasi Email:</p>
        <p className="mt-1 text-amber-800">
          Jika Anda tidak menemukan email konfirmasi/notifikasi di Kotak Masuk (Inbox), silakan periksa folder <strong>Spam / Junk</strong> di akun email Anda.
        </p>
      </div>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#003459] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

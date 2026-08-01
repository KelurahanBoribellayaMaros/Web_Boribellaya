import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { requireSession } from "@/lib/firebase/session";
import { ResendVerificationButton } from "@/components/verifikasi-email/ResendVerificationButton";

export const metadata: Metadata = {
  title: "Verifikasi Email | Kelurahan Boribellaya",
};

export default async function VerifikasiEmailPage() {
  const session = await requireSession();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-blue-100 text-[#003459]">
        <MailCheck className="size-7" />
      </span>
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Verifikasi Email Anda
        </h1>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Untuk mengajukan permohonan, email akun Anda (
          <span className="font-medium text-gray-700">{session.email}</span>)
          perlu diverifikasi terlebih dahulu. Silakan cek kotak masuk (dan
          folder spam) untuk tautan verifikasi yang kami kirim saat Anda
          mendaftar.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ResendVerificationButton />
      </div>
      <Link
        href="/"
        className="mt-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

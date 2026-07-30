import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/login/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | Kelurahan Boribellaya",
};

export default function LupaSandiPage() {
  return (
    <div className="px-2 py-12 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 sm:text-3xl">
            Lupa Kata Sandi
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Masukkan email Anda, kami akan mengirimkan tautan untuk mengatur
            ulang kata sandi.
          </p>
        </div>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-green-700 hover:text-green-800">
            Kembali ke halaman masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

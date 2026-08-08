import type { Metadata } from "next";
import { LoginForm } from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | Kelurahan Boribellaya",
  description:
    "Masuk untuk mengakses layanan digital dan administrasi Kelurahan Boribellaya.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Masuk ke Akun
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Sistem Informasi Kelurahan
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Silakan masuk untuk mengakses layanan digital dan administrasi
          kelurahan.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

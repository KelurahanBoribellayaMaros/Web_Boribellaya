import type { Metadata } from "next";
import { LoginForm } from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | Kelurahan Boribellaya",
  description:
    "Masuk untuk mengakses layanan digital dan administrasi Kelurahan Boribellaya.",
};

export default function LoginPage() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white px-2 py-12 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 sm:text-3xl">
            Sistem Informasi Kelurahan
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Silakan masuk untuk mengakses layanan digital dan administrasi
            kelurahan.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

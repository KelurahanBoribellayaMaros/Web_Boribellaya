import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/login/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Akun | Kelurahan Boribellaya",
  description: "Daftar akun warga untuk mengakses layanan digital Kelurahan Boribellaya.",
};

export default function DaftarPage() {
  return (
    <div className="px-2 py-12 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 sm:text-3xl">
            Daftar Akun Warga
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Buat akun untuk mengakses layanan digital dan administrasi
            kelurahan.
          </p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="font-medium text-green-700 hover:text-green-800">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

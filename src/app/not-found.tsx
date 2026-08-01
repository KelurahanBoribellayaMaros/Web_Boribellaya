import type { Metadata } from "next";
import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { GoBackButton } from "@/components/ui/GoBackButton";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | Kelurahan Boribellaya",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-4 overflow-hidden px-4 py-20 text-center">
      <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-[9rem] leading-none font-black text-gray-100 select-none sm:text-[13rem]">
        404
      </span>

      <span className="relative flex size-14 items-center justify-center rounded-full bg-blue-100 text-[#003459]">
        <SearchX className="size-7" />
      </span>

      <div className="relative">
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Maaf, sepertinya halaman yang Anda cari telah dipindahkan atau
          tautan yang Anda gunakan rusak.
        </p>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <Home className="size-4" />
          Kembali ke Beranda
        </Link>
        <GoBackButton />
      </div>
    </div>
  );
}

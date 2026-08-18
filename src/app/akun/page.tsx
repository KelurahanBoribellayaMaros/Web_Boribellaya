import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/firebase/session";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Ubah Kredensial | Kelurahan Boribellaya",
  description:
    "Halaman pengubahan kata sandi dan pembaharuan kredensial akun Kelurahan Boribellaya.",
};

export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const session = await requireSession();
  const isAdmin = session.role === "admin";

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      {/* Back button matching other page header buttons */}
      <div className="mb-6">
        <Link
          href={isAdmin ? "/admin" : "/"}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="size-4" />
          {isAdmin ? "Kembali ke Panel Admin" : "Kembali ke Beranda"}
        </Link>
      </div>

      {/* Blue Header Banner matching Login page exactly */}
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Pengaturan Akun
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Ubah Kredensial
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Kelola kata sandi dan informasi keamanan akun Anda untuk menjaga kerahasiaan akses.
        </p>
      </div>

      {/* Form Container matching Login page layout */}
      <div className="mx-auto mt-8 max-w-md">
        <ChangePasswordForm session={session} />
      </div>
    </div>
  );
}

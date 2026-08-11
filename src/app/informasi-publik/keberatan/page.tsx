import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByPermohonanId } from "@/lib/firebase/keberatan-repository";
import { KeberatanForm } from "@/components/permohonan/KeberatanForm";
import { SopRequirementBox } from "@/components/layanan/SopRequirementBox";
import { sopKeberatanInformasi } from "@/lib/syarat-layanan-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ajukan Keberatan Informasi | Kelurahan Boribellaya",
};

export default async function AjukanKeberatanPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="mx-auto max-w-6xl px-2 py-10 text-center sm:px-3 sm:py-12 lg:px-4">
        <Scale className="mx-auto size-12 text-gray-400" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Pilih Permohonan Terlebih Dahulu
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Silakan periksa status permohonan Anda terlebih dahulu untuk
          mengajukan keberatan.
        </p>
        <Link
          href="/cek-status"
          className="mt-6 inline-block rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Cek Status Permohonan
        </Link>
      </div>
    );
  }

  const permohonan = await getPermohonanById(id);
  if (!permohonan || permohonan.type !== "informasi") {
    return (
      <div className="mx-auto max-w-6xl px-2 py-10 text-center sm:px-3 sm:py-12 lg:px-4">
        <h1 className="text-xl font-bold text-red-600">Permohonan Tidak Valid</h1>
        <p className="mt-2 text-sm text-gray-500">
          Permohonan informasi publik tidak ditemukan.
        </p>
        <Link
          href="/cek-status"
          className="mt-6 inline-block rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const existingKeberatan = await getKeberatanByPermohonanId(id);
  if (existingKeberatan) {
    return (
      <div className="mx-auto max-w-6xl px-2 py-10 text-center sm:px-3 sm:py-12 lg:px-4">
        <h1 className="text-xl font-bold text-gray-900">Keberatan Sudah Diajukan</h1>
        <p className="mt-2 text-sm text-gray-500">
          Anda sudah pernah mengajukan keberatan untuk permohonan ini.
        </p>
        <Link
          href="/cek-status"
          className="mt-6 inline-block rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="mb-6">
        <Link
          href="/cek-status"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#003459]"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </div>

      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Hak Warga
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Ajukan Keberatan Informasi
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Anda sedang mengajukan keberatan untuk: <strong>{permohonan.categoryLabel}</strong> {permohonan.number ? `(${permohonan.number})` : ''}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-4 sm:mt-10">
        <SopRequirementBox sop={sopKeberatanInformasi} />
        <KeberatanForm permohonanId={id} />
      </div>
    </div>
  );
}

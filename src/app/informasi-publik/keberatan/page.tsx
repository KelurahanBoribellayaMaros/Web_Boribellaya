import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileQuestion, Scale } from "lucide-react";
import { requireVerifiedSession } from "@/lib/firebase/session";
import { getPermohonanByEmail } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByEmail } from "@/lib/firebase/keberatan-repository";
import { formatDate } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ajukan Keberatan Informasi | Kelurahan Boribellaya",
};

export default async function PilihPermohonanKeberatanPage() {
  const session = await requireVerifiedSession();

  const [permohonanList, keberatanList] = session.email
    ? await Promise.all([
        getPermohonanByEmail(session.email),
        getKeberatanByEmail(session.email),
      ])
    : [[], []];
  const alreadyObjected = new Set(keberatanList.map((k) => k.permohonanId));
  const eligible = permohonanList.filter(
    (p) => p.type === "informasi" && !alreadyObjected.has(p.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
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
          Pilih permohonan informasi publik yang ingin Anda ajukan
          keberatan.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl space-y-3 sm:mt-10">
        {eligible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Scale className="size-8" />
            <p className="text-sm">
              Anda belum memiliki permohonan informasi publik yang bisa
              diajukan keberatan. Keberatan hanya bisa diajukan untuk
              permohonan informasi (PPID) yang sudah pernah Anda kirim dan
              belum diajukan keberatan sebelumnya.
            </p>
            <Link
              href="/informasi-publik/ajukan"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#003459] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              <FileQuestion className="size-4" />
              Ajukan Permohonan Informasi
            </Link>
          </div>
        ) : (
          eligible.map((item) => (
            <Link
              key={item.id}
              href={`/akun/permohonan/${item.id}/keberatan`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {item.categoryLabel}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  Diajukan {formatDate(item.createdAt)}
                </p>
                {item.number && (
                  <p className="mt-0.5 font-mono text-xs text-gray-400">
                    {item.number}
                  </p>
                )}
              </div>
              <ArrowRight className="size-4 shrink-0 text-gray-400" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

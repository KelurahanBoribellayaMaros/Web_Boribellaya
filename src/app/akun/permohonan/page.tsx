import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import { requireSession } from "@/lib/firebase/session";
import { getPermohonanByEmail } from "@/lib/firebase/permohonan-repository";
import {
  copyFormatLabels,
  identityCategoryLabels,
  statusLabels,
} from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";
import { formatDate } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Riwayat Permohonan Saya | Kelurahan Boribellaya",
};

const statusBadgeClass: Record<PermohonanStatus, string> = {
  baru: "bg-amber-100 text-amber-700",
  diverifikasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

export default async function RiwayatPermohonanPage() {
  const session = await requireSession();
  const items = session.email ? await getPermohonanByEmail(session.email) : [];

  return (
    <div className="mx-auto max-w-3xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-8 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Pantau Pengajuan Anda
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Riwayat Permohonan Saya
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Semua permohonan layanan dan informasi PPID yang pernah Anda ajukan
          dengan akun ini.
        </p>
      </div>

      <div className="mt-8 space-y-3 sm:mt-10">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Inbox className="size-8" />
            <p className="text-sm">Anda belum pernah mengajukan permohonan.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  {item.type === "layanan" ? "Layanan" : "Informasi"}
                </span>
                <span className="text-xs text-gray-400">
                  Diajukan {formatDate(item.createdAt)}
                </span>
              </div>

              <h3 className="mt-2 font-semibold text-gray-900">
                {item.categoryLabel}
              </h3>

              <dl className="mt-3 space-y-1.5 text-sm">
                {item.identityCategory && (
                  <div className="flex gap-2">
                    <dt className="w-36 shrink-0 text-gray-500">Kategori Pemohon</dt>
                    <dd className="text-gray-900">
                      {identityCategoryLabels[item.identityCategory]}
                    </dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="w-36 shrink-0 text-gray-500">
                    {item.type === "informasi" ? "Rincian Informasi" : "Keperluan"}
                  </dt>
                  <dd className="text-gray-900">{item.description}</dd>
                </div>
                {item.usagePurpose && (
                  <div className="flex gap-2">
                    <dt className="w-36 shrink-0 text-gray-500">Tujuan Penggunaan</dt>
                    <dd className="text-gray-900">{item.usagePurpose}</dd>
                  </div>
                )}
                {item.copyFormat && (
                  <div className="flex gap-2">
                    <dt className="w-36 shrink-0 text-gray-500">Format Salinan</dt>
                    <dd className="text-gray-900">{copyFormatLabels[item.copyFormat]}</dd>
                  </div>
                )}
              </dl>

              {item.status !== "baru" && (
                <p className="mt-3 text-xs text-gray-400">
                  Terakhir diperbarui {formatDate(item.updatedAt)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, Calendar, CheckCircle2, Clock, XCircle, FileQuestion, ArrowRight } from "lucide-react";
import { getPermohonanByPhone } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByPhone } from "@/lib/firebase/keberatan-repository";
import { formatDate } from "@/lib/home-data";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";

export const metadata: Metadata = {
  title: "Cek Status Permohonan | Kelurahan Boribellaya",
  description: "Cek status permohonan layanan atau informasi publik Anda.",
};

const statusIcon = {
  baru: Clock,
  diverifikasi: CheckCircle2,
  selesai: CheckCircle2,
  ditolak: XCircle,
};

const statusColor = {
  baru: "text-amber-500",
  diverifikasi: "text-blue-500",
  selesai: "text-green-500",
  ditolak: "text-red-500",
};

export default async function CekStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;

  const permohonanList = phone ? await getPermohonanByPhone(phone) : [];
  const keberatanList = phone ? await getKeberatanByPhone(phone) : [];
  
  const alreadyObjected = new Set(keberatanList.map((k) => k.permohonanId));

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Pantau Layanan
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Cek Status Permohonan
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Masukkan nomor WhatsApp yang Anda gunakan saat mengajukan permohonan untuk melihat status terkini.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <form
          method="GET"
          action="/cek-status"
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-[#003459] focus-within:ring-2 focus-within:ring-[#003459]/20"
        >
          <div className="flex-1 relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              defaultValue={phone}
              required
              placeholder="Contoh: 081234567890"
              className="w-full border-none bg-transparent py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#003459] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Cari
          </button>
        </form>
      </div>

      {phone && (
        <div className="mx-auto mt-10 max-w-3xl">
          <h2 className="mb-6 text-lg font-bold text-gray-900">
            Hasil Pencarian untuk "{phone}"
          </h2>

          {permohonanList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
              <FileQuestion className="mx-auto size-10" />
              <p className="mt-3 text-sm">
                Tidak ada permohonan yang ditemukan dengan nomor WhatsApp tersebut.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {permohonanList.map((item) => {
                const StatusIcon = statusIcon[item.status];
                const canObject = item.type === "informasi" && !alreadyObjected.has(item.id);
                
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-widest text-[#003459] uppercase">
                            {item.type === "informasi" ? "Informasi Publik" : "Layanan Administrasi"}
                          </p>
                          <h3 className="mt-1 font-bold text-gray-900 sm:text-lg">
                            {item.categoryLabel}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium">
                          <StatusIcon className={`size-4 ${statusColor[item.status]}`} />
                          <span className={statusColor[item.status]}>
                            {statusLabels[item.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50/50 px-5 py-4 sm:px-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 size-4 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Diajukan Pada</p>
                            <p className="mt-0.5 text-sm font-medium text-gray-900">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Search className="mt-0.5 size-4 shrink-0 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Nomor Resi</p>
                            <p className="mt-0.5 font-mono text-sm font-medium text-gray-900">
                              {item.number || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {canObject && (
                      <div className="border-t border-gray-100 bg-blue-50/50 px-5 py-4 sm:px-6 flex items-center justify-between">
                        <p className="text-xs text-blue-800">
                          Merasa tidak puas dengan hasil permohonan informasi Anda?
                        </p>
                        <Link 
                          href={`/informasi-publik/keberatan?id=${item.id}`}
                          className="flex items-center gap-1.5 text-sm font-semibold text-[#003459] hover:underline"
                        >
                          Ajukan Keberatan <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

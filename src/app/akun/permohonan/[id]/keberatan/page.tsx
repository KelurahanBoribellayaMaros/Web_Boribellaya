import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Scale } from "lucide-react";
import { requireVerifiedSession } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByPermohonanId } from "@/lib/firebase/keberatan-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { KeberatanForm } from "@/components/permohonan/KeberatanForm";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";
import { keberatanReasonLabels } from "@/types/keberatan";
import { formatDate } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Keberatan Informasi | Kelurahan Boribellaya",
};

const statusBadgeClass: Record<PermohonanStatus, string> = {
  baru: "bg-amber-100 text-amber-700",
  diverifikasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

export default async function KeberatanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireVerifiedSession();
  const { id } = await params;

  // Guarded here (not just by hiding the button) since the URL is
  // guessable — every failure path redirects back with an error toast
  // rather than showing a blank/broken form.
  const item = await getPermohonanById(id);
  if (!item || item.email !== session.email || item.type !== "informasi") {
    redirect(
      toastRedirectUrl(
        "/akun/permohonan",
        "Permohonan tidak ditemukan atau tidak bisa diajukan keberatan.",
        "error"
      )
    );
  }

  const existing = await getKeberatanByPermohonanId(id);

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
          {existing ? "Keberatan Anda" : "Ajukan Keberatan"}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Untuk permohonan &quot;{item.categoryLabel}&quot;
          {item.number && ` (${item.number})`}.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
        {existing ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass[existing.status]}`}
              >
                {statusLabels[existing.status]}
              </span>
              <span className="text-xs text-gray-400">
                Diajukan {formatDate(existing.createdAt)}
              </span>
            </div>

            {existing.isKuasa && existing.kuasaName && (
              <p className="mt-3 text-sm text-gray-600">
                Diajukan atas nama kuasa:{" "}
                <span className="font-semibold text-gray-900">
                  {existing.kuasaName}
                </span>
              </p>
            )}

            <div className="mt-4 border-t border-gray-100 pt-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Alasan Pengajuan Keberatan
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                {existing.reasons.map((reason) => (
                  <li key={reason}>{keberatanReasonLabels[reason]}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Kronologi (Penjelasan Keberatan)
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {existing.kronologi}
              </p>
            </div>

            {existing.catatan && (
              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#003459]">
                  <Scale className="size-4" />
                  Catatan dari Petugas
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  {existing.catatan}
                </p>
              </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
              Terakhir diperbarui {formatDate(existing.updatedAt)}
            </p>
          </div>
        ) : (
          <KeberatanForm permohonanId={id} />
        )}
      </div>
    </div>
  );
}

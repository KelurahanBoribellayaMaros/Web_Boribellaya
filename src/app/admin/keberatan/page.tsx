import Link from "next/link";
import { Scale } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getKeberatanList } from "@/lib/firebase/keberatan-repository";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";
import type { Keberatan } from "@/types/keberatan";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

const statusFilters: { label: string; value: PermohonanStatus | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Baru", value: "baru" },
  { label: "Diverifikasi", value: "diverifikasi" },
  { label: "Selesai", value: "selesai" },
  { label: "Ditolak", value: "ditolak" },
];

const statusBadgeClass: Record<PermohonanStatus, string> = {
  baru: "bg-amber-100 text-amber-700",
  diverifikasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

// Not an automatic deletion — retention/record-keeping requirements are a
// policy decision for the kelurahan to make, not something to hardcode.
// This is purely a visual nudge for admins to review old, finished
// objections and manually delete (via ConfirmSubmitButton) if appropriate.
const RETENTION_REVIEW_DAYS = 180;

function isRetentionCandidate(item: Keberatan): boolean {
  if (item.status !== "selesai" && item.status !== "ditolak") return false;
  const ageMs = Date.now() - new Date(item.updatedAt).getTime();
  return ageMs > RETENTION_REVIEW_DAYS * 24 * 60 * 60 * 1000;
}

export default async function AdminKeberatanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const status =
    params.status && params.status !== "semua"
      ? (params.status as PermohonanStatus)
      : undefined;

  const items = await getKeberatanList({ status });

  function filterHref(value: string) {
    return `/admin/keberatan?status=${value}`;
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Scale}
        iconClass="bg-orange-100 text-orange-700"
        title="Keberatan Masuk"
        description="Kelola pengajuan keberatan atas permohonan informasi publik dari warga."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={filterHref(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              (params.status ?? "semua") === f.value
                ? "bg-[#003459] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Scale className="size-8" />
            <p className="text-sm">
              Tidak ada keberatan yang cocok dengan filter ini.
            </p>
          </div>
        )}

        {items.map((item) => (
          <Link
            key={item.id}
            href={`/admin/keberatan/${item.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass[item.status]}`}
                >
                  {statusLabels[item.status]}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(item.createdAt)}
                </span>
                {isRetentionCandidate(item) && (
                  <span
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500"
                    title={`Sudah ${RETENTION_REVIEW_DAYS}+ hari sejak terakhir diperbarui — pertimbangkan untuk ditinjau/dihapus`}
                  >
                    Kandidat retensi
                  </span>
                )}
              </div>
              <h3 className="mt-1.5 font-semibold text-gray-900">
                {item.permohonanCategoryLabel}
              </h3>
              <p className="text-sm text-gray-500">
                {item.name} &middot; {item.email}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {item.reasons.length} alasan diajukan
                {item.permohonanNumber && ` · ${item.permohonanNumber}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

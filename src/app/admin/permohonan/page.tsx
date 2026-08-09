import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getPermohonanList } from "@/lib/firebase/permohonan-repository";
import { statusLabels } from "@/types/permohonan";
import type { Permohonan, PermohonanStatus, PermohonanType } from "@/types/permohonan";
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

const typeFilters: { label: string; value: PermohonanType | "semua" }[] = [
  { label: "Semua Jenis", value: "semua" },
  { label: "Layanan", value: "layanan" },
  { label: "Informasi", value: "informasi" },
];

const statusBadgeClass: Record<PermohonanStatus, string> = {
  baru: "bg-amber-100 text-amber-700",
  diverifikasi: "bg-blue-100 text-blue-700",
  selesai: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const ITEMS_PER_PAGE = 20;

// Not an automatic deletion — retention/record-keeping requirements are a
// policy decision for the kelurahan to make, not something to hardcode.
// This is purely a visual nudge for admins to review old, finished
// requests and manually delete (via ConfirmSubmitButton) if appropriate.
const RETENTION_REVIEW_DAYS = 180;

function isRetentionCandidate(item: Permohonan): boolean {
  if (item.status !== "selesai" && item.status !== "ditolak") return false;
  const ageMs = Date.now() - new Date(item.updatedAt).getTime();
  return ageMs > RETENTION_REVIEW_DAYS * 24 * 60 * 60 * 1000;
}

export default async function AdminPermohonanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const status =
    params.status && params.status !== "semua"
      ? (params.status as PermohonanStatus)
      : undefined;
  const type =
    params.type && params.type !== "semua"
      ? (params.type as PermohonanType)
      : undefined;

  const allItems = await getPermohonanList({ status, type });

  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(allItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const items = allItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function filterHref(next: { status?: string; type?: string; page?: string }) {
    const query = new URLSearchParams({
      status: next.status ?? params.status ?? "semua",
      type: next.type ?? params.type ?? "semua",
      page: next.page ?? "1",
    });
    return `/admin/permohonan?${query.toString()}`;
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Inbox}
        iconClass="bg-amber-100 text-amber-700"
        title="Permohonan Masuk"
        description="Verifikasi dan selesaikan permohonan layanan dan informasi dari warga."
      />

      <div className="mt-6 space-y-2">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <Link
              key={f.value}
              href={filterHref({ status: f.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                (params.status ?? "semua") === f.value
                  ? "bg-[#003459] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((f) => (
            <Link
              key={f.value}
              href={filterHref({ type: f.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                (params.type ?? "semua") === f.value
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Inbox className="size-8" />
            <p className="text-sm">
              Tidak ada permohonan yang cocok dengan filter ini.
            </p>
          </div>
        )}

        {items.map((item) => (
          <Link
            key={item.id}
            href={`/admin/permohonan/${item.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass[item.status]}`}>
                  {statusLabels[item.status]}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  {item.type === "layanan" ? "Layanan" : "Informasi"}
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
                {item.categoryLabel}
              </h3>
              <p className="text-sm text-gray-500">
                {item.name} &middot; {item.email}
              </p>
              {item.number && (
                <p className="mt-0.5 font-mono text-xs text-gray-400">{item.number}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={filterHref({ page: String(currentPage - 1) })}
            aria-disabled={currentPage <= 1}
            className={`flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors ${
              currentPage <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-gray-50"
            }`}
          >
            <ChevronLeft className="size-4" />
          </Link>
          <span className="text-sm text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Link
            href={filterHref({ page: String(currentPage + 1) })}
            aria-disabled={currentPage >= totalPages}
            className={`flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-gray-50"
            }`}
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

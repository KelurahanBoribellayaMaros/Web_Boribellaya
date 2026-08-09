import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getKeberatanById } from "@/lib/firebase/keberatan-repository";
import {
  deleteKeberatanAction,
  updateKeberatanStatusAction,
} from "@/lib/actions/keberatan-actions";
import { statusLabels } from "@/types/permohonan";
import { keberatanReasonLabels } from "@/types/keberatan";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminKeberatanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const item = await getKeberatanById(id);
  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Scale}
        iconClass="bg-orange-100 text-orange-700"
        title="Detail Keberatan"
        description={`Dari ${item.name}`}
        backHref="/admin/keberatan"
        backLabel="Keberatan Masuk"
      />

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">
            Diajukan {formatDate(item.createdAt)}
          </span>
        </div>

        <h1 className="mt-2 text-xl font-bold text-gray-900">
          Keberatan atas: {item.permohonanCategoryLabel}
        </h1>

        <Link
          href={`/admin/permohonan/${item.permohonanId}`}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#003459] hover:underline"
        >
          Lihat Permohonan Asal
          <ArrowRight className="size-4" />
        </Link>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-gray-500">Nama</dt>
            <dd className="text-gray-900">{item.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-gray-500">Email</dt>
            <dd className="text-gray-900">{item.email}</dd>
          </div>
          {item.permohonanNumber && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Nomor Permohonan</dt>
              <dd className="font-mono text-gray-900">{item.permohonanNumber}</dd>
            </div>
          )}
          {item.isKuasa && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Dikuasakan Kepada</dt>
              <dd className="text-gray-900">{item.kuasaName}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Alasan Pengajuan Keberatan
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
            {item.reasons.map((reason) => (
              <li key={reason}>{keberatanReasonLabels[reason]}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Kronologi (Penjelasan Keberatan)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {item.kronologi}
          </p>
        </div>

        <form
          action={updateKeberatanStatusAction.bind(null, item.id)}
          className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={item.status}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Simpan Status
          </button>
        </form>

        <form
          action={deleteKeberatanAction.bind(null, item.id)}
          className="mt-4 flex justify-end border-t border-gray-100 pt-4"
        >
          <ConfirmSubmitButton
            confirmMessage={`Hapus keberatan atas "${item.permohonanCategoryLabel}" dari ${item.name}? Tindakan ini tidak bisa dibatalkan.`}
            className="rounded-xl border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Hapus Keberatan
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

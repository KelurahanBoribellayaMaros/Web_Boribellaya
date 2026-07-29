import { notFound } from "next/navigation";
import { Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { updatePermohonanStatusAction } from "@/lib/actions/permohonan-actions";
import { statusLabels } from "@/types/permohonan";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminPermohonanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const item = await getPermohonanById(id);
  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Inbox}
        iconClass="bg-amber-100 text-amber-700"
        title="Detail Permohonan"
        description={`Dari ${item.name}`}
        backHref="/admin/permohonan"
        backLabel="Permohonan Masuk"
      />

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {item.type === "layanan" ? "Layanan" : "Informasi"}
          </span>
          <span className="text-xs text-gray-400">
            Diajukan {formatDate(item.createdAt)}
          </span>
        </div>

        <h1 className="mt-2 text-xl font-bold text-gray-900">
          {item.categoryLabel}
        </h1>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-28 shrink-0 text-gray-500">Nama</dt>
            <dd className="text-gray-900">{item.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-28 shrink-0 text-gray-500">Email</dt>
            <dd className="text-gray-900">{item.email}</dd>
          </div>
          {item.phone && (
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 text-gray-500">No. HP</dt>
              <dd className="text-gray-900">{item.phone}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-28 shrink-0 text-gray-500">Keperluan</dt>
            <dd className="text-gray-900">{item.description}</dd>
          </div>
        </dl>

        <form
          action={updatePermohonanStatusAction.bind(null, item.id)}
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
            className="rounded-xl bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900"
          >
            Simpan Status
          </button>
        </form>
      </div>
    </div>
  );
}

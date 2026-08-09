import { notFound } from "next/navigation";
import { FileText, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import {
  deletePermohonanAction,
  updatePermohonanStatusAction,
} from "@/lib/actions/permohonan-actions";
import { copyFormatLabels, identityCategoryLabels, statusLabels } from "@/types/permohonan";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { supabaseAdmin, PERMOHONAN_BUCKET } from "@/lib/supabase/client";

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

  const berkasLinks = item.berkas
    ? await Promise.all(
        item.berkas.map(async (b) => {
          const { data } = await supabaseAdmin.storage
            .from(PERMOHONAN_BUCKET)
            .createSignedUrl(b.path, 3600);
          return { label: b.label, url: data?.signedUrl };
        })
      )
    : [];

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
        {item.number && (
          <p className="mt-0.5 font-mono text-xs text-gray-400">{item.number}</p>
        )}

        <dl className="mt-4 space-y-2 text-sm">
          {item.identityCategory && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Kategori Pemohon</dt>
              <dd className="text-gray-900">{identityCategoryLabels[item.identityCategory]}</dd>
            </div>
          )}
          {item.nik && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">NIK</dt>
              <dd className="text-gray-900">{item.nik}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-gray-500">Nama</dt>
            <dd className="text-gray-900">{item.name}</dd>
          </div>
          {item.address && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Alamat</dt>
              <dd className="text-gray-900">{item.address}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-gray-500">Email</dt>
            <dd className="text-gray-900">{item.email}</dd>
          </div>
          {item.phone && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">No. HP</dt>
              <dd className="text-gray-900">{item.phone}</dd>
            </div>
          )}
          {item.occupation && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Pekerjaan</dt>
              <dd className="text-gray-900">{item.occupation}</dd>
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
          {berkasLinks.length > 0 && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-gray-500">Berkas Persyaratan</dt>
              <dd className="flex flex-col gap-1.5">
                {berkasLinks.map((b, i) =>
                  b.url ? (
                    <a
                      key={i}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#003459] hover:underline"
                    >
                      <FileText className="size-4" />
                      {b.label}
                    </a>
                  ) : (
                    <span key={i} className="text-gray-400">
                      {b.label} (gagal memuat link)
                    </span>
                  )
                )}
              </dd>
            </div>
          )}
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
            className="rounded-xl bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            Simpan Status
          </button>
        </form>

        <form
          action={deletePermohonanAction.bind(null, item.id)}
          className="mt-4 flex justify-end border-t border-gray-100 pt-4"
        >
          <ConfirmSubmitButton
            confirmMessage={`Hapus permohonan "${item.categoryLabel}" dari ${item.name}? Berkas yang diunggah (termasuk KTP/KK) juga akan ikut terhapus permanen dan tidak bisa dikembalikan.`}
            className="rounded-xl border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Hapus Permohonan
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

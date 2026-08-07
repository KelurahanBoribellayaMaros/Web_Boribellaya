import { Wrench } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getLayananStatus, isLayananEnabled } from "@/lib/firebase/layanan-repository";
import { updateLayananStatusAction } from "@/lib/actions/layanan-actions";
import { layananItems } from "@/lib/layanan-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayananPage() {
  await requireAdmin();
  const status = await getLayananStatus();

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Wrench}
        iconClass="bg-teal-100 text-teal-700"
        title="Kelola Layanan"
        description="Aktifkan atau nonaktifkan sementara layanan digital yang bisa diajukan warga."
      />

      <form
        action={updateLayananStatusAction}
        className="mt-6 space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {layananItems.map((item) => {
          const enabled = isLayananEnabled(status, item.slug);
          return (
            <label
              key={item.slug}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 transition-colors has-[:checked]:border-[#003459]/30 has-[:checked]:bg-blue-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#003459]">
                  <item.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                name={`enabled-${item.slug}`}
                defaultChecked={enabled}
                className="size-5 shrink-0 accent-[#003459]"
              />
            </label>
          );
        })}

        <p className="text-xs text-gray-400">
          Layanan yang dinonaktifkan tidak akan bisa diajukan warga sampai
          diaktifkan kembali — kartu layanannya tetap tampil di halaman
          publik, tapi ditandai &quot;Tidak Tersedia&quot;.
        </p>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:w-auto sm:px-8"
        >
          Simpan Status Layanan
        </button>
      </form>
    </div>
  );
}

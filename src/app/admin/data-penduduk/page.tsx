import { Users } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getPopulationStats } from "@/lib/firebase/population-repository";
import { updatePopulationAction } from "@/lib/actions/population-actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminDataPendudukPage() {
  await requireAdmin();
  const stats = await getPopulationStats();

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Users}
        iconClass="bg-green-100 text-green-700"
        title="Perbarui Data Penduduk"
        description="Angka ini tampil di beranda pada bagian statistik demografi."
      />

      <form
        action={updatePopulationAction}
        className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="totalPenduduk"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Total Penduduk
            </label>
            <input
              id="totalPenduduk"
              name="totalPenduduk"
              type="number"
              min={0}
              required
              defaultValue={stats.totalPenduduk}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="kepalaKeluarga"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Kepala Keluarga
            </label>
            <input
              id="kepalaKeluarga"
              name="kepalaKeluarga"
              type="number"
              min={0}
              required
              defaultValue={stats.kepalaKeluarga}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="lakiLaki"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Laki-laki
            </label>
            <input
              id="lakiLaki"
              name="lakiLaki"
              type="number"
              min={0}
              required
              defaultValue={stats.lakiLaki}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="perempuan"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Perempuan
            </label>
            <input
              id="perempuan"
              name="perempuan"
              type="number"
              min={0}
              required
              defaultValue={stats.perempuan}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-green-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

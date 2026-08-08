import { Users } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import {
  computePopulationStats,
  getPopulationDetail,
} from "@/lib/firebase/population-repository";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PopulationDetailForm } from "@/components/admin/PopulationDetailForm";
import { formatNumber } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export default async function AdminDataPendudukPage() {
  await requireAdmin();
  const rws = await getPopulationDetail();
  const stats = computePopulationStats(rws);

  return (
    <div className="mx-auto max-w-5xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Users}
        iconClass="bg-blue-100 text-[#003459]"
        title="Perbarui Data Penduduk"
        description="Kelola tabel rincian per RW/RT di halaman Profil."
      />

      <section className="mt-6">
        <h2 className="font-semibold text-gray-900">Statistik Ringkas</h2>
        <p className="mt-1 text-sm text-gray-500">
          Dihitung otomatis dari tabel rincian di bawah — tidak perlu diisi
          manual. Ditampilkan sebagai kartu ringkasan di beranda dan halaman
          Profil.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Total Penduduk</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(stats.totalPenduduk)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Kepala Keluarga</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(stats.kepalaKeluarga)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Laki-laki</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(stats.lakiLaki)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Perempuan</p>
            <p className="text-xl font-bold text-gray-900">
              {formatNumber(stats.perempuan)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-gray-900">Rincian per RW/RT</h2>
        <p className="mt-1 text-sm text-gray-500">
          Ditampilkan sebagai tabel lengkap di halaman Profil. Statistik
          ringkas di atas otomatis mengikuti perubahan di sini.
        </p>
        <div className="mt-3">
          <PopulationDetailForm rws={rws} />
        </div>
      </section>
    </div>
  );
}

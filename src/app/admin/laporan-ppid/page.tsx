import { requireAdmin } from "@/lib/firebase/session";
import { getPpidStatistics } from "@/lib/firebase/permohonan-repository";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PpidStatisticsWidget } from "@/components/ppid/PpidStatistics";
import { PieChart, Download } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLaporanPpidPage() {
  await requireAdmin();
  const stats = await getPpidStatistics();

  return (
    <div className="mx-auto max-w-4xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={PieChart}
        iconClass="bg-blue-100 text-blue-700"
        title="Laporan Layanan Informasi Publik"
        description="Rekapitulasi jumlah dan tindak lanjut permohonan informasi publik (PPID)."
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900">
          Ringkasan Status Permohonan
        </h3>
        <p className="mt-1 text-sm text-gray-500 mb-4">
          Data ini ditampilkan secara otomatis dan *real-time* ke halaman publik PPID.
        </p>
        <PpidStatisticsWidget stats={stats} />
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
        <h4 className="font-semibold text-gray-900">Keterbukaan Informasi Publik</h4>
        <p className="mt-2 text-sm text-gray-600">
          Sesuai dengan regulasi Keterbukaan Informasi, kelurahan wajib mendata dan 
          mengumumkan jumlah permohonan informasi beserta tindak lanjutnya. 
          Laporan ini sudah otomatis ditautkan ke halaman <Link href="/informasi-publik" className="font-medium text-[#003459] underline">Informasi Publik</Link> sehingga Anda tidak perlu membuat rekap manual secara berkala.
        </p>
      </div>
    </div>
  );
}

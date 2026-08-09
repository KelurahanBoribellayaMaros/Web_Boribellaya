import { PieChart, Clock, CheckCircle, XCircle, Inbox } from "lucide-react";
import type { PpidStatistics } from "@/lib/firebase/permohonan-repository";
import { formatNumber } from "@/lib/home-data";

export function PpidStatisticsWidget({ stats }: { stats: PpidStatistics }) {
  const cards = [
    {
      label: "Total Permohonan",
      value: stats.total,
      icon: Inbox,
      iconClass: "bg-gray-100 text-gray-700",
      borderClass: "border-gray-200",
    },
    {
      label: "Permohonan Baru",
      value: stats.baru,
      icon: Clock,
      iconClass: "bg-amber-100 text-amber-700",
      borderClass: "border-amber-200",
    },
    {
      label: "Sedang Diproses",
      value: stats.diverifikasi,
      icon: PieChart,
      iconClass: "bg-blue-100 text-blue-700",
      borderClass: "border-blue-200",
    },
    {
      label: "Telah Selesai",
      value: stats.selesai,
      icon: CheckCircle,
      iconClass: "bg-green-100 text-green-700",
      borderClass: "border-green-200",
    },
    {
      label: "Ditolak",
      value: stats.ditolak,
      icon: XCircle,
      iconClass: "bg-red-100 text-red-700",
      borderClass: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border ${card.borderClass} bg-white p-4 shadow-sm transition-shadow hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${card.iconClass}`}
            >
              <card.icon className="size-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatNumber(card.value)}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}

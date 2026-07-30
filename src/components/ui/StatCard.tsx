import type { PopulationStat } from "@/types/home";
import { formatNumber } from "@/lib/home-data";

export function StatCard({ icon: Icon, label, value }: PopulationStat) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm">
      <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-[#003459]">
        <Icon className="size-5" />
      </span>
      <span className="text-xl font-bold text-gray-900">{formatNumber(value)}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

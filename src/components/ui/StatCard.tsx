import type { PopulationStat } from "@/types/home";
import { formatNumber } from "@/lib/home-data";

export function StatCard({ icon: Icon, label, value }: PopulationStat) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 p-5 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-700">
        <Icon className="size-5" />
      </span>
      <span className="text-xl font-bold text-gray-900">{formatNumber(value)}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

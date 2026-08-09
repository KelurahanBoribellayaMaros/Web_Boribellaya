import { FileCheck2 } from "lucide-react";
import type { SyaratLayanan } from "@/types/layanan";

export function SopRequirementBox({ sop }: { sop: SyaratLayanan }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <FileCheck2 className="size-4 text-[#003459]" />
        Persyaratan
      </h2>
      <ul className="mt-3 space-y-2">
        {sop.persyaratan.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-gray-600">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#003459]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

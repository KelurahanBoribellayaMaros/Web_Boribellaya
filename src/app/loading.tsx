import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <Loader2 className="size-8 animate-spin text-[#003459]" />
      <p className="text-sm text-gray-500">Memuat halaman...</p>
    </div>
  );
}

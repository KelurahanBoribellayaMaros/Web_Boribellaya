"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
    >
      <ArrowLeft className="size-4" />
      Halaman Sebelumnya
    </button>
  );
}

"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="size-7" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Terjadi Kesalahan</h2>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
        </p>
      </div>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="flex items-center gap-2 rounded-full bg-green-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900"
      >
        <RotateCw className="size-4" />
        Coba Lagi
      </button>
    </div>
  );
}

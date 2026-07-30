"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function AdminError({
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
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-3 py-16 text-center sm:px-4">
      <span className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="size-7" />
      </span>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Terjadi Kesalahan</h2>
        <p className="mt-1 text-sm text-gray-500">
          Maaf, terjadi kesalahan saat memuat halaman admin ini.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="flex items-center gap-2 rounded-full bg-[#003459] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <RotateCw className="size-4" />
          Coba Lagi
        </button>
        <Link
          href="/admin"
          className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Dashboard Admin
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { LayananItem } from "@/types/layanan";

export function LayananCard({
  icon: Icon,
  title,
  description,
  cta,
  href,
  variant,
  enabled = true,
  accent = "blue",
}: LayananItem) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${
        enabled ? "" : "opacity-60"
      }`}
    >
      <span
        className={`flex size-11 items-center justify-center rounded-xl ${
          !enabled
            ? "bg-gray-100 text-gray-400"
            : accent === "red"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-[#003459]"
        }`}
      >
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      {enabled ? (
        <Link
          href={href}
          className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
            variant === "solid"
              ? "bg-[#003459] text-white hover:opacity-90"
              : accent === "red"
                ? "border border-red-600 text-red-600 hover:bg-red-50"
                : "border border-[#003459] text-[#003459] hover:bg-blue-50"
          }`}
        >
          {cta}
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span className="mt-4 inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400">
          <Lock className="size-4" />
          Tidak Tersedia
        </span>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LayananItem } from "@/types/layanan";

export function LayananCard({
  icon: Icon,
  title,
  description,
  cta,
  href,
  variant,
}: LayananItem) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-[#003459]">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      <Link
        href={href}
        className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
          variant === "solid"
            ? "bg-[#003459] text-white hover:opacity-90"
            : "border border-[#003459] text-[#003459] hover:bg-blue-50"
        }`}
      >
        {cta}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

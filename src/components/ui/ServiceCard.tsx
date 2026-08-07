import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { ServiceItem } from "@/types/home";

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  enabled = true,
}: ServiceItem) {
  const content = (
    <>
      <span
        className={`absolute top-5 right-5 flex size-8 items-center justify-center rounded-full transition-colors ${
          enabled
            ? "bg-blue-50 text-[#003459] group-hover:bg-[#003459] group-hover:text-white"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {enabled ? <ArrowUpRight className="size-4" /> : <Lock className="size-3.5" />}
      </span>
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          enabled ? "bg-blue-100 text-[#003459]" : "bg-gray-100 text-gray-400"
        }`}
      >
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
      {!enabled && (
        <span className="mt-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
          Tidak Tersedia
        </span>
      )}
    </>
  );

  if (!enabled) {
    return (
      <div className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 opacity-60 shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {content}
    </Link>
  );
}

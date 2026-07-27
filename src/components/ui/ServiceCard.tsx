import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceItem } from "@/types/home";

export function ServiceCard({ icon: Icon, title, description, href }: ServiceItem) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-green-50 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
        <ArrowUpRight className="size-4" />
      </span>
      <span className="flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
    </Link>
  );
}

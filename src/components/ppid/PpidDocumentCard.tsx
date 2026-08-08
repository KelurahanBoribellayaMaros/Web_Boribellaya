import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import type { PpidDocument } from "@/types/ppid";
import { categoryLabels } from "@/lib/ppid-data";
import { formatDate } from "@/lib/home-data";

export function PpidDocumentCard({
  title,
  description,
  category,
  date,
  fileUrl,
  websiteUrl,
}: PpidDocument) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#003459]">
          <FileText className="size-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-[#003459]">
              {categoryLabels[category]}
            </span>
            <span className="text-xs text-gray-400">{formatDate(date)}</span>
          </div>
          <h3 className="mt-1.5 font-semibold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {fileUrl ? (
        <a
          href={fileUrl}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#003459] px-4 py-2 text-sm font-semibold text-[#003459] transition-colors hover:bg-blue-50 sm:self-center"
        >
          <Download className="size-4" />
          Unduh
        </a>
      ) : websiteUrl ? (
        <Link
          href={websiteUrl}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#003459] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:self-center"
        >
          Lihat di Website
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span className="shrink-0 text-sm text-gray-400 italic sm:self-center">
          Tanpa lampiran
        </span>
      )}
    </div>
  );
}

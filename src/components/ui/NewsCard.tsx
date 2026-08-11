import Link from "next/link";
import { Calendar, ImageIcon } from "lucide-react";
import type { NewsItem } from "@/types/home";
import { formatDate } from "@/lib/home-data";

export function NewsCard({
  slug,
  title,
  excerpt,
  date,
  category,
  coverImage,
}: NewsItem) {
  return (
    <Link
      href={`/berita/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#003459]/40">
            <ImageIcon className="size-10" />
          </div>
        )}

        {category === "pengumuman" && (
          <span className="absolute top-3 left-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            Pengumuman
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex h-5 items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="size-3.5 shrink-0" />
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        <h3 className="mt-2 line-clamp-2 h-11 text-base leading-snug font-semibold text-gray-900 transition-colors group-hover:text-[#003459]">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 h-10 text-sm leading-5 text-gray-500">
          {excerpt}
        </p>

        <div className="mt-auto pt-3">
          <span className="text-xs font-medium text-[#003459] opacity-0 transition-opacity group-hover:opacity-100">
            Baca selengkapnya →
          </span>
        </div>
      </div>
    </Link>
  );
}

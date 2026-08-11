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
      <div className="relative aspect-video shrink-0 bg-gradient-to-br from-blue-100 to-blue-200">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#003459]/40">
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
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="size-3.5" />
          <time>{formatDate(date)}</time>
        </div>
        <h3 className="mt-2 h-[3rem] font-semibold text-gray-900 transition-colors group-hover:text-green-700 line-clamp-2">
          {title}
        </h3>
        <div className="mt-1 flex-1">
          <p className="h-[2.5rem] text-sm text-gray-500 line-clamp-2">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}

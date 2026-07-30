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
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200">
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
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="size-3.5" />
          <time>{formatDate(date)}</time>
        </div>
        <h3 className="mt-2 font-semibold text-gray-900 transition-colors group-hover:text-green-700">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{excerpt}</p>
      </div>
    </Link>
  );
}

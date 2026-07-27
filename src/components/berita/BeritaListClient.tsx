"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { NewsCategory, NewsItem } from "@/types/home";
import { NewsCard } from "@/components/ui/NewsCard";

const filters: { label: string; value: NewsCategory | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Berita", value: "berita" },
  { label: "Pengumuman", value: "pengumuman" },
];

export function BeritaListClient({ items }: { items: NewsItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsCategory | "semua">("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "semua" || item.category === category;
      const matchesQuery =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, category]);

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-600/20"
        >
          <Search className="ml-3 size-5 shrink-0 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita atau pengumuman..."
            className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            Cari
          </button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setCategory(f.value)}
              aria-pressed={category === f.value}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === f.value
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <NewsCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-gray-400">
          <Search className="size-8" />
          <p className="text-sm">
            Tidak ada berita atau pengumuman yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { SyaratLayanan } from "@/types/layanan";

const PAGE_SIZE = 5;

export function SyaratLayananList({ items }: { items: SyaratLayanan[] }) {
  const [query, setQuery] = useState("");
  const [openNo, setOpenNo] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  const visibleItems = filtered.slice(0, visibleCount);

  function handleQueryChange(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-[#003459] focus-within:ring-2 focus-within:ring-[#003459]/20"
        >
          <Search className="ml-3 size-5 shrink-0 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Cari jenis surat..."
            className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Menampilkan {visibleItems.length} dari {filtered.length} jenis surat
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 space-y-3">
          {visibleItems.map((item) => {
            const isOpen = openNo === item.no;
            return (
              <div
                key={item.no}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenNo(isOpen ? null : item.no)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#003459]">
                      {item.no}
                    </span>
                    <span className="font-semibold text-gray-900">{item.name}</span>
                  </div>
                  <ChevronDown
                    className={`size-5 shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Dokumen Persyaratan:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {item.persyaratan.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#003459]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {filtered.length > visibleCount && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length))
            }
            className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Lihat Selengkapnya
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-gray-400">
          <Search className="size-8" />
          <p className="text-sm">Tidak ada jenis surat yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}

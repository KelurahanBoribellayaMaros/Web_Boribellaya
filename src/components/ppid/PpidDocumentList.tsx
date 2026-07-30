"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PpidCategory, PpidDocument } from "@/types/ppid";
import { PpidDocumentCard } from "@/components/ppid/PpidDocumentCard";

const filters: { label: string; value: PpidCategory | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Berkala", value: "berkala" },
  { label: "Setiap Saat", value: "setiap-saat" },
  { label: "Serta Merta", value: "serta-merta" },
];

export function PpidDocumentList({ documents }: { documents: PpidDocument[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PpidCategory | "semua">("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesCategory = category === "semua" || doc.category === category;
      const matchesQuery =
        q === "" ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [documents, query, category]);

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-[#2b9348] focus-within:ring-2 focus-within:ring-[#2b9348]/20"
        >
          <Search className="ml-3 size-5 shrink-0 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari dokumen..."
            className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#003459] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
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
                  ? "bg-[#003459] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Menampilkan {filtered.length} dari {documents.length} dokumen
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 space-y-3">
          {filtered.map((doc) => (
            <PpidDocumentCard key={doc.id} {...doc} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-gray-400">
          <Search className="size-8" />
          <p className="text-sm">Tidak ada dokumen yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}

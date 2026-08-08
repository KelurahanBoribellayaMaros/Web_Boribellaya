"use client";

import { useMemo, useState } from "react";
import { FileStack, Search } from "lucide-react";
import type { PpidCategory, PpidDocument } from "@/types/ppid";
import { categoryLabels } from "@/lib/ppid-data";
import { PpidDocumentCard } from "@/components/ppid/PpidDocumentCard";

const categories: PpidCategory[] = ["berkala", "setiap-saat", "serta-merta"];

export function PpidDocumentList({ documents }: { documents: PpidDocument[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q)
    );
  }, [documents, query]);

  const isSearching = query.trim() !== "";
  const hasAnyResult = filtered.length > 0;

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
        </form>
      </div>

      {isSearching && !hasAnyResult ? (
        <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-gray-400">
          <Search className="size-8" />
          <p className="text-sm">Tidak ada dokumen yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {categories.map((category) => {
            const categoryDocs = filtered.filter((doc) => doc.category === category);

            // A category the search matched nothing in stays out of the way
            // entirely; an empty, unsearched category still shows so it's
            // clear the section exists and simply has nothing published yet.
            if (isSearching && categoryDocs.length === 0) return null;

            return (
              <section key={category}>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Informasi {categoryLabels[category]}
                  </h3>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                    {categoryDocs.length}
                  </span>
                </div>

                {categoryDocs.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {categoryDocs.map((doc) => (
                      <PpidDocumentCard key={doc.id} {...doc} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-400">
                    <FileStack className="size-5 shrink-0" />
                    Belum ada dokumen di kategori ini.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

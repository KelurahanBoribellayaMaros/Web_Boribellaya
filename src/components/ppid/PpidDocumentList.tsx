"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ChevronDown, FileStack, Loader2, Search, X } from "lucide-react";
import type { PpidCategory, PpidDocument } from "@/types/ppid";
import { categoryLabels, PPID_PREVIEW_LIMIT } from "@/lib/ppid-data";
import { PpidDocumentCard } from "@/components/ppid/PpidDocumentCard";
import {
  loadMorePpidCategoryAction,
  searchPpidDocumentsAction,
} from "@/lib/actions/ppid-actions";

const categories: PpidCategory[] = ["berkala", "setiap-saat", "serta-merta"];

function groupByCategory(documents: PpidDocument[]): Record<PpidCategory, PpidDocument[]> {
  const grouped: Record<PpidCategory, PpidDocument[]> = {
    berkala: [],
    "setiap-saat": [],
    "serta-merta": [],
  };
  for (const doc of documents) grouped[doc.category].push(doc);
  return grouped;
}

export function PpidDocumentList({ previewDocuments }: { previewDocuments: PpidDocument[] }) {
  const [docsByCategory, setDocsByCategory] = useState(() => groupByCategory(previewDocuments));
  const [expandedCategories, setExpandedCategories] = useState<Set<PpidCategory>>(new Set());
  const [loadingCategory, setLoadingCategory] = useState<PpidCategory | null>(null);

  const [queryInput, setQueryInput] = useState("");
  const [searchResults, setSearchResults] = useState<PpidDocument[] | null>(null);
  const [isSearchPending, startSearchTransition] = useTransition();

  async function handleExpand(category: PpidCategory) {
    setLoadingCategory(category);
    try {
      const full = await loadMorePpidCategoryAction(category);
      setDocsByCategory((prev) => ({ ...prev, [category]: full }));
      setExpandedCategories((prev) => new Set(prev).add(category));
    } finally {
      setLoadingCategory(null);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = queryInput.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }
    startSearchTransition(async () => {
      setSearchResults(await searchPpidDocumentsAction(q));
    });
  }

  function handleClearSearch() {
    setQueryInput("");
    setSearchResults(null);
  }

  const isSearchActive = searchResults !== null;

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-colors focus-within:border-[#2b9348] focus-within:ring-2 focus-within:ring-[#2b9348]/20"
        >
          <Search className="ml-3 size-5 shrink-0 text-gray-400" />
          <input
            type="search"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Cari dokumen..."
            className="w-full bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          {isSearchActive && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Hapus pencarian"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearchPending}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#003459] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearchPending ? <Loader2 className="size-4 animate-spin" /> : "Cari"}
          </button>
        </form>
      </div>

      {isSearchActive ? (
        searchResults.length > 0 ? (
          <div className="mt-8 space-y-3">
            {searchResults.map((doc) => (
              <PpidDocumentCard key={doc.id} {...doc} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-gray-400">
            <Search className="size-8" />
            <p className="text-sm">Tidak ada dokumen yang cocok dengan pencarian Anda.</p>
          </div>
        )
      ) : (
        <div className="mt-8 space-y-8">
          {categories.map((category) => {
            const categoryDocs = docsByCategory[category];
            const isExpanded = expandedCategories.has(category);
            const mayHaveMore = !isExpanded && categoryDocs.length >= PPID_PREVIEW_LIMIT;

            return (
              <section key={category}>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Informasi {categoryLabels[category]}
                  </h3>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                    {categoryDocs.length}
                    {mayHaveMore ? "+" : ""}
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

                {mayHaveMore && (
                  <button
                    type="button"
                    onClick={() => handleExpand(category)}
                    disabled={loadingCategory === category}
                    className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#003459] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingCategory === category ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                    Lihat Selengkapnya
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

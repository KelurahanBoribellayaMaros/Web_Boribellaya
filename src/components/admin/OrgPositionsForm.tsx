"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Plus, Trash2, User } from "lucide-react";
import { updateOrgPositionsAction } from "@/lib/actions/struktur-actions";
import type { OrgPosition } from "@/lib/firebase/struktur-repository";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB
const ROOT_VALUE = "__lurah__";

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type Row = OrgPosition & { newPhotoFile?: File; newPhotoPreview?: string };

function toRow(p: OrgPosition): Row {
  return { ...p, id: p.id || newId() };
}

export function OrgPositionsForm({ positions }: { positions: OrgPosition[] }) {
  const [rows, setRows] = useState<Row[]>(
    positions.length > 0
      ? positions.map(toRow)
      : [{ id: newId(), name: "", position: "", nip: "", order: 0, parentId: null }]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Briefly disables the reorder/remove buttons right after a click. Rows
  // shift position on every move, so a second rapid click landing before
  // React re-renders can resolve against a row that's no longer under the
  // cursor — this lock gives the DOM time to settle so that never happens.
  const [isLocked, setIsLocked] = useState(false);

  function withLock(action: () => void) {
    if (isLocked) return;
    action();
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 250);
  }

  // Every mutation below looks up the row by its stable id from the latest
  // `prev` array inside the updater, rather than closing over an `index`
  // captured at render time. Indices shift on every reorder/add/remove, so
  // a stale closured index (e.g. from a second click landing before React
  // re-renders and rebinds the handlers) could silently target the wrong
  // row or double-apply a move, which looked like the buttons "sticking".
  function updateRow(id: string, field: "name" | "position" | "nip", value: string) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  function updateParent(id: string, value: string) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, parentId: value === ROOT_VALUE ? null : value } : row
      )
    );
  }

  function updatePhoto(id: string, file: File | null) {
    setError(null);
    if (file) {
      if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
        setError("Foto harus berformat JPG, PNG, atau WEBP.");
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        setError("Ukuran foto maksimal 600KB.");
        return;
      }
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              newPhotoFile: file ?? undefined,
              newPhotoPreview: file ? URL.createObjectURL(file) : undefined,
            }
          : row
      )
    );
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: newId(), name: "", position: "", nip: "", order: prev.length, parentId: null },
    ]);
  }

  function removeRow(id: string) {
    setRows((prev) =>
      prev
        .filter((row) => row.id !== id)
        // Any row that reported to the one being deleted now reports
        // straight to the Lurah, instead of pointing at a row that's gone.
        .map((row) => (row.parentId === id ? { ...row, parentId: null } : row))
    );
  }

  function moveRow(id: string, direction: -1 | 1) {
    setRows((prev) => {
      const index = prev.findIndex((row) => row.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set(
      "positionsJson",
      JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          position: row.position,
          nip: row.nip,
          photo: row.photo,
          parentId: row.parentId,
        }))
      )
    );
    rows.forEach((row, i) => {
      if (row.newPhotoFile) formData.set(`photo-${i}`, row.newPhotoFile);
    });

    try {
      await updateOrgPositionsAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-start"
          >
            <div className="flex shrink-0 items-center gap-2 sm:flex-col">
              <div className="size-14 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
                {row.newPhotoPreview || row.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.newPhotoPreview || row.photo}
                    alt={row.name || "Foto"}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-gray-300">
                    <User className="size-6" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer text-center text-xs font-semibold text-[#003459] hover:underline">
                Ganti Foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => updatePhoto(row.id, event.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Nama</label>
                <input
                  type="text"
                  required
                  value={row.name}
                  onChange={(event) => updateRow(row.id, "name", event.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Jabatan</label>
                <input
                  type="text"
                  required
                  value={row.position}
                  onChange={(event) => updateRow(row.id, "position", event.target.value)}
                  placeholder="Mis. Sekertaris Lurah"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">NIP</label>
                <input
                  type="text"
                  value={row.nip ?? ""}
                  onChange={(event) => updateRow(row.id, "nip", event.target.value)}
                  placeholder="Opsional"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Atasan</label>
                <select
                  value={row.parentId ?? ROOT_VALUE}
                  onChange={(event) => updateParent(row.id, event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                >
                  <option value={ROOT_VALUE}>Lurah (struktur utama)</option>
                  {rows
                    .filter((other) => other.id !== row.id)
                    .map((other) => (
                      <option key={other.id} value={other.id}>
                        {other.name || "(belum diisi)"} — {other.position || "?"}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex shrink-0 gap-1.5 sm:flex-col">
              <button
                type="button"
                onClick={() => withLock(() => moveRow(row.id, -1))}
                disabled={index === 0 || isLocked}
                aria-label="Naikkan urutan"
                title="Naikkan urutan"
                className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => withLock(() => moveRow(row.id, 1))}
                disabled={index === rows.length - 1 || isLocked}
                aria-label="Turunkan urutan"
                title="Turunkan urutan"
                className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => withLock(() => removeRow(row.id))}
                disabled={rows.length === 1 || isLocked}
                aria-label="Hapus posisi ini"
                className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-2.5 py-1.5 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#003459] hover:underline"
      >
        <Plus className="size-4" />
        Tambah Posisi
      </button>

      <p className="text-xs text-gray-400">
        Pilih &quot;Atasan&quot; untuk menentukan posisi ini berada di bawah
        siapa — bisa langsung di bawah Lurah, atau di bawah posisi lain,
        sehingga tingkatnya bisa diubah bebas kapan saja. Tombol ↑↓ mengatur
        urutan tampil sesama posisi dengan atasan yang sama.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Struktur Organisasi"}
      </button>
    </form>
  );
}

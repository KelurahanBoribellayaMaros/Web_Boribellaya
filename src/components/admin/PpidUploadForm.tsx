"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { supabaseBrowser, PPID_BUCKET } from "@/lib/supabase/browser-client";
import {
  createPpidUploadUrlAction,
  createPpidDocumentAction,
} from "@/lib/actions/ppid-actions";
import type { PpidCategory } from "@/types/ppid";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function PpidUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PpidCategory>("berkala");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!date) {
      setError("Tanggal wajib diisi.");
      return;
    }
    if (!file) {
      setError("Pilih file PDF atau DOCX terlebih dahulu.");
      return;
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      setError("Hanya file PDF atau DOCX yang diperbolehkan.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 2MB.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { path, token } = await createPpidUploadUrlAction({
        fileType: file.type,
        fileSize: file.size,
      });

      const { error: uploadError } = await supabaseBrowser.storage
        .from(PPID_BUCKET)
        .uploadToSignedUrl(path, token, file);

      if (uploadError) {
        throw new Error("Gagal mengunggah file. Silakan coba lagi.");
      }

      await createPpidDocumentAction({ path, title, description, category, date });
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
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
          Judul Dokumen
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as PpidCategory)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          >
            <option value="berkala">Berkala</option>
            <option value="setiap-saat">Setiap Saat</option>
            <option value="serta-merta">Serta Merta</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-gray-700">
            Tanggal
          </label>
          <DatePicker id="date" required value={date} onChange={setDate} />
        </div>
      </div>

      <div>
        <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-gray-700">
          File (PDF atau DOCX, maksimal 2MB)
        </label>
        <input
          id="file"
          type="file"
          required
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-[#003459] focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Mengunggah..." : "Unggah Dokumen"}
        <UploadCloud className="size-4" />
      </button>
    </form>
  );
}

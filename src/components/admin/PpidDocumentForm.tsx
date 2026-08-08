"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Save, UploadCloud } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import { categoryDescriptions } from "@/lib/ppid-data";
import { supabaseBrowser, PPID_BUCKET } from "@/lib/supabase/browser-client";
import {
  createPpidUploadUrlAction,
  createPpidDocumentAction,
  updatePpidDocumentAction,
} from "@/lib/actions/ppid-actions";
import type { PpidCategory, PpidDocument } from "@/types/ppid";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

type PpidDocumentFormProps = {
  mode: "create" | "edit";
  documentId?: string;
  defaultValues?: Pick<
    PpidDocument,
    "title" | "description" | "category" | "date" | "fileUrl" | "websiteUrl"
  >;
};

export function PpidDocumentForm({ mode, documentId, defaultValues }: PpidDocumentFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [category, setCategory] = useState<PpidCategory>(defaultValues?.category ?? "berkala");
  const [date, setDate] = useState(defaultValues?.date ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState(defaultValues?.websiteUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!date) {
      setError("Tanggal wajib diisi.");
      return;
    }
    const trimmedWebsiteUrl = websiteUrl.trim();
    if (trimmedWebsiteUrl && !trimmedWebsiteUrl.startsWith("/")) {
      setError("Link halaman website harus dimulai dengan / (mis. /profil).");
      return;
    }
    if (mode === "create" && !file && !trimmedWebsiteUrl) {
      setError(
        "Pilih file PDF/DOCX, atau isi Link Halaman Website jika informasinya sudah ada di situs."
      );
      return;
    }
    if (file) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        setError("Hanya file PDF atau DOCX yang diperbolehkan.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Ukuran file maksimal 2MB.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let path: string | undefined;

      if (file) {
        const { path: signedPath, token } = await createPpidUploadUrlAction({
          fileType: file.type,
          fileSize: file.size,
        });

        const { error: uploadError } = await supabaseBrowser.storage
          .from(PPID_BUCKET)
          .uploadToSignedUrl(signedPath, token, file);

        if (uploadError) {
          throw new Error("Gagal mengunggah file. Silakan coba lagi.");
        }
        path = signedPath;
      }

      if (mode === "create") {
        await createPpidDocumentAction({
          path,
          title,
          description,
          category,
          date,
          websiteUrl: trimmedWebsiteUrl || undefined,
        });
      } else {
        await updatePpidDocumentAction(documentId!, {
          path,
          title,
          description,
          category,
          date,
          websiteUrl: trimmedWebsiteUrl || undefined,
        });
      }
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
          <p className="mt-1.5 text-xs text-gray-400">{categoryDescriptions[category]}</p>
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
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-[#003459] focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        {mode === "edit" && (
          <p className="mt-1.5 text-xs text-gray-400">
            {defaultValues?.fileUrl
              ? "Kosongkan jika tidak ingin mengganti file yang sudah ada."
              : "Dokumen ini belum punya file. Pilih file di sini untuk melampirkannya."}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="websiteUrl" className="mb-1.5 block text-sm font-medium text-gray-700">
          Link Halaman Website (opsional)
        </label>
        <input
          id="websiteUrl"
          type="text"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          placeholder="/profil atau /layanan#sop-pelayanan"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Isi ini kalau informasinya sudah tersedia langsung di situs (mis.
          Data Penduduk, SOP Pelayanan, Profil Kelurahan) — publik akan
          diarahkan ke halaman itu, tidak perlu unggah file. Kosongkan kalau
          memakai file di atas.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mode === "create" ? (
          <>
            {isSubmitting ? "Menyimpan..." : "Simpan Dokumen"}
            <UploadCloud className="size-4" />
          </>
        ) : (
          <>
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            <Save className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";
import type { NewsItem } from "@/types/home";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB

type NewsFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Pick<
    NewsItem,
    "title" | "excerpt" | "content" | "date" | "category" | "coverImage" | "source"
  >;
  submitLabel: string;
};

export function NewsForm({ action, defaultValues, submitLabel }: NewsFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const photo = formData.get("coverImage");

    if (photo instanceof File && photo.size > 0) {
      if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
        setError("Foto sampul harus berformat JPG, PNG, atau WEBP.");
        return;
      }
      if (photo.size > MAX_PHOTO_SIZE) {
        setError("Ukuran foto sampul maksimal 600KB.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await action(formData);
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
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Foto Sampul
        </label>
        <div className="flex items-center gap-4">
          <div className="flex aspect-video w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
            {defaultValues?.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={defaultValues.coverImage}
                alt="Foto sampul"
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon className="size-6 text-gray-300" />
            )}
          </div>
          <input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-[#003459]"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Format JPG, PNG, atau WEBP, maksimal 600KB. Tampil sebagai foto
          sampul di kartu berita. Biarkan kosong jika tidak ingin mengubah
          foto.
        </p>
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Judul
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Ringkasan
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          defaultValue={defaultValues?.excerpt}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Ringkasan singkat yang tampil di kartu daftar berita.
        </p>
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Konten Berita
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          defaultValue={defaultValues?.content}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Isi lengkap berita yang tampil saat warga membuka halaman detail.
        </p>
      </div>

      <div>
        <label
          htmlFor="source"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Sumber Berita
        </label>
        <input
          id="source"
          name="source"
          type="text"
          defaultValue={defaultValues?.source}
          placeholder="Contoh: Humas Pemkab Maros (opsional)"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Isi jika berita ini mengutip atau berasal dari sumber lain. Biarkan
          kosong jika tidak ada.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Tanggal
          </label>
          <DatePicker
            id="date"
            name="date"
            required
            defaultValue={defaultValues?.date}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaultValues?.category ?? "berita"}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          >
            <option value="berita">Berita</option>
            <option value="pengumuman">Pengumuman</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}

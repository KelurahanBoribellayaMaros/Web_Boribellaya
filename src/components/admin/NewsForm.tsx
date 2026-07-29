import { ImageIcon } from "lucide-react";
import type { NewsItem } from "@/types/home";

type NewsFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Pick<
    NewsItem,
    "title" | "excerpt" | "content" | "date" | "category" | "coverImage"
  >;
  submitLabel: string;
};

export function NewsForm({ action, defaultValues, submitLabel }: NewsFormProps) {
  return (
    <form
      action={action}
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
            className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-green-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-green-700"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Tanggal
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaultValues?.date}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
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

      <button
        type="submit"
        className="w-full rounded-xl bg-green-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}

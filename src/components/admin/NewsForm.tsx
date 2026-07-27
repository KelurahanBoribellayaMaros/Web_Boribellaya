import type { NewsItem } from "@/types/home";

type NewsFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Pick<NewsItem, "title" | "excerpt" | "date" | "category">;
  submitLabel: string;
};

export function NewsForm({ action, defaultValues, submitLabel }: NewsFormProps) {
  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
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
          rows={4}
          defaultValue={defaultValues?.excerpt}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
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

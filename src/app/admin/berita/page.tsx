import Link from "next/link";
import { Plus } from "lucide-react";
import { getNews } from "@/lib/firebase/news-repository";
import { deleteNewsAction } from "@/lib/actions/news-actions";
import { requireAdmin } from "@/lib/firebase/session";
import { formatDate } from "@/lib/home-data";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  await requireAdmin();
  const news = await getNews();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Kelola Berita
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tambah, ubah, atau hapus berita dan pengumuman.
          </p>
        </div>
        <Link
          href="/admin/berita/baru"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900"
        >
          <Plus className="size-4" />
          Tambah Berita
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {news.length === 0 && (
          <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
            Belum ada berita. Klik &quot;Tambah Berita&quot; untuk membuat yang
            pertama.
          </p>
        )}

        {news.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                {item.category === "pengumuman" && (
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Pengumuman
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {formatDate(item.date)}
                </span>
              </div>
              <h3 className="mt-1 font-semibold text-gray-900">{item.title}</h3>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/berita/${item.id}/edit`}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Ubah
              </Link>
              <form action={deleteNewsAction.bind(null, item.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Hapus
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

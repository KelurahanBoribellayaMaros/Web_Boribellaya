import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { getNews } from "@/lib/firebase/news-repository";
import { deleteNewsAction } from "@/lib/actions/news-actions";
import { requireAdmin } from "@/lib/firebase/session";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  await requireAdmin();
  const news = await getNews();

  return (
    <div className="mx-auto max-w-4xl px-2 py-10 sm:px-3 lg:px-4">
      <AdminPageHeader
        icon={Newspaper}
        iconClass="bg-blue-100 text-blue-700"
        title="Kelola Berita"
        description="Tambah, ubah, atau hapus berita dan pengumuman."
        action={{ href: "/admin/berita/baru", label: "Tambah Berita", icon: Plus }}
      />

      <div className="mt-6 space-y-3">
        {news.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <Newspaper className="size-8" />
            <p className="text-sm">
              Belum ada berita. Klik &quot;Tambah Berita&quot; untuk membuat
              yang pertama.
            </p>
          </div>
        )}

        {news.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex aspect-video w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <Newspaper className="size-5 text-gray-300" />
                )}
              </div>
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
                <h3 className="mt-1 font-semibold text-gray-900">
                  {item.title}
                </h3>
              </div>
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

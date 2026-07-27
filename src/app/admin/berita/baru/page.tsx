import { requireAdmin } from "@/lib/firebase/session";
import { createNewsAction } from "@/lib/actions/news-actions";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function NewNewsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Tambah Berita
      </h1>
      <div className="mt-6">
        <NewsForm action={createNewsAction} submitLabel="Simpan" />
      </div>
    </div>
  );
}

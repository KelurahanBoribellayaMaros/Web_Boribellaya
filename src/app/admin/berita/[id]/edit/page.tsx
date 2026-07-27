import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/firebase/session";
import { getNewsById } from "@/lib/firebase/news-repository";
import { updateNewsAction } from "@/lib/actions/news-actions";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const item = await getNewsById(id);
  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Ubah Berita
      </h1>
      <div className="mt-6">
        <NewsForm
          action={updateNewsAction.bind(null, id)}
          submitLabel="Simpan Perubahan"
          defaultValues={item}
        />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getNewsById } from "@/lib/firebase/news-repository";
import { updateNewsAction } from "@/lib/actions/news-actions";
import { NewsForm } from "@/components/admin/NewsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

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
    <div className="mx-auto max-w-2xl px-2 py-10 sm:px-3 lg:px-4">
      <AdminPageHeader
        icon={Newspaper}
        iconClass="bg-blue-100 text-blue-700"
        title="Ubah Berita"
        description={item.title}
        backHref="/admin/berita"
        backLabel="Kelola Berita"
      />
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

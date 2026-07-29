import { Newspaper } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { createNewsAction } from "@/lib/actions/news-actions";
import { NewsForm } from "@/components/admin/NewsForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewNewsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-2 py-10 sm:px-3 lg:px-4">
      <AdminPageHeader
        icon={Newspaper}
        iconClass="bg-blue-100 text-blue-700"
        title="Tambah Berita"
        description="Publikasikan berita atau pengumuman baru untuk warga."
        backHref="/admin/berita"
        backLabel="Kelola Berita"
      />
      <div className="mt-6">
        <NewsForm action={createNewsAction} submitLabel="Simpan" />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { FileCheck2 } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getPpidDocumentById } from "@/lib/firebase/ppid-repository";
import { PpidDocumentForm } from "@/components/admin/PpidDocumentForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function EditPpidDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const doc = await getPpidDocumentById(id);
  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={FileCheck2}
        iconClass="bg-purple-100 text-purple-700"
        title="Ubah Dokumen"
        description={doc.title}
        backHref="/admin/ppid"
        backLabel="Kelola Informasi Publik"
      />
      <div className="mt-6">
        <PpidDocumentForm mode="edit" documentId={id} defaultValues={doc} />
      </div>
    </div>
  );
}

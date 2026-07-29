import { FileCheck2 } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { PpidUploadForm } from "@/components/admin/PpidUploadForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewPpidDocumentPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={FileCheck2}
        iconClass="bg-purple-100 text-purple-700"
        title="Unggah Dokumen PPID"
        description="Format PDF atau DOCX, maksimal 3MB."
        backHref="/admin/ppid"
        backLabel="Kelola PPID"
      />
      <div className="mt-6">
        <PpidUploadForm />
      </div>
    </div>
  );
}

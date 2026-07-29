import { Building2 } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { createOrgPositionAction } from "@/lib/actions/struktur-actions";
import { OrgPositionForm } from "@/components/admin/OrgPositionForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewOrgPositionPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Building2}
        iconClass="bg-indigo-100 text-indigo-700"
        title="Tambah Posisi"
        description="Tambahkan aparatur baru ke bagan struktur organisasi."
        backHref="/admin/struktur-organisasi"
        backLabel="Struktur Organisasi"
      />
      <div className="mt-6">
        <OrgPositionForm action={createOrgPositionAction} submitLabel="Simpan" />
      </div>
    </div>
  );
}

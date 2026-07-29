import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getOrgPositionById } from "@/lib/firebase/struktur-repository";
import { updateOrgPositionAction } from "@/lib/actions/struktur-actions";
import { OrgPositionForm } from "@/components/admin/OrgPositionForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function EditOrgPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const position = await getOrgPositionById(id);
  if (!position) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Building2}
        iconClass="bg-indigo-100 text-indigo-700"
        title="Ubah Posisi"
        description={`${position.name} — ${position.position}`}
        backHref="/admin/struktur-organisasi"
        backLabel="Struktur Organisasi"
      />
      <div className="mt-6">
        <OrgPositionForm
          action={updateOrgPositionAction.bind(null, id)}
          submitLabel="Simpan Perubahan"
          defaultValues={position}
        />
      </div>
    </div>
  );
}

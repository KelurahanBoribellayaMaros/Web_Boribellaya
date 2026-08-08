import { Building2, UserCog, Users } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getLeader, getOrgPositions } from "@/lib/firebase/struktur-repository";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeaderForm } from "@/components/admin/LeaderForm";
import { OrgPositionsForm } from "@/components/admin/OrgPositionsForm";

export const dynamic = "force-dynamic";

export default async function AdminStrukturOrganisasiPage() {
  await requireAdmin();
  const [leader, positions] = await Promise.all([getLeader(), getOrgPositions()]);

  return (
    <div className="mx-auto max-w-5xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={Building2}
        iconClass="bg-indigo-100 text-indigo-700"
        title="Struktur Organisasi"
        description="Kelola profil pimpinan dan susunan aparatur kelurahan."
      />

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <UserCog className="size-4 text-indigo-600" />
          Profil Pimpinan
        </h2>
        <LeaderForm leader={leader} />
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <Users className="size-4 text-indigo-600" />
          Susunan Aparatur (di bawah Lurah)
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tambah, ubah, hapus, atau atur ulang urutan langsung di sini, lalu
          simpan sekali untuk semuanya.
        </p>
        <div className="mt-3">
          <OrgPositionsForm positions={positions} />
        </div>
      </section>
    </div>
  );
}

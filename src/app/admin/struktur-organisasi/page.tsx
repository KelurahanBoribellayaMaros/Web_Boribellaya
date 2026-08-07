import Link from "next/link";
import { Building2, Plus, UserCog, Users } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getLeader, getOrgPositions } from "@/lib/firebase/struktur-repository";
import { deleteOrgPositionAction } from "@/lib/actions/struktur-actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeaderForm } from "@/components/admin/LeaderForm";

export const dynamic = "force-dynamic";

export default async function AdminStrukturOrganisasiPage() {
  await requireAdmin();
  const [leader, positions] = await Promise.all([getLeader(), getOrgPositions()]);

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4 lg:px-6">
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
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <Users className="size-4 text-indigo-600" />
            Susunan Aparatur (di bawah Lurah)
          </h2>
          <Link
            href="/admin/struktur-organisasi/baru"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#003459] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="size-4" />
            Tambah Posisi
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {positions.length === 0 && (
            <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
              Belum ada posisi tersimpan. Halaman Profil akan menampilkan
              contoh bawaan sampai Anda menambah posisi di sini.
            </p>
          )}

          {positions.map((pos) => (
            <div
              key={pos.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{pos.name}</h3>
                <p className="text-sm text-gray-500">
                  {pos.position} &middot; urutan {pos.order}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/struktur-organisasi/${pos.id}/edit`}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Ubah
                </Link>
                <form action={deleteOrgPositionAction.bind(null, pos.id)}>
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
      </section>
    </div>
  );
}

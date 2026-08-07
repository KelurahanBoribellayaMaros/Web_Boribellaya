import Link from "next/link";
import { Building2, Plus, User, UserCog, Users } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getLeader, getOrgPositions } from "@/lib/firebase/struktur-repository";
import { updateLeaderAction, deleteOrgPositionAction } from "@/lib/actions/struktur-actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

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
        <form
          action={updateLeaderAction}
          className="mt-3 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Foto Lurah
            </label>
            <div className="flex items-center gap-4">
              <div className="size-16 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
                {leader.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-gray-300">
                    <User className="size-7" />
                  </div>
                )}
              </div>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-[#003459]"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Format JPG, PNG, atau WEBP, maksimal 600KB. Biarkan kosong jika
              tidak ingin mengubah foto.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={leader.name}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Jabatan
              </label>
              <input
                id="position"
                name="position"
                type="text"
                required
                defaultValue={leader.position}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
            <div>
              <label htmlFor="nip" className="mb-1.5 block text-sm font-medium text-gray-700">
                NIP
              </label>
              <input
                id="nip"
                name="nip"
                type="text"
                required
                defaultValue={leader.nip}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={leader.email}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="term" className="mb-1.5 block text-sm font-medium text-gray-700">
                Masa Jabatan
              </label>
              <input
                id="term"
                name="term"
                type="text"
                required
                defaultValue={leader.term}
                placeholder="Masa Jabatan: 2021 - Sekarang"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-gray-700">
              Bio Singkat
            </label>
            <textarea
              id="bio"
              name="bio"
              required
              rows={3}
              defaultValue={leader.bio}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:w-auto sm:px-8"
          >
            Simpan Profil Pimpinan
          </button>
        </form>
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

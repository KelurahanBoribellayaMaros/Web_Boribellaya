import { ShieldUser } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getAdminList } from "@/lib/firebase/users-repository";
import { revokeAdminAction } from "@/lib/actions/admin-users-actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function KelolaAdminPage() {
  const session = await requireAdmin();
  const admins = await getAdminList();

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={ShieldUser}
        iconClass="bg-red-100 text-red-700"
        title="Kelola Admin"
        description="Berikan atau cabut akses admin tanpa perlu bantuan teknisi."
      />

      <section className="mt-8">
        <h2 className="font-semibold text-gray-900">Admin Saat Ini</h2>
        <div className="mt-3 space-y-3">
          {admins.map((admin) => {
            const isSelf = admin.uid === session.uid;
            const isLastAdmin = admins.length <= 1;
            return (
              <div
                key={admin.uid}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {admin.name || admin.email}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-[#003459]">
                        Akun Anda
                      </span>
                    )}
                  </p>
                  {admin.name && (
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  )}
                </div>

                {!isSelf && !isLastAdmin && (
                  <form action={revokeAdminAction.bind(null, admin.uid)} className="shrink-0">
                    <ConfirmSubmitButton
                      confirmMessage={`Cabut akses admin dari ${admin.email}? Akun ini akan kembali menjadi akun warga biasa dan sesi login yang sedang aktif akan langsung berakhir.`}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cabut Akses
                    </ConfirmSubmitButton>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-gray-900">Tambah / Jadikan Admin</h2>
        <p className="mt-1 text-sm text-gray-500">
          Masukkan email calon admin. Kalau orang tersebut sudah punya akun
          warga (daftar sendiri lewat halaman Daftar), akunnya langsung
          dinaikkan jadi admin. Kalau belum punya akun sama sekali, isi juga
          password untuk membuatkan akun baru.
        </p>
        <div className="mt-3">
          <AdminUserForm />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Newspaper, Users, Wrench } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/firebase/session";

export const metadata: Metadata = {
  title: "Dashboard Admin | Kelurahan Boribellaya",
};

const quickLinks = [
  {
    icon: Newspaper,
    title: "Kelola Berita",
    description: "Tambah, ubah, atau hapus berita dan pengumuman.",
    href: "/admin/berita",
  },
  {
    icon: Wrench,
    title: "Kelola Layanan",
    description: "Atur daftar layanan publik yang tersedia.",
    href: "/layanan",
  },
  {
    icon: Users,
    title: "Data Penduduk",
    description: "Lihat dan perbarui statistik kependudukan.",
    href: "/#data-penduduk",
  },
  {
    icon: Building2,
    title: "Struktur Organisasi",
    description: "Kelola profil pimpinan dan struktur organisasi.",
    href: "/profil",
  },
];

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-wide text-green-700 uppercase">
              Admin Panel
            </p>
            <h1 className="text-lg font-bold text-gray-900">
              Kelurahan Boribellaya
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Selamat Datang, Admin
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Kelola konten dan layanan portal Kelurahan Boribellaya dari sini.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <item.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Download,
  FileCheck2,
  History,
  Inbox,
  MapPin,
  Newspaper,
  Scale,
  ShieldUser,
  Users,
  Wrench,
} from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { countUrgentBaru, getPermohonanList } from "@/lib/firebase/permohonan-repository";
import { getKeberatanBaruCount } from "@/lib/firebase/keberatan-repository";
import { getNews } from "@/lib/firebase/news-repository";
import { getPpidDocuments } from "@/lib/firebase/ppid-repository";
import { getPopulationStats } from "@/lib/firebase/population-repository";
import { formatNumber, timeAgo } from "@/lib/home-data";
import { statusLabels } from "@/types/permohonan";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Admin | Kelurahan Boribellaya",
};

type Activity = {
  text: string;
  at: string;
  dot: "amber" | "green" | "blue";
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [permohonanList, keberatanBaruCount, newsList, ppidDocuments, population] =
    await Promise.all([
      getPermohonanList(),
      getKeberatanBaruCount(),
      getNews(),
      getPpidDocuments(),
      getPopulationStats(),
    ]);

  const baruCount = permohonanList.filter((p) => p.status === "baru").length;
  const urgentCount = countUrgentBaru(permohonanList);

  const stats = [
    {
      icon: Inbox,
      iconClass: "bg-amber-100 text-amber-700",
      label: "Permohonan Masuk",
      value: formatNumber(permohonanList.length),
      badge: baruCount > 0 ? `${baruCount} Baru` : undefined,
    },
    {
      icon: Users,
      iconClass: "bg-blue-100 text-[#003459]",
      label: "Warga Terdaftar",
      value: formatNumber(population.totalPenduduk),
      badge: `${formatNumber(population.kepalaKeluarga)} KK`,
    },
    {
      icon: Newspaper,
      iconClass: "bg-blue-100 text-blue-700",
      label: "Total Berita",
      value: formatNumber(newsList.length),
      badge: undefined,
    },
    {
      icon: FileCheck2,
      iconClass: "bg-purple-100 text-purple-700",
      label: "Dokumen Informasi Publik",
      value: formatNumber(ppidDocuments.length),
      badge: undefined,
    },
  ];

  const quickLinks = [
    {
      icon: Inbox,
      iconClass: "bg-amber-100 text-amber-700",
      title: "Permohonan Masuk",
      description: "Verifikasi dan selesaikan permohonan layanan & informasi.",
      href: "/admin/permohonan",
      badge: baruCount > 0 ? baruCount : undefined,
    },
    {
      icon: Scale,
      iconClass: "bg-orange-100 text-orange-700",
      title: "Keberatan Masuk",
      description: "Kelola pengajuan keberatan atas permohonan informasi publik.",
      href: "/admin/keberatan",
      badge: keberatanBaruCount > 0 ? keberatanBaruCount : undefined,
    },
    {
      icon: Newspaper,
      iconClass: "bg-blue-100 text-blue-700",
      title: "Kelola Berita",
      description: "Tambah, ubah, atau hapus berita dan pengumuman.",
      href: "/admin/berita",
    },
    {
      icon: FileCheck2,
      iconClass: "bg-purple-100 text-purple-700",
      title: "Kelola Informasi Publik",
      description: "Unggah atau hapus dokumen keterbukaan informasi.",
      href: "/admin/ppid",
    },
    {
      icon: Wrench,
      iconClass: "bg-teal-100 text-teal-700",
      title: "Kelola Layanan",
      description: "Aktifkan atau nonaktifkan layanan digital yang tersedia.",
      href: "/admin/layanan",
    },
    {
      icon: Users,
      iconClass: "bg-blue-100 text-[#003459]",
      title: "Data Penduduk",
      description: "Perbarui statistik dan tabel rincian RW/RT di halaman Profil.",
      href: "/admin/data-penduduk",
    },
    {
      icon: Building2,
      iconClass: "bg-indigo-100 text-indigo-700",
      title: "Struktur Organisasi",
      description: "Kelola profil pimpinan dan struktur organisasi.",
      href: "/admin/struktur-organisasi",
    },
    {
      icon: MapPin,
      iconClass: "bg-teal-100 text-teal-700",
      title: "Kontak & Lokasi",
      description: "Atur alamat, kontak, jam operasional, dan peta lokasi.",
      href: "/admin/kontak",
    },
    {
      icon: History,
      iconClass: "bg-gray-100 text-gray-700",
      title: "Log Aktivitas",
      description: "Riwayat perubahan data yang dilakukan akun admin.",
      href: "/admin/audit",
    },
    {
      icon: ShieldUser,
      iconClass: "bg-red-100 text-red-700",
      title: "Kelola Admin",
      description: "Berikan atau cabut akses admin untuk staf lain.",
      href: "/admin/kelola-admin",
    },
    {
      icon: Download,
      iconClass: "bg-gray-100 text-gray-700",
      title: "Backup Data",
      description: "Unduh salinan seluruh data (JSON) dari database.",
      href: "/api/admin/backup",
      // Plain <a>, not <Link> — Link prefetches visible hrefs in production,
      // which would silently trigger a full Firestore export on every
      // dashboard view. A real download also needs a full navigation
      // anyway for the browser to honor Content-Disposition.
      isDownload: true,
    },
  ];

  const activities: Activity[] = [
    ...permohonanList.slice(0, 5).map((p): Activity =>
      p.status === "baru"
        ? {
            text: `Permohonan baru: ${p.categoryLabel} dari ${p.name}`,
            at: p.createdAt,
            dot: "amber",
          }
        : {
            text: `Permohonan ${p.categoryLabel}: ${statusLabels[p.status]}`,
            at: p.updatedAt,
            dot: p.status === "ditolak" ? "amber" : "green",
          }
    ),
    ...newsList.slice(0, 5).map(
      (n): Activity => ({
        text: `Berita diperbarui: ${n.title}`,
        at: n.updatedAt,
        dot: "blue",
      })
    ),
    ...ppidDocuments.slice(0, 5).map(
      (d): Activity => ({
        text: `Dokumen Informasi Publik diunggah: ${d.title}`,
        at: d.createdAt,
        dot: "blue",
      })
    ),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5);

  const dotClass: Record<Activity["dot"], string> = {
    amber: "bg-amber-500",
    green: "bg-green-600",
    blue: "bg-blue-500",
  };

  return (
    <div className="mx-auto max-w-6xl px-2 py-8 sm:px-3 lg:px-4">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Selamat Datang, Admin
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Berikut adalah ringkasan aktivitas dan metrik kelurahan hari ini.
      </p>

      {urgentCount > 0 && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <AlertTriangle className="size-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Peringatan Sistem
            </p>
            <p className="mt-0.5 text-sm text-red-600">
              Terdapat {urgentCount} permohonan warga yang sudah lebih dari 24
              jam belum diverifikasi.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <stat.icon className="size-5" />
              </span>
              {stat.badge && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="mt-4 text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">Aksi Cepat</h2>
      <div className="mt-4 space-y-3">
        {quickLinks.map((item) => {
          const content = (
            <>
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
              >
                <item.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              {item.badge !== undefined && (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
            </>
          );
          const className =
            "flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md";

          return item.isDownload ? (
            <a key={item.title} href={item.href} className={className}>
              {content}
            </a>
          ) : (
            <Link key={item.title} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">
        Aktivitas Terkini
      </h2>
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400">Belum ada aktivitas.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="flex gap-3">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClass[activity.dot]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-400">
                    {timeAgo(activity.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pemerintah Kelurahan Boribellaya. Seluruh
        Hak Cipta Dilindungi.
      </p>
    </div>
  );
}

import { History } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getAuditLogs } from "@/lib/firebase/audit-repository";
import type { AuditAction } from "@/lib/firebase/audit-repository";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

const actionLabels: Record<AuditAction, string> = {
  create: "Menambahkan",
  update: "Mengubah",
  delete: "Menghapus",
  status_change: "Mengubah status",
  login: "Masuk",
};

const targetLabels: Record<string, string> = {
  berita: "Berita",
  ppid_document: "Dokumen Informasi Publik",
  leader: "Profil Pimpinan",
  org_position: "Struktur Organisasi",
  kontak: "Info Kontak & Lokasi",
  population: "Data Penduduk",
  permohonan: "Permohonan",
  admin: "sebagai admin",
};

const actionDotClass: Record<AuditAction, string> = {
  create: "bg-green-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
  status_change: "bg-amber-500",
  login: "bg-gray-400",
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminAuditPage() {
  await requireAdmin();
  const logs = await getAuditLogs();

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={History}
        iconClass="bg-gray-100 text-gray-700"
        title="Log Aktivitas Admin"
        description="Riwayat perubahan data yang dilakukan oleh akun admin."
      />

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        {logs.length === 0 ? (
          <p className="p-10 text-center text-sm text-gray-400">
            Belum ada aktivitas tercatat.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {logs.map((log) => (
              <li key={log.id} className="flex gap-3 px-5 py-4">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${actionDotClass[log.action]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{log.email || "—"}</span>{" "}
                    {actionLabels[log.action] ?? log.action}{" "}
                    {targetLabels[log.target] ?? log.target}
                    {log.details && (
                      <span className="text-gray-500"> — {log.details}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatTimestamp(log.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

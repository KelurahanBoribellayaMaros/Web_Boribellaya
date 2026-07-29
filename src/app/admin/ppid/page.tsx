import { FileCheck2, Plus } from "lucide-react";
import { getPpidDocuments } from "@/lib/firebase/ppid-repository";
import { deletePpidDocumentAction } from "@/lib/actions/ppid-actions";
import { requireAdmin } from "@/lib/firebase/session";
import { categoryLabels } from "@/lib/ppid-data";
import { formatDate } from "@/lib/home-data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminPpidPage() {
  await requireAdmin();
  const documents = await getPpidDocuments();

  return (
    <div className="mx-auto max-w-4xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={FileCheck2}
        iconClass="bg-purple-100 text-purple-700"
        title="Kelola Informasi Publik (PPID)"
        description="Unggah atau hapus dokumen PDF/DOCX untuk keterbukaan informasi."
        action={{ href: "/admin/ppid/baru", label: "Unggah Dokumen", icon: Plus }}
      />

      <div className="mt-6 space-y-3">
        {documents.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
            <FileCheck2 className="size-8" />
            <p className="text-sm">
              Belum ada dokumen. Klik &quot;Unggah Dokumen&quot; untuk menambah
              yang pertama.
            </p>
          </div>
        )}

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  {categoryLabels[doc.category]}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(doc.date)}
                </span>
              </div>
              <h3 className="mt-1 font-semibold text-gray-900">{doc.title}</h3>
            </div>

            <div className="flex shrink-0 gap-2">
              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Lihat
                </a>
              )}
              <form action={deletePpidDocumentAction.bind(null, doc.id)}>
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
    </div>
  );
}

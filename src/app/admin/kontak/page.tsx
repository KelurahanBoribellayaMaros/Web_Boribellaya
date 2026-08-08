import { MapPin } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getKontakInfo } from "@/lib/firebase/kontak-repository";
import { KontakForm } from "@/components/admin/KontakForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminKontakPage() {
  await requireAdmin();
  const kontak = await getKontakInfo();

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4 lg:px-6">
      <AdminPageHeader
        icon={MapPin}
        iconClass="bg-teal-100 text-teal-700"
        title="Kontak & Lokasi"
        description="Kelola alamat, kontak, jam operasional, dan peta lokasi kantor."
      />

      <KontakForm kontak={kontak} />
    </div>
  );
}

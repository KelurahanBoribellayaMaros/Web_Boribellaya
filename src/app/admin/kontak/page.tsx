import { MapPin } from "lucide-react";
import { requireAdmin } from "@/lib/firebase/session";
import { getKontakInfo } from "@/lib/firebase/kontak-repository";
import { updateKontakAction } from "@/lib/actions/kontak-actions";
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

      <form
        action={updateKontakAction}
        className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">
            Alamat Kantor
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={2}
            defaultValue={kontak.address === "Data belum tersedia" ? "" : kontak.address}
            placeholder="Jl. Contoh No. 1, Kelurahan Boribellaya, Kec. Turikale, Kab. Maros"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nomor WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              defaultValue={kontak.whatsapp}
              placeholder="08xxxxxxxxxx"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email Kontak
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={kontak.email}
              placeholder="kontak@boribellaya.desa.id"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hours" className="mb-1.5 block text-sm font-medium text-gray-700">
            Jam Operasional
          </label>
          <input
            id="hours"
            name="hours"
            type="text"
            required
            defaultValue={kontak.hours}
            placeholder="08:00 - 16:00 WITA"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        <div>
          <label
            htmlFor="mapsEmbedUrl"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            URL Embed Google Maps
          </label>
          <textarea
            id="mapsEmbedUrl"
            name="mapsEmbedUrl"
            rows={2}
            defaultValue={kontak.mapsEmbedUrl ?? ""}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Cara mendapatkan: buka lokasi kantor di Google Maps (desktop) →
            Bagikan → tab &quot;Sematkan peta&quot; → salin kodenya. Boleh
            tempel kode <code className="rounded bg-gray-100 px-1 py-0.5">&lt;iframe&gt;</code>{" "}
            utuh atau cukup URL-nya saja, keduanya otomatis dikenali.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:w-auto sm:px-8"
        >
          Simpan Info Kontak
        </button>
      </form>
    </div>
  );
}

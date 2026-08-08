"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { updateKontakAction } from "@/lib/actions/kontak-actions";
import type { KontakInfo, KontakPerson } from "@/types/kontak";

export function KontakForm({ kontak }: { kontak: KontakInfo }) {
  const [contacts, setContacts] = useState<KontakPerson[]>(
    kontak.contacts.length > 0 ? kontak.contacts : [{ jabatan: "", whatsapp: "" }]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateContact(index: number, field: keyof KontakPerson, value: string) {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function addContact() {
    setContacts((prev) => [...prev, { jabatan: "", whatsapp: "" }]);
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const validContacts = contacts.filter((c) => c.jabatan.trim() && c.whatsapp.trim());
    formData.set("contactsJson", JSON.stringify(validContacts));

    try {
      await updateKontakAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Kontak WhatsApp
        </label>
        <div className="space-y-2.5">
          {contacts.map((contact, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                required
                value={contact.jabatan}
                onChange={(event) => updateContact(index, "jabatan", event.target.value)}
                placeholder="Jabatan (mis. Lurah)"
                className="w-2/5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
              <input
                type="text"
                required
                value={contact.whatsapp}
                onChange={(event) => updateContact(index, "whatsapp", event.target.value)}
                placeholder="08xxxxxxxxxx"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
              <button
                type="button"
                onClick={() => removeContact(index)}
                disabled={contacts.length === 1}
                aria-label="Hapus kontak ini"
                className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 px-3 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addContact}
          className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold text-[#003459] hover:underline"
        >
          <Plus className="size-4" />
          Tambah Kontak
        </button>
        <p className="mt-1.5 text-xs text-gray-400">
          Bisa lebih dari satu, misalnya Lurah, Sekretaris, atau Kepala Seksi
          Pelayanan. Kontak pertama akan dipakai sebagai tombol WhatsApp utama
          di halaman Layanan.
        </p>
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Info Kontak"}
      </button>
    </form>
  );
}

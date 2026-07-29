import { Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import { submitPermohonanAction } from "@/lib/actions/permohonan-actions";
import type { PermohonanType } from "@/types/permohonan";

type PermohonanFormProps = {
  type: PermohonanType;
  category: string;
  categoryLabel: string;
  prefillName?: string;
  prefillEmail?: string;
};

export function PermohonanForm({
  type,
  category,
  categoryLabel,
  prefillName,
  prefillEmail,
}: PermohonanFormProps) {
  const action = submitPermohonanAction.bind(null, type, category, categoryLabel);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Honeypot: hidden from real users, bots that auto-fill every field will trip it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Nama Lengkap
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={prefillName}
            placeholder="Masukkan nama lengkap Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={prefillEmail}
            placeholder="Masukkan email Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
          No. HP (opsional)
        </label>
        <div className="relative">
          <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Masukkan nomor HP Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Keperluan
        </label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-gray-400" />
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Jelaskan keperluan permohonan Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-900"
      >
        Kirim Permohonan
        <Send className="size-4" />
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Send, User, Phone, Mail } from "lucide-react";
import { submitKeberatanAction } from "@/lib/actions/keberatan-actions";
import { keberatanReasonLabels } from "@/types/keberatan";
import { TurnstileWidget } from "@/components/turnstile-widget";
import type { KeberatanReason } from "@/types/keberatan";

const reasonEntries = Object.entries(keberatanReasonLabels) as [KeberatanReason, string][];

export function KeberatanForm({ permohonanId }: { permohonanId: string }) {
  const [isKuasa, setIsKuasa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    if (formData.getAll("reasons").length === 0) {
      setError("Pilih minimal satu alasan keberatan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitKeberatanAction(permohonanId, formData);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xs font-bold tracking-widest text-[#003459] uppercase">
          Identitas Pemohon
        </h2>
        <div className="mt-4 space-y-4">
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
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#003459] focus:ring-2 focus:ring-[#003459]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                No. WhatsApp Aktif *
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#003459] focus:ring-2 focus:ring-[#003459]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email (opsional)
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email (jika ada)"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#003459] focus:ring-2 focus:ring-[#003459]/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xs font-bold tracking-widest text-[#003459] uppercase">
          Alasan Pengajuan Keberatan
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Pilih satu atau lebih alasan sesuai Pasal 17 &amp; 35 UU No. 14 Tahun
          2008.
        </p>

        <div className="mt-4 space-y-2.5">
          {reasonEntries.map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition-colors has-[:checked]:border-[#003459] has-[:checked]:bg-blue-50"
            >
              <input
                type="checkbox"
                name="reasons"
                value={value}
                className="mt-0.5 size-4 shrink-0 accent-[#003459]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xs font-bold tracking-widest text-[#003459] uppercase">
          Detail Keberatan
        </h2>

        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="isKuasa"
              checked={isKuasa}
              onChange={(event) => setIsKuasa(event.target.checked)}
              className="size-4 accent-[#003459]"
            />
            Pengajuan keberatan dikuasakan (jika ada)
          </label>

          {isKuasa && (
            <div>
              <label
                htmlFor="kuasaName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Nama Penerima Kuasa
              </label>
              <input
                id="kuasaName"
                name="kuasaName"
                type="text"
                required={isKuasa}
                placeholder="Masukkan nama penerima kuasa"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#003459] focus:ring-2 focus:ring-[#003459]/20"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="kronologi"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Kronologi (Penjelasan Keberatan)
            </label>
            <textarea
              id="kronologi"
              name="kronologi"
              required
              rows={5}
              placeholder="Jelaskan kronologi keberatan Anda"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#003459] focus:ring-2 focus:ring-[#003459]/20"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <TurnstileWidget />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:px-10"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Keberatan"}
        <Send className="size-4" />
      </button>
    </form>
  );
}

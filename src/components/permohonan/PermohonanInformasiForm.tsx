"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import {
  Briefcase,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Send,
  Target,
  User,
  Users,
} from "lucide-react";
import { submitPermohonanAction } from "@/lib/actions/permohonan-actions";
import { TurnstileWidget } from "@/components/turnstile-widget";

export function PermohonanInformasiForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await submitPermohonanAction(
        "informasi",
        "informasi-publik",
        "Permohonan Informasi Publik",
        formData
      );
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot: hidden from real users, bots that auto-fill every field will trip it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>



      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xs font-bold tracking-widest text-[#2b9348] uppercase">
            Data Pemohon
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="identityCategory"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Kategori Permohonan
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                <select
                  id="identityCategory"
                  name="identityCategory"
                  defaultValue="perorangan"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                >
                  <option value="perorangan">Perorangan</option>
                  <option value="badan-hukum">Badan Hukum</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="nik" className="mb-1.5 block text-sm font-medium text-gray-700">
                NIK / No. Identitas Pribadi
              </label>
              <div className="relative">
                <IdCard className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="nik"
                  name="nik"
                  type="text"
                  inputMode="numeric"
                  required
                  minLength={16}
                  maxLength={16}
                  placeholder="Masukkan 16 digit NIK sesuai KTP"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Pastikan NIK yang Anda masukkan sesuai dengan KTP.
              </p>
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
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Alamat
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={2}
                  placeholder="Masukkan alamat Anda"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>

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
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Admin akan menghubungi Anda via WhatsApp.
              </p>
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
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="occupation"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Pekerjaan
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  placeholder="Masukkan pekerjaan Anda"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xs font-bold tracking-widest text-[#2b9348] uppercase">
            Detail Permohonan
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Rincian Informasi
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Jelaskan informasi yang Anda butuhkan"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="usagePurpose"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Tujuan Penggunaan Informasi
              </label>
              <div className="relative">
                <Target className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-gray-400" />
                <textarea
                  id="usagePurpose"
                  name="usagePurpose"
                  required
                  rows={4}
                  placeholder="Jelaskan tujuan penggunaan informasi ini"
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                />
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Format Salinan Informasi
              </span>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors has-[:checked]:border-[#003459] has-[:checked]:bg-blue-50 has-[:checked]:text-[#003459]">
                  <input
                    type="radio"
                    name="copyFormat"
                    value="softcopy"
                    defaultChecked
                    className="accent-[#003459]"
                  />
                  Softcopy
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors has-[:checked]:border-[#003459] has-[:checked]:bg-blue-50 has-[:checked]:text-[#003459]">
                  <input type="radio" name="copyFormat" value="hardcopy" className="accent-[#003459]" />
                  Hardcopy
                </label>
              </div>
            </div>
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
        {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
        <Send className="size-4" />
      </button>
    </form>
  );
}

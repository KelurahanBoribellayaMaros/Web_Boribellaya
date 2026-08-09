"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Mail, MessageSquare, Phone, Send, UploadCloud, User } from "lucide-react";
import {
  createPermohonanUploadUrlAction,
  submitPermohonanAction,
} from "@/lib/actions/permohonan-actions";
import { supabaseBrowser, PERMOHONAN_BUCKET } from "@/lib/supabase/browser-client";
import { TurnstileWidget } from "@/components/turnstile-widget";
import type { BerkasRequirement } from "@/types/layanan";
import type { PermohonanType } from "@/types/permohonan";

const ALLOWED_BERKAS_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_BERKAS_SIZE = 2 * 1024 * 1024; // 2MB

type PermohonanFormProps = {
  type: PermohonanType;
  category: string;
  categoryLabel: string;
  accountEmail: string;
  prefillName?: string;
  berkasRequirements?: BerkasRequirement[];
};

export function PermohonanForm({
  type,
  category,
  categoryLabel,
  accountEmail,
  prefillName,
  berkasRequirements = [],
}: PermohonanFormProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setFileFor(key: string, file: File | null) {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    for (const req of berkasRequirements) {
      const file = files[req.key];
      if (!file) {
        setError(`Unggah dokumen "${req.label}" terlebih dahulu.`);
        return;
      }
      if (!ALLOWED_BERKAS_TYPES.has(file.type)) {
        setError(`Dokumen "${req.label}" harus berformat PDF, JPG, atau PNG.`);
        return;
      }
      if (file.size > MAX_BERKAS_SIZE) {
        setError(`Ukuran dokumen "${req.label}" maksimal 2MB.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const berkas = await Promise.all(
        berkasRequirements.map(async (req) => {
          const file = files[req.key]!;
          const { path, token } = await createPermohonanUploadUrlAction({
            fileType: file.type,
            fileSize: file.size,
          });

          const { error: uploadError } = await supabaseBrowser.storage
            .from(PERMOHONAN_BUCKET)
            .uploadToSignedUrl(path, token, file);

          if (uploadError) {
            throw new Error(`Gagal mengunggah dokumen "${req.label}". Silakan coba lagi.`);
          }

          return { key: req.key, label: req.label, path };
        })
      );

      if (berkas.length > 0) {
        formData.set("berkasJson", JSON.stringify(berkas));
      }
      await submitPermohonanAction(type, category, categoryLabel, formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <div className="flex items-center gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
        <Mail className="size-4 shrink-0" />
        <span>
          Pembaruan permohonan akan dikirim ke{" "}
          <span className="font-semibold">{accountEmail}</span>
        </span>
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

      {berkasRequirements.length > 0 && (
        <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-[#003459]">
            Dokumen Persyaratan (sesuai SOP)
          </p>
          {berkasRequirements.map((req) => (
            <div key={req.key}>
              <label
                htmlFor={`berkas-${req.key}`}
                className="mb-1.5 block text-xs font-medium text-gray-700"
              >
                {req.label}
              </label>
              <input
                id={`berkas-${req.key}`}
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={(event) => setFileFor(req.key, event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-900 outline-none file:mr-3 file:rounded-full file:border-0 file:bg-blue-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#003459] focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            </div>
          ))}
          <p className="text-xs text-gray-500">
            Format PDF, JPG, atau PNG, maksimal 2MB per dokumen.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <TurnstileWidget />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            Mengunggah...
            <UploadCloud className="size-4" />
          </>
        ) : (
          <>
            Kirim Permohonan
            <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

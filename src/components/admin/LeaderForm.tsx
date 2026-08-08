"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { User } from "lucide-react";
import { updateLeaderAction } from "@/lib/actions/struktur-actions";
import type { Leader } from "@/types/profile";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 600 * 1024; // 600KB

export function LeaderForm({ leader }: { leader: Leader }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const photo = formData.get("photo");

    if (photo instanceof File && photo.size > 0) {
      if (!ALLOWED_PHOTO_TYPES.has(photo.type)) {
        setError("Foto harus berformat JPG, PNG, atau WEBP.");
        return;
      }
      if (photo.size > MAX_PHOTO_SIZE) {
        setError("Ukuran foto maksimal 600KB.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await updateLeaderAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Foto Lurah
        </label>
        <div className="flex items-center gap-4">
          <div className="size-16 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
            {leader.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={leader.photo}
                alt={leader.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-gray-300">
                <User className="size-7" />
              </div>
            )}
          </div>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-100 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-[#003459]"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Format JPG, PNG, atau WEBP, maksimal 600KB. Biarkan kosong jika
          tidak ingin mengubah foto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={leader.name}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
        <div>
          <label
            htmlFor="position"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Jabatan
          </label>
          <input
            id="position"
            name="position"
            type="text"
            required
            defaultValue={leader.position}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
        <div>
          <label htmlFor="nip" className="mb-1.5 block text-sm font-medium text-gray-700">
            NIP
          </label>
          <input
            id="nip"
            name="nip"
            type="text"
            required
            defaultValue={leader.nip}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Profil Pimpinan"}
      </button>
    </form>
  );
}

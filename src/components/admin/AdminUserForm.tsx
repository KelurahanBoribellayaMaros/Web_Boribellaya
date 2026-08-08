"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Mail, ShieldPlus, User } from "lucide-react";
import { promoteOrCreateAdminAction } from "@/lib/actions/admin-users-actions";

export function AdminUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await promoteOrCreateAdminAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Nama (opsional)
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nama staf admin"
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-11 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
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
            placeholder="staf@contoh.com"
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-11 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          placeholder="Minimal 6 karakter"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Hanya diperlukan jika email ini belum punya akun. Jika sudah punya
          akun warga, kolom ini diabaikan — akun tersebut langsung dijadikan
          admin tanpa mengubah passwordnya.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Menyimpan..." : "Jadikan Admin"}
        <ShieldPlus className="size-4" />
      </button>
    </form>
  );
}

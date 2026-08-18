"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { updateCredentialsAction } from "@/lib/actions/auth-actions";
import type { Session } from "@/lib/firebase/session-cookie";

export function ChangePasswordForm({ session }: { session: Session }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState(session.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError("Kata sandi saat ini wajib diisi untuk verifikasi.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError("Kata sandi baru minimal 6 karakter.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Konfirmasi kata sandi baru tidak cocok.");
        return;
      }
      if (newPassword === currentPassword) {
        setError("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.");
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      await updateCredentialsAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Informational Email Field */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Alamat Email Akun
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            type="email"
            disabled
            value={session.email ?? ""}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-11 text-sm text-gray-500 cursor-not-allowed outline-none"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Email terdaftar pada sistem (tidak dapat diubah secara langsung).
        </p>
      </div>

      {/* Full Name Field */}
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Nama Lengkap
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-base font-semibold text-gray-900">Ubah Kata Sandi</h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Kosongkan kolom kata sandi baru jika Anda hanya ingin memperbarui nama profil.
        </p>
      </div>

      {/* Current Password Field */}
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Kata Sandi Saat Ini <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Masukkan kata sandi lama Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-11 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((v) => !v)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showCurrentPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* New Password Field */}
      <div>
        <label
          htmlFor="newPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Kata Sandi Baru
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-xl border border-gray-200 py-3 pr-11 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((v) => !v)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showNewPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm New Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Konfirmasi Kata Sandi Baru
        </label>
        <div className="relative">
          <CheckCircle2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="w-full rounded-xl border border-gray-200 py-3 pr-11 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="size-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Security Tip Box */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-800">
        <ShieldCheck className="size-5 shrink-0 text-[#003459] mt-0.5" />
        <div>
          <p className="font-semibold text-[#003459]">Tips Keamanan Kredensial</p>
          <p className="mt-0.5 text-blue-700">
            Gunakan kombinasi kata sandi yang kuat dengan minimal 6 karakter.
            Jangan bagikan kata sandi Anda kepada pihak lain.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Menyimpan Perubahan..." : "Simpan Perubahan Kredensial"}
        <Save className="size-4" />
      </button>
    </form>
  );
}

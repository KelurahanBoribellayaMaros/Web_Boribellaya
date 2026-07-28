"use client";

import { useState, type FormEvent } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  type AuthError,
} from "firebase/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { auth } from "@/lib/firebase/client";

function authErrorMessage(error: unknown): string {
  const code = (error as AuthError)?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Kata sandi saat ini salah.";
    case "auth/weak-password":
      return "Kata sandi baru terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/email-already-in-use":
      return "Email tersebut sudah dipakai akun lain.";
    case "auth/invalid-email":
      return "Format email baru tidak valid.";
    case "auth/requires-recent-login":
      return "Sesi Anda sudah terlalu lama. Silakan keluar dan masuk kembali sebelum mengubah kredensial.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}

export function CredentialsForm({ currentEmail }: { currentEmail: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("Sesi tidak ditemukan. Silakan masuk kembali.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      const messages: string[] = [];

      if (newPassword) {
        await updatePassword(user, newPassword);
        messages.push("Kata sandi berhasil diubah.");
      }

      if (newEmail && newEmail !== currentEmail) {
        await verifyBeforeUpdateEmail(user, newEmail);
        messages.push(
          `Link konfirmasi telah dikirim ke ${newEmail}. Email akan berubah setelah Anda mengklik link tersebut.`
        );
      }

      if (messages.length === 0) {
        setError("Tidak ada perubahan untuk disimpan.");
      } else {
        setSuccess(messages.join(" "));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Kata Sandi Saat Ini
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="currentPassword"
            type={showPassword ? "text" : "password"}
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Diperlukan untuk konfirmasi perubahan"
            className="w-full rounded-xl border border-gray-200 py-3 pr-11 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <label
          htmlFor="newEmail"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="newEmail"
            type="email"
            required
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Ubah untuk mengganti email. Anda perlu mengklik link konfirmasi yang
          dikirim ke email baru.
        </p>
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Kata Sandi Baru
        </label>
        <input
          id="newPassword"
          type={showPassword ? "text" : "password"}
          minLength={6}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Kosongkan jika tidak ingin mengubah"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      {newPassword && (
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-green-800 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}

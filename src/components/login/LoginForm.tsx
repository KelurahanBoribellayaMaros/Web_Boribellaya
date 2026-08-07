"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { createSessionAction } from "@/lib/actions/auth-actions";

type LoginTab = "warga" | "admin";

function authErrorMessage(error: unknown): string {
  const code = (error as AuthError)?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau kata sandi salah.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-disabled":
      return "Akun ini telah dinonaktifkan. Hubungi admin kelurahan.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan gagal. Silakan coba lagi nanti.";
    case "auth/network-request-failed":
      return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    default:
      return "Gagal masuk. Silakan coba lagi.";
  }
}

export function LoginForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>("warga");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();
      const { role } = await createSessionAction(idToken, rememberMe);
      const toast = `toast=${encodeURIComponent("Berhasil masuk. Selamat datang kembali!")}`;
      router.push(role === "admin" ? `/admin?${toast}` : `/?${toast}`);
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("warga")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${activeTab === "warga"
            ? "bg-white text-[#003459] shadow-sm"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Warga
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("admin")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${activeTab === "admin"
            ? "bg-white text-[#003459] shadow-sm"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full rounded-xl border border-gray-200 py-3 pr-11 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
            />
            Ingat Saya
          </label>
          <Link href="/lupa-sandi" className="font-medium text-[#003459] hover:opacity-80">
            Lupa Sandi?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
          <LogIn className="size-4" />
        </button>
      </form>

      {activeTab === "warga" && (
        <>
          <div className="my-6 border-t border-gray-100" />
          <p className="text-center text-sm text-gray-500">
            Belum memiliki akun warga?
          </p>
          <Link
            href="/daftar"
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#003459] py-3 text-sm font-semibold text-[#003459] transition-colors hover:bg-blue-50"
          >
            Daftar Akun Baru
          </Link>
        </>
      )}
    </div>
  );
}

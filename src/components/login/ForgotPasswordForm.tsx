"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Mail, Send } from "lucide-react";
import { sendPasswordResetEmailAction } from "@/lib/actions/email-verification-actions";
import { useToast } from "@/components/ui/ToastProvider";
import { TurnstileWidget } from "@/components/turnstile-widget";

const SUCCESS_MESSAGE =
  "Jika email tersebut terdaftar, tautan untuk mengatur ulang kata sandi telah dikirim. Silakan cek kotak masuk (dan folder spam) Anda.";

export function ForgotPasswordForm() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

    try {
      const result = await sendPasswordResetEmailAction(email, turnstileToken);
      if (result?.error) {
        setError(result.error);
        return;
      }
      
      setSuccess(true);
      showToast("Tautan reset kata sandi telah dikirim.");
    } catch (err) {
      unstable_rethrow(err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-gray-700">{SUCCESS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
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
            placeholder="Masukkan email akun Anda"
            className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <TurnstileWidget />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003459] py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
        <Send className="size-4" />
      </button>
    </form>
  );
}

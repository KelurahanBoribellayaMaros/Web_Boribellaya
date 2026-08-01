"use client";

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { Send } from "lucide-react";
import { auth } from "@/lib/firebase/client";

export function ResendVerificationButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleResend() {
    setStatus("sending");
    setErrorMessage(null);

    // On a fresh page load, Firebase's client SDK rehydrates the signed-in
    // user from storage asynchronously — auth.currentUser can still be null
    // for a moment even though the browser session cookie is already valid.
    await auth.authStateReady();

    if (!auth.currentUser) {
      setStatus("error");
      setErrorMessage("Sesi Anda di perangkat ini tidak ditemukan. Silakan masuk kembali.");
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);
      setStatus("sent");
    } catch (error) {
      setStatus("error");
      const code = (error as { code?: string })?.code;
      setErrorMessage(
        code === "auth/too-many-requests"
          ? "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi."
          : "Gagal mengirim email verifikasi. Silakan coba lagi."
      );
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm font-medium text-green-700">
        Email verifikasi telah dikirim ulang. Silakan cek kotak masuk Anda.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        className="flex items-center gap-2 rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" />
        {status === "sending" ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
      </button>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}

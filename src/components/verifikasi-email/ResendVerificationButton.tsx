"use client";

import { useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { Send } from "lucide-react";
import { sendVerificationEmailAction } from "@/lib/actions/email-verification-actions";

export function ResendVerificationButton() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleResend() {
    setStatus("sending");
    setErrorMessage(null);

    try {
      await sendVerificationEmailAction();
      setStatus("sent");
    } catch (error) {
      unstable_rethrow(error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal mengirim email verifikasi. Silakan coba lagi."
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

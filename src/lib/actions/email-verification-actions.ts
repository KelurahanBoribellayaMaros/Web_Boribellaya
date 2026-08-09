"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { requireSession } from "@/lib/firebase/session";
import { getSiteUrl, sendEmail } from "@/lib/email";
import { emailSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limiter";
import { verifyTurnstileToken } from "@/lib/turnstile";

// Firebase's client SDK (sendEmailVerification / sendPasswordResetEmail)
// sends from Firebase's own "noreply@" address and rate-limits abuse for
// us automatically. Generating the action link via the Admin SDK instead
// (so the message can be sent through our own Gmail sender) bypasses both
// of those — so a lightweight per-email cooldown is enforced here instead.

const emailFooter = `
  <p style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
    Email ini dikirim oleh sistem Kelurahan Boribellaya. Ada pertanyaan?
    Silakan balas email ini, kami akan membacanya.
  </p>
`;

function verificationEmailHtml(link: string): string {
  return `
    <p>Terima kasih telah mendaftar di portal Kelurahan Boribellaya.</p>
    <p>Klik tautan berikut untuk memverifikasi email Anda:</p>
    <p><a href="${link}">Verifikasi Email Saya</a></p>
    <p>Kalau Anda tidak merasa mendaftar akun di situs ini, abaikan saja email ini.</p>
    ${emailFooter}
  `;
}

function passwordResetEmailHtml(link: string): string {
  return `
    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda di portal Kelurahan Boribellaya.</p>
    <p>Klik tautan berikut untuk membuat kata sandi baru:</p>
    <p><a href="${link}">Atur Ulang Kata Sandi</a></p>
    <p>Kalau Anda tidak meminta ini, abaikan saja email ini — kata sandi Anda tidak akan berubah.</p>
    ${emailFooter}
  `;
}

// Only ever sends to the caller's own session email — never accepts an
// email parameter — so this can't be used to spam an arbitrary inbox.
export async function sendVerificationEmailAction(): Promise<void> {
  const session = await requireSession();
  if (!session.email) {
    throw new Error("Email akun tidak ditemukan. Silakan masuk kembali.");
  }

  const allowed = await checkRateLimit(`verify:${session.email}`, 1, 60 * 1000);
  if (!allowed) {
    throw new Error("Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit.");
  }

  const link = await adminAuth.generateEmailVerificationLink(session.email, {
    url: `${getSiteUrl()}/login`,
  });

  await sendEmail({
    to: session.email,
    subject: "Verifikasi Email Anda — Kelurahan Boribellaya",
    html: verificationEmailHtml(link),
  });
}

export async function sendPasswordResetEmailAction(email: string, turnstileToken: string): Promise<{ error?: string }> {
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return { error: "Sistem mendeteksi aktivitas yang mencurigakan (Turnstile tidak terdeteksi). Silakan matikan AdBlock atau muat ulang halaman." };
    }
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken);
    if (!isTurnstileValid) {
      return { error: "Verifikasi keamanan Turnstile gagal. Silakan coba lagi." };
    }
  }

  const parseResult = emailSchema.safeParse({ email });
  if (!parseResult.success) {
    return { error: parseResult.error.issues[0].message };
  }
  const validEmail = parseResult.data.email;

  const allowed = await checkRateLimit(`reset:${validEmail}`, 1, 60 * 1000);
  if (!allowed) {
    return { error: "Terlalu banyak percobaan. Silakan coba lagi dalam 1 menit." };
  }

  try {
    const link = await adminAuth.generatePasswordResetLink(validEmail, {
      url: `${getSiteUrl()}/login`,
    });
    await sendEmail({
      to: validEmail,
      subject: "Atur Ulang Kata Sandi — Kelurahan Boribellaya",
      html: passwordResetEmailHtml(link),
    });
  } catch (error) {
    // Never reveal whether this email is registered — silently no-op
    // instead of throwing when it simply doesn't exist.
    const code = (error as { code?: string })?.code;
    if (code !== "auth/user-not-found") {
      console.error("Firebase Auth Error:", error);
      return { error: "Terjadi kesalahan pada server saat mengirim email." };
    }
  }
  
  return {};
}

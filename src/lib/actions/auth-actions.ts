"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME, requireSession } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { toastRedirectUrl } from "@/lib/toast-redirect";

const REMEMBERED_EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days (platform max)
const NOT_REMEMBERED_EXPIRES_IN_MS = 24 * 60 * 60 * 1000; // 1 day

export async function createSessionAction(
  idToken: string,
  rememberMe: boolean = true
): Promise<{ role: "admin" | "warga" }> {
  const ip = await getClientIp();
  // Maksimal 10 percobaan login dari IP yang sama dalam 15 menit
  const allowed = await checkRateLimit(`login_ip:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    throw new Error("Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.");
  }

  const decoded = await adminAuth.verifyIdToken(idToken);
  const expiresInMs = rememberMe
    ? REMEMBERED_EXPIRES_IN_MS
    : NOT_REMEMBERED_EXPIRES_IN_MS;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: expiresInMs,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Omitting maxAge for "not remembered" makes it a browser-session cookie
    // (cleared when the browser closes) instead of a persistent one.
    ...(rememberMe ? { maxAge: expiresInMs / 1000 } : {}),
  });

  const role: "admin" | "warga" = decoded.role === "admin" ? "admin" : "warga";

  await adminDb.collection("users").doc(decoded.uid).set(
    {
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      role,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Only admin sign-ins are audit-worthy — warga logins aren't a
  // security-sensitive event in the same way.
  if (role === "admin") {
    await logAudit({
      uid: decoded.uid,
      email: decoded.email ?? "",
      action: "login",
      target: "admin",
    });
  }

  return { role };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

export async function updateCredentialsAction(formData: FormData): Promise<void> {
  const session = await requireSession();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!currentPassword) {
    throw new Error("Kata sandi saat ini wajib diisi untuk verifikasi.");
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error("Kata sandi baru minimal 6 karakter.");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Konfirmasi kata sandi baru tidak cocok.");
    }
    if (newPassword === currentPassword) {
      throw new Error("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.");
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Konfigurasi API Key Firebase tidak ditemukan.");
  }

  if (!session.email) {
    throw new Error("Alamat email tidak ditemukan pada akun ini.");
  }

  const verifyRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.email,
        password: currentPassword,
        returnSecureToken: true,
      }),
    }
  );

  if (!verifyRes.ok) {
    const errorData = await verifyRes.json().catch(() => ({}));
    const errCode = errorData?.error?.message;
    if (
      errCode === "INVALID_PASSWORD" ||
      errCode === "INVALID_LOGIN_CREDENTIALS" ||
      errCode === "EMAIL_NOT_FOUND"
    ) {
      throw new Error("Kata sandi saat ini tidak sesuai.");
    }
    throw new Error("Verifikasi kata sandi saat ini gagal. Silakan periksa kembali.");
  }

  const updatePayload: { password?: string; displayName?: string } = {};
  if (newPassword) updatePayload.password = newPassword;
  if (name) updatePayload.displayName = name;

  if (Object.keys(updatePayload).length > 0) {
    await adminAuth.updateUser(session.uid, updatePayload);
  }

  await adminDb.collection("users").doc(session.uid).set(
    {
      ...(name && { name }),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  if (session.role === "admin") {
    await logAudit({
      uid: session.uid,
      email: session.email,
      action: "update",
      target: "credentials",
      targetId: session.uid,
      details: newPassword
        ? "Mengubah kata sandi dan kredensial akun admin"
        : "Memperbarui profil akun admin",
    });
  }

  redirect(
    toastRedirectUrl(
      "/akun",
      newPassword
        ? "Kata sandi dan kredensial Anda berhasil diperbarui!"
        : "Profil kredensial Anda berhasil diperbarui!"
    )
  );
}

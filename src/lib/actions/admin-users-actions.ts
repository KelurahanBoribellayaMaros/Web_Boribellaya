"use server";

import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { getAdminList } from "@/lib/firebase/users-repository";
import { logAudit } from "@/lib/firebase/audit-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";

function isUserNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "auth/user-not-found"
  );
}

export async function promoteOrCreateAdminAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    throw new Error("Format email tidak valid.");
  }

  let uid: string;
  let alreadyExisted: boolean;

  try {
    const existing = await adminAuth.getUserByEmail(email);
    uid = existing.uid;
    alreadyExisted = true;
    // Existing account (warga or otherwise) — only the role changes. Their
    // own password is left untouched; they keep logging in with whatever
    // they already use.
  } catch (error) {
    if (!isUserNotFound(error)) throw error;

    if (password.length < 6) {
      throw new Error(
        "Email ini belum terdaftar. Isi password (minimal 6 karakter) untuk membuat akun admin baru."
      );
    }

    const created = await adminAuth.createUser({
      email,
      password,
      displayName: name || undefined,
      emailVerified: true,
    });
    uid = created.uid;
    alreadyExisted = false;
  }

  await adminAuth.setCustomUserClaims(uid, { role: "admin" });

  await adminDb.collection("users").doc(uid).set(
    {
      email,
      ...(name && { name }),
      role: "admin",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "admin_role",
    targetId: uid,
    details: alreadyExisted
      ? `Menjadikan ${email} admin (akun warga sudah ada)`
      : `Membuat akun admin baru untuk ${email}`,
  });

  redirect(
    toastRedirectUrl(
      "/admin/kelola-admin",
      alreadyExisted
        ? `${email} sekarang menjadi admin.`
        : `Akun admin baru untuk ${email} berhasil dibuat.`
    )
  );
}

export async function revokeAdminAction(uid: string): Promise<void> {
  const session = await requireAdmin();

  if (uid === session.uid) {
    throw new Error("Anda tidak bisa mencabut akses admin Anda sendiri.");
  }

  const admins = await getAdminList();
  if (admins.length <= 1) {
    throw new Error("Tidak bisa mencabut akses admin terakhir yang tersisa.");
  }

  const target = admins.find((admin) => admin.uid === uid);

  await adminAuth.setCustomUserClaims(uid, { role: "warga" });
  // Existing session cookies embed the role at sign-in time, so without this
  // the just-demoted account would keep admin access until their cookie
  // naturally expires.
  await adminAuth.revokeRefreshTokens(uid);

  await adminDb.collection("users").doc(uid).set(
    { role: "warga", updatedAt: new Date().toISOString() },
    { merge: true }
  );

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "update",
    target: "admin_role",
    targetId: uid,
    details: `Mencabut akses admin dari ${target?.email ?? uid}`,
  });

  redirect(
    toastRedirectUrl(
      "/admin/kelola-admin",
      `Akses admin ${target?.email ?? ""} berhasil dicabut.`
    )
  );
}

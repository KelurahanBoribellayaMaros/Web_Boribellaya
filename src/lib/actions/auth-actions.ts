"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";

const REMEMBERED_EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days (platform max)
const NOT_REMEMBERED_EXPIRES_IN_MS = 24 * 60 * 60 * 1000; // 1 day

export async function createSessionAction(
  idToken: string,
  rememberMe: boolean = true
): Promise<{ role: "admin" | "warga" }> {
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

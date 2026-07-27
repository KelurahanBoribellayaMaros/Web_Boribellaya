"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/session";

const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000; // 5 days (platform max: 14 days)

export async function createSessionAction(
  idToken: string
): Promise<{ role: "admin" | "warga" }> {
  const decoded = await adminAuth.verifyIdToken(idToken);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRES_IN_MS / 1000,
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

  return { role };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

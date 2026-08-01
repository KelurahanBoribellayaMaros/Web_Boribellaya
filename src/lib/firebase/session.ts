import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { decodeSessionCookie, SESSION_COOKIE_NAME } from "@/lib/firebase/session-cookie";
import type { Session } from "@/lib/firebase/session-cookie";

export { SESSION_COOKIE_NAME };
export type { Session };

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  return decodeSessionCookie(cookieStore.get(SESSION_COOKIE_NAME)?.value);
});

export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/login");
  }
  return session;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

// Session cookies are long-lived and don't auto-refresh, so a user who
// verifies their email minutes after registering would still look
// unverified for the rest of that cookie's lifetime if we only trusted its
// embedded claim. Checking the live Firebase user record instead avoids
// that staleness at the cost of one extra Admin SDK call.
export async function requireVerifiedSession(): Promise<Session> {
  const session = await requireSession();
  const user = await adminAuth.getUser(session.uid);
  if (!user.emailVerified) {
    redirect("/verifikasi-email");
  }
  return session;
}

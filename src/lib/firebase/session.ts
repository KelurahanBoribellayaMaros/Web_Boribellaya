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



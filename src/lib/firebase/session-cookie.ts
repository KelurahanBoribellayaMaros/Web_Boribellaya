import "server-only";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "session";

export type Session = {
  uid: string;
  email: string | null;
  name: string | null;
  role: "admin" | "warga";
};

// Pure cookie-value -> Session decoder, with no dependency on next/headers,
// so it can be called from both Server Components (via session.ts) and
// proxy.ts (which only has access to NextRequest's cookies, not next/headers).
export async function decodeSessionCookie(
  sessionCookie: string | undefined
): Promise<Session | null> {
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      role: decoded.role === "admin" ? "admin" : "warga",
    };
  } catch {
    return null;
  }
}

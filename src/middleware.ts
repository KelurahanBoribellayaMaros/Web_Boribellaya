import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSessionCookie, SESSION_COOKIE_NAME } from "@/lib/firebase/session-cookie";

// Route protection for /admin, /akun, and the permohonan submission forms
// (login required so every request is tied to a real account email). This
// runs before any page renders or fetches data, so unauthenticated/
// unauthorized requests are redirected immediately instead of paying for a
// render pass first.
//
// This is a complementary, optimistic-ish layer, not the only line of
// defense: every protected page still calls requireAdmin()/requireSession()
// itself, and every admin Server Action + submitPermohonanAction still call
// them too. That defense-in-depth is required (not optional) because Next's
// Partial Rendering means a layout-only check doesn't re-run on
// client-side navigation between sibling pages under the same layout.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decodeSessionCookie(sessionCookie);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute && session.role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

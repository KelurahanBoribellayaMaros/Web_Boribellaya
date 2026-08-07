import type { NextConfig } from "next";

// 'unsafe-eval' is only needed for Turbopack/webpack's dev-mode HMR runtime —
// dropped in production so the policy is meaningfully stricter there.
const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // va.vercel-scripts.com serves the @vercel/analytics client script.
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // 'data:' covers base64 profile/news photos, stored inline in Firestore
  // rather than a file host (see news-actions.ts / struktur-actions.ts).
  "img-src 'self' data: https://*.supabase.co",
  "font-src 'self' data:",
  // Firebase Auth (identitytoolkit/securetoken) + Supabase Storage uploads +
  // Vercel Analytics' beacon endpoint.
  "connect-src 'self' https://*.googleapis.com https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  // Google Maps "Sematkan peta" embed on /kontak.
  "frame-src https://www.google.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  // firebase-admin is externalized by Next.js's default server-external-packages
  // list, which means its own require('jwks-rsa') -> require('jose') chain is
  // never traced by Turbopack and falls through to a raw runtime require().
  // jose v6 is pure ESM, so that raw require() throws ERR_REQUIRE_ESM in
  // Vercel's serverless runtime. Forcing firebase-admin into the normal
  // bundling pipeline lets Turbopack compile the ESM/CJS interop correctly.
  transpilePackages: ["firebase-admin"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;

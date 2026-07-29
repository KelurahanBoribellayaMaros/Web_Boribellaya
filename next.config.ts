import type { NextConfig } from "next";

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
};

export default nextConfig;

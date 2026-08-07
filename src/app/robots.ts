import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Auth-gated and utility routes have no SEO value and would just
      // show crawlers a login redirect or a confirmation page.
      disallow: [
        "/admin",
        "/admin/",
        "/akun",
        "/akun/",
        "/login",
        "/daftar",
        "/lupa-sandi",
        "/verifikasi-email",
        "/permohonan/terkirim",
        "/layanan/*/ajukan",
        "/informasi-publik/ajukan",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

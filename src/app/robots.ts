import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "https://kel-boribellaya.maroskab.go.id";

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
        "/login",
        "/permohonan/terkirim",
        "/layanan/*/ajukan",
        "/informasi-publik/ajukan",
        "/informasi-publik/keberatan",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

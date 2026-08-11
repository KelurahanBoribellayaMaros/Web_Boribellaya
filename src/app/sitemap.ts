import type { MetadataRoute } from "next";
import { getNews } from "@/lib/firebase/news-repository";

// Without this, Next.js caches the sitemap at build time (no request-time
// API is called otherwise), so newly published berita would never appear
// in it until the next redeploy.
export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL || "https://kel-boribellaya.maroskab.go.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/profil`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/berita`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/layanan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/cek-status`, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${siteUrl}/informasi-publik`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${siteUrl}/kontak`, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${siteUrl}/kebijakan-privasi`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/syarat-ketentuan`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${siteUrl}/berita/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}

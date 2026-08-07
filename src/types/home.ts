import type { LucideIcon } from "lucide-react";

export type ServiceItem = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  enabled?: boolean;
};

export type PopulationStat = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export type NewsCategory = "berita" | "pengumuman";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: NewsCategory;
  coverImage?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
};

export type HeroImage = {
  src: string;
  alt: string;
};

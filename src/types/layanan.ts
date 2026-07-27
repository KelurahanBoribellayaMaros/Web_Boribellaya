import type { LucideIcon } from "lucide-react";

export type SopStep = {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type LayananItem = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  variant: "solid" | "outline";
};

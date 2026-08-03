import type { LucideIcon } from "lucide-react";

export type SopStep = {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type BerkasRequirement = { key: string; label: string };

export type LayananItem = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  variant: "solid" | "outline";
  // Matching entry number in syarat-layanan-data.ts, when this online
  // service has a direct SOP counterpart (shown as a reference link).
  sopNo?: number;
  // Document-type upload fields shown on the ajukan form, derived from the
  // SOP's persyaratan list (only the items that are actual files to upload).
  berkasRequirements?: BerkasRequirement[];
};

export type SyaratLayanan = {
  no: number;
  name: string;
  persyaratan: string[];
};

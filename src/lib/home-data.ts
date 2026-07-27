import { FileText, Receipt } from "lucide-react";
import { Users, UsersRound, Mars, Venus } from "lucide-react";
import type { HeroImage, PopulationStat, ServiceItem } from "@/types/home";

export const heroImages: HeroImage[] = [
  {
    src: "/images/hero/kantor-lurah-1.jpg",
    alt: "Kantor Lurah Boribellaya",
  },
];

export const services: ServiceItem[] = [
  {
    slug: "administrasi-surat",
    icon: FileText,
    title: "Administrasi Surat",
    description:
      "Layanan pengajuan surat keterangan domisili, usaha, dan dokumen resmi lainnya.",
    href: "/layanan/administrasi-surat",
  },
  {
    slug: "cek-status-pbb",
    icon: Receipt,
    title: "Cek Status PBB",
    description:
      "Informasi tagihan dan pembayaran Pajak Bumi dan Bangunan secara online.",
    href: "/layanan/cek-status-pbb",
  },
];

export const populationStats: PopulationStat[] = [
  { icon: Users, label: "Total Penduduk", value: 12450 },
  { icon: UsersRound, label: "Kepala Keluarga", value: 3210 },
  { icon: Mars, label: "Laki-laki", value: 6120 },
  { icon: Venus, label: "Perempuan", value: 6330 },
];

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

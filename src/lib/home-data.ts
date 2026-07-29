import { FileText, Receipt } from "lucide-react";
import type { HeroImage, ServiceItem } from "@/types/home";

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

export function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
}

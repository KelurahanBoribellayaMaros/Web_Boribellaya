import {
  CheckCircle2,
  FileBarChart,
  FileText,
  HandHeart,
  IdCard,
  MessageSquareWarning,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { LayananItem, SopStep } from "@/types/layanan";

export const sopSteps: SopStep[] = [
  {
    step: 1,
    icon: FileText,
    title: "Siapkan Dokumen",
    description:
      "Siapkan berkas persyaratan sesuai jenis layanan yang dibutuhkan.",
  },
  {
    step: 2,
    icon: Send,
    title: "Ajukan Online",
    description:
      "Isi formulir dan unggah dokumen melalui portal layanan kami.",
  },
  {
    step: 3,
    icon: ShieldCheck,
    title: "Verifikasi",
    description:
      "Petugas kelurahan akan memverifikasi berkas Anda secara berkala.",
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: "Selesai",
    description:
      "Dokumen Anda siap diambil atau dikirim via kurir digital.",
  },
];

export const layananItems: LayananItem[] = [
  {
    slug: "administrasi-kependudukan",
    icon: IdCard,
    title: "Administrasi Kependudukan",
    description:
      "Layanan pengurusan KK, KTP, Akta Kelahiran, dan Surat Kematian secara mandiri.",
    cta: "Ajukan Sekarang",
    href: "#",
    variant: "solid",
  },
  {
    slug: "surat-keterangan-umum",
    icon: FileText,
    title: "Surat Keterangan Umum",
    description:
      "SKU, Surat Keterangan Domisili, dan surat pengantar lainnya untuk seluruh keperluan administrasi.",
    cta: "Ajukan Sekarang",
    href: "#",
    variant: "solid",
  },
  {
    slug: "bantuan-sosial",
    icon: HandHeart,
    title: "Bantuan Sosial",
    description:
      "Informasi dan pengajuan BLT, PKH, dan bantuan pemerintah lainnya.",
    cta: "Ajukan",
    href: "#",
    variant: "solid",
  },
  {
    slug: "lapor-keluhan",
    icon: MessageSquareWarning,
    title: "Lapor Keluhan",
    description:
      "Sampaikan keluhan fasilitas umum atau lingkungan Anda di sini.",
    cta: "Kirim Laporan",
    href: "#",
    variant: "solid",
  },
  {
    slug: "informasi-publik",
    icon: FileBarChart,
    title: "Informasi Publik",
    description:
      "Akses data penduduk, laporan anggaran, dan transparansi kelurahan.",
    cta: "Lihat Data",
    href: "#",
    variant: "outline",
  },
];

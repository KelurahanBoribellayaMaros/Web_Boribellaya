import {
  CheckCircle2,
  FileBarChart,
  FileText,
  IdCard,
  MessageSquareWarning,
  Send,
  ShieldCheck,
  Search,
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
      "Dokumen Anda siap diambil di kantor Kelurahan Boribellaya.",
  },
];

export const layananItems: LayananItem[] = [
  {
    slug: "surat-pengantar-skck",
    icon: ShieldCheck,
    title: "Surat Pengantar/SKCK",
    description:
      "Ajukan surat pengantar untuk pengurusan SKCK (Surat Keterangan Catatan Kepolisian).",
    cta: "Ajukan Sekarang",
    href: "/layanan/surat-pengantar-skck/ajukan",
    variant: "solid",
    sopNo: 1,
    berkasRequirements: [
      { key: "surat-pengantar-rt-rw", label: "Surat Pengantar RT/RW" },
      { key: "ktp-kk", label: "Foto Copy KTP/KK" },
      { key: "ijazah", label: "Foto Copy Ijazah" },
      { key: "bukti-pbb", label: "Bukti Bayar PBB" },
    ],
  },
  {
    slug: "pengurusan-kk",
    icon: IdCard,
    title: "Layanan Pengurusan KK",
    description:
      "Ajukan pembuatan, perubahan, atau penerbitan Kartu Keluarga (KK) baru.",
    cta: "Ajukan Sekarang",
    href: "/layanan/pengurusan-kk/ajukan",
    variant: "solid",
    sopNo: 13,
    berkasRequirements: [
      { key: "surat-pengantar-rt-rw", label: "Surat Pengantar RT/RW" },
      { key: "buku-nikah", label: "Foto Copy Buku Nikah" },
      { key: "ktp-kk", label: "Foto Copy KTP/KK" },
      { key: "bukti-pbb", label: "Bukti Bayar PBB" },
    ],
  },
  {
    slug: "lapor-keluhan",
    icon: MessageSquareWarning,
    title: "Lapor Keluhan",
    description:
      "Sampaikan keluhan fasilitas umum atau lingkungan Anda di sini.",
    cta: "Kirim Laporan",
    href: "/layanan/lapor-keluhan/ajukan",
    variant: "solid",
  },
  {
    slug: "informasi-publik",
    icon: FileBarChart,
    title: "Informasi Publik",
    description:
      "Akses data penduduk, laporan anggaran, dan transparansi kelurahan.",
    cta: "Lihat Data",
    href: "/informasi-publik",
    variant: "outline",
  },
  {
    slug: "cek-status",
    icon: Search,
    title: "Cek Status Permohonan",
    description:
      "Pantau progres permohonan atau laporan Anda menggunakan nomor WhatsApp.",
    cta: "Cek Status",
    href: "/cek-status",
    variant: "outline",
  },
];

import type { PpidCategory } from "@/types/ppid";

export const ppidAbout =
  "PPID (Pejabat Pengelola Informasi dan Dokumentasi) Kelurahan Boribellaya dibentuk berdasarkan Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik. PPID bertanggung jawab atas penyimpanan, pendokumentasian, dan pelayanan informasi publik yang wajib disediakan dan diumumkan secara berkala, tersedia setiap saat, maupun serta-merta sesuai ketentuan perundang-undangan.";

export const categoryLabels: Record<PpidCategory, string> = {
  berkala: "Berkala",
  "setiap-saat": "Setiap Saat",
  "serta-merta": "Serta Merta",
};

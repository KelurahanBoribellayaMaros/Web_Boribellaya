import type { PpidCategory } from "@/types/ppid";

export const categoryLabels: Record<PpidCategory, string> = {
  berkala: "Berkala",
  "setiap-saat": "Setiap Saat",
  "serta-merta": "Serta Merta",
};

export type DasarHukum = {
  title: string;
  content: string;
};

export const dasarHukum: DasarHukum[] = [
  {
    title: "UU 14/2008 — Pasal 1 angka 9",
    content:
      "Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah pejabat yang bertanggung jawab atas penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan informasi di Badan Publik.",
  },
  {
    title: "UU 14/2008 — Pasal 13 ayat (1)",
    content:
      "Untuk mewujudkan pelayanan yang cepat, tepat, dan sederhana, setiap Badan Publik menunjuk pejabat pengelola informasi serta membangun sistem penyediaan layanan informasi yang cepat, mudah, dan wajar.",
  },
  {
    title: "UU 14/2008 — Pasal 13 ayat (2)",
    content:
      "Pejabat pengelola informasi tersebut dibantu oleh pejabat fungsional. Atas dasar inilah pelayanan informasi di Kelurahan Boribellaya dijalankan oleh petugas/pejabat fungsional yang ditunjuk.",
  },
];

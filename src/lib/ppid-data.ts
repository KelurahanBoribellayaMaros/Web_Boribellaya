import type { PpidCategory } from "@/types/ppid";

// Shared between the server-side preview query and the client's "is there
// possibly more" heuristic for showing the "Lihat Selengkapnya" button.
export const PPID_PREVIEW_LIMIT = 5;

export const categoryLabels: Record<PpidCategory, string> = {
  berkala: "Berkala",
  "setiap-saat": "Setiap Saat",
  "serta-merta": "Serta Merta",
};

export const categoryDescriptions: Record<PpidCategory, string> = {
  berkala:
    "Wajib diumumkan secara rutin sekurang-kurangnya sekali dalam 6 bulan — misalnya laporan kinerja, anggaran, dan program kerja kelurahan.",
  "setiap-saat":
    "Tersedia setiap saat dan wajib diberikan kepada warga yang memintanya, di luar informasi berkala dan serta-merta.",
  "serta-merta":
    "Wajib diumumkan tanpa penundaan karena menyangkut hal yang dapat mengancam hak hidup dan ketertiban umum, misalnya informasi darurat atau bencana.",
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

export const informasiDikecualikan: string[] = [
  "Data pribadi warga (NIK, KK, data kesehatan, dan keuangan pribadi), sesuai UU Pelindungan Data Pribadi.",
  "Dokumen yang berkaitan dengan proses penegakan hukum yang masih berjalan.",
  "Surat-menyurat internal antarinstansi yang menurut sifatnya dirahasiakan.",
  "Isi akta otentik yang bersifat pribadi dan wasiat/kemauan terakhir seseorang.",
  "Informasi lain yang dikecualikan berdasarkan peraturan perundang-undangan.",
];

export const informasiDikecualikanNote =
  "Informasi yang dikecualikan bersifat rahasia dalam jangka waktu tertentu dan dapat dibuka apabila terdapat kepentingan publik yang lebih besar, melalui mekanisme keberatan dan sengketa informasi sesuai Pasal 17 UU No. 14 Tahun 2008.";

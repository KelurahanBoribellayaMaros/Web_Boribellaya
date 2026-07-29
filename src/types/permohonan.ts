export type PermohonanType = "layanan" | "informasi";

export type PermohonanStatus = "baru" | "diverifikasi" | "selesai" | "ditolak";

export type Permohonan = {
  id: string;
  type: PermohonanType;
  category: string;
  categoryLabel: string;
  name: string;
  email: string;
  phone?: string;
  description: string;
  status: PermohonanStatus;
  createdAt: string;
  updatedAt: string;
};

export const statusLabels: Record<PermohonanStatus, string> = {
  baru: "Baru",
  diverifikasi: "Diverifikasi",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

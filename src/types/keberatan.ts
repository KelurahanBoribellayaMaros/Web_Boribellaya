import type { PermohonanStatus } from "@/types/permohonan";

export type KeberatanReason =
  | "penolakan-pasal-17"
  | "tidak-disediakan-berkala"
  | "tidak-ditanggapi"
  | "permintaan-tidak-sesuai"
  | "tidak-dipenuhi"
  | "biaya-tidak-wajar"
  | "melebihi-waktu";

export const keberatanReasonLabels: Record<KeberatanReason, string> = {
  "penolakan-pasal-17":
    "Penolakan atas permintaan informasi berdasarkan alasan pengecualian sebagaimana dimaksud dalam Pasal 17 UU No. 14 Tahun 2008",
  "tidak-disediakan-berkala": "Tidak disediakannya informasi berkala",
  "tidak-ditanggapi": "Tidak ditanggapinya permintaan informasi",
  "permintaan-tidak-sesuai":
    "Permintaan informasi tidak ditanggapi sebagaimana yang diminta",
  "tidak-dipenuhi": "Tidak dipenuhinya permintaan informasi",
  "biaya-tidak-wajar": "Pengenaan biaya yang tidak wajar",
  "melebihi-waktu":
    "Penyampaian informasi yang melebihi jangka waktu yang diatur dalam UU No. 14 Tahun 2008",
};

export type Keberatan = {
  id: string;
  permohonanId: string;
  // Snapshotted at submission time so the objection still displays
  // correctly even if the original permohonan is later deleted by an admin.
  permohonanNumber?: string;
  permohonanCategoryLabel: string;
  name: string;
  email: string;
  reasons: KeberatanReason[];
  kronologi: string;
  isKuasa: boolean;
  kuasaName?: string;
  // Reuses the same status vocabulary as Permohonan — no separate workflow
  // needed for this small a feature.
  status: PermohonanStatus;
  // Admin's explanation for the resolution, shown to the citizen alongside
  // the status change (e.g. why it was rejected, or how it was resolved).
  catatan?: string;
  createdAt: string;
  updatedAt: string;
};

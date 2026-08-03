export type PermohonanType = "layanan" | "informasi";

export type PermohonanStatus = "baru" | "diverifikasi" | "selesai" | "ditolak";

export type IdentityCategory = "perorangan" | "badan-hukum";

export type CopyFormat = "softcopy" | "hardcopy";

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
  // PPID-specific fields, only present for type === "informasi".
  nik?: string;
  identityCategory?: IdentityCategory;
  address?: string;
  occupation?: string;
  usagePurpose?: string;
  copyFormat?: CopyFormat;
  // Storage paths (private bucket) for citizen-uploaded documents, one per
  // required document type — only present for layanan submissions that
  // require file uploads.
  berkas?: BerkasFile[];
};

export type BerkasFile = { key: string; label: string; path: string };

export const statusLabels: Record<PermohonanStatus, string> = {
  baru: "Baru",
  diverifikasi: "Diverifikasi",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const identityCategoryLabels: Record<IdentityCategory, string> = {
  perorangan: "Perorangan",
  "badan-hukum": "Badan Hukum",
};

export const copyFormatLabels: Record<CopyFormat, string> = {
  softcopy: "Softcopy",
  hardcopy: "Hardcopy",
};

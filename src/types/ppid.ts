export type PpidCategory = "berkala" | "setiap-saat" | "serta-merta";

export type PpidDocument = {
  id: string;
  title: string;
  description: string;
  category: PpidCategory;
  year: number;
  date: string;
  fileUrl?: string;
  filePath?: string;
  createdAt: string;
};


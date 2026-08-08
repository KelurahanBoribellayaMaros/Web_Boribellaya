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
  // Internal site path (e.g. "/profil#data-penduduk") for information that
  // already lives on the website itself rather than as an uploaded file —
  // shown as a "Lihat di Website" link instead of a download button.
  websiteUrl?: string;
  createdAt: string;
};


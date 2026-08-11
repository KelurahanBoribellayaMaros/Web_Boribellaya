import { z } from "zod";
import { keberatanReasonLabels } from "@/types/keberatan";

export const permohonanSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi."),
  phone: z
    .string()
    .trim()
    .min(10, "Nomor WhatsApp minimal 10 digit.")
    .regex(/^(08|62)/, "Nomor WhatsApp harus diawali dengan 08 atau 62."),
  email: z.string().trim().email("Format email tidak valid.").nullable().optional().or(z.literal("")),
  description: z.string().trim().min(1, "Keperluan wajib diisi."),
  nik: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || /^\d{16}$/.test(val), "NIK harus terdiri dari 16 digit angka."),
  identityCategory: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  occupation: z.string().trim().nullable().optional(),
  usagePurpose: z.string().trim().nullable().optional(),
  copyFormat: z.string().trim().nullable().optional(),
  berkasJson: z.string().trim().nullable().optional(),
});

const VALID_REASONS = new Set<string>(Object.keys(keberatanReasonLabels));

export const keberatanSchema = z
  .object({
    reasons: z
      .array(z.string())
      .min(1, "Pilih minimal satu alasan keberatan.")
      .refine((items) => items.every((item) => VALID_REASONS.has(item)), "Alasan tidak valid."),
    kronologi: z.string().trim().min(1, "Kronologi keberatan wajib diisi."),
    isKuasa: z.boolean().default(false),
    kuasaName: z.string().trim().nullable().optional(),
  })
  .refine((data) => !data.isKuasa || (data.isKuasa && data.kuasaName && data.kuasaName.length > 0), {
    message: "Nama kuasa wajib diisi jika diajukan atas nama kuasa.",
    path: ["kuasaName"],
  });


import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/firebase/session";
import { getPermohonanById } from "@/lib/firebase/permohonan-repository";
import { getKeberatanByPermohonanId } from "@/lib/firebase/keberatan-repository";
import { toastRedirectUrl } from "@/lib/toast-redirect";
import { KeberatanForm } from "@/components/permohonan/KeberatanForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ajukan Keberatan Informasi | Kelurahan Boribellaya",
};

export default async function AjukanKeberatanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireVerifiedSession();
  const { id } = await params;

  // Guarded here (not just by hiding the button) since the URL is
  // guessable — every failure path redirects back with an error toast
  // rather than showing a blank/broken form.
  const item = await getPermohonanById(id);
  if (!item || item.email !== session.email || item.type !== "informasi") {
    redirect(
      toastRedirectUrl(
        "/akun/permohonan",
        "Permohonan tidak ditemukan atau tidak bisa diajukan keberatan.",
        "error"
      )
    );
  }

  const existing = await getKeberatanByPermohonanId(id);
  if (existing) {
    redirect(
      toastRedirectUrl(
        "/akun/permohonan",
        "Keberatan untuk permohonan ini sudah pernah diajukan.",
        "error"
      )
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Hak Warga
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Ajukan Keberatan
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Untuk permohonan &quot;{item.categoryLabel}&quot;
          {item.number && ` (${item.number})`}.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
        <KeberatanForm permohonanId={id} />
      </div>
    </div>
  );
}

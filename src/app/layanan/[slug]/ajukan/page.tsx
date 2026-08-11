import Link from "next/link";
import { Lock } from "lucide-react";
import { notFound } from "next/navigation";
import { layananItems } from "@/lib/layanan-data";
import { getLayananStatus, isLayananEnabled } from "@/lib/firebase/layanan-repository";
import { PermohonanForm } from "@/components/permohonan/PermohonanForm";

export default async function AjukanLayananPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = layananItems.find((i) => i.slug === slug);

  if (!item || item.slug === "informasi-publik") {
    notFound();
  }

  const status = await getLayananStatus();
  if (!isLayananEnabled(status, item.slug)) {
    return (
      <div className="mx-auto max-w-md px-3 py-16 text-center sm:px-4">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Lock className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-bold text-gray-900">
          Layanan Sementara Tidak Tersedia
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          {item.title} sedang tidak menerima pengajuan online untuk saat
          ini. Silakan hubungi kantor kelurahan langsung, atau coba lagi
          nanti.
        </p>
        <Link
          href="/layanan"
          className="mt-6 inline-block rounded-full bg-[#003459] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Kembali ke Layanan
        </Link>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Layanan Digital
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Ajukan {item.title}
        </h1>
        <p className="mt-2 text-sm text-white/80">{item.description}</p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <PermohonanForm
          type="layanan"
          category={item.slug}
          categoryLabel={item.title}
          berkasRequirements={item.berkasRequirements}
        />

        {item.sopNo && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Lihat{" "}
            <Link
              href="/layanan#sop-pelayanan"
              className="font-semibold text-[#003459] hover:underline"
            >
              SOP Pelayanan lengkap
            </Link>{" "}
            untuk detail alur dan persyaratan.
          </p>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { layananItems } from "@/lib/layanan-data";
import { requireVerifiedSession } from "@/lib/firebase/session";
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

  const session = await requireVerifiedSession();

  return (
    <div className="mx-auto max-w-md px-3 py-10 sm:px-4 sm:py-12">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-8 sm:py-12">
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

      <div className="mt-8">
        <PermohonanForm
          type="layanan"
          category={item.slug}
          categoryLabel={item.title}
          accountEmail={session.email ?? ""}
          prefillName={session.name ?? undefined}
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

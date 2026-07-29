import { notFound } from "next/navigation";
import { layananItems } from "@/lib/layanan-data";
import { getSession } from "@/lib/firebase/session";
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

  const session = await getSession();

  return (
    <div className="mx-auto max-w-md px-3 py-10 sm:px-4 sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Ajukan {item.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{item.description}</p>
      </div>

      <div className="mt-8">
        <PermohonanForm
          type="layanan"
          category={item.slug}
          categoryLabel={item.title}
          prefillName={session?.name ?? undefined}
          prefillEmail={session?.email ?? undefined}
        />
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import { layananItems } from "@/lib/layanan-data";
import { getLayananStatus, isLayananEnabled } from "@/lib/firebase/layanan-repository";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Reveal } from "@/components/ui/Reveal";

export async function ServicesSection() {
  const status = await getLayananStatus();

  return (
    <section
      id="layanan"
      className="mx-auto max-w-6xl scroll-mt-20 px-2 py-10 sm:px-3 sm:py-12 lg:px-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Layanan
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Layanan publik yang bisa Anda akses secara online.
          </p>
        </div>
        <a
          href="/layanan"
          className="hidden shrink-0 items-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:inline-flex"
        >
          Lihat Semua Layanan
          <ChevronRight className="size-4" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {layananItems
          .filter((item) => item.slug !== "cek-status")
          .slice(0, 4)
          .map((item, index) => (
          <Reveal key={item.slug} delay={index * 100}>
            <ServiceCard
              slug={item.slug}
              icon={item.icon}
              title={item.title}
              description={item.description}
              href={item.href}
              enabled={isLayananEnabled(status, item.slug)}
            />
          </Reveal>
        ))}
      </div>

      <a
        href="/layanan"
        className="mt-6 flex items-center justify-center gap-0.5 text-sm font-medium text-[#003459] hover:opacity-80 sm:hidden"
      >
        Lihat Semua Layanan
        <ChevronRight className="size-4" />
      </a>
    </section>
  );
}

import { ChevronRight } from "lucide-react";
import { services } from "@/lib/home-data";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function ServicesSection() {
  return (
    <section
      id="layanan"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
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
          className="hidden shrink-0 items-center gap-0.5 text-sm font-medium text-green-700 hover:text-green-800 sm:inline-flex"
        >
          Lihat Semua Layanan
          <ChevronRight className="size-4" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.slug} {...service} />
        ))}
      </div>

      <a
        href="/layanan"
        className="mt-6 flex items-center justify-center gap-0.5 text-sm font-medium text-green-700 hover:text-green-800 sm:hidden"
      >
        Lihat Semua Layanan
        <ChevronRight className="size-4" />
      </a>
    </section>
  );
}

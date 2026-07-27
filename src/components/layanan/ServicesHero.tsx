import { Smartphone } from "lucide-react";

export function ServicesHero() {
  return (
    <section className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-green-700 to-green-900 px-6 py-12 text-center sm:py-16">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Smartphone className="size-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          Pusat Layanan Digital
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-green-100/90 sm:text-base">
          Akses layanan kelurahan dengan mudah, cepat, dan transparan dari
          genggaman Anda.
        </p>
      </div>
    </section>
  );
}

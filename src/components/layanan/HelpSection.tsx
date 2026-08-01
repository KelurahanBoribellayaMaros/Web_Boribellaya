import { MapPin, MessageCircle, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { toWhatsAppHref } from "@/lib/whatsapp";

export function HelpSection({ whatsapp }: { whatsapp: string }) {
  const whatsappHref = toWhatsAppHref(whatsapp) ?? "/kontak";

  return (
    <section className="mx-auto max-w-6xl px-2 pb-12 sm:px-3 lg:px-4">
      <Reveal className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:flex sm:items-center">
        <div className="p-6 sm:flex-1 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Butuh Bantuan Lebih Lanjut?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Hubungi petugas kami melalui WhatsApp atau kunjungi kantor
            kelurahan pada jam kerja.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target={whatsappHref.startsWith("http") ? "_blank" : undefined}
              rel={whatsappHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
            <a
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <MapPin className="size-4" />
              Peta Lokasi
            </a>
          </div>
        </div>
        <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 sm:h-48 sm:w-56 sm:shrink-0">
          <div className="flex size-full items-center justify-center text-[#003459]/40">
            <UserRound className="size-12" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

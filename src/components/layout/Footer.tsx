import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { KontakInfo } from "@/types/kontak";
import { toWhatsAppHref } from "@/lib/whatsapp";

const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Berita", href: "/berita" },
  { label: "Layanan", href: "/layanan" },
  { label: "PPID", href: "/ppid" },
  { label: "Kontak", href: "/kontak" },
];

export function Footer({ kontak }: { kontak: KontakInfo }) {
  const year = new Date().getFullYear();
  const whatsappHref = toWhatsAppHref(kontak.whatsapp);

  return (
    <footer className="bg-[#293241] px-2 pt-12 pb-6 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold text-white">Kelurahan Boribellaya</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-blue-200">
              Portal resmi pelayanan publik dan informasi Kelurahan
              Boribellaya, Kecamatan Turikale, Kabupaten Maros.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Tautan Cepat
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              Kontak Kami
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-blue-200">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{kontak.address}</span>
              </li>
              {whatsappHref && (
                <li className="flex gap-2.5">
                  <Phone className="size-4 shrink-0" />
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {kontak.whatsapp}
                  </a>
                </li>
              )}
              {kontak.email && (
                <li className="flex gap-2.5">
                  <Mail className="size-4 shrink-0" />
                  <a
                    href={`mailto:${kontak.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {kontak.email}
                  </a>
                </li>
              )}
              <li className="flex gap-2.5">
                <Clock className="size-4 shrink-0" />
                <span>{kontak.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-blue-200">
          © {year} Kelurahan Boribellaya. Melayani dengan Sepenuh Hati.
        </p>
      </div>
    </footer>
  );
}

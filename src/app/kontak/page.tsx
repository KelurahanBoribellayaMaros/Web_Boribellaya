import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { getKontakInfo } from "@/lib/firebase/kontak-repository";
import { toWhatsAppHref } from "@/lib/whatsapp";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kontak & Lokasi | Kelurahan Boribellaya",
  description:
    "Alamat, kontak, jam operasional, dan peta lokasi kantor Kelurahan Boribellaya.",
};

export default async function KontakPage() {
  const kontak = await getKontakInfo();

  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Layanan Publik
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Kontak &amp; Lokasi
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Hubungi atau kunjungi kantor Kelurahan Boribellaya.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <Reveal>
            <ProfileCard icon={MapPin} title="Alamat Kantor">
              <p className="text-sm leading-relaxed text-gray-600">
                {kontak.address}
              </p>
            </ProfileCard>
          </Reveal>

          <Reveal>
            <ProfileCard icon={Clock} title="Jam Operasional">
              <p className="text-sm leading-relaxed text-gray-600">
                {kontak.hours}
              </p>
            </ProfileCard>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-gray-900">Hubungi Kami</h2>
              <div className="mt-4 flex flex-col gap-3">
                {kontak.contacts.map((contact) => {
                  const href = toWhatsAppHref(contact.whatsapp);
                  if (!href) return null;
                  return (
                    <a
                      key={contact.jabatan}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      <MessageCircle className="size-4" />
                      {contact.jabatan} — {contact.whatsapp}
                    </a>
                  );
                })}
                {kontak.email && (
                  <a
                    href={`mailto:${kontak.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Mail className="size-4" />
                    {kontak.email}
                  </a>
                )}
                {kontak.contacts.length === 0 && !kontak.email && (
                  <p className="text-sm text-gray-400">
                    Kontak belum tersedia.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-3">
          <Reveal className="h-full">
            <div className="h-full min-h-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {kontak.mapsEmbedUrl ? (
                <iframe
                  src={kontak.mapsEmbedUrl}
                  className="size-full min-h-80"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="Peta Lokasi Kantor Kelurahan Boribellaya"
                />
              ) : (
                <div className="flex size-full min-h-80 flex-col items-center justify-center gap-2 p-8 text-center">
                  <MapPin className="size-8 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    Peta lokasi belum tersedia.
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ServicesHero } from "@/components/layanan/ServicesHero";
import { SopSteps } from "@/components/layanan/SopSteps";
import { LayananListSection } from "@/components/layanan/LayananListSection";
import { SopPelayananSection } from "@/components/layanan/SopPelayananSection";
import { HelpSection } from "@/components/layanan/HelpSection";
import { sopSteps, layananItems } from "@/lib/layanan-data";
import { getKontakInfo } from "@/lib/firebase/kontak-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Layanan | Kelurahan Boribellaya",
  description:
    "Akses layanan kelurahan dengan mudah, cepat, dan transparan dari genggaman Anda.",
};

export default async function LayananPage() {
  const kontak = await getKontakInfo();

  return (
    <>
      <ServicesHero />
      <SopSteps steps={sopSteps} />
      <LayananListSection items={layananItems} />
      <SopPelayananSection />
      <HelpSection whatsapp={kontak.whatsapp} />
    </>
  );
}

import type { Metadata } from "next";
import { ServicesHero } from "@/components/layanan/ServicesHero";
import { SopSteps } from "@/components/layanan/SopSteps";
import { LayananListSection } from "@/components/layanan/LayananListSection";
import { HelpSection } from "@/components/layanan/HelpSection";
import { sopSteps, layananItems } from "@/lib/layanan-data";

export const metadata: Metadata = {
  title: "Layanan | Kelurahan Boribellaya",
  description:
    "Akses layanan kelurahan dengan mudah, cepat, dan transparan dari genggaman Anda.",
};

export default function LayananPage() {
  return (
    <>
      <ServicesHero />
      <SopSteps steps={sopSteps} />
      <LayananListSection items={layananItems} />
      <HelpSection />
    </>
  );
}

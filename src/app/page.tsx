import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PopulationSection } from "@/components/home/PopulationSection";
import { NewsSection } from "@/components/home/NewsSection";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <NewsSection />
      <PopulationSection />
      <ServicesSection />
    </>
  );
}

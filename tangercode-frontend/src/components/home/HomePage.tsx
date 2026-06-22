import type { HomeData } from "@/lib/home-data";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { ProcessSection } from "./ProcessSection";
import { PortfolioPreview } from "./PortfolioPreview";
import { PricingPreview } from "./PricingPreview";
import { TestimonialsSection } from "./TestimonialsSection";
import { StatsSection } from "./StatsSection";
import { TechnologiesSection } from "./TechnologiesSection";
import { BlogPreview } from "./BlogPreview";
import { ContactCTA } from "./ContactCTA";

export function HomePage({ data }: { data: HomeData }) {
  return (
    <main>
      <HeroSection data={data} />
      <ServicesSection data={data} />
      <div className="container"><hr className="divider" /></div>
      <ProcessSection data={data} />
      <PortfolioPreview data={data} />
      <PricingPreview data={data} />
      <TestimonialsSection data={data} />
      <StatsSection data={data} />
      <TechnologiesSection data={data} />
      <BlogPreview data={data} />
      <ContactCTA data={data} />
    </main>
  );
}

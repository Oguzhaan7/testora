import { LandingHeader } from "@/components/homepage/LandingHeader";
import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { StatsSection } from "@/components/homepage/StatsSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { PricingSection } from "@/components/homepage/PricingSection";
import { CTASection } from "@/components/homepage/CTASection";
import { LandingFooter } from "@/components/homepage/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}

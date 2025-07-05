"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { StatsSection } from "@/components/homepage/StatsSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { PricingSection } from "@/components/homepage/PricingSection";
import { CTASection } from "@/components/homepage/CTASection";
import { LandingFooter } from "@/components/homepage/LandingFooter";
import { AuthWrapper } from "@/components/layout/AuthWrapper";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen">
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
    </AuthWrapper>
  );
}

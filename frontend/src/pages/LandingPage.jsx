import { CTASection } from "../components/landing/CTASection";
import { FeatureSection } from "../components/landing/FeatureSection";
import { HeroSection } from "../components/landing/HeroSection";
import { PricingSection } from "../components/landing/PricingSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { Footer } from "../components/layout/Footer";
import { MarketingNavbar } from "../components/layout/MarketingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

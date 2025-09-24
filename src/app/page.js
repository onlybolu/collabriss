import DetailedFeatures from "@/app/components/DetailedFeatures";
import FaqSection from "@/app/components/FaqSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import Marquee from "@/app/components/Marquee";
import PricingSection from "@/app/components/PricingSection";
import NewsletterPopup from "@/app/components/NewsletterPopup";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <HeroSection />
        <Marquee />
        <FeaturesSection />
        <DetailedFeatures />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
      <NewsletterPopup />
    </div>
  );
}

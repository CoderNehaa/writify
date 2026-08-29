import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesCarousel } from "@/components/home/FeaturesCarousel";
import { EarningSection } from "@/components/home/EarningSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesCarousel />
        <EarningSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

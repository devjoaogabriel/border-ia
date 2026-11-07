import { LandingMotionController } from "@/components/motion/LandingMotionController";
import { BannerSection } from "@/components/sections/BannerSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <LandingMotionController>
      <Header />
      <main id="conteudo-principal">
        <HeroSection />
        <FeaturesSection />
        <BannerSection />
      </main>
      <Footer />
    </LandingMotionController>
  );
}

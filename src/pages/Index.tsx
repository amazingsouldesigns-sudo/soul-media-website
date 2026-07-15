import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import MarqueeSection from "@/components/MarqueeSection";
import ServicesSection from "@/components/ServicesSection";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import AboutSection from "@/components/AboutSection";
import BrandsSection from "@/components/BrandsSection";
import ContactSection from "@/components/ContactSection";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background film-grain">
      <Navbar />
      <HeroSection />
      <WhoWeAreSection />
      <CategoriesSection />
      <MarqueeSection />
      <ServicesSection />
      <AboutSection />
      <BrandsSection />
      <ContactSection />
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGate from "@/components/CategoryGate";
import MarqueeSection from "@/components/MarqueeSection";
import ServicesSection from "@/components/ServicesSection";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import AboutSection from "@/components/AboutSection";
import BrandsSection from "@/components/BrandsSection";
import ContactSection from "@/components/ContactSection";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { useCategory } from "@/context/CategoryContext";

const Index = () => {
  const { selectedCategory } = useCategory();

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background film-grain">
        <CategoryGate />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-background film-grain"
    >
      <Navbar />
      <HeroSection />
      <WhoWeAreSection />
      <MarqueeSection />
      <ServicesSection />
      <AboutSection />
      <BrandsSection />
      <ContactSection />
      <Footer />
      <FloatingContact />
    </motion.div>
  );
};

export default Index;

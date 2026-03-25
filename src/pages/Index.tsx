import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ToolsGrid } from "@/components/ToolsGrid";
import { AboutSection } from "@/components/AboutSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Cyber Venom" description="67+ free online web tools — image editors, code testers, converters, calculators, and more. No signup required." path="/" />
      <Navbar />
      <HeroSection />
      <ToolsGrid />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;

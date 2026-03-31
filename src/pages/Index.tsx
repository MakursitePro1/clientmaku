import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesMarquee } from "@/components/CategoriesMarquee";
import { PopularToolsSection } from "@/components/PopularToolsSection";
import { ImportantToolsSection } from "@/components/ImportantToolsSection";
import { ToolsGrid } from "@/components/ToolsGrid";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ToolsBanner } from "@/components/ToolsBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Cyber Venom" description="210+ free online web tools — image editors, code testers, converters, calculators, and more. No signup required." path="/" />
      <Navbar />
      <HeroSection />
      <CategoriesMarquee />
      <PopularToolsSection />
      <ImportantToolsSection />
      <ToolsGrid />
      <TestimonialsSection />
      <ContactSection />
      <ToolsBanner />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;

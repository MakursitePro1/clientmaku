import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Contact Us" description="Get in touch with us. We'd love to hear from you — questions, suggestions, or feedback." path="/contact" />
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ContactPage;

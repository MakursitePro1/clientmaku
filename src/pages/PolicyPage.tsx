import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { motion } from "framer-motion";
import { Shield, FileText, Eye, Cookie, AlertTriangle, Mail } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: `We collect minimal information to provide and improve our services. This may include:
• Account information (email, display name) when you sign up
• Usage data such as tools accessed, timestamps, and interaction patterns
• Device information including browser type, screen resolution, and operating system
• Cookies and similar technologies for session management

We do not sell, trade, or share your personal information with third parties for marketing purposes.`
  },
  {
    icon: Shield,
    title: "How We Use Your Information",
    content: `Your information is used solely to:
• Provide and maintain our free web tools
• Save your favorite tools and preferences
• Improve user experience and tool functionality
• Send important service updates (only if you opt in)
• Ensure security and prevent abuse of our platform

All data processing is done with your privacy as our top priority.`
  },
  {
    icon: Cookie,
    title: "Cookies Policy",
    content: `We use essential cookies to keep our platform functional:
• Session cookies — to maintain your login state
• Preference cookies — to remember your settings
• Analytics cookies — to understand how tools are used (anonymized)

You can control cookie settings through your browser. Disabling essential cookies may affect the functionality of certain features.`
  },
  {
    icon: FileText,
    title: "Terms of Service",
    content: `By using Makursite, you agree to the following:
• All tools are provided "as is" without warranty
• You will not use our tools for illegal or harmful purposes
• You are responsible for the content you create using our tools
• We reserve the right to modify or discontinue any tool at any time
• Accounts that violate our terms may be suspended or terminated

We strive to keep all 200+ tools free and accessible to everyone.`
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer",
    content: `Makursite provides web tools for informational and utility purposes:
• We do not guarantee 100% accuracy of calculations or conversions
• Generated content (IDs, passwords, etc.) should be used responsibly
• We are not responsible for any loss or damage resulting from tool usage
• Third-party links or resources are not endorsed by us
• Tools may have limitations based on browser capabilities`
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: `If you have any questions about our Privacy Policy, Terms of Service, or any other concerns, please reach out to us:
• Email: contact@makursite.com
• Use the Contact form on our website
• Response time: within 48 hours

We value your feedback and are committed to addressing any concerns promptly.`
  }
];

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Privacy Policy & Terms" description="Read Makursite's privacy policy, terms of service, cookie policy, and disclaimer. We value your privacy." path="/policy" />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy & <span className="gradient-text">Terms</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters to us. Read our policies to understand how we handle your data and what terms apply when using Makursite.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-muted-foreground/50 mt-4">
            Last updated: March 20, 2025
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PolicyPage;

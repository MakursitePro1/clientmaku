import { motion } from "framer-motion";
import { HelpCircle, Sparkles, MessageCircle, ChevronDown, Search, Mail, Zap, Shield, Globe, Smartphone, RefreshCw, Code, Palette, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  q: string;
  a: string;
  emoji: string;
  category: string;
}

const faqs: FAQItem[] = [
  // General
  { q: "Are all tools free to use?", a: "Yes! All tools on our platform are completely free to use. No hidden charges, no premium plans, no subscription fees — just free tools available 24/7.", emoji: "🆓", category: "General" },
  { q: "Do I need to sign up to use the tools?", a: "No signup required! You can use all tools instantly without creating an account. However, creating an optional account lets you save favorites and personalize your experience.", emoji: "🚀", category: "General" },
  { q: "How many tools are available?", a: "We offer 210+ free online tools across multiple categories including text tools, developer utilities, image tools, calculators, generators, network tools, and much more. New tools are added regularly.", emoji: "🧰", category: "General" },
  { q: "How often are new tools added?", a: "We regularly add new tools and update existing ones based on user feedback and emerging needs. We aim to add at least a few new tools every month.", emoji: "✨", category: "General" },
  { q: "Can I suggest new tools?", a: "Of course! We welcome suggestions. Use the contact form to share your ideas for new tools. Community feedback drives our development roadmap.", emoji: "💡", category: "General" },

  // Privacy & Security
  { q: "Is my data safe when using these tools?", a: "Absolutely. Most tools process data directly in your browser using client-side JavaScript. Your data never leaves your device. We do not store, log, or share any personal information.", emoji: "🔒", category: "Privacy & Security" },
  { q: "Do you collect any personal data?", a: "We collect minimal analytics data (page views, tool usage counts) to improve our service. We never collect, store, or sell personal data like names, emails, or files you process through our tools.", emoji: "🛡️", category: "Privacy & Security" },
  { q: "Are the tools safe from malware?", a: "Yes, all our tools run in your browser's sandbox. They are pure JavaScript/HTML tools with no downloads required. There's no risk of malware or viruses.", emoji: "✅", category: "Privacy & Security" },

  // Technical
  { q: "Do the tools work on mobile devices?", a: "Yes, all our tools are fully responsive and optimized for mobile phones, tablets, and desktops. The interface adapts seamlessly to any screen size.", emoji: "📱", category: "Technical" },
  { q: "Which browsers are supported?", a: "Our tools work on all modern browsers including Chrome, Firefox, Safari, Edge, and Brave. We recommend using the latest version of your browser for the best experience.", emoji: "🌐", category: "Technical" },
  { q: "Do I need an internet connection?", a: "Most tools require an internet connection to load initially. However, once loaded, many tools work entirely offline since they process data in your browser.", emoji: "📡", category: "Technical" },
  { q: "Why is a specific tool not working?", a: "Try clearing your browser cache, disabling extensions, or using a different browser. If the issue persists, please contact us through the contact form with details about the problem.", emoji: "🔧", category: "Technical" },

  // Features
  { q: "Can I save my favorite tools?", a: "Yes! Create a free account or log in to save your favorite tools. They'll appear in your Favorites page for quick access anytime.", emoji: "❤️", category: "Features" },
  { q: "Can I export or download results?", a: "Most tools support exporting results in various formats like CSV, JSON, TXT, or PDF. Look for the download/export buttons within each tool.", emoji: "📥", category: "Features" },
  { q: "Is there a dark mode?", a: "Our platform is designed with a beautiful, eye-friendly theme. The color scheme is optimized for comfortable use during extended periods.", emoji: "🌙", category: "Features" },
  { q: "Can I share a specific tool with someone?", a: "Yes! Each tool has its own unique URL. Simply copy the URL from your browser and share it with anyone. They can use the tool immediately without signing up.", emoji: "🔗", category: "Features" },

  // Developer
  { q: "Is there an API available?", a: "Currently, we don't offer a public API. All tools are designed for browser-based usage. If there's demand, we may consider adding API access in the future.", emoji: "⚙️", category: "Developer" },
  { q: "Can I embed tools on my website?", a: "Some tools may be embeddable. Contact us for embedding options and we'll work with you to find a solution that meets your needs.", emoji: "🔌", category: "Developer" },
];

const categories = ["All", "General", "Privacy & Security", "Technical", "Features", "Developer"];
const categoryIcons: Record<string, any> = {
  "All": Zap,
  "General": HelpCircle,
  "Privacy & Security": Shield,
  "Technical": Code,
  "Features": Palette,
  "Developer": Globe,
};

function FAQCard({ faq, index, isOpen, onToggle }: { faq: FAQItem; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 100 }}
    >
      <div
        className={cn(
          "group relative glass rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer",
          isOpen
            ? "border-primary/30 shadow-[0_8px_30px_-8px_hsl(263_85%_58%/0.15)]"
            : "border-border/30 hover:border-primary/20 hover:shadow-[0_4px_20px_-6px_hsl(263_85%_58%/0.1)]"
        )}
        onClick={onToggle}
      >
        <div className={cn(
          "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        )} />

        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5">
          <span className="text-xl sm:text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300" style={{ filter: isOpen ? 'none' : undefined }}>
            {faq.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-[15px] leading-snug">{faq.q}</h3>
            <span className="text-[10px] text-muted-foreground mt-0.5 inline-block">{faq.category}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-300",
              isOpen ? "bg-primary/10 text-primary" : "bg-accent/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="px-4 sm:px-6 pb-4 sm:pb-5 pl-[3.25rem] sm:pl-[4.25rem]">
            <div className="h-px bg-gradient-to-r from-primary/10 via-border to-transparent mb-3 sm:mb-4" />
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-[14.5px]">{faq.a}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const filteredFaqs = useMemo(() => {
    let result = faqs;
    if (activeCategory !== "All") {
      result = result.filter(f => f.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`FAQ — ${settings.site_name}`} description="Find answers to frequently asked questions about our free online tools platform." path="/faq" />
      <Navbar />

      <main className="pt-28 pb-20 px-4 relative overflow-hidden">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[250px] opacity-20" style={{ background: "hsl(263 85% 58% / 0.08)" }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-14">
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 text-sm font-semibold text-primary mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">FAQ</span>
            </motion.span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl mx-auto">
              Got questions? We've got answers. Find everything you need to know.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8">
            {categories.map(cat => {
              const Icon = categoryIcons[cat] || HelpCircle;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center gap-1.5",
                    activeCategory === cat
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-transparent hover:bg-muted/50 text-muted-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </motion.div>

          {/* Count */}
          <div className="text-center text-xs text-muted-foreground mb-4">
            Showing {filteredFaqs.length} of {faqs.length} questions
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <FAQCard
                key={`${faq.category}-${i}`}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-4 border border-border/30">
              <HelpCircle className="w-5 h-5 text-primary" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Still have questions?{" "}
                <button onClick={() => navigate("/#contact")} className="text-primary font-semibold hover:underline underline-offset-4">
                  Contact us
                </button>
              </p>
              <Sparkles className="w-4 h-4 text-primary/50" />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

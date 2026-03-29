import { motion } from "framer-motion";
import { HelpCircle, Sparkles, MessageCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Are all tools free to use?", a: "Yes! All tools on Cyber Venom are completely free to use. No hidden charges, no premium plans — just free tools.", emoji: "🆓" },
  { q: "Do I need to sign up to use the tools?", a: "No signup required! You can use all tools instantly without creating an account.", emoji: "🚀" },
  { q: "Is my data safe when using these tools?", a: "Absolutely. Most tools process data directly in your browser. We do not store or share your personal data.", emoji: "🔒" },
  { q: "Can I suggest new tools?", a: "Of course! We welcome suggestions. Use the contact form below to share your ideas for new tools.", emoji: "💡" },
  { q: "Do the tools work on mobile devices?", a: "Yes, all our tools are fully responsive and work great on mobile phones, tablets, and desktops.", emoji: "📱" },
  { q: "How often are new tools added?", a: "We regularly add new tools and update existing ones based on user feedback and needs.", emoji: "✨" },
];

function FAQItem({ faq, index, isOpen, onToggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
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
        {/* Top shimmer */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        )} />

        {/* Question */}
        <div className="flex items-center gap-4 px-6 py-5">
          <span className="text-2xl shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300" style={{ filter: isOpen ? 'none' : undefined }}>
            {faq.emoji}
          </span>
          <h3 className="flex-1 font-semibold text-[15px] leading-snug">{faq.q}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
              isOpen
                ? "bg-primary/10 text-primary"
                : "bg-accent/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Answer with smooth height animation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-5 pl-[4.25rem]">
            <div className="h-px bg-gradient-to-r from-primary/10 via-border to-transparent mb-4" />
            <p className="text-muted-foreground leading-relaxed text-[14.5px]">{faq.a}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[250px] opacity-20"
        style={{ background: "hsl(263 85% 58% / 0.08)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 text-sm font-semibold text-primary mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
            <MessageCircle className="w-4 h-4 relative z-10" />
            <span className="relative z-10">FAQ</span>
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Got questions? We've got answers. Find everything you need to know.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-4 border border-border/30">
            <HelpCircle className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Contact us
              </button>
            </p>
            <Sparkles className="w-4 h-4 text-primary/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

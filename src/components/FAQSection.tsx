import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Are all tools free to use?", a: "Yes! All tools on Cyber Venom are completely free to use. No hidden charges, no premium plans — just free tools." },
  { q: "Do I need to sign up to use the tools?", a: "No signup required! You can use all tools instantly without creating an account." },
  { q: "Is my data safe when using these tools?", a: "Absolutely. Most tools process data directly in your browser. We do not store or share your personal data." },
  { q: "Can I suggest new tools?", a: "Of course! We welcome suggestions. Use the contact form below to share your ideas for new tools." },
  { q: "Do the tools work on mobile devices?", a: "Yes, all our tools are fully responsive and work great on mobile phones, tablets, and desktops." },
  { q: "How often are new tools added?", a: "We regularly add new tools and update existing ones based on user feedback and needs." },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 text-sm font-semibold text-primary mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass border border-border/30 rounded-2xl px-6 overflow-hidden hover:border-primary/20 transition-colors">
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

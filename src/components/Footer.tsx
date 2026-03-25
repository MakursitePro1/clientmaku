import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Mail, Heart, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools, categories } from "@/data/tools";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "Home", hash: "hero" },
  { name: "All Tools", hash: "tools" },
  { name: "About Us", hash: "about" },
  { name: "FAQ", hash: "faq" },
  { name: "Contact", hash: "contact" },
];

const toolCategories = categories.filter(c => c.id !== "all").slice(0, 8);

const popularTools = [
  "Password Generator", "QR Code Maker", "Image Compressor",
  "JSON Formatter", "Color Picker", "Unit Converter",
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollTo = (hash: string) => {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else if (hash === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* CTA Banner */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto gradient-bg rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-90 mb-4 bg-primary-foreground/10 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" /> Start Now
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
              Start Using Free Tools Today
            </h2>
            <p className="opacity-90 max-w-xl mx-auto mb-8 text-lg">
              {tools.length}+ free tools ready to use instantly. No signup, no payment — just pure productivity.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-2xl px-10 py-6 font-bold text-base hover:scale-105 transition-transform"
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore All Tools
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Premium Footer */}
      <footer className="relative overflow-hidden">
        {/* Animated top border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Background */}
        <div className="absolute inset-0 bg-[#000000]" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* Floating glow orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10">
          {/* Main footer content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              
              {/* Brand column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <Link to="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center glow-shadow">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    <span className="gradient-text">Cyber</span>
                    <span className="text-white"> Venom</span>
                  </span>
                </Link>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Your ultimate toolkit with {tools.length}+ free online tools. Fast, secure, and always available — no signup required.
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Github, href: "#" },
                    { icon: Twitter, href: "#" },
                    { icon: Mail, href: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollTo(link.hash)}
                        className="text-white/40 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Categories
                </h3>
                <ul className="space-y-3">
                  {toolCategories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => scrollTo("tools")}
                        className="text-white/40 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Popular Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Popular Tools
                </h3>
                <ul className="space-y-3">
                  {popularTools.map((tool) => {
                    const t = tools.find(tt => tt.name === tool);
                    return (
                      <li key={tool}>
                        <Link
                          to={t?.path || "/"}
                          className="text-white/40 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                        >
                          <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                          {tool}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {[
                { label: "Free Tools", value: `${tools.length}+` },
                { label: "Categories", value: `${categories.length - 1}` },
                { label: "No Signup", value: "100%" },
                { label: "Uptime", value: "99.9%" },
              ].map((stat, i) => (
                <div key={i} className="text-center py-4 px-6 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-white/30 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/30 text-sm flex items-center gap-1.5">
                © {new Date().getFullYear()} Cyber Venom. Made with
                <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
                All rights reserved.
              </p>
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-2 text-white/30 hover:text-primary text-sm transition-colors duration-300"
              >
                Back to top
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300 group-hover:-translate-y-1">
                  <ArrowUp className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

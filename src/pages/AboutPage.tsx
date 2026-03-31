import { motion } from "framer-motion";
import { Target, Heart, Award, TrendingUp, Zap, Sparkles, Users, Globe, Shield, Code, Palette, GraduationCap, Coffee, Rocket, CheckCircle, Star, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Target, title: "Mission-Driven", desc: "Building the most useful tools for everyone, everywhere. Our goal is to simplify digital tasks for millions.", color: "from-violet-500 to-purple-600" },
  { icon: Heart, title: "User-Centric", desc: "Your productivity and experience is our highest priority. Every tool is designed with the user in mind.", color: "from-pink-500 to-rose-600" },
  { icon: Award, title: "Quality First", desc: "Every tool meets the highest quality and performance standards. We never compromise on reliability.", color: "from-amber-500 to-orange-600" },
  { icon: TrendingUp, title: "Always Improving", desc: "Continuously updated with new tools and improvements based on community feedback.", color: "from-emerald-500 to-teal-600" },
  { icon: Shield, title: "Privacy Focused", desc: "Most tools process data in your browser. We never store or sell your personal data.", color: "from-blue-500 to-indigo-600" },
  { icon: Rocket, title: "Lightning Fast", desc: "Optimized for speed. Tools load instantly with no unnecessary bloat or waiting.", color: "from-red-500 to-orange-600" },
];

const whyUs = [
  "100% Free — No hidden charges, no premium plans",
  "No Signup Required — Use tools instantly",
  "Privacy First — Data processed in your browser",
  "Mobile Friendly — Works on all devices",
  "Regular Updates — New tools added frequently",
  "Open to Feedback — We listen and improve",
];

const whoFor = [
  { icon: Code, title: "Developers", desc: "JSON formatters, regex testers, hash generators, and more coding utilities." },
  { icon: Palette, title: "Designers", desc: "Color pickers, gradient generators, and visual tools for creative work." },
  { icon: GraduationCap, title: "Students", desc: "Calculators, converters, word counters, and educational helpers." },
  { icon: Coffee, title: "Everyday Users", desc: "QR codes, password generators, unit converters, and daily utilities." },
];

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const { totalTools, totalCategories } = useToolCatalog();
  const navigate = useNavigate();

  const stats = [
    { val: `${totalTools}`, label: "Tools Available", icon: Zap },
    { val: `${totalCategories}`, label: "Categories", icon: Globe },
    { val: "100%", label: "Free Forever", icon: Shield },
    { val: settings.stats_users_count || "50K+", label: "Happy Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`About — ${settings.site_name}`} description="Learn about our mission, team, and the story behind our free online tools platform." path="/about" />
      <Navbar />

      <main className="pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <motion.div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] opacity-30" style={{ background: "hsl(263 85% 58% / 0.1)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-20" style={{ background: "hsl(290 90% 60% / 0.08)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 text-sm font-semibold text-primary mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
              <Sparkles className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{settings.about_title || "About Us"}</span>
            </motion.span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
              We Are <span className="gradient-text">{settings.site_name}</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {settings.about_text || "A comprehensive collection of free online tools designed for developers, designers, students, and everyday users."}
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative mb-16">
            <div className="absolute -inset-1 gradient-bg rounded-3xl opacity-20 blur-xl" />
            <div className="relative glass-strong rounded-3xl p-6 sm:p-8 border border-border/30 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <motion.div className="flex items-center gap-4 shrink-0" whileHover={{ scale: 1.03 }}>
                  <img src="/logo.png" alt={settings.site_name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover glow-shadow" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{settings.site_name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{settings.site_tagline}</p>
                  </div>
                </motion.div>
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 flex-1 w-full">
                  {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.08 }} className="group text-center p-3 sm:p-4 rounded-xl bg-accent/30 border border-border/20 hover:border-primary/30 hover:bg-accent/50 transition-all cursor-default">
                      <s.icon className="w-5 h-5 text-primary mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="text-xl sm:text-2xl font-extrabold gradient-text">{s.val}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -8, scale: 1.02 }} className="group relative glass rounded-2xl p-5 sm:p-6 border border-border/30 hover:border-primary/40 transition-all duration-500 cursor-default overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-4 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-4px_hsl(263_85%_58%/0.3)] transition-all duration-500">
                      <f.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </motion.div>
                    <h3 className="font-bold text-base sm:text-lg mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="glass-strong rounded-3xl p-6 sm:p-10 border border-border/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
                Why Choose <span className="gradient-text">Us?</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
                {whyUs.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-accent/30 border border-border/20 hover:border-primary/30 transition-all">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Who Is It For */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">
              Who Is It <span className="gradient-text">For?</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whoFor.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass rounded-2xl p-5 sm:p-6 border border-border/30 hover:border-primary/30 transition-all text-center group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-1.5">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description & CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="glass-strong rounded-3xl p-6 sm:p-10 border border-border/30 max-w-3xl mx-auto">
              <Star className="w-8 h-8 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                {settings.site_description || "From image editors to code testers, converters to generators — we provide all types of tools to make your digital life easier."}
                <span className="text-foreground font-medium"> No signup. No limits. Completely free.</span>
              </p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/tools")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm sm:text-base glow-shadow">
                Explore Tools <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

import { motion } from "framer-motion";
import { Target, Heart, Award, TrendingUp, Zap, Sparkles, Users, Globe, Shield } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const features = [
  { icon: Target, title: "Mission-Driven", desc: "Building the most useful tools for everyone, everywhere.", color: "from-violet-500 to-purple-600" },
  { icon: Heart, title: "User-Centric", desc: "Your productivity and experience is our highest priority.", color: "from-pink-500 to-rose-600" },
  { icon: Award, title: "Quality First", desc: "Every tool meets the highest quality and performance standards.", color: "from-amber-500 to-orange-600" },
  { icon: TrendingUp, title: "Always Improving", desc: "Continuously updated with new tools and improvements.", color: "from-emerald-500 to-teal-600" },
];

export function AboutSection() {
  const { settings } = useSiteSettings();

  const stats = [
    { val: settings.stats_tools_count, label: "Tools Available", icon: Zap },
    { val: settings.stats_categories_count, label: "Categories", icon: Globe },
    { val: "100%", label: "Free Forever", icon: Shield },
    { val: settings.stats_users_count, label: "Happy Users", icon: Users },
  ];

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] opacity-30"
        style={{ background: "hsl(263 85% 58% / 0.1)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-20"
        style={{ background: "hsl(290 90% 60% / 0.08)" }}
        animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 text-sm font-semibold text-primary mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{settings.about_title || "About Us"}</span>
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            We Are <span className="gradient-text">{settings.site_name}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {settings.about_text || "A comprehensive collection of free online tools designed for developers, designers, students, and everyday users."}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass rounded-2xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-500 cursor-default overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-4 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-4px_hsl(263_85%_58%/0.3)] transition-all duration-500"
                >
                  <f.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-1 gradient-bg rounded-3xl opacity-20 blur-xl" />
          <div className="relative glass-strong rounded-3xl p-8 md:p-10 border border-border/30 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <motion.div
                className="flex items-center gap-4 shrink-0"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src="/logo.png" alt={settings.site_name} className="w-16 h-16 rounded-2xl object-cover glow-shadow" />
                <div>
                  <h3 className="text-xl font-bold">{settings.site_name}</h3>
                  <p className="text-sm text-muted-foreground">{settings.site_tagline}</p>
                </div>
              </motion.div>

              <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="md:hidden w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08 }}
                    className="group text-center p-4 rounded-xl bg-accent/30 border border-border/20 hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 cursor-default"
                  >
                    <s.icon className="w-5 h-5 text-primary mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="text-2xl font-extrabold gradient-text">{s.val}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-center mt-8 max-w-3xl mx-auto leading-relaxed"
            >
              {settings.site_description || "From image editors to code testers, converters to generators — we provide all types of tools to make your digital life easier."}
              <span className="text-foreground font-medium"> No signup. No limits. Completely free.</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

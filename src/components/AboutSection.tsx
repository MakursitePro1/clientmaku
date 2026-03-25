import { motion } from "framer-motion";
import { Target, Heart, Award, TrendingUp, Zap } from "lucide-react";
import { tools, categories } from "@/data/tools";

const features = [
  { icon: Target, title: "Mission-Driven", desc: "We focus on building the most useful tools for everyone." },
  { icon: Heart, title: "User-Centric", desc: "Your productivity is our highest priority." },
  { icon: Award, title: "Quality First", desc: "We deliver tools with the highest quality standards." },
  { icon: TrendingUp, title: "Always Improving", desc: "We continuously update and add new tools." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 text-sm font-semibold text-primary mb-4">
              <Zap className="w-3.5 h-3.5" /> About Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-6 tracking-tight">
              We Are <span className="gradient-text">Cyber Venom</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Cyber Venom is a comprehensive collection of free online tools designed for developers, designers, students, and everyday users. From image editors to code testers, converters to generators — we provide all types of tools to make your digital life easier.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 border border-border/30 hover-lift hover:border-primary/30"
                >
                  <f.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 gradient-bg rounded-3xl opacity-10 blur-2xl" />
            <div className="relative glass rounded-3xl p-8 border border-border/30">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center glow-shadow">
                    <Zap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cyber Venom</h3>
                    <p className="text-sm text-muted-foreground">Free Online Tools Platform</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: `${tools.length}+`, label: "Tools Available" },
                    { val: `${categories.length - 1}`, label: "Categories" },
                    { val: "100%", label: "Free" },
                    { val: "∞", label: "Usage Limit" },
                  ].map((s) => (
                    <div key={s.label} className="bg-accent/30 rounded-xl p-4 text-center border border-border/20">
                      <div className="text-2xl font-extrabold gradient-text">{s.val}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

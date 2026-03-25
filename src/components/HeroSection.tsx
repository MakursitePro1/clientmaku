import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Code2, Image, Shield, Globe, Search, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools, categories } from "@/data/tools";

const floatingIcons = [
  { icon: Globe, top: "12%", left: "8%", delay: 0, size: "w-10 h-10" },
  { icon: Shield, top: "8%", left: "30%", delay: 0.3, size: "w-8 h-8" },
  { icon: Code2, top: "18%", right: "8%", delay: 0.6, size: "w-10 h-10" },
  { icon: Search, top: "50%", right: "5%", delay: 0.9, size: "w-7 h-7" },
  { icon: BarChart3, top: "72%", right: "10%", delay: 1.2, size: "w-9 h-9" },
  { icon: Image, top: "65%", left: "5%", delay: 1.5, size: "w-8 h-8" },
  { icon: Sparkles, top: "35%", left: "3%", delay: 1.8, size: "w-6 h-6" },
];

const getStats = () => [
  { value: `${tools.length}+`, label: "Free Tools", icon: Zap },
  { value: "100%", label: "Free to Use", icon: Shield },
  { value: "0", label: "Signup Required", icon: Globe },
  { value: `${categories.length - 1}`, label: "Categories", icon: BarChart3 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          <div className="p-3 rounded-2xl glass border border-border/30">
            <item.icon className={`${item.size} text-primary/40`} />
          </div>
        </motion.div>
      ))}

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 mb-8"
        >
          <Zap className="w-4 h-4 text-primary animate-pulse-glow" />
          <span className="text-sm font-semibold gradient-text">Cyber Venom — Free Online Web Tools</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight"
        >
          Your Ultimate{" "}
          <span className="gradient-text">Web Tools</span>
          <br />
          <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl font-bold">Collection</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Image editors, code testers, converters, generators — all in one place.
          <span className="text-foreground font-medium"> Completely free, no signup required.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="gradient-bg text-primary-foreground rounded-2xl px-10 py-6 font-bold text-base hover:opacity-90 transition-all glow-shadow"
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Tools <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl px-10 py-6 font-bold text-base border-border/50 hover:bg-accent"
          >
            <Play className="mr-2 w-5 h-5" /> Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {getStats().map((stat) => (
            <div key={stat.label} className="group glass rounded-2xl p-6 border border-border/30 hover-lift hover:border-primary/30 cursor-default">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

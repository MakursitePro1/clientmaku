import { motion } from "framer-motion";
import { ArrowRight, Play, Wrench, Code2, Image, Shield, Globe, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  { icon: Globe, top: "15%", left: "5%", delay: 0 },
  { icon: Shield, top: "10%", left: "28%", delay: 0.3 },
  { icon: Code2, top: "20%", right: "5%", delay: 0.6 },
  { icon: Search, top: "45%", right: "3%", delay: 0.9 },
  { icon: BarChart3, top: "70%", right: "5%", delay: 1.2 },
  { icon: Image, top: "60%", left: "3%", delay: 1.5 },
];

const stats = [
  { value: "29+", label: "Free Tools" },
  { value: "100%", label: "Free to Use" },
  { value: "0", label: "Signup Required" },
  { value: "24/7", label: "Available" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          <item.icon className="w-8 h-8 text-primary/20" />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card mb-8"
        >
          <Wrench className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Free Online Web Tools</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Your Ultimate{" "}
          <span className="gradient-text italic">Web Tools</span>
          <br />
          Collection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Image editors, code testers, converters, generators — all in one place.
          Completely free, no signup required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="gradient-bg text-primary-foreground rounded-xl px-8 font-semibold text-base hover:opacity-90 transition-opacity"
            onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Tools <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-8 font-semibold text-base"
          >
            <Play className="mr-2 w-4 h-4" /> Watch Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-5 card-shadow">
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, Zap, ArrowRight, Sparkles, Star, Layers, Code2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools, categories } from "@/data/tools";

const floatingIcons = [
  { icon: Code2, x: "8%", y: "20%", delay: 0, size: 20 },
  { icon: Palette, x: "85%", y: "15%", delay: 0.5, size: 18 },
  { icon: Layers, x: "15%", y: "75%", delay: 1, size: 16 },
  { icon: Star, x: "90%", y: "70%", delay: 1.5, size: 22 },
  { icon: Zap, x: "50%", y: "10%", delay: 0.8, size: 14 },
  { icon: Wrench, x: "75%", y: "80%", delay: 0.3, size: 16 },
];

export function ToolsBanner() {
  return (
    <section className="px-4 pb-10 pt-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/10" />
          <div className="absolute inset-0 cyber-grid opacity-[0.04]" />

          {/* Animated gradient orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full bg-primary/20 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 -right-20 w-[350px] h-[350px] rounded-full bg-pink-500/15 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, 30, 0], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-cyan-500/10 blur-[80px]"
          />

          {/* Floating tool icons */}
          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/15 pointer-events-none"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
            >
              <item.icon size={item.size} />
            </motion.div>
          ))}

          {/* Shimmer sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-20deg]"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-10 sm:py-14 flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Icon + Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                200+ FREE TOOLS AVAILABLE
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight"
              >
                All the{" "}
                <span className="gradient-text">Web Tools</span>{" "}
                You Need, <br className="hidden sm:block" />
                In One Place
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Image editors, code testers, converters, calculators, generators &amp; more — completely free, no signup required.
              </motion.p>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 mt-5 justify-center lg:justify-start"
              >
                {[
                  { label: "Tools", value: `${tools.length}+` },
                  { label: "Categories", value: `${categories.length - 1}` },
                  { label: "Users", value: "50K+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg sm:text-xl font-extrabold text-foreground">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-3 shrink-0"
            >
              <Link to="/tools">
                <Button
                  size="lg"
                  className="rounded-2xl px-8 py-6 text-base font-bold gap-2 gradient-bg hover:opacity-90 shadow-lg shadow-primary/25 group w-full"
                >
                  <Wrench className="w-5 h-5" />
                  Explore All Tools
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/favorites">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-8 py-6 text-base font-bold gap-2 border-2 border-border/60 hover:border-primary/30 w-full"
                >
                  <Star className="w-5 h-5 text-yellow-500" />
                  My Favorites
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
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

const typingWords = [
  "Web Tools",
  "Image Editors",
  "Code Formatters",
  "Converters",
  "Generators",
  "Calculators",
  "Security Tools",
  "Dev Utilities",
];

const getStats = () => [
  { value: `${tools.length}+`, label: "Free Tools", icon: Zap },
  { value: "100%", label: "Free to Use", icon: Shield },
  { value: "200K+", label: "Happy Users", icon: Globe },
  { value: `${categories.length - 1}`, label: "Categories", icon: BarChart3 },
];

// Particles component
function Particles() {
  const particles = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `hsl(263 85% ${60 + Math.random() * 20}% / ${p.opacity})`,
          }}
          animate={{
            y: [-20, -60, -20],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Typing effect hook
function useTypingEffect(words: string[], typingSpeed = 100, deletingSpeed = 60, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
        if (displayText.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}

// Counter animation
function AnimatedCounter({ target, duration = 2 }: { target: string; duration?: number }) {
  const numericPart = parseInt(target.replace(/[^0-9]/g, ""));
  const suffix = target.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isNaN(numericPart)) return;
    let start = 0;
    const increment = numericPart / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericPart) {
        setCount(numericPart);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [numericPart, duration]);

  if (isNaN(numericPart)) return <>{target}</>;
  return <>{count}{suffix}</>;
}

export function HeroSection() {
  const typedText = useTypingEffect(typingWords);

  return (
    <section id="hero" className="relative flex items-start justify-center pt-14 pb-4 md:pt-16 md:pb-6 overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: "hsl(263 85% 58% / 0.08)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "hsl(290 90% 60% / 0.06)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{ background: "hsl(200 100% 50% / 0.04)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Particles */}
      <Particles />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex items-center justify-center"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
        >
          <div className="p-3 rounded-2xl glass border border-border/30 hover:border-primary/40 transition-colors duration-300">
            <item.icon className={`${item.size} text-primary/40`} />
          </div>
        </motion.div>
      ))}

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
          <Zap className="w-4 h-4 text-primary animate-pulse-glow relative z-10" />
          <span className="text-sm font-semibold gradient-text relative z-10">Cyber Venom — Free Online Web Tools</span>
          <span className="relative z-10 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </motion.div>

        {/* Heading with typing effect */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight"
        >
          <span className="block">Your Ultimate Collection</span>
          <span className="block mt-2 min-h-[1.2em]">
            <span className="relative inline-block">
              <motion.span
                className="gradient-text"
                key={typedText}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {typedText}
              </motion.span>
              <motion.span
                className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle rounded-full shadow-[0_0_8px_hsl(263_85%_58%/0.8),0_0_20px_hsl(263_85%_58%/0.4)]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Image editors, code testers, converters, generators — all in one place.
          <span className="text-foreground font-medium"> Completely free, no signup required.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 md:mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="gradient-bg text-primary-foreground rounded-2xl px-10 py-6 font-bold text-base transition-all glow-shadow relative overflow-hidden group"
              onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center">
                Explore Tools <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-10 py-6 font-bold text-base border-border/50 hover:bg-accent hover:border-primary/30 transition-all"
            >
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getStats().map((stat) => (
            <div
              key={stat.label}
              className="group glass rounded-2xl p-6 border border-border/30 hover:border-primary/30 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_hsl(263_85%_58%/0.2)]"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 md:mt-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

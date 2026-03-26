import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Search, Grid3X3, BookOpen, ArrowLeft, RefreshCw, Ghost } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
}));

const quickLinks = [
  { name: "Home", path: "/", icon: Home, desc: "Back to homepage" },
  { name: "All Tools", path: "/tools", icon: Search, desc: "Browse all tools" },
  { name: "Categories", path: "/categories", icon: Grid3X3, desc: "Explore categories" },
  { name: "Blog", path: "/blog", icon: BookOpen, desc: "Read our blog" },
];

const NotFound = () => {
  const location = useLocation();
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-20">
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/[0.08] rounded-full blur-[80px] pointer-events-none" />

        {/* Floating particles */}
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 max-w-3xl w-full text-center">
          {/* Ghost icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="mb-4 sm:mb-6 flex justify-center"
          >
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10"
            >
              <Ghost className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* 404 number with glitch */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-2 sm:mb-4"
          >
            <h1
              className={`text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter gradient-text select-none transition-all ${glitchActive ? "translate-x-[2px] skew-x-1" : ""}`}
            >
              404
            </h1>
            {glitchActive && (
              <>
                <span className="absolute inset-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-primary/30 translate-x-1 -translate-y-0.5 select-none pointer-events-none">
                  404
                </span>
                <span className="absolute inset-0 text-[80px] sm:text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-accent-foreground/20 -translate-x-1 translate-y-0.5 select-none pointer-events-none">
                  404
                </span>
              </>
            )}
          </motion.div>

          {/* Title & description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-3"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Oops! Page Not Found
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed px-2">
              The page you're looking for has been moved, deleted, or never existed in the first place.
            </p>
          </motion.div>

          {/* Attempted path */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 sm:mb-10"
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-destructive/10 border border-destructive/20 text-[10px] sm:text-xs font-mono text-destructive max-w-[90vw] truncate">
              <RefreshCw className="w-3 h-3 shrink-0" />
              {location.pathname}
            </span>
          </motion.div>

          {/* Quick navigation cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8 sm:mb-10"
          >
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="group flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-border/30 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground">{link.name}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 leading-tight">{link.desc}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

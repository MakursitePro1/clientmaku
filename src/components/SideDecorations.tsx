import { motion } from "framer-motion";

export function SideDecorations() {
  return (
    <>
      {/* Left Side Decorations */}
      <div className="fixed left-0 top-0 bottom-0 w-12 sm:w-16 lg:w-20 pointer-events-none z-0 hidden lg:block">
        {/* Gradient line */}
        <div className="absolute left-4 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
        
        {/* Floating dots */}
        {[25, 40, 55, 70, 85].map((top, i) => (
          <motion.div
            key={`left-${i}`}
            className="absolute left-3 w-1.5 h-1.5 rounded-full bg-primary/20"
            style={{ top: `${top}%` }}
            animate={{ 
              opacity: [0.15, 0.4, 0.15],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}

        {/* Decorative squares */}
        <motion.div
          className="absolute left-6 top-[30%] w-3 h-3 border border-primary/10 rounded-sm rotate-45"
          animate={{ rotate: [45, 135, 45], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-8 top-[60%] w-2 h-2 border border-primary/10 rounded-sm rotate-45"
          animate={{ rotate: [45, -45, 45], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Glow orb */}
        <div className="absolute left-0 top-[45%] w-20 h-40 bg-primary/[0.02] rounded-full blur-[40px]" />
      </div>

      {/* Right Side Decorations */}
      <div className="fixed right-0 top-0 bottom-0 w-12 sm:w-16 lg:w-20 pointer-events-none z-0 hidden lg:block">
        {/* Gradient line */}
        <div className="absolute right-4 top-[15%] bottom-[25%] w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        
        {/* Floating dots */}
        {[20, 35, 50, 65, 80].map((top, i) => (
          <motion.div
            key={`right-${i}`}
            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary/15"
            style={{ top: `${top}%` }}
            animate={{ 
              opacity: [0.1, 0.35, 0.1],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}

        {/* Decorative circles */}
        <motion.div
          className="absolute right-6 top-[40%] w-4 h-4 border border-primary/[0.08] rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-8 top-[70%] w-2.5 h-2.5 border border-primary/[0.06] rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Cross marks */}
        <motion.div
          className="absolute right-5 top-[25%] text-primary/10 text-xs font-light"
          animate={{ opacity: [0.05, 0.15, 0.05], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          +
        </motion.div>

        {/* Glow orb */}
        <div className="absolute right-0 top-[55%] w-20 h-40 bg-primary/[0.02] rounded-full blur-[40px]" />
      </div>
    </>
  );
}

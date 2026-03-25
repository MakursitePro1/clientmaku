import { motion } from "framer-motion";
import { categories } from "@/data/tools";
import { cn } from "@/lib/utils";

const categoryItems = categories.filter(c => c.id !== "all");

// Duplicate items for seamless infinite scroll
const row1 = [...categoryItems, ...categoryItems, ...categoryItems];
const row2 = [...[...categoryItems].reverse(), ...[...categoryItems].reverse(), ...[...categoryItems].reverse()];

function MarqueeRow({ items, direction = "left", speed = 35 }: { items: typeof row1; direction?: "left" | "right"; speed?: number }) {
  const totalWidth = items.length * 200;
  
  return (
    <div className="relative overflow-hidden py-2">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
      
      <motion.div
        className="flex gap-3 sm:gap-4 w-max"
        animate={{ x: direction === "left" ? [0, -totalWidth / 3] : [-totalWidth / 3, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      >
        {items.map((cat, i) => (
          <div
            key={`${cat.id}-${i}`}
            className={cn(
              "group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl",
              "bg-card/80 backdrop-blur-sm border border-border/40",
              "hover:border-primary/40 hover:bg-accent/60 hover:shadow-lg",
              "transition-all duration-300 cursor-default shrink-0",
              "hover:-translate-y-0.5"
            )}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <cat.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-primary/70 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {cat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function CategoriesMarquee() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 px-4"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-lg mx-auto">
            Find the perfect tool from our curated collections
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <MarqueeRow items={row1} direction="left" speed={40} />
          <MarqueeRow items={row2} direction="right" speed={45} />
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Star, Quote, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  emoji: string;
  accent: string;
}

const testimonials: Testimonial[] = [
  { name: "Arif Rahman", role: "Web Developer", avatar: "AR", rating: 5, text: "Best free tools collection! The image editor and code formatters save me hours every week.", emoji: "🚀", accent: "from-violet-500/20 to-fuchsia-500/20" },
  { name: "Sadia Akter", role: "Graphic Designer", avatar: "SA", rating: 5, text: "The color palette generator and gradient tools are incredible. No signup needed!", emoji: "🎨", accent: "from-pink-500/20 to-rose-500/20" },
  { name: "Tanvir Hasan", role: "Student", avatar: "TH", rating: 5, text: "I use the PDF tools and unit converter daily. So fast and easy to use.", emoji: "📚", accent: "from-blue-500/20 to-cyan-500/20" },
  { name: "Mitul Chowdhury", role: "Content Creator", avatar: "MC", rating: 4, text: "Social media tools are fantastic! The thumbnail generator is my favorite.", emoji: "✨", accent: "from-amber-500/20 to-orange-500/20" },
  { name: "Nusrat Jahan", role: "Freelancer", avatar: "NJ", rating: 5, text: "From password generators to QR code makers — everything works perfectly.", emoji: "💎", accent: "from-emerald-500/20 to-teal-500/20" },
  { name: "Rafi Islam", role: "Software Engineer", avatar: "RI", rating: 5, text: "JSON formatter, regex tester, API tester — all dev tools I need in one place.", emoji: "⚡", accent: "from-indigo-500/20 to-violet-500/20" },
  { name: "Fatima Begum", role: "Teacher", avatar: "FB", rating: 5, text: "The text-to-speech and word counter tools help me prepare lessons quickly.", emoji: "📝", accent: "from-sky-500/20 to-blue-500/20" },
  { name: "Kamal Ahmed", role: "Entrepreneur", avatar: "KA", rating: 4, text: "Business card maker and invoice calculator — great for small businesses.", emoji: "💼", accent: "from-lime-500/20 to-green-500/20" },
  { name: "Lily Das", role: "UI Designer", avatar: "LD", rating: 5, text: "Glassmorphism generator, wireframe tools — a designer's dream toolkit!", emoji: "🎯", accent: "from-fuchsia-500/20 to-pink-500/20" },
  { name: "Omar Faruk", role: "YouTuber", avatar: "OF", rating: 5, text: "YouTube tag generator and thumbnail tools boosted my channel growth.", emoji: "🎬", accent: "from-red-500/20 to-rose-500/20" },
  { name: "Priya Sen", role: "Data Analyst", avatar: "PS", rating: 5, text: "CSV viewer and JSON to CSV converter are incredibly useful for my work.", emoji: "📊", accent: "from-cyan-500/20 to-teal-500/20" },
  { name: "Habib Khan", role: "Blogger", avatar: "HK", rating: 4, text: "SEO meta tag generator and slug generator help optimize my blog posts.", emoji: "✍️", accent: "from-purple-500/20 to-indigo-500/20" },
];

const row1 = testimonials.slice(0, 6);
const row2 = testimonials.slice(6);

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="shrink-0 w-[280px] sm:w-[320px] group"
    >
      <div className={cn(
        "relative h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl",
        "bg-card/90 backdrop-blur-xl border border-border/50",
        "shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.06)]",
        "hover:shadow-[0_20px_60px_-12px_hsl(var(--primary)/0.15)]",
        "hover:border-primary/30",
        "transition-all duration-500 cursor-default overflow-hidden"
      )}>
        {/* Gradient blob background */}
        <div className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br",
          testimonial.accent
        )} />
        
        {/* Sparkle decoration */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
          <Sparkles className="w-4 h-4 text-primary/40" />
        </div>

        {/* Quote icon */}
        <div className="relative mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Quote className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Rating with cute style */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.4)]"
                  : "text-muted-foreground/20"
              )}
            />
          ))}
          <span className="text-[10px] text-muted-foreground/60 ml-1 font-medium">{testimonial.rating}.0</span>
        </div>

        {/* Review text */}
        <p className="relative text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          "{testimonial.text}"
        </p>

        {/* Author row */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold",
                "bg-gradient-to-br from-primary/20 to-primary/5 text-primary",
                "border border-primary/10 shadow-sm"
              )}>
                {testimonial.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">{testimonial.emoji}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{testimonial.name}</p>
              <p className="text-[11px] text-muted-foreground/70 truncate">{testimonial.role}</p>
            </div>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsLiked(!isLiked)}
            className="p-1.5 rounded-full hover:bg-primary/5 transition-colors"
          >
            <Heart className={cn(
              "w-3.5 h-3.5 transition-all duration-300",
              isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground/30 hover:text-rose-400"
            )} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ items, direction = "left", speed = 40 }: { items: Testimonial[]; direction?: "left" | "right"; speed?: number }) {
  const duplicated = [...items, ...items, ...items, ...items];
  const gap = 20; // matches gap-5
  const cardWidth = 340;
  const setWidth = items.length * cardWidth + items.length * gap;

  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

      <div
        className="flex gap-5 w-max"
        style={{
          animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`,
          // @ts-ignore
          '--set-width': `${setWidth}px`,
        } as React.CSSProperties}
      >
        {duplicated.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} testimonial={t} index={i % items.length} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[200px] pointer-events-none opacity-30" style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.06), transparent 70%)" }} />
      
      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] text-3xl opacity-20 pointer-events-none hidden sm:block"
      >💜</motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] text-2xl opacity-20 pointer-events-none hidden sm:block"
      >✨</motion.div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4"
          >
            <Heart className="w-3.5 h-3.5 text-primary fill-primary/30" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Testimonials</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Loved by <span className="gradient-text">200K+</span> Users
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            Real people, real love — see why thousands trust Cyber Venom tools every day 💜
          </p>

          {/* Mini stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
            {[
              { value: "4.9", label: "Avg Rating", icon: "⭐" },
              { value: "200K+", label: "Happy Users", icon: "😍" },
              { value: "99%", label: "Satisfaction", icon: "💯" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm">{stat.icon}</span>
                  <span className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Marquee rows */}
        <div className="flex flex-col gap-4 sm:gap-5">
          <MarqueeRow items={row1} direction="left" speed={90} />
          <MarqueeRow items={row2} direction="right" speed={100} />
        </div>
      </div>
    </section>
  );
}

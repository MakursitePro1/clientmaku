import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  { name: "Arif Rahman", role: "Web Developer", avatar: "AR", rating: 5, text: "Best free tools collection! The image editor and code formatters save me hours every week." },
  { name: "Sadia Akter", role: "Graphic Designer", avatar: "SA", rating: 5, text: "The color palette generator and gradient tools are incredible. No signup needed!" },
  { name: "Tanvir Hasan", role: "Student", avatar: "TH", rating: 5, text: "I use the PDF tools and unit converter daily. So fast and easy to use." },
  { name: "Mitul Chowdhury", role: "Content Creator", avatar: "MC", rating: 4, text: "Social media tools are fantastic! The thumbnail generator is my favorite." },
  { name: "Nusrat Jahan", role: "Freelancer", avatar: "NJ", rating: 5, text: "From password generators to QR code makers — everything works perfectly." },
  { name: "Rafi Islam", role: "Software Engineer", avatar: "RI", rating: 5, text: "JSON formatter, regex tester, API tester — all dev tools I need in one place." },
  { name: "Fatima Begum", role: "Teacher", avatar: "FB", rating: 5, text: "The text-to-speech and word counter tools help me prepare lessons quickly." },
  { name: "Kamal Ahmed", role: "Entrepreneur", avatar: "KA", rating: 4, text: "Business card maker and invoice calculator — great for small businesses." },
  { name: "Lily Das", role: "UI Designer", avatar: "LD", rating: 5, text: "Glassmorphism generator, wireframe tools — a designer's dream toolkit!" },
  { name: "Omar Faruk", role: "YouTuber", avatar: "OF", rating: 5, text: "YouTube tag generator and thumbnail tools boosted my channel growth." },
  { name: "Priya Sen", role: "Data Analyst", avatar: "PS", rating: 5, text: "CSV viewer and JSON to CSV converter are incredibly useful for my work." },
  { name: "Habib Khan", role: "Blogger", avatar: "HK", rating: 4, text: "SEO meta tag generator and slug generator help optimize my blog posts." },
];

const row1 = [...reviews.slice(0, 6), ...reviews.slice(0, 6), ...reviews.slice(0, 6)];
const row2 = [...reviews.slice(6), ...reviews.slice(6), ...reviews.slice(6)];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className={cn(
      "shrink-0 w-[280px] sm:w-[320px] p-4 sm:p-5 rounded-xl sm:rounded-2xl",
      "bg-card/80 backdrop-blur-sm border border-border/40",
      "hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5",
      "transition-all duration-300 cursor-default"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs sm:text-sm font-bold text-primary">
          {review.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{review.name}</p>
          <p className="text-xs text-muted-foreground truncate">{review.role}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-2.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")} />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">"{review.text}"</p>
    </div>
  );
}

function ReviewRow({ items, direction = "left", speed = 45 }: { items: Review[]; direction?: "left" | "right"; speed?: number }) {
  const totalWidth = items.length * 340;

  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

      <motion.div
        className="flex gap-4 sm:gap-5 w-max"
        animate={{ x: direction === "left" ? [0, -totalWidth / 3] : [-totalWidth / 3, 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      >
        {items.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}

export function ReviewsMarquee() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[180px] pointer-events-none" style={{ background: "hsl(263 85% 58% / 0.04)" }} />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 px-4"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Loved by <span className="gradient-text">Users</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-lg mx-auto">
            See what our community says about Cyber Venom tools
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <ReviewRow items={row1} direction="left" speed={50} />
          <ReviewRow items={row2} direction="right" speed={55} />
        </div>
      </div>
    </section>
  );
}

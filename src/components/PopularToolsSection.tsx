import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Crown } from "lucide-react";
import { tools } from "@/data/tools";
import { FavoriteButton } from "@/components/FavoriteButton";

const popularToolIds = [
  "qr-code-maker", "password-generator", "image-compressor", "json-formatter",
  "color-picker", "word-counter", "image-resizer", "base64-encoder-decoder",
  "typing-test", "age-calculator", "unit-converter", "emoji-picker"
];

const popularTools = popularToolIds.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools;

export function PopularToolsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 mb-5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">Trending Now</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Most <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">Popular</span> Tools
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Discover the tools loved by thousands of users worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={tool.path}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full"
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                />
                {/* Shimmer */}
                <div className="absolute inset-0 animate-[shimmer_4s_ease-in-out_infinite]"
                  style={{ background: `linear-gradient(105deg, transparent 35%, ${tool.color.replace(')', ' / 0.08)')}, transparent 65%)` }}
                />

                {/* Rank badge for top 3 */}
                {i < 3 && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      i === 0 ? 'bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]' :
                      i === 1 ? 'bg-gray-400 text-white shadow-[0_0_12px_rgba(156,163,175,0.4)]' :
                      'bg-amber-700 text-white shadow-[0_0_12px_rgba(180,83,9,0.4)]'
                    }`}>
                      {i === 0 ? <Crown className="w-3 h-3" /> : i + 1}
                    </div>
                  </div>
                )}

                {/* Favorite button */}
                <div className="absolute top-2 left-2 z-20">
                  <FavoriteButton toolId={tool.id} />
                </div>

                <div className="relative z-10 mt-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      backgroundColor: tool.color.replace(')', ' / 0.12)'),
                      color: tool.color,
                    }}
                  >
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xs mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {tool.name}
                  </h3>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary mt-auto pt-1 transition-all group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

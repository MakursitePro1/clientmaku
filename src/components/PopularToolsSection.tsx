import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Crown, TrendingUp } from "lucide-react";
import { tools } from "@/data/tools";
import { FavoriteButton } from "@/components/FavoriteButton";

const popularToolIds = [
  "internet-speed-tester", "password-generator", "qr-code-maker",
  "hash-generator", "encryption-tool", "typing-test",
  "json-formatter", "color-picker"
];

const popularTools = popularToolIds.map(id => tools.find(t => t.id === id)).filter(Boolean) as typeof tools;

export function PopularToolsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 cyber-grid opacity-[0.04]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-500/[0.04] via-red-500/[0.06] to-pink-500/[0.04] blur-[120px] animate-pulse-glow" />
      <div className="absolute top-20 right-20 w-[200px] h-[200px] rounded-full bg-primary/[0.03] blur-[80px] animate-float" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 mb-6 backdrop-blur-sm"
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
              TRENDING NOW
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Most{" "}
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                Popular
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <motion.path
                  d="M2 6C40 2 80 2 100 4C120 6 160 2 198 4"
                  stroke="url(#underline-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(25, 95%, 53%)" />
                    <stop offset="0.5" stopColor="hsl(0, 84%, 60%)" />
                    <stop offset="1" stopColor="hsl(330, 80%, 55%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {" "}Tools
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-base">
            Discover the tools loved by thousands of users worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {popularTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
            >
              <Link
                to={tool.path}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-[0_4px_24px_-6px_hsl(var(--primary)/0.08)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px] overflow-hidden h-full"
                style={{
                  // @ts-ignore
                  '--tw-shadow-color': `${tool.color.replace(')', ' / 0.2)')}`,
                }}
              >
                {/* Animated border gradient on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${tool.color.replace(')', ' / 0.15)')}, transparent 40%, transparent 60%, ${tool.color.replace(')', ' / 0.1)')})`,
                  }}
                />

                {/* Top accent line */}
                <div className="absolute top-0 left-[10%] right-[10%] h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:left-0 group-hover:right-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                />

                {/* Shimmer sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(105deg, transparent 30%, ${tool.color.replace(')', ' / 0.08)')}, transparent 70%)`,
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />

                {/* Rank badge for top 3 */}
                {i < 3 && (
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        i === 0
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_0_16px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/30'
                          : i === 1
                          ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-[0_0_12px_rgba(148,163,184,0.4)] ring-2 ring-slate-300/30'
                          : 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-[0_0_12px_rgba(180,83,9,0.4)] ring-2 ring-amber-700/30'
                      }`}
                    >
                      {i === 0 ? <Crown className="w-3.5 h-3.5" /> : `#${i + 1}`}
                    </motion.div>
                  </div>
                )}

                {/* Favorite button */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  <FavoriteButton toolId={tool.id} />
                </div>

                {/* Icon */}
                <div className="relative z-10 mt-3">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
                      style={{
                        backgroundColor: tool.color.replace(')', ' / 0.1)'),
                        color: tool.color,
                      }}
                    >
                      <tool.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {/* Icon glow */}
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"
                      style={{ backgroundColor: tool.color }}
                    />
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm mb-0.5 group-hover:text-foreground transition-colors line-clamp-2 leading-tight">
                    {tool.name}
                  </h3>
                </div>

                <div className="mt-auto pt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <span className="text-[10px] font-semibold" style={{ color: tool.color }}>Open</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" style={{ color: tool.color }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SEOHead } from "./SEOHead";
import { ScrollToTop } from "./ScrollToTop";
import { FavoriteButton } from "./FavoriteButton";
import { tools } from "@/data/tools";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const location = useLocation();

  const currentTool = useMemo(() => tools.find(t => t.path === location.pathname), [location.pathname]);

  const relatedTools = useMemo(() => {
    if (!currentTool) return [];
    return tools
      .filter(t => t.category === currentTool.category && t.id !== currentTool.id)
      .slice(0, 4);
  }, [currentTool]);

  const toolColor = currentTool?.color || "hsl(var(--primary))";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={location.pathname} type="website" />
      <Navbar />

      <div className="relative">
        {/* ===== HERO SECTION ===== */}
        <div className="relative pt-24 pb-8 px-4 overflow-hidden">
          {/* Large radial gradient background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 cyber-grid opacity-[0.06]" />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] opacity-[0.12]"
              style={{ background: toolColor }}
            />
            <div
              className="absolute top-20 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.06]"
              style={{ background: toolColor }}
            />
            {/* Bottom fade into content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Link to="/tools">
                <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground group rounded-xl">
                  <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tools
                </Button>
              </Link>
            </motion.div>

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex flex-col sm:flex-row items-start gap-5 mb-8"
            >
              {/* Tool Icon - Large Premium */}
              {currentTool && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${toolColor.replace(')', ' / 0.2)')}, ${toolColor.replace(')', ' / 0.08)')})`,
                      color: toolColor,
                      boxShadow: `0 20px 60px ${toolColor.replace(')', ' / 0.25)')}, 0 0 0 1px ${toolColor.replace(')', ' / 0.1)')}`
                    }}
                  >
                    <div
                      className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                      style={{ background: `linear-gradient(105deg, transparent 30%, ${toolColor.replace(')', ' / 0.15)')}, transparent 70%)` }}
                    />
                    <div className="absolute inset-0 opacity-30"
                      style={{ background: "radial-gradient(circle at 30% 30%, white, transparent 60%)" }}
                    />
                    <currentTool.icon className="w-10 h-10 sm:w-12 sm:h-12 relative z-10 drop-shadow-sm" />
                  </div>
                  {/* Glow dot */}
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: toolColor, boxShadow: `0 0 14px 3px ${toolColor.replace(')', ' / 0.5)')}` }}
                  />
                </motion.div>
              )}

              {/* Title & Description */}
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 leading-tight"
                >
                  {title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed"
                >
                  {description}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mt-5"
                >
                  {currentTool && <FavoriteButton toolId={currentTool.id} size="lg" />}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-2 border-border/60 hover:border-primary/30 gap-2"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== TOOL CONTENT ===== */}
        <div className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative rounded-3xl border-2 border-border/40 bg-card shadow-xl overflow-hidden"
            >
              {/* Top accent bar */}
              {currentTool && (
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${toolColor}, ${toolColor.replace(')', ' / 0.3)')}, transparent)` }} />
              )}

              {/* Inner glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"
                style={{ background: toolColor }}
              />

              <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                {children}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== RELATED TOOLS ===== */}
        {relatedTools.length > 0 && (
          <div className="px-4 pb-20">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Similar Tools</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedTools.map((tool, i) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Link
                        to={tool.path}
                        className="group relative block rounded-2xl border-2 border-border/40 bg-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl h-full"
                        style={{ boxShadow: `0 4px 20px -8px ${tool.color.replace(')', ' / 0.1)')}` }}
                      >
                        {/* Top accent */}
                        <div className="h-[2px] w-full opacity-50 group-hover:opacity-100 transition-opacity"
                          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                        />
                        {/* Hover glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color.replace(')', ' / 0.06)')}, transparent 70%)` }}
                        />

                        <div className="p-5 relative z-10">
                          <div className="flex items-start gap-3.5 mb-4">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                              style={{ backgroundColor: tool.color.replace(')', ' / 0.12)'), color: tool.color }}
                            >
                              <tool.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border/30 group-hover:border-primary/20 transition-colors">
                            <span className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: tool.color }}>
                              Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <FavoriteButton toolId={tool.id} />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

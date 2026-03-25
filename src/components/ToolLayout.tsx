import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} path={location.pathname} type="website" />
      <Navbar />

      <div className="pt-28 pb-16 px-4 relative">
        {/* Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        {currentTool && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none"
            style={{ background: currentTool.color }}
          />
        )}

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/tools">
              <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Tools
              </Button>
            </Link>
          </motion.div>

          {/* Tool Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Tool Icon */}
                {currentTool && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: currentTool.color.replace(')', ' / 0.15)'),
                      color: currentTool.color,
                      boxShadow: `0 8px 30px ${currentTool.color.replace(')', ' / 0.2)')}`
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{ background: `radial-gradient(circle at 30% 30%, white, transparent 60%)` }}
                    />
                    <currentTool.icon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />
                  </motion.div>
                )}
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-1.5">{title}</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
                </div>
              </div>

              {/* Favorite Button - Large & Prominent */}
              {currentTool && (
                <FavoriteButton
                  toolId={currentTool.id}
                  size="lg"
                />
              )}
            </div>
          </motion.div>

          {/* Tool Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 shadow-lg relative overflow-hidden"
          >
            {/* Top accent line */}
            {currentTool && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${currentTool.color}, transparent)` }}
              />
            )}
            {children}
          </motion.div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-14"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                Similar Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedTools.map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <Link
                      to={tool.path}
                      className={cn(
                        "group relative block rounded-2xl p-5 border border-border/40 transition-all duration-500 overflow-hidden",
                        "bg-card hover:border-primary/30 hover:-translate-y-1"
                      )}
                      style={{ boxShadow: `0 4px 20px -8px ${tool.color.replace(')', ' / 0.08)')}` }}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color.replace(')', ' / 0.05)')}, transparent 70%)` }}
                      />
                      <div className="flex items-start gap-3.5 relative z-10">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: tool.color.replace(')', ' / 0.1)'), color: tool.color }}
                        >
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.description}</p>
                        </div>
                        <FavoriteButton toolId={tool.id} />
                      </div>
                      <div className="flex items-center mt-3 pt-3 border-t border-border/30 group-hover:border-primary/20 transition-colors">
                        <span className="text-xs font-semibold text-primary/70 group-hover:text-primary flex items-center transition-colors">
                          Open <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

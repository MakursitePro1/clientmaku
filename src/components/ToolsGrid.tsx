import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Sparkles, ExternalLink, ChevronLeft, ChevronRight, Star, Users, Eye, Share2, Zap, TrendingUp, Crown, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ToolCategory, type Tool } from "@/data/tools";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TOOLS_PER_PAGE = 24;

// Generate stable pseudo-random stats per tool
function getToolStats(toolId: string) {
  let hash = 0;
  for (let i = 0; i < toolId.length; i++) hash = ((hash << 5) - hash + toolId.charCodeAt(i)) | 0;
  const abs = Math.abs(hash);
  const visitors = 1200 + (abs % 8800);
  const users = 300 + (abs % 2700);
  const rating = (4.0 + (abs % 10) / 10).toFixed(1);
  return { visitors, users, rating };
}

export function ToolsGrid() {
  const { tools, categories, totalTools, getCategoryCount } = useToolCatalog();
  const { isToolLocked, premiumToolIds } = useSubscription();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleShare = useCallback((e: React.MouseEvent, tool: Tool) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.origin + tool.path;
    navigator.clipboard.writeText(url);
    toast.success(`Link copied: ${tool.name}`);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const category = (e as CustomEvent).detail as ToolCategory;
      setActiveCategory(category);
      setCurrentPage(1);
    };
    window.addEventListener("select-category", handler);
    return () => window.removeEventListener("select-category", handler);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery, tools]);

  const totalPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE);
  const paginatedTools = filteredTools.slice((currentPage - 1) * TOOLS_PER_PAGE, currentPage * TOOLS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section id="tools" className="py-28 px-4 relative">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[200px] pointer-events-none" style={{ background: "hsl(263 85% 58% / 0.04)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
            <Sparkles className="w-4 h-4 text-primary animate-pulse-glow relative z-10" />
            <span className="text-sm font-semibold gradient-text relative z-10">Powerful Tool Collection</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-5 tracking-tight"
          >
            Explore Our <span className="gradient-text">Web Tools</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Every tool is crafted with precision — fast, free, and ready to use
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative group">
            <div className="absolute -inset-1 gradient-bg rounded-2xl opacity-0 group-focus-within:opacity-20 blur-lg transition-all duration-500" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={`Search from ${totalTools} tools...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-13 pr-20 py-7 rounded-2xl bg-card/80 backdrop-blur-sm border-border/40 text-base focus:border-primary/40 transition-all shadow-sm focus:shadow-[0_0_30px_-8px_hsl(263_85%_58%/0.15)]"
                style={{ paddingLeft: '3.25rem' }}
              />
              {searchQuery && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                  {filteredTools.length} found
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 mb-16"
        >
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-300 overflow-hidden whitespace-nowrap",
                  cat.id === "all" && "col-span-2",
                  isActive
                    ? "gradient-bg text-primary-foreground shadow-lg glow-shadow"
                    : "bg-card/80 text-muted-foreground hover:text-foreground border border-border/40 hover:border-primary/30 hover:bg-accent/50 hover:shadow-md"
                )}
              >
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-gradient" />}
                <cat.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{cat.label}</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-md relative z-10 font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-accent text-muted-foreground"
                )}>{count}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tools Grid - Ultra Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedTools.map((tool, index) => {
              const stats = getToolStats(tool.id);
              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5), type: "spring", stiffness: 120 }}
                >
                  <Link
                    to={tool.path}
                    className="group relative block rounded-2xl overflow-hidden h-full border-[3px] border-primary/40 transition-all duration-500 hover:-translate-y-3 hover:border-primary/70"
                    style={{
                      boxShadow: `0 4px 20px -5px ${tool.color.replace(')', ' / 0.08)')}`,
                      '--tool-color': tool.color,
                    } as React.CSSProperties}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 25px 60px -12px ${tool.color.replace(')', ' / 0.25)')}, 0 8px 20px -8px ${tool.color.replace(')', ' / 0.15)')}`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px -5px ${tool.color.replace(')', ' / 0.08)')}`; }}
                  >
                    
                    <div className="absolute inset-[1.5px] rounded-2xl bg-card/98 backdrop-blur-md" />

                    {/* Continuous shine sweep animation */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div
                        className="absolute -left-full top-0 w-1/2 h-full animate-[shine-sweep_4s_ease-in-out_infinite] skew-x-[-20deg]"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${tool.color.replace(')', ' / 0.08)')}, ${tool.color.replace(')', ' / 0.15)')}, ${tool.color.replace(')', ' / 0.08)')}, transparent)`,
                        }}
                      />
                    </div>

                    {/* Top accent gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl overflow-hidden">
                      <div
                        className="h-full w-full opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, ${tool.color}, transparent)` }}
                      />
                    </div>

                    {/* Hover glow orbs */}
                    <div
                      className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-25 transition-all duration-700"
                      style={{ background: tool.color }}
                    />
                    <div
                      className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-[80px] opacity-0 group-hover:opacity-15 transition-all duration-700"
                      style={{ background: tool.color }}
                    />

                    <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">
                      {/* Top row: Icon + Category Badge + Share */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <motion.div
                            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                            transition={{ duration: 0.5 }}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500"
                            style={{
                              background: `linear-gradient(135deg, ${tool.color.replace(')', ' / 0.18)')}, ${tool.color.replace(')', ' / 0.06)')})`,
                              color: tool.color,
                            }}
                          >
                            <div
                              className="absolute inset-0 animate-[shimmer_2.5s_ease-in-out_infinite]"
                              style={{ background: `linear-gradient(105deg, transparent 30%, ${tool.color.replace(')', ' / 0.25)')}, transparent 70%)` }}
                            />
                            <tool.icon className="w-7 h-7 relative z-10 drop-shadow-sm" />
                          </motion.div>
                          {/* Pulsing glow dot */}
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                            style={{
                              backgroundColor: tool.color,
                              boxShadow: `0 0 10px 2px ${tool.color.replace(')', ' / 0.5)')}`,
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Category Badge */}
                          <span
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: tool.color.replace(')', ' / 0.1)'),
                              color: tool.color,
                              border: `1px solid ${tool.color.replace(')', ' / 0.2)')}`,
                            }}
                          >
                            {tool.category}
                          </span>
                          {/* Share Button */}
                          <button
                            onClick={(e) => handleShare(e, tool)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/50 border border-border/30 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
                            title="Copy link"
                          >
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-bold text-[15px] mb-1.5 leading-snug group-hover:text-primary transition-colors duration-300">
                        {tool.name}
                      </h3>
                      <p className="text-[13px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/70">
                          <Eye className="w-3.5 h-3.5" style={{ color: tool.color }} />
                          {stats.visitors.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/70">
                          <Users className="w-3.5 h-3.5" style={{ color: tool.color }} />
                          {stats.users.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          {stats.rating}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto flex items-center gap-2">
                        <span
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${tool.color.replace(')', ' / 0.12)')}, ${tool.color.replace(')', ' / 0.06)')})`,
                            color: tool.color,
                            border: `1px solid ${tool.color.replace(')', ' / 0.2)')}`,
                          }}
                        >
                          {/* Button shine sweep */}
                          <span
                            className="absolute -left-full top-0 w-1/2 h-full animate-[shine-sweep_3s_ease-in-out_infinite_0.5s] skew-x-[-20deg] pointer-events-none"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${tool.color.replace(')', ' / 0.15)')}, transparent)`,
                            }}
                          />
                          <Zap className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">Open Tool</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 relative z-10" />
                        </span>
                        <FavoriteButton toolId={tool.id} size="md" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <p className="text-xl text-muted-foreground font-semibold mb-2">No tools found</p>
            <p className="text-sm text-muted-foreground/60">Try a different search term or category</p>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent -translate-y-1/2" />
              <div className="relative flex flex-col items-center gap-5">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-card/90 backdrop-blur-sm border border-border/40 rounded-2xl px-3 py-2.5 shadow-lg">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }); }}
                    disabled={currentPage === 1}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-border/40 mx-1" />
                  {getPageNumbers().map((page, i) => (
                    typeof page === "string" ? (
                      <span key={`dots-${i}`} className="w-6 flex items-center justify-center text-muted-foreground/40 text-xs">•••</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }); }}
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
                          currentPage === page
                            ? "gradient-bg text-primary-foreground shadow-lg glow-shadow scale-110"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {currentPage === page && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-gradient" />
                        )}
                        <span className="relative z-10">{page}</span>
                      </button>
                    )
                  ))}
                  <div className="w-px h-6 bg-border/40 mx-1" />
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }); }}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{(currentPage - 1) * TOOLS_PER_PAGE + 1}-{Math.min(currentPage * TOOLS_PER_PAGE, filteredTools.length)}</span> of <span className="font-bold text-foreground">{filteredTools.length}</span> tools
                  </p>
                  <Link
                    to="/tools"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  >
                    View All Tools
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

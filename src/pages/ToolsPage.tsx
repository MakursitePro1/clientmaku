import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight, ChevronDown, X, Sparkles, Wrench, Zap, TrendingUp, Star, Grid3X3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ToolCategory } from "@/data/tools";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToolsBanner } from "@/components/ToolsBanner";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";
import { cn } from "@/lib/utils";


export default function ToolsPage() {
  const { tools, categories, totalTools, totalCategories, getCategoryCount } = useToolCatalog();
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as ToolCategory) || "all";
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const stats = [
    { label: "Total Tools", value: `${totalTools}`, icon: Wrench, color: "hsl(262, 83%, 58%)" },
    { label: "Categories", value: `${totalCategories}`, icon: Grid3X3, color: "hsl(142, 71%, 45%)" },
    { label: "Always Free", value: "100%", icon: Star, color: "hsl(45, 93%, 47%)" },
    { label: "Updated Daily", value: "24/7", icon: TrendingUp, color: "hsl(199, 89%, 48%)" },
  ];

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery, tools]);

  const activeLabel = categories.find(c => c.id === activeCategory)?.label || "All Tools";
  const ActiveIcon = categories.find(c => c.id === activeCategory)?.icon;

  const groupedTools = useMemo(() => {
    if (activeCategory !== "all") return null;
    const groups: Record<string, typeof tools> = {};
    filteredTools.forEach(tool => {
      const cat = categories.find(c => c.id === tool.category);
      const label = cat?.label || tool.category;
      if (!groups[label]) groups[label] = [];
      groups[label].push(tool);
    });
    return groups;
  }, [filteredTools, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="All Tools — Cyber Venom" description={`Browse all ${totalTools} free online tools across ${totalCategories} categories. Filter by category and search instantly.`} path="/tools" />
      <Navbar />

      {/* ===== PREMIUM HERO ===== */}
      <section className="relative pt-24 sm:pt-28 pb-6 px-4 overflow-hidden">
        {/* Multi-layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_55%)]" />
        <div className="absolute inset-0 cyber-grid opacity-[0.06]" />

        {/* Colorful blurred orbs */}
        <div className="absolute top-16 left-[10%] w-[400px] h-[300px] bg-purple-500/[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-[350px] h-[250px] bg-cyan-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-pink-500/[0.05] rounded-full blur-[130px] pointer-events-none" />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: `hsl(${260 + i * 20}, 70%, 60%)`,
              top: `${15 + i * 10}%`,
              left: `${5 + i * 12}%`,
            }}
            animate={{ y: [0, -25, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-[shimmer_3s_ease-in-out_infinite]" />
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
              <span className="text-sm font-bold gradient-text relative z-10">{totalTools} Free Tools Available</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
            >
              Explore All{" "}
              <span className="relative">
                <span className="gradient-text">Tools</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full gradient-bg"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg"
            >
              Browse, search, and filter our massive collection of free web tools
            </motion.p>
          </motion.div>

          {/* Stats Row — Colorful */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="relative rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md p-4 text-center group hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color.replace(')', ' / 0.12)')}, transparent 70%)` }}
                />
                {/* Color stripe */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: stat.color }} />

                <stat.icon className="w-5 h-5 mx-auto mb-2 relative z-10 group-hover:scale-110 transition-transform" style={{ color: stat.color }} />
                <div className="text-xl font-extrabold relative z-10" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="px-4 pb-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-md p-3 sm:p-4 shadow-xl shadow-primary/5">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.08), transparent 60%)" }} />

            <div className="relative flex flex-col sm:flex-row gap-3 items-center justify-center">
              {/* Search */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search 200+ tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 py-6 rounded-xl bg-background border-2 border-primary/15 text-base focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "flex items-center gap-2.5 px-5 py-3 sm:py-3.5 rounded-xl border-2 transition-all duration-300 w-full sm:min-w-[200px] justify-between",
                    dropdownOpen
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-primary/20 bg-background hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    {ActiveIcon && <ActiveIcon className="w-4 h-4 text-primary/70" />}
                    <span className="text-sm font-bold">{activeLabel}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-primary transition-transform duration-300", dropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 right-0 sm:left-auto sm:right-0 sm:w-80 rounded-2xl bg-card border-2 border-primary/20 shadow-2xl z-50 p-2 max-h-[60vh] overflow-y-auto"
                      >
                        {categories.map(cat => {
                          const count = cat.id === "all" ? tools.length : tools.filter(t => t.category === cat.id).length;
                          const isActive = activeCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => { setActiveCategory(cat.id); setDropdownOpen(false); }}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                                isActive
                                  ? "bg-primary/15 text-primary font-bold border border-primary/20"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              )}
                            >
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isActive ? "bg-primary/20" : "bg-accent")}>
                                <cat.icon className="w-4 h-4" />
                              </div>
                              <span className="flex-1 text-left">{cat.label}</span>
                              <span className={cn("text-xs px-2.5 py-1 rounded-full font-bold", isActive ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground")}>{count}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4 px-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredTools.length}</span> tools
              {activeCategory !== "all" && (
                <span> in <span className="font-semibold text-primary">{activeLabel}</span>
                  <button onClick={() => setActiveCategory("all")} className="ml-2 text-xs text-primary hover:underline">(clear)</button>
                </span>
              )}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===== TOOLS LIST ===== */}
      <div className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeCategory !== "all" || searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            groupedTools && Object.entries(groupedTools).map(([label, groupTools]) => {
              const cat = categories.find(c => c.label === label);
              return (
                <div key={label} className="mb-12">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                      {cat && <cat.icon className="w-5 h-5 text-primary-foreground" />}
                    </div>
                    <h3 className="text-lg font-extrabold">{label}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{groupTools.length}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-border/30 to-transparent ml-2" />
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupTools.map((tool, index) => (
                      <ToolCard key={tool.id} tool={tool} index={index} />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="w-24 h-24 rounded-3xl bg-accent/50 border border-border/30 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground/20" />
              </div>
              <p className="text-xl text-muted-foreground font-bold mb-2">No tools found</p>
              <p className="text-sm text-muted-foreground/60">Try a different search term or category</p>
            </motion.div>
          )}
        </div>
      </div>

      <ToolsBanner />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

/* ===== COLORFUL TOOL CARD ===== */
function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.3) }}
    >
      <Link
        to={tool.path}
        className="group relative block rounded-2xl p-5 border border-border/30 transition-all duration-500 overflow-hidden h-full hover:border-transparent hover:shadow-xl hover:-translate-y-1"
        style={{ background: 'hsl(var(--card))' }}
      >
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-40 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
        />

        {/* Left edge accent */}
        <div className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-700"
          style={{ background: `linear-gradient(180deg, ${tool.color}, transparent)` }}
        />

        {/* Hover glow orb */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[250px] h-[120px] rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
          style={{ background: `${tool.color.replace(')', ' / 0.12)')}` }}
        />

        {/* Bottom corner glow */}
        <div
          className="absolute bottom-0 right-0 w-[100px] h-[60px] rounded-full blur-[40px] opacity-0 group-hover:opacity-60 transition-all duration-500 pointer-events-none"
          style={{ background: `${tool.color.replace(')', ' / 0.08)')}` }}
        />

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon container with animated border */}
          <div className="relative shrink-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
              style={{
                backgroundColor: tool.color.replace(')', ' / 0.12)'),
                color: tool.color,
              }}
            >
              <tool.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            {/* Pulsing dot */}
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: tool.color }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm mb-1 transition-colors truncate group-hover:text-foreground" style={{ color: undefined }}>
              <span className="group-hover:hidden">{tool.name}</span>
              <span className="hidden group-hover:inline" style={{ color: tool.color }}>{tool.name}</span>
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">{tool.description}</p>
          </div>
          <FavoriteButton toolId={tool.id} className="shrink-0 mt-0.5" />
          <ArrowRight className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-1"
            style={{ color: undefined }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

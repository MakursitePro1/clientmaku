import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight, ExternalLink, ChevronDown, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { tools, categories, type ToolCategory } from "@/data/tools";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FavoriteButton } from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";

export default function ToolsPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as ToolCategory) || "all";
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredTools = useMemo(() => tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchQuery]);

  const activeLabel = categories.find(c => c.id === activeCategory)?.label || "All Tools";
  const ActiveIcon = categories.find(c => c.id === activeCategory)?.icon;

  // Group tools by category for list view
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
      <SEOHead title="All Tools — Cyber Venom" description="Browse all 200+ free online tools. Filter by category, search instantly." path="/tools" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-gradient" />
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
              <span className="text-sm font-semibold gradient-text relative z-10">{tools.length}+ Tools Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              All <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Browse, search, and filter our entire collection of free web tools
            </p>
          </motion.div>

          {/* Search + Category Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 py-6 rounded-2xl bg-card/80 backdrop-blur-sm border-border/40 text-base focus:border-primary/40 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn(
                    "flex items-center gap-2.5 px-5 py-3 sm:py-0 sm:h-full rounded-2xl border transition-all duration-300 min-w-[200px] justify-between",
                    dropdownOpen
                      ? "border-primary/40 bg-accent/60 shadow-lg"
                      : "border-border/40 bg-card/80 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    {ActiveIcon && <ActiveIcon className="w-4 h-4 text-primary/70" />}
                    <span className="text-sm font-semibold">{activeLabel}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-64 rounded-2xl bg-card border border-border/60 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      {categories.map(cat => {
                        const count = cat.id === "all" ? tools.length : tools.filter(t => t.category === cat.id).length;
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setDropdownOpen(false); }}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all",
                              isActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                          >
                            <cat.icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{cat.label}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-md font-bold", isActive ? "bg-primary/20 text-primary" : "bg-accent text-muted-foreground")}>{count}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Active filter + count */}
            <div className="flex items-center justify-between mt-4 px-1">
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

          {/* Tools List */}
          {activeCategory !== "all" || searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            groupedTools && Object.entries(groupedTools).map(([label, groupTools]) => (
              <div key={label} className="mb-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full gradient-bg" />
                  {label}
                  <span className="text-xs font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded-md ml-1">{groupTools.length}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupTools.map((tool, index) => (
                    <ToolCard key={tool.id} tool={tool} index={index} />
                  ))}
                </div>
              </div>
            ))
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl text-muted-foreground font-semibold mb-2">No tools found</p>
              <p className="text-sm text-muted-foreground/60">Try a different search term or category</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

function ToolCard({ tool, index }: { tool: typeof tools[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.2) }}
    >
      <Link
        to={tool.path}
        className="tool-card group relative block rounded-2xl p-5 border border-border/40 transition-all duration-500 overflow-hidden h-full"
        style={{ background: 'hsl(var(--card))' }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: tool.color.replace(')', ' / 0.1)'), color: tool.color }}
          >
            <tool.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">{tool.description}</p>
          </div>
          <FavoriteButton toolId={tool.id} className="shrink-0 mt-0.5" />
          <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary shrink-0 mt-1 transition-all group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Filter, X } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToolSidebarProps {
  currentToolId?: string;
  currentCategory?: ToolCategory;
}

export function ToolSidebar({ currentToolId, currentCategory }: ToolSidebarProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<ToolCategory>("all");

  const similarTools = useMemo(() => {
    if (!currentCategory || !currentToolId) return [];
    return tools.filter(t => t.category === currentCategory && t.id !== currentToolId).slice(0, 6);
  }, [currentCategory, currentToolId]);

  const filteredTools = useMemo(() => {
    let list = tools.filter(t => t.id !== currentToolId);
    if (selectedCat !== "all") list = list.filter(t => t.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list.slice(0, 8);
  }, [search, selectedCat, currentToolId]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-5 w-full"
    >
      {/* Search Card */}
      <div className="relative group rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -inset-[100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--primary)/0.06)_10%,transparent_20%)]" />
        </div>
        <div className="relative bg-card m-[1px] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Find Tools</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-accent/40 border border-border/30 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative group rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0%,hsl(var(--primary)/0.05)_8%,transparent_16%)]" />
        </div>
        <div className="relative bg-card m-[1px] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Categories</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => {
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <cat.icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtered Results */}
      <AnimatePresence mode="wait">
        {(search || selectedCat !== "all") && filteredTools.length > 0 && (
          <motion.div
            key="filtered"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm"
          >
            <div className="p-4 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                {search ? "Search Results" : "Filtered"} ({filteredTools.length})
              </span>
            </div>
            <div className="px-2 pb-3 space-y-0.5">
              {filteredTools.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <Link
                    to={tool.path}
                    className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-accent/60 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: tool.color.replace(")", " / 0.1)"), color: tool.color }}
                    >
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground/50 truncate">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Similar Tools */}
      {similarTools.length > 0 && !search && selectedCat === "all" && (
        <div className="relative group rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute -inset-[100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_180deg,transparent_0%,hsl(var(--primary)/0.04)_6%,transparent_12%)]" />
          </div>
          <div className="relative bg-card m-[1px] rounded-2xl">
            <div className="p-4 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Similar Tools</span>
            </div>
            <div className="px-2 pb-3 space-y-0.5">
              {similarTools.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <Link
                    to={tool.path}
                    className="group flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-accent/60 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: tool.color.replace(")", " / 0.1)"), color: tool.color }}
                    >
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{tool.name}</p>
                      <p className="text-[10px] text-muted-foreground/50 truncate">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Tools", value: tools.length, color: "text-primary" },
            { label: "Categories", value: categories.length - 1, color: "text-green-500" },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl bg-accent/30">
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Filter, X, TrendingUp, Clock, Flame, Zap } from "lucide-react";
import { type Tool, type ToolCategory } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";

interface ToolSidebarProps {
  currentToolId?: string;
  currentCategory?: ToolCategory;
}

// Popular tools (curated)
const popularToolIds = [
  "internet-speed-tester", "password-generator", "qr-code-maker",
  "ip-address-lookup", "hash-generator", "typing-test",
];

// Recent tools from localStorage
function getRecentTools(): string[] {
  try {
    return JSON.parse(localStorage.getItem("cv_recent_tools") || "[]");
  } catch { return []; }
}

function saveRecentTool(toolId: string) {
  const recent = getRecentTools().filter(id => id !== toolId);
  recent.unshift(toolId);
  localStorage.setItem("cv_recent_tools", JSON.stringify(recent.slice(0, 10)));
}

const itemVariants = {
  hidden: { opacity: 0, x: -16, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { delay: i * 0.045, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, x: 16, scale: 0.96, transition: { duration: 0.2 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.04 } },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.25 } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

function ToolItem({ tool, index = 0 }: { tool: Tool; index?: number }) {
  return (
    <motion.div variants={itemVariants} custom={index} initial="hidden" animate="visible" exit="exit" layout>
      <Link
        to={tool.path}
        onClick={() => saveRecentTool(tool.id)}
        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 hover:bg-foreground/[0.04] hover:shadow-[0_8px_24px_-12px_hsl(var(--foreground)/0.2)]"
      >
        {/* Hover accent line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-full bg-primary transition-all duration-300 group-hover:h-6 opacity-0 group-hover:opacity-100" />
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-foreground/[0.06]"
          style={{
            background: `linear-gradient(135deg, ${tool.color.replace(")", " / 0.15)")}, ${tool.color.replace(")", " / 0.05)")})`,
            color: tool.color,
            boxShadow: `0 4px 12px -4px ${tool.color.replace(")", " / 0.2)")}`,
          }}
        >
          <tool.icon className="w-4 h-4 drop-shadow-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold truncate group-hover:text-foreground transition-colors leading-tight">{tool.name}</p>
          <p className="text-[10px] text-muted-foreground/55 truncate mt-0.5 leading-tight">{tool.description}</p>
        </div>
        <div className="w-6 h-6 rounded-lg bg-foreground/[0.04] flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all duration-300">
          <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

function SidebarSection({ icon: Icon, label, children, accent }: { icon: any; label: string; children: React.ReactNode; accent?: string }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="tool-section-card overflow-hidden group/section"
    >
      {/* Section header with accent icon */}
      <div className="p-4 pb-2.5 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover/section:scale-110"
          style={{
            background: accent
              ? `linear-gradient(135deg, ${accent}22, ${accent}0A)`
              : 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))',
            color: accent || 'hsl(var(--primary))',
            boxShadow: `0 4px 12px -6px ${accent || 'hsl(var(--primary))'}40`,
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground/70">{label}</span>
      </div>
      <div className="px-2 pb-3.5 space-y-0.5">
        {children}
      </div>
    </motion.div>
  );
}

export function ToolSidebar({ currentToolId, currentCategory }: ToolSidebarProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<ToolCategory>("all");
  const { tools, categories, totalTools, totalCategories, getCategoryCount } = useToolCatalog();

  const similarTools = useMemo(() => {
    if (!currentCategory || !currentToolId) return [];
    return tools.filter(t => t.category === currentCategory && t.id !== currentToolId).slice(0, 5);
  }, [currentCategory, currentToolId]);

  const popular = useMemo(() =>
    popularToolIds.map(id => tools.find(t => t.id === id)).filter((t): t is Tool => !!t && t.id !== currentToolId).slice(0, 5),
    [currentToolId]
  );

  const recent = useMemo(() => {
    const ids = getRecentTools();
    return ids.map(id => tools.find(t => t.id === id)).filter((t): t is Tool => !!t && t.id !== currentToolId).slice(0, 5);
  }, [currentToolId]);

  const filteredTools = useMemo(() => {
    let list = tools.filter(t => t.id !== currentToolId);
    if (selectedCat !== "all") list = list.filter(t => t.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list.slice(0, 8);
  }, [search, selectedCat, currentToolId]);

  const showFiltered = search || selectedCat !== "all";

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="space-y-5 w-full"
    >
      {/* Search */}
      <SidebarSection icon={Search} label="Find Tools" accent="#6366f1">
        <div className="px-1.5 pb-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search from ${totalTools} tools...`}
              className="tool-input-colorful w-full pl-9 pr-8 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </SidebarSection>

      {/* Categories */}
      <SidebarSection icon={Filter} label="Categories" accent="#f59e0b">
        <div className="flex flex-wrap gap-1.5 px-2 pb-1">
          {categories.map((cat, i) => {
            const isActive = selectedCat === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                layout
                whileTap={{ scale: 0.95 }}
                animate={isActive ? { scale: 1.03 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors duration-300 border",
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-[0_8px_20px_-8px_hsl(var(--foreground)/0.5)]"
                    : "bg-foreground/[0.03] text-muted-foreground border-foreground/[0.08] hover:bg-foreground/[0.07] hover:text-foreground hover:border-foreground/[0.16]"
                )}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
                <span className={cn(
                  "rounded-md px-1.5 py-0.5 text-[9px] font-extrabold",
                  isActive ? "bg-background/20 text-background" : "bg-foreground/[0.06] text-muted-foreground/70"
                )}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </SidebarSection>

      {/* Filtered Results */}
      <AnimatePresence mode="wait">
        {showFiltered && filteredTools.length > 0 && (
          <motion.div
            key={`filtered-${selectedCat}-${search}`}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="tool-section-card overflow-hidden"
          >
            <div className="p-4 pb-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground/70">
                {search ? "Search Results" : "Filtered"} ({filteredTools.length})
              </span>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="px-2 pb-3 space-y-0.5">
              {filteredTools.map((tool, i) => <ToolItem key={tool.id} tool={tool} index={i} />)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Popular Tools */}
        {!showFiltered && popular.length > 0 && (
          <SidebarSection key="popular" icon={Flame} label="Popular Tools" accent="#ef4444">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              {popular.map((tool, i) => <ToolItem key={tool.id} tool={tool} index={i} />)}
            </motion.div>
          </SidebarSection>
        )}

        {/* Similar Tools */}
        {!showFiltered && similarTools.length > 0 && (
          <SidebarSection key="similar" icon={Zap} label="Similar Tools" accent="#8b5cf6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              {similarTools.map((tool, i) => <ToolItem key={tool.id} tool={tool} index={i} />)}
            </motion.div>
          </SidebarSection>
        )}

        {/* Recent Tools */}
        {!showFiltered && recent.length > 0 && (
          <SidebarSection key="recent" icon={Clock} label="Recently Visited" accent="#10b981">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
              {recent.map((tool, i) => <ToolItem key={tool.id} tool={tool} index={i} />)}
            </motion.div>
          </SidebarSection>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="tool-section-card p-5 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-4 relative">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10" style={{ boxShadow: '0 4px 12px -6px hsl(var(--primary) / 0.4)' }}>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground/70">Quick Stats</span>
        </div>
        <div className="grid grid-cols-2 gap-3 relative">
          {[
            { label: "Total Tools", value: totalTools, emoji: "🛠️", gradient: "from-blue-500/15 via-indigo-500/10 to-purple-500/5", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
            { label: "Categories", value: totalCategories, emoji: "📂", gradient: "from-amber-500/15 via-orange-500/10 to-red-500/5", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`group relative rounded-2xl border ${s.border} bg-gradient-to-br ${s.gradient} p-4 text-center cursor-default transition-shadow duration-300 hover:shadow-lg ${s.glow} backdrop-blur-sm`}
            >
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300">{s.emoji}</div>
              <div className="text-2xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}

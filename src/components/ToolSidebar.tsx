import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, Filter, X, TrendingUp, Clock } from "lucide-react";
import { tools, categories, type ToolCategory } from "@/data/tools";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

function ToolItem({ tool, delay = 0 }: { tool: typeof tools[0]; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <Link
        to={tool.path}
        onClick={() => saveRecentTool(tool.id)}
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
  );
}

function SidebarSection({ icon: Icon, label, children, shineDelay = "0s" }: { icon: any; label: string; children: React.ReactNode; shineDelay?: string }) {
  return (
    <div className="relative group rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--primary)/0.05)_8%,transparent_16%)]" style={{ animation: `spin 8s linear infinite`, animationDelay: shineDelay }} />
      </div>
      <div className="relative bg-card m-[1px] rounded-2xl">
        <div className="p-4 pb-2 flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{label}</span>
        </div>
        <div className="px-2 pb-3 space-y-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ToolSidebar({ currentToolId, currentCategory }: ToolSidebarProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<ToolCategory>("all");

  const similarTools = useMemo(() => {
    if (!currentCategory || !currentToolId) return [];
    return tools.filter(t => t.category === currentCategory && t.id !== currentToolId).slice(0, 5);
  }, [currentCategory, currentToolId]);

  const popular = useMemo(() =>
    popularToolIds.map(id => tools.find(t => t.id === id)).filter((t): t is typeof tools[0] => !!t && t.id !== currentToolId).slice(0, 5),
    [currentToolId]
  );

  const recent = useMemo(() => {
    const ids = getRecentTools();
    return ids.map(id => tools.find(t => t.id === id)).filter((t): t is typeof tools[0] => !!t && t.id !== currentToolId).slice(0, 5);
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
      <SidebarSection icon={Search} label="Find Tools" shineDelay="0s">
        <div className="px-1.5 pb-1">
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
      </SidebarSection>

      {/* Categories */}
      <SidebarSection icon={Filter} label="Categories" shineDelay="2s">
        <div className="flex flex-wrap gap-1.5 px-1.5 pb-1">
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
      </SidebarSection>

      {/* Filtered Results */}
      <AnimatePresence mode="wait">
        {showFiltered && filteredTools.length > 0 && (
          <motion.div key="filtered" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm"
          >
            <div className="p-4 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                {search ? "Search Results" : "Filtered"} ({filteredTools.length})
              </span>
            </div>
            <div className="px-2 pb-3 space-y-0.5">
              {filteredTools.map((tool, i) => <ToolItem key={tool.id} tool={tool} delay={i * 0.03} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Tools */}
      {!showFiltered && popular.length > 0 && (
        <SidebarSection icon={TrendingUp} label="Popular Tools" shineDelay="4s">
          {popular.map((tool, i) => <ToolItem key={tool.id} tool={tool} delay={0.2 + i * 0.04} />)}
        </SidebarSection>
      )}

      {/* Similar Tools */}
      {!showFiltered && similarTools.length > 0 && (
        <SidebarSection icon={Sparkles} label="Similar Tools" shineDelay="6s">
          {similarTools.map((tool, i) => <ToolItem key={tool.id} tool={tool} delay={0.3 + i * 0.05} />)}
        </SidebarSection>
      )}

      {/* Recent Tools */}
      {!showFiltered && recent.length > 0 && (
        <SidebarSection icon={Clock} label="Recently Visited" shineDelay="8s">
          {recent.map((tool, i) => <ToolItem key={tool.id} tool={tool} delay={0.3 + i * 0.04} />)}
        </SidebarSection>
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

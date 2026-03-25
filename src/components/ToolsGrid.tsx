import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { tools, categories, type ToolCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

export function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toolCount = filteredTools.length;

  return (
    <section id="tools" className="py-24 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Our Tools</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
            Explore Our <span className="gradient-text">Web Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every tool is designed to make your work faster and easier
          </p>
        </div>

        {/* Search - Premium glassmorphism */}
        <div className="max-w-lg mx-auto mb-10">
          <div className="relative group">
            <div className="absolute -inset-0.5 gradient-bg rounded-2xl opacity-20 group-focus-within:opacity-40 blur transition-opacity" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-2xl bg-card border-border/50 text-base focus:border-primary/50 transition-all"
              />
              {searchQuery && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-accent px-2 py-1 rounded-lg">
                  {toolCount} found
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter - Premium pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                activeCategory === cat.id
                  ? "gradient-bg text-primary-foreground shadow-lg glow-shadow scale-105"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/30 hover:bg-accent/50"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
              {activeCategory === cat.id && (
                <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-2 py-0.5 rounded-md">
                  {cat.id === "all" ? tools.length : tools.filter(t => t.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tools Grid - Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Link
                  to={tool.path}
                  className="group relative block rounded-2xl p-6 border border-border/50 hover:border-primary/40 transition-all duration-500 hover-lift overflow-hidden"
                  style={{ background: 'hsl(var(--card))' }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color.replace(')', ' / 0.08)')}, transparent 70%)` }}
                  />

                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{ 
                        backgroundColor: tool.color.replace(')', ' / 0.12)'),
                        color: tool.color,
                        boxShadow: 'none'
                      }}
                    >
                      <tool.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors duration-300">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-primary translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                      Use Tool <ArrowRight className="ml-1.5 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground font-medium">No tools found matching your criteria</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try a different search term or category</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

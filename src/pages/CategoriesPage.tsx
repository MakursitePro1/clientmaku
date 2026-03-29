import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { motion } from "framer-motion";
import { ArrowRight, Grid3X3 } from "lucide-react";
import { useToolCatalog } from "@/contexts/ToolCatalogContext";

const CategoriesPage = () => {
  const { categories, tools, totalTools, totalCategories } = useToolCatalog();
  const cats = categories.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Tool Categories" description={`Browse ${totalCategories} tool categories with ${totalTools} free tools organized for you.`} path="/categories" />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Grid3X3 className="w-4 h-4" /> All Categories
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Explore Tools by <span className="gradient-text">Category</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl mx-auto">
            {totalCategories} categories with {totalTools} tools — find exactly what you need, organized for maximum productivity.
          </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map((cat, i) => {
            const catTools = tools.filter((t) => t.category === cat.id);
            const Icon = cat.icon;
            const sampleTools = catTools.slice(0, 4);
            const colors = [
              "hsl(263, 85%, 58%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)",
              "hsl(280, 90%, 55%)", "hsl(45, 93%, 47%)", "hsl(330, 80%, 55%)", "hsl(200, 80%, 50%)",
              "hsl(160, 70%, 45%)", "hsl(25, 95%, 53%)", "hsl(210, 80%, 55%)", "hsl(350, 80%, 50%)"
            ];
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/tools?category=${cat.id}`} className="group block h-full">
                  <div className="relative h-full rounded-2xl border border-border/30 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: color }} />

                    <div className="relative z-10 p-6">
                      {/* Icon + Count */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-border/20" style={{ background: `${color}15` }}>
                          <Icon className="w-7 h-7" style={{ color }} />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-border/20" style={{ background: `${color}10`, color }}>
                          {catTools.length} tools
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{cat.label}</h2>

                      {/* Sample Tools */}
                      <div className="space-y-1.5 mb-4">
                        {sampleTools.map((tool) => (
                          <div key={tool.id} className="flex items-center gap-2 text-xs text-muted-foreground/70">
                            <span className="w-1 h-1 rounded-full bg-primary/40" />
                            {tool.name}
                          </div>
                        ))}
                        {catTools.length > 4 && (
                          <div className="text-xs text-muted-foreground/50 pl-3">+{catTools.length - 4} more tools</div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore Category <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CategoriesPage;

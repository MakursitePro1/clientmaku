import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, LogIn, Sparkles, Search, Filter, X, Grid3X3, List, Star } from "lucide-react";
import { tools, categories } from "@/data/tools";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FavoriteButton } from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading } = useFavorites();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const favoriteTools = useMemo(
    () => tools.filter(t => favorites.includes(t.id)),
    [favorites]
  );

  const filteredTools = useMemo(() => {
    let result = favoriteTools;
    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return result;
  }, [favoriteTools, selectedCategory, search]);

  const activeCategories = useMemo(() => {
    const cats = new Set(favoriteTools.map(t => t.category));
    return categories.filter(c => c.id === "all" || cats.has(c.id));
  }, [favoriteTools]);

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Favorites — Cyber Venom" description="Your favorite tools collection" path="/favorites" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 relative">
        <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/10 to-pink-500/10 mb-5"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">My Favorites</span>
              {favoriteTools.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">{favoriteTools.length}</span>
              )}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Favorite <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your personal collection of most-used tools — quick access to everything you love
            </p>
          </motion.div>

          {!user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/10 to-pink-500/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <LogIn className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <p className="text-xl text-muted-foreground font-semibold mb-2">Login Required</p>
              <p className="text-sm text-muted-foreground/60 mb-6">Please login to save and view your favorite tools</p>
              <Button onClick={() => navigate("/auth")} className="gradient-bg text-primary-foreground rounded-xl font-semibold px-8 py-3 shadow-lg shadow-primary/20">
                <LogIn className="w-4 h-4 mr-2" /> Login / Sign Up
              </Button>
            </motion.div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading your favorites...</p>
            </div>
          ) : favoriteTools.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-10 h-10 text-red-300/40" />
              </motion.div>
              <p className="text-xl text-muted-foreground font-semibold mb-2">No favorites yet</p>
              <p className="text-sm text-muted-foreground/60 mb-6">Start adding tools to your favorites!</p>
              <Button onClick={() => navigate("/tools")} className="gradient-bg text-primary-foreground rounded-xl font-semibold px-8 py-3 shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 mr-2" /> Browse Tools
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Filters Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search favorites..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="pl-10 bg-card border-border/50 rounded-xl h-11 shadow-sm"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 bg-card border border-border/50 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn("p-2.5 rounded-lg transition-all", viewMode === "grid" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn("p-2.5 rounded-lg transition-all", viewMode === "list" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent")}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {activeCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border",
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                          : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground shadow-sm"
                      )}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      {cat.label}
                      {cat.id !== "all" && (
                        <span className="ml-0.5 opacity-70">
                          ({favoriteTools.filter(t => t.category === cat.id).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Results Info */}
              {filteredTools.length !== favoriteTools.length && (
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredTools.length} of {favoriteTools.length} favorites
                </p>
              )}

              {/* Tools Grid/List */}
              {filteredTools.length === 0 ? (
                <div className="text-center py-16">
                  <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No favorites match your filter</p>
                  <button onClick={() => { setSearch(""); setSelectedCategory("all"); }} className="text-sm text-primary mt-2 hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                      >
                        <Link
                          to={tool.path}
                          className="group relative block rounded-2xl p-5 border border-border/40 transition-all duration-500 overflow-hidden h-full hover:-translate-y-2"
                          style={{
                            background: 'hsl(var(--card))',
                            boxShadow: `0 4px 20px -8px ${tool.color.replace(')', ' / 0.08)')}`
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color.replace(')', ' / 0.05)')}, transparent 70%)` }}
                          />
                          <div className="relative z-10 flex items-start gap-4">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                              style={{
                                backgroundColor: tool.color.replace(')', ' / 0.1)'),
                                color: tool.color,
                                boxShadow: `0 0 0 0 ${tool.color.replace(')', ' / 0)')}`
                              }}
                            >
                              <tool.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                            </div>
                            <FavoriteButton toolId={tool.id} />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: Math.min(index * 0.02, 0.2) }}
                      >
                        <Link
                          to={tool.path}
                          className="group flex items-center gap-4 rounded-xl p-4 border border-border/40 bg-card hover:border-primary/30 hover:shadow-md transition-all"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: tool.color.replace(')', ' / 0.1)'), color: tool.color }}
                          >
                            <tool.icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{tool.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                          </div>
                          <FavoriteButton toolId={tool.id} />
                          <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

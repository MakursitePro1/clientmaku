import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, LogIn, Sparkles } from "lucide-react";
import { tools } from "@/data/tools";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading } = useFavorites();
  const navigate = useNavigate();

  const favoriteTools = useMemo(
    () => tools.filter(t => favorites.includes(t.id)),
    [favorites]
  );

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Favorites — Cyber Venom" description="Your favorite tools collection" path="/favorites" />
      <Navbar />

      <div className="pt-28 pb-20 px-4 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-accent/50 mb-5">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold gradient-text">My Favorites</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Favorite <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your personal collection of most-used tools
            </p>
          </motion.div>

          {!user ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl text-muted-foreground font-semibold mb-2">Login Required</p>
              <p className="text-sm text-muted-foreground/60 mb-6">Please login to save and view your favorite tools</p>
              <Button onClick={() => navigate("/auth")} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
                <LogIn className="w-4 h-4 mr-2" /> Login / Sign Up
              </Button>
            </motion.div>
          ) : loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : favoriteTools.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl text-muted-foreground font-semibold mb-2">No favorites yet</p>
              <p className="text-sm text-muted-foreground/60 mb-6">Start adding tools to your favorites!</p>
              <Button onClick={() => navigate("/tools")} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
                <Sparkles className="w-4 h-4 mr-2" /> Browse Tools
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                >
                  <Link
                    to={tool.path}
                    className="group relative block rounded-2xl p-5 border border-border/40 transition-all duration-500 overflow-hidden h-full hover:-translate-y-2"
                    style={{ background: 'hsl(var(--card))' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }}
                    />
                    <div className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                      style={{ background: `linear-gradient(105deg, transparent 40%, ${tool.color.replace(')', ' / 0.06)')}, transparent 60%)` }}
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
                        <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                      </div>
                      <FavoriteButton toolId={tool.id} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

/* Favorites context provider */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  loading: boolean;
  toggleFavorite: (toolId: string) => Promise<boolean>;
  isFavorite: (toolId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select("tool_id")
      .eq("user_id", user.id);
    if (error) {
      console.error("Fetch favorites error:", error);
    }
    setFavorites(data?.map(f => f.tool_id) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (toolId: string) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return false;
    }
    const isFav = favorites.includes(toolId);
    
    // Optimistic update
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== toolId));
    } else {
      setFavorites(prev => [...prev, toolId]);
    }

    if (isFav) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("tool_id", toolId);
      if (error) {
        setFavorites(prev => [...prev, toolId]); // rollback
        toast.error("Failed to remove favorite");
        return false;
      }
      toast.success("Removed from favorites");
    } else {
      const { error } = await supabase.from("favorites").insert({ user_id: user.id, tool_id: toolId });
      if (error) {
        setFavorites(prev => prev.filter(id => id !== toolId)); // rollback
        toast.error("Failed to add favorite");
        return false;
      }
      toast.success("Added to favorites!");
    }
    return true;
  }, [user, favorites]);

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}

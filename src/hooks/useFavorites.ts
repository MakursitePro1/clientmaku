import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setFavorites([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("favorites")
      .select("tool_id")
      .eq("user_id", user.id);
    setFavorites(data?.map(f => f.tool_id) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggleFavorite = async (toolId: string) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return false;
    }
    const isFav = favorites.includes(toolId);
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("tool_id", toolId);
      setFavorites(prev => prev.filter(id => id !== toolId));
      toast.success("Removed from favorites");
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, tool_id: toolId });
      setFavorites(prev => [...prev, toolId]);
      toast.success("Added to favorites");
    }
    return true;
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, loading, toggleFavorite, isFavorite };
}

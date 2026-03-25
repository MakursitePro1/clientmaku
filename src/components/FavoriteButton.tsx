import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FavoriteButton({ toolId, className }: { toolId: string; className?: string }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const fav = isFavorite(toolId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    await toggleFavorite(toolId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "shrink-0 p-1.5 rounded-lg transition-all duration-300 hover:scale-110",
        fav ? "text-red-500" : "text-muted-foreground/40 hover:text-red-400",
        className
      )}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("w-4 h-4 transition-all", fav && "fill-red-500")} />
    </button>
  );
}

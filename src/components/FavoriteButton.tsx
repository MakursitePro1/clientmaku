import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteButtonProps {
  toolId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ toolId, className, size = "sm" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const fav = isFavorite(toolId);

  const sizeMap = {
    sm: { button: "p-1.5", icon: "w-4 h-4" },
    md: { button: "p-2.5", icon: "w-5 h-5" },
    lg: { button: "p-3.5", icon: "w-6 h-6" },
  };

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
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.2 }}
      className={cn(
        "shrink-0 rounded-xl transition-all duration-300 relative group/fav",
        sizeMap[size].button,
        fav
          ? "text-red-500"
          : "text-muted-foreground/50 hover:text-red-400",
        className
      )}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Glow ring behind icon when active */}
      <AnimatePresence>
        {fav && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 rounded-xl bg-red-500/10 border border-red-500/20"
          />
        )}
      </AnimatePresence>

      {/* Burst particles on favorite */}
      <AnimatePresence>
        {fav && (
          <>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <motion.span
                key={deg}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5],
                  opacity: [1, 0],
                  x: [0, Math.cos((deg * Math.PI) / 180) * 14],
                  y: [0, Math.sin((deg * Math.PI) / 180) * 14],
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-red-400"
                style={{ marginLeft: -2, marginTop: -2 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <Heart
        className={cn(
          sizeMap[size].icon,
          "relative z-10 transition-all duration-300",
          fav && "fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]",
          !fav && "group-hover/fav:drop-shadow-[0_0_4px_rgba(239,68,68,0.3)]"
        )}
      />
    </motion.button>
  );
}

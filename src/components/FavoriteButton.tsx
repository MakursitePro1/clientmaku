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
    sm: { button: "w-9 h-9", icon: "w-4 h-4", ring: "w-10 h-10" },
    md: { button: "w-11 h-11", icon: "w-5 h-5", ring: "w-12 h-12" },
    lg: { button: "w-14 h-14", icon: "w-6 h-6", ring: "w-16 h-16" },
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
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      className={cn(
        "shrink-0 rounded-xl flex items-center justify-center relative transition-all duration-300",
        sizeMap[size].button,
        fav
          ? "bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          : "bg-card/80 border-2 border-border/60 hover:border-red-400/40 hover:bg-red-500/5 shadow-sm",
        className
      )}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Outer glow pulse when active */}
      <AnimatePresence>
        {fav && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-xl border-2 border-red-500/30"
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
                  x: [0, Math.cos((deg * Math.PI) / 180) * 16],
                  y: [0, Math.sin((deg * Math.PI) / 180) * 16],
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-red-400"
                style={{ marginLeft: -3, marginTop: -3 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <Heart
        className={cn(
          sizeMap[size].icon,
          "relative z-10 transition-all duration-300",
          fav
            ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]"
            : "text-muted-foreground/70 group-hover:text-red-400"
        )}
      />
    </motion.button>
  );
}

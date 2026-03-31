import { Crown } from "lucide-react";
import { motion } from "framer-motion";

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold shadow-lg shadow-amber-500/30 ${className}`}
    >
      <Crown className="w-3 h-3" />
      PRO
    </motion.div>
  );
}

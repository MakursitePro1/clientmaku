import { useNavigate } from "react-router-dom";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function PremiumLockOverlay() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 rounded-2xl flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <div className="text-center p-6 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold mb-2">Premium Tool</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This tool requires a premium subscription to access
        </p>
        <Button
          onClick={() => navigate("/pricing")}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>
    </motion.div>
  );
}

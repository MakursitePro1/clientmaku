import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const FlipCoin = () => {
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<("heads" | "tails")[]>([]);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? "heads" : "tails";
      setResult(r);
      setHistory(prev => [r, ...prev].slice(0, 20));
      setFlipping(false);
    }, 800);
  };

  const headsCount = history.filter(h => h === "heads").length;
  const tailsCount = history.filter(h => h === "tails").length;

  return (
    <ToolLayout title="Flip a Coin" description="Virtual coin flipper for quick decisions">
      <div className="max-w-sm mx-auto text-center space-y-8">
        <div className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={result || "none"}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: flipping ? 1800 : 0 }}
              transition={{ duration: 0.8 }}
              className="w-40 h-40 mx-auto rounded-full flex items-center justify-center text-5xl font-extrabold border-4"
              style={{
                background: result === "heads" ? "linear-gradient(135deg, hsl(47, 95%, 55%), hsl(25, 95%, 53%))" : result === "tails" ? "linear-gradient(135deg, hsl(263, 85%, 58%), hsl(290, 90%, 60%))" : "hsl(var(--card))",
                borderColor: result ? "transparent" : "hsl(var(--border))",
                color: result ? "white" : "hsl(var(--muted-foreground))",
              }}>
              {result === "heads" ? "H" : result === "tails" ? "T" : "?"}
            </motion.div>
          </AnimatePresence>
          {result && <p className="text-2xl font-bold mt-4 capitalize gradient-text">{result}!</p>}
        </div>

        <Button onClick={flip} disabled={flipping} className="gradient-bg text-primary-foreground rounded-2xl font-bold px-10 py-6 text-lg">
          {flipping ? "Flipping..." : "Flip Coin"}
        </Button>

        {history.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-center gap-6 text-sm">
              <span>Heads: <strong>{headsCount}</strong></span>
              <span>Tails: <strong>{tailsCount}</strong></span>
              <span>Total: <strong>{history.length}</strong></span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {history.map((h, i) => (
                <span key={i} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${h === "heads" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>
                  {h === "heads" ? "H" : "T"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default FlipCoin;

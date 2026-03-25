import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DiceRoller = () => {
  const [numDice, setNumDice] = useState(1);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<{ dice: number[]; total: number }[]>([]);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const r = Array.from({ length: numDice }, () => Math.floor(Math.random() * sides) + 1);
      setResults(r);
      setHistory(prev => [{ dice: r, total: r.reduce((a, b) => a + b, 0) }, ...prev].slice(0, 10));
      setRolling(false);
    }, 500);
  };

  const total = results.reduce((a, b) => a + b, 0);

  const diceFaces: Record<number, string> = { 1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅" };

  return (
    <ToolLayout title="Dice Roller" description="Roll virtual dice with customizable sides">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="flex gap-4 justify-center">
          <div>
            <label className="text-sm font-semibold mb-1 block">Dice Count</label>
            <select value={numDice} onChange={e => setNumDice(parseInt(e.target.value))} className="rounded-xl bg-card border border-border/50 px-4 py-2.5">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Sides</label>
            <select value={sides} onChange={e => setSides(parseInt(e.target.value))} className="rounded-xl bg-card border border-border/50 px-4 py-2.5">
              {[4,6,8,10,12,20,100].map(n => <option key={n} value={n}>D{n}</option>)}
            </select>
          </div>
        </div>

        <div className="py-6 flex flex-wrap justify-center gap-4">
          {results.map((r, i) => (
            <motion.div key={`${i}-${r}`} initial={{ rotate: 360, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/30 flex items-center justify-center shadow-lg">
              {sides === 6 ? (
                <span className="text-5xl">{diceFaces[r]}</span>
              ) : (
                <span className="text-3xl font-extrabold gradient-text">{r}</span>
              )}
            </motion.div>
          ))}
        </div>

        {results.length > 0 && <p className="text-xl font-bold">Total: <span className="gradient-text text-3xl">{total}</span></p>}

        <Button onClick={roll} disabled={rolling} className="gradient-bg text-primary-foreground rounded-2xl font-bold px-10 py-6 text-lg">
          {rolling ? "Rolling..." : "🎲 Roll Dice"}
        </Button>

        {history.length > 1 && (
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-left">
            <h3 className="font-bold text-sm mb-2">History</h3>
            {history.slice(1).map((h, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-border/20 last:border-0 text-sm">
                <span className="text-muted-foreground">[{h.dice.join(", ")}]</span>
                <span className="font-bold">= {h.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default DiceRoller;

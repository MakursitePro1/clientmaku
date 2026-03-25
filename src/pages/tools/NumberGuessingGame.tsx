import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function NumberGuessingGame() {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState<{ num: number; hint: string }[]>([]);
  const [won, setWon] = useState(false);
  const [range, setRange] = useState(100);

  const newGame = (r = range) => {
    setTarget(Math.floor(Math.random() * r) + 1);
    setHistory([]);
    setGuess("");
    setWon(false);
    setRange(r);
  };

  useEffect(() => { newGame(); }, []);

  const submit = () => {
    const num = parseInt(guess);
    if (isNaN(num)) return;
    if (num === target) {
      setHistory(h => [...h, { num, hint: "🎉 Correct!" }]);
      setWon(true);
    } else {
      const diff = Math.abs(num - target);
      let hint = num > target ? "📉 Too high" : "📈 Too low";
      if (diff <= 3) hint += " (🔥 Very close!)";
      else if (diff <= 10) hint += " (Warm)";
      setHistory(h => [...h, { num, hint }]);
    }
    setGuess("");
  };

  return (
    <ToolLayout title="Number Guessing Game" description="Guess the secret number with hints">
      <div className="space-y-4 max-w-sm mx-auto text-center">
        <div className="flex gap-2 justify-center">
          {[50, 100, 500, 1000].map(r => (
            <Button key={r} onClick={() => newGame(r)} variant={range === r ? "default" : "outline"} size="sm" className="rounded-xl">1-{r}</Button>
          ))}
        </div>
        <p className="text-lg">Guess a number between <span className="font-bold">1</span> and <span className="font-bold">{range}</span></p>
        {!won && (
          <div className="flex gap-2">
            <input value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Your guess..." type="number" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-center" />
            <Button onClick={submit} className="gradient-bg text-primary-foreground rounded-xl">Guess</Button>
          </div>
        )}
        {won && <Button onClick={() => newGame()} className="gradient-bg text-primary-foreground rounded-xl">Play Again</Button>}
        <div className="space-y-1 max-h-48 overflow-auto">
          {[...history].reverse().map((h, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-accent/20 text-sm">
              <span className="font-mono font-bold">{h.num}</span>
              <span>{h.hint}</span>
            </div>
          ))}
        </div>
        {history.length > 0 && !won && <p className="text-sm text-muted-foreground">Attempts: {history.length}</p>}
      </div>
    </ToolLayout>
  );
}

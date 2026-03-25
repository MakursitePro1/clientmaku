import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

const generateRound = () => {
  const correct = randomColor();
  const options = [correct, randomColor(), randomColor(), randomColor(), randomColor(), randomColor()].sort(() => Math.random() - 0.5);
  return { correct, options };
};

export default function ColorGuessingGame() {
  const [round, setRound] = useState(generateRound);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const guess = useCallback((color: string) => {
    setSelected(color);
    if (color === round.correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else setStreak(0);
    setTimeout(() => { setRound(generateRound()); setSelected(null); }, 1000);
  }, [round]);

  return (
    <ToolLayout title="Color Guessing Game" description="Guess the color from the HEX code">
      <div className="space-y-6 max-w-md mx-auto text-center">
        <div className="flex justify-center gap-4">
          <div className="bg-accent/30 rounded-xl px-5 py-3"><p className="text-xs text-muted-foreground">Score</p><p className="text-2xl font-bold">{score}</p></div>
          <div className="bg-accent/30 rounded-xl px-5 py-3"><p className="text-xs text-muted-foreground">Streak</p><p className="text-2xl font-bold text-primary">🔥 {streak}</p></div>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8">
          <p className="text-sm text-muted-foreground mb-2">What color is this?</p>
          <p className="text-3xl font-mono font-bold">{round.correct.toUpperCase()}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {round.options.map((color, i) => (
            <button key={i} onClick={() => !selected && guess(color)}
              className={`aspect-square rounded-2xl border-4 transition-all hover:scale-105 ${
                selected ? (color === round.correct ? "border-green-500 ring-4 ring-green-500/30" : color === selected ? "border-destructive ring-4 ring-destructive/30" : "border-transparent opacity-50") : "border-transparent hover:border-primary/50"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={() => { setScore(0); setStreak(0); setRound(generateRound()); setSelected(null); }}>Reset</Button>
      </div>
    </ToolLayout>
  );
}

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function MemoryGame() {
  const emojis = ["🎮", "🎯", "🎨", "🎭", "🎪", "🎬", "🎤", "🎧"];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const init = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => { init(); }, []);

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (cards[next[0]] === cards[next[1]]) {
        setMatched(m => [...m, ...next]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const won = matched.length === cards.length && cards.length > 0;

  return (
    <ToolLayout title="Memory Card Game" description="Test your memory by matching pairs of cards">
      <div className="space-y-4 max-w-sm mx-auto text-center">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Moves: <span className="font-bold">{moves}</span></span>
          <span className="text-sm text-muted-foreground">Matched: <span className="font-bold">{matched.length / 2}/{emojis.length}</span></span>
          <Button onClick={init} size="sm" variant="outline" className="rounded-xl">New Game</Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, i) => (
            <button key={i} onClick={() => flip(i)}
              className={`h-20 rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
                flipped.includes(i) || matched.includes(i)
                  ? "bg-primary/10 border-primary/30 border-2 scale-95"
                  : "bg-accent/50 border border-border hover:bg-accent/70"
              } ${matched.includes(i) ? "opacity-60" : ""}`}>
              {flipped.includes(i) || matched.includes(i) ? card : "❓"}
            </button>
          ))}
        </div>
        {won && (
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30 text-center">
            <p className="text-2xl font-bold text-green-700">🎉 You Won!</p>
            <p className="text-sm text-muted-foreground">Completed in {moves} moves</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

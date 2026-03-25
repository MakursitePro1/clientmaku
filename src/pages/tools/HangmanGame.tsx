import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const WORDS = ["apple","banana","cherry","delta","elephant","forest","guitar","harbor","island","jungle","kitten","lemon","mango","night","ocean","parrot","queen","river","sunset","tiger","umbrella","violin","whale","xylophone","yellow","zebra"];

export default function HangmanGame() {
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const maxWrong = 6;

  const newGame = () => { setWord(WORDS[Math.floor(Math.random() * WORDS.length)]); setGuessed(new Set()); setWrong(0); };
  useEffect(() => { newGame(); }, []);

  const guess = (l: string) => {
    if (guessed.has(l)) return;
    const ng = new Set(guessed);
    ng.add(l);
    setGuessed(ng);
    if (!word.includes(l)) setWrong(w => w + 1);
  };

  const display = word.split("").map(c => guessed.has(c) ? c : "_").join(" ");
  const won = word && word.split("").every(c => guessed.has(c));
  const lost = wrong >= maxWrong;

  const parts = ["O", "/", "|", "\\", "/", "\\"];
  const body = parts.slice(0, wrong);

  return (
    <ToolLayout title="Hangman Game" description="Classic word guessing game">
      <div className="space-y-5 max-w-md mx-auto text-center">
        <div className="font-mono text-5xl leading-relaxed tracking-[0.5em]">{lost ? word.split("").join(" ") : display}</div>
        <div className="h-32 flex items-center justify-center">
          <pre className="text-2xl font-mono leading-tight">{`  ┌──┐\n  ${body[0]||" "}  │\n ${body[1]||" "}${body[2]||" "}${body[3]||" "} │\n ${body[4]||" "} ${body[5]||" "} │\n ───┘`}</pre>
        </div>
        {(won || lost) ? (
          <div className="space-y-3">
            <p className={`text-2xl font-bold ${won ? "text-green-600" : "text-destructive"}`}>{won ? "🎉 You Won!" : `😵 Game Over! Word: ${word}`}</p>
            <Button onClick={newGame} className="gradient-bg text-primary-foreground rounded-xl">Play Again</Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {"abcdefghijklmnopqrstuvwxyz".split("").map(l => (
              <Button key={l} onClick={() => guess(l)} disabled={guessed.has(l)} size="sm" variant={guessed.has(l) ? (word.includes(l) ? "default" : "destructive") : "outline"} className="w-9 h-9 rounded-lg font-mono uppercase">{l}</Button>
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground">Wrong guesses: {wrong}/{maxWrong}</p>
      </div>
    </ToolLayout>
  );
}

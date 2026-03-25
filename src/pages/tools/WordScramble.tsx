import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const WORDS = [
  "javascript", "programming", "developer", "keyboard", "computer",
  "algorithm", "function", "variable", "database", "framework",
  "interface", "component", "template", "security", "software",
  "internet", "protocol", "network", "browser", "terminal",
];

export default function WordScramble() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const newWord = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    const chars = w.split("");
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    if (chars.join("") === w) chars.reverse();
    setScrambled(chars.join(""));
    setGuess("");
    setResult(null);
    setHint(false);
  };

  useEffect(() => { newWord(); }, []);

  const check = () => {
    if (guess.toLowerCase().trim() === word) {
      setResult("correct");
      setScore(s => s + (hint ? 5 : 10));
      setStreak(s => s + 1);
    } else {
      setResult("wrong");
      setStreak(0);
    }
  };

  return (
    <ToolLayout title="Word Scramble Game" description="Unscramble the letters to find the word">
      <div className="space-y-4 max-w-sm mx-auto text-center">
        <div className="flex justify-between text-sm">
          <span>Score: <span className="font-bold">{score}</span></span>
          <span>🔥 Streak: <span className="font-bold">{streak}</span></span>
        </div>
        <div className="p-6 bg-accent/30 rounded-2xl border border-border">
          <p className="text-4xl font-mono font-bold tracking-[0.3em] uppercase">{scrambled}</p>
          {hint && <p className="text-sm text-muted-foreground mt-2">Hint: Starts with "{word[0]}" and has {word.length} letters</p>}
        </div>
        {!result && (
          <>
            <div className="flex gap-2">
              <input value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} placeholder="Your answer..." className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-center" />
              <Button onClick={check} className="gradient-bg text-primary-foreground rounded-xl">Check</Button>
            </div>
            <Button onClick={() => setHint(true)} variant="outline" size="sm" className="rounded-xl" disabled={hint}>💡 Hint (-5 pts)</Button>
          </>
        )}
        {result && (
          <div className="space-y-2">
            <p className={`text-xl font-bold ${result === "correct" ? "text-green-700" : "text-destructive"}`}>
              {result === "correct" ? "🎉 Correct!" : `❌ Wrong! The word was "${word}"`}
            </p>
            <Button onClick={newWord} className="gradient-bg text-primary-foreground rounded-xl">Next Word</Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

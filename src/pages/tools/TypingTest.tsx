import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do.",
  "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower.",
  "The only way to do great work is to love what you do. Code is like humor, when you have to explain it, it is bad.",
];

export default function TypingTest() {
  const [text] = useState(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    setInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    if (val.length >= text.length) {
      setFinished(true);
      const elapsed = (Date.now() - startTime) / 60000;
      const words = text.split(" ").length;
      setWpm(Math.round(words / elapsed));
    }
  };

  const reset = () => {
    setInput("");
    setStarted(false);
    setFinished(false);
    setWpm(0);
    setAccuracy(100);
  };

  return (
    <ToolLayout title="Typing Test" description="Test your typing speed and accuracy">
      <div className="space-y-6">
        <div className="bg-accent/50 rounded-2xl p-6 font-mono text-base leading-relaxed">
          {text.split("").map((char, i) => {
            let color = "text-muted-foreground";
            if (i < input.length) {
              color = input[i] === char ? "text-green-600" : "text-red-500 bg-red-100";
            }
            if (i === input.length) color = "text-foreground underline";
            return <span key={i} className={color}>{char}</span>;
          })}
        </div>
        <textarea
          value={input}
          onChange={handleInput}
          disabled={finished}
          placeholder="Start typing here..."
          className="w-full rounded-xl border border-border bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={4}
        />
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-accent/50 rounded-2xl p-5 text-center">
            <div className="text-sm text-muted-foreground mb-1">WPM</div>
            <div className="text-3xl font-extrabold text-primary">{finished ? wpm : "—"}</div>
          </div>
          <div className="bg-accent/50 rounded-2xl p-5 text-center">
            <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
            <div className="text-3xl font-extrabold text-primary">{accuracy}%</div>
          </div>
          <div className="bg-accent/50 rounded-2xl p-5 text-center">
            <div className="text-sm text-muted-foreground mb-1">Progress</div>
            <div className="text-3xl font-extrabold text-primary">{Math.min(Math.round((input.length / text.length) * 100), 100)}%</div>
          </div>
        </div>
        <Button onClick={reset} variant="outline" className="rounded-xl">Reset</Button>
      </div>
    </ToolLayout>
  );
}

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ops = ["+", "-", "×"] as const;

const genQ = () => {
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; }
  else if (op === "-") { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a); answer = a - b; }
  else { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
  return { a, b, op, answer, text: `${a} ${op} ${b} = ?` };
};

export default function MathQuizGame() {
  const [q, setQ] = useState(genQ);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const submit = useCallback(() => {
    const ans = parseInt(input);
    if (isNaN(ans)) return;
    setTotal(t => t + 1);
    if (ans === q.answer) {
      setScore(s => s + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Answer: ${q.answer}`);
    }
    setTimeout(() => { setQ(genQ()); setInput(""); setFeedback(null); }, 1200);
  }, [input, q]);

  return (
    <ToolLayout title="Math Quiz Game" description="Test your mental math skills">
      <div className="space-y-6 max-w-sm mx-auto text-center">
        <div className="flex justify-center gap-4">
          <div className="bg-green-500/10 rounded-xl px-5 py-3 border border-green-500/20"><p className="text-xs text-muted-foreground">Correct</p><p className="text-2xl font-bold text-green-600">{score}</p></div>
          <div className="bg-accent/30 rounded-xl px-5 py-3"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">{total}</p></div>
          <div className="bg-primary/10 rounded-xl px-5 py-3 border border-primary/20"><p className="text-xs text-muted-foreground">Accuracy</p><p className="text-2xl font-bold text-primary">{total > 0 ? Math.round((score / total) * 100) : 0}%</p></div>
        </div>
        <div className="bg-accent/50 rounded-2xl p-8">
          <p className="text-4xl font-bold font-mono">{q.text}</p>
        </div>
        {feedback && <p className={`text-lg font-bold ${feedback.startsWith("✅") ? "text-green-600" : "text-destructive"}`}>{feedback}</p>}
        <div className="flex gap-3">
          <Input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Your answer" className="rounded-xl text-center text-xl" autoFocus />
          <Button onClick={submit} className="gradient-bg text-primary-foreground rounded-xl px-8">Submit</Button>
        </div>
        <Button variant="ghost" onClick={() => { setScore(0); setTotal(0); setQ(genQ()); setInput(""); setFeedback(null); }}>Reset</Button>
      </div>
    </ToolLayout>
  );
}

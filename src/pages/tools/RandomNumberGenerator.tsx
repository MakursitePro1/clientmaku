import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Shuffle } from "lucide-react";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [results, setResults] = useState<number[]>([]);
  const [unique, setUnique] = useState(false);

  const generate = () => {
    const lo = parseInt(min), hi = parseInt(max), n = parseInt(count);
    if (isNaN(lo) || isNaN(hi) || isNaN(n) || lo >= hi || n < 1) {
      toast({ title: "Invalid range", variant: "destructive" }); return;
    }
    if (unique && n > (hi - lo + 1)) {
      toast({ title: "Cannot generate that many unique numbers in range", variant: "destructive" }); return;
    }
    if (unique) {
      const set = new Set<number>();
      while (set.size < n) set.add(Math.floor(Math.random() * (hi - lo + 1)) + lo);
      setResults(Array.from(set));
    } else {
      setResults(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo));
    }
  };

  const copy = () => { navigator.clipboard.writeText(results.join(", ")); toast({ title: "Copied!" }); };

  return (
    <ToolLayout title="Random Number Generator" description="Generate random numbers within a custom range">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="text-sm font-semibold mb-1 block">Min</label>
            <Input type="number" value={min} onChange={e => setMin(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Max</label>
            <Input type="number" value={max} onChange={e => setMax(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Count</label>
            <Input type="number" min="1" max="1000" value={count} onChange={e => setCount(e.target.value)} className="rounded-xl bg-card border-border/50" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} className="accent-primary" /> Unique numbers only
        </label>
        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2"><Shuffle className="w-4 h-4" /> Generate</Button>
          {results.length > 0 && <Button variant="outline" onClick={copy} className="rounded-xl gap-2"><Copy className="w-4 h-4" /> Copy</Button>}
        </div>
        {results.length > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-accent/50 font-bold text-lg gradient-text">{n}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default RandomNumberGenerator;

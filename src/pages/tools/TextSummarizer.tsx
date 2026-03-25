import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextSummarizer() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [ratio, setRatio] = useState(30);

  const summarize = () => {
    const sentences = input.match(/[^.!?]+[.!?]+/g) || [input];
    const wordFreq: Record<string, number> = {};
    const words = input.toLowerCase().match(/\b\w+\b/g) || [];
    const stopWords = new Set(["the","a","an","is","are","was","were","in","on","at","to","for","of","and","or","but","this","that","it","i","you","he","she","we","they","with","from","by","as","be","has","had","have","not","do","does","did"]);
    words.forEach(w => { if (!stopWords.has(w) && w.length > 2) wordFreq[w] = (wordFreq[w] || 0) + 1; });

    const scored = sentences.map(s => {
      const sWords = s.toLowerCase().match(/\b\w+\b/g) || [];
      const sw: string[] = sWords as string[];
      const score = sw.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) / Math.max(sw.length, 1);
      return { sentence: s.trim(), score };
    });

    const count = Math.max(1, Math.round(sentences.length * ratio / 100));
    const top = scored.sort((a, b) => b.score - a.score).slice(0, count);
    const ordered = sentences.filter(s => top.some(t => t.sentence === s.trim()));
    setSummary(ordered.join(" "));
  };

  const copy = () => { navigator.clipboard.writeText(summary); toast.success("Copied!"); };

  return (
    <ToolLayout title="Text Summarizer" description="Summarize long texts by extracting key sentences">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your text here..." className="min-h-[150px] rounded-xl" />
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground whitespace-nowrap">Summary length: {ratio}%</label>
          <input type="range" min={10} max={80} value={ratio} onChange={e => setRatio(+e.target.value)} className="flex-1" />
        </div>
        <Button onClick={summarize} disabled={!input.trim()} className="gradient-bg text-primary-foreground rounded-xl w-full">Summarize</Button>
        {summary && (
          <div className="p-4 bg-accent/30 rounded-xl border border-border">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Summary ({summary.split(/\s+/).length} words)</p>
              <Button onClick={copy} size="sm" variant="outline" className="rounded-xl">Copy</Button>
            </div>
            <p className="text-sm leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

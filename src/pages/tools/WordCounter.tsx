import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";

const WordCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Characters (no spaces)", value: stats.charsNoSpace },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: `${stats.readingTime} min` },
    { label: "Speaking Time", value: `${stats.speakingTime} min` },
  ];

  return (
    <ToolLayout title="Word Counter" description="Count words, characters, sentences, and estimate reading time">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border/50 p-4 text-center">
              <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px] rounded-xl bg-card border-border/50 resize-none text-base"
          placeholder="Start typing or paste your text here..."
        />
      </div>
    </ToolLayout>
  );
};

export default WordCounter;

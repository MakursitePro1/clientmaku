import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FileText, Hash, Clock, AlignLeft, Type, BarChart3, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const speakTime = Math.max(1, Math.ceil(words / 130));
    const lines = text ? text.split("\n").length : 0;
    const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : "0";
    const longestWord = text.trim() ? text.split(/\s+/).sort((a, b) => b.length - a.length)[0] || "" : "";
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/).filter(Boolean)).size;
    
    // Top 5 words
    const wordFreq: Record<string, number> = {};
    text.toLowerCase().split(/\s+/).filter(w => w.length > 2).forEach(w => {
      const clean = w.replace(/[^a-zA-Z0-9]/g, "");
      if (clean) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    });
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { words, chars, charsNoSpace, sentences, paragraphs, readTime, speakTime, lines, avgWordLen, longestWord, uniqueWords, topWords };
  }, [text]);

  return (
    <ToolLayout title="Word Counter" description="Count words, characters, sentences, and more with detailed text analysis">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="tool-section-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold gradient-text">Enter Your Text</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
              <button onClick={() => setText("")} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }}><Trash2 className="w-3 h-3" /> Clear</button>
            </div>
          </div>
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start typing or paste your text here..." className="tool-input-colorful rounded-xl min-h-[180px] resize-y" />
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Hash, label: "Words", value: stats.words, color: "text-primary" },
            { icon: Type, label: "Characters", value: stats.chars, color: "text-blue-500" },
            { icon: AlignLeft, label: "Sentences", value: stats.sentences, color: "text-green-500" },
            { icon: Clock, label: "Read Time", value: `${stats.readTime}m`, color: "text-orange-500" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="tool-stat-card">
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <div className="stat-value text-xl">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div className="tool-section-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Detailed Analysis</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Characters (no spaces)", value: stats.charsNoSpace },
              { label: "Paragraphs", value: stats.paragraphs },
              { label: "Lines", value: stats.lines },
              { label: "Speak Time", value: `${stats.speakTime} min` },
              { label: "Avg Word Length", value: stats.avgWordLen },
              { label: "Unique Words", value: stats.uniqueWords },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">{s.label}</p>
                <p className="font-bold text-lg mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Words */}
        {stats.topWords.length > 0 && (
          <div className="tool-section-card p-4">
            <h3 className="text-sm font-bold gradient-text mb-3">🔥 Top Words</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topWords.map(([word, count], i) => (
                <span key={i} className="tool-badge text-xs">
                  {word} <span className="text-primary font-bold ml-1">×{count}</span>
                </span>
              ))}
            </div>
            {stats.longestWord && (
              <p className="text-xs text-muted-foreground mt-3">Longest word: <span className="font-bold text-foreground">{stats.longestWord}</span> ({stats.longestWord.length} chars)</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

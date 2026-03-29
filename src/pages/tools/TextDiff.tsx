import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Diff, Copy, ArrowRightLeft } from "lucide-react";

export default function TextDiff() {
  const [text1, setText1] = useState("Hello World\nThis is the original text.\nLine three.");
  const [text2, setText2] = useState("Hello World\nThis is the modified text.\nLine three.\nNew line added.");

  const diff = useMemo(() => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLen = Math.max(lines1.length, lines2.length);
    const result: { line: number; type: "same" | "added" | "removed" | "changed"; left: string; right: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l = lines1[i] ?? "";
      const r = lines2[i] ?? "";
      if (l === r) result.push({ line: i + 1, type: "same", left: l, right: r });
      else if (!l && r) result.push({ line: i + 1, type: "added", left: "", right: r });
      else if (l && !r) result.push({ line: i + 1, type: "removed", left: l, right: "" });
      else result.push({ line: i + 1, type: "changed", left: l, right: r });
    }
    return result;
  }, [text1, text2]);

  const stats = {
    same: diff.filter(d => d.type === "same").length,
    added: diff.filter(d => d.type === "added").length,
    removed: diff.filter(d => d.type === "removed").length,
    changed: diff.filter(d => d.type === "changed").length,
  };

  const typeColors = { same: "", added: "bg-green-500/10 border-l-4 border-green-500", removed: "bg-red-500/10 border-l-4 border-red-500", changed: "bg-yellow-500/10 border-l-4 border-yellow-500" };

  return (
    <ToolLayout title="Text Diff Checker" description="Compare two texts side-by-side and find differences instantly">
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="tool-section-card p-4">
            <h3 className="text-sm font-bold gradient-text mb-2">📄 Original Text</h3>
            <Textarea value={text1} onChange={e => setText1(e.target.value)} className="tool-input-colorful rounded-xl min-h-[150px] font-mono text-xs" />
          </div>
          <div className="tool-section-card p-4">
            <h3 className="text-sm font-bold gradient-text mb-2">📝 Modified Text</h3>
            <Textarea value={text2} onChange={e => setText2(e.target.value)} className="tool-input-colorful rounded-xl min-h-[150px] font-mono text-xs" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { const t = text1; setText1(text2); setText2(t); }} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <ArrowRightLeft className="w-4 h-4" /> Swap Texts
          </button>
          <button onClick={() => { setText1(""); setText2(""); }} className="tool-btn-primary px-5 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }}>
            Clear Both
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="tool-stat-card"><div className="stat-value text-lg text-green-500">{stats.same}</div><div className="stat-label">Same</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg text-blue-500">{stats.added}</div><div className="stat-label">Added</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg text-red-500">{stats.removed}</div><div className="stat-label">Removed</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg text-yellow-500">{stats.changed}</div><div className="stat-label">Changed</div></div>
        </div>

        {/* Diff Output */}
        <div className="tool-section-card overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10">
            <span className="text-xs font-bold gradient-text"><Diff className="w-3.5 h-3.5 inline mr-1" /> Diff Result ({diff.length} lines)</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border/20">
            {diff.map(d => (
              <div key={d.line} className={`flex text-xs font-mono ${typeColors[d.type]}`}>
                <span className="w-8 text-center text-muted-foreground/50 py-2 shrink-0">{d.line}</span>
                <div className="flex-1 grid grid-cols-2 divide-x divide-border/20">
                  <span className={`px-3 py-2 ${d.type === "removed" || d.type === "changed" ? "text-red-600 line-through" : ""}`}>{d.left}</span>
                  <span className={`px-3 py-2 ${d.type === "added" || d.type === "changed" ? "text-green-600 font-semibold" : ""}`}>{d.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Key, Copy, RefreshCw, History, Trash2 } from "lucide-react";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<"standard" | "uppercase" | "no-dash">("standard");
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const newUuids = Array.from({ length: count }, generateUUID).map(u => {
      if (format === "uppercase") return u.toUpperCase();
      if (format === "no-dash") return u.replace(/-/g, "");
      return u;
    });
    setUuids(newUuids);
    setHistory(prev => [...newUuids, ...prev].slice(0, 50));
  }, [count, format]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    toast.success(`${uuids.length} UUID(s) copied!`);
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate random UUID v4 strings for your applications">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Controls */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Settings</h3>
          </div>
          <div className="flex gap-2">
            {(["standard", "uppercase", "no-dash"] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${format === f ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {f === "no-dash" ? "No Dashes" : f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Count:</span>
            <input type="range" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} className="flex-1 accent-primary" />
            <span className="font-bold text-sm w-8 text-center">{count}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={generate} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <RefreshCw className="w-4 h-4" /> Generate
          </button>
          <button onClick={copyAll} className="tool-btn-primary px-5 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%))" }}>
            <Copy className="w-4 h-4" /> Copy All
          </button>
        </div>

        {/* Results */}
        <div className="tool-result-card">
          <h3 className="text-sm font-bold gradient-text mb-3">🔑 Generated UUIDs</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {uuids.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group">
                <span className="font-mono text-sm font-bold flex-1 break-all select-all">{u}</span>
                <button onClick={() => { navigator.clipboard.writeText(u); toast.success("Copied!"); }} className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{uuids.length}</div>
            <div className="stat-label">Generated</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{history.length}</div>
            <div className="stat-label">Total History</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">v4</div>
            <div className="stat-label">Version</div>
          </div>
        </div>

        {/* History */}
        {history.length > uuids.length && (
          <div className="tool-section-card overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center justify-between">
              <span className="text-xs font-bold gradient-text"><History className="w-3.5 h-3.5 inline mr-1" /> History ({history.length})</span>
              <button onClick={() => { setHistory([]); toast.success("Cleared!"); }} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Clear</button>
            </div>
            <div className="divide-y divide-border/20 max-h-32 overflow-y-auto">
              {history.slice(uuids.length, uuids.length + 10).map((u, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-primary/5">
                  <span className="font-mono truncate flex-1">{u}</span>
                  <button onClick={() => { navigator.clipboard.writeText(u); toast.success("Copied!"); }} className="text-muted-foreground hover:text-primary"><Copy className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

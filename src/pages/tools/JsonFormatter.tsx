import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Braces, Copy, Trash2, CheckCircle2, AlertCircle, Minimize2, Maximize2 } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "skills": ["JavaScript", "React", "Node.js"],\n  "address": {\n    "city": "New York",\n    "country": "USA"\n  }\n}');
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!input.trim()) return { valid: true, output: "", error: "", stats: null };
    try {
      const parsed = JSON.parse(input);
      const output = JSON.stringify(parsed, null, indent);
      const keys = new Set<string>();
      const countKeys = (obj: any) => {
        if (typeof obj === "object" && obj !== null) {
          if (Array.isArray(obj)) obj.forEach(countKeys);
          else Object.keys(obj).forEach(k => { keys.add(k); countKeys(obj[k]); });
        }
      };
      countKeys(parsed);
      const depth = (obj: any): number => {
        if (typeof obj !== "object" || obj === null) return 0;
        if (Array.isArray(obj)) return 1 + Math.max(0, ...obj.map(depth));
        return 1 + Math.max(0, ...Object.values(obj).map(depth));
      };
      return {
        valid: true, output, error: "",
        stats: { keys: keys.size, depth: depth(parsed), size: new Blob([output]).size, isArray: Array.isArray(parsed) }
      };
    } catch (e: any) {
      return { valid: false, output: "", error: e.message, stats: null };
    }
  }, [input, indent]);

  const minify = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input)));
      toast.success("Minified!");
    } catch { toast.error("Invalid JSON"); }
  };

  const prettify = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input), null, indent));
      toast.success("Formatted!");
    } catch { toast.error("Invalid JSON"); }
  };

  return (
    <ToolLayout title="JSON Formatter" description="Format, validate, minify, and analyze JSON data instantly">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`tool-result-card flex items-center gap-3 ${result.valid ? "" : "border-destructive/30"}`}>
          {result.valid ? (
            <><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="font-bold text-sm text-green-600">Valid JSON ✓</span></>
          ) : (
            <><AlertCircle className="w-5 h-5 text-destructive" /><span className="font-bold text-sm text-destructive">Invalid: {result.error}</span></>
          )}
        </motion.div>

        {/* Input */}
        <div className="tool-section-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Braces className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold gradient-text">JSON Input</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={prettify} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Format</button>
              <button onClick={minify} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1" style={{ background: "linear-gradient(135deg, hsl(30 90% 50%), hsl(30 90% 40%))" }}><Minimize2 className="w-3 h-3" /> Minify</button>
              <button onClick={() => setInput("")} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }}><Trash2 className="w-3 h-3" /> Clear</button>
            </div>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="tool-input-colorful rounded-xl font-mono text-xs min-h-[200px] resize-y" />
        </div>

        {/* Indent Control */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Indent:</span>
          {[2, 4, 8].map(n => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${indent === n ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 hover:bg-primary/20"}`}>
              {n} spaces
            </button>
          ))}
          <button onClick={() => setIndent(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${indent === 0 ? "bg-primary text-primary-foreground shadow-md" : "bg-primary/10 hover:bg-primary/20"}`}>
            Tab
          </button>
        </div>

        {/* Stats */}
        {result.stats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="tool-stat-card">
              <Braces className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="stat-value text-lg">{result.stats.keys}</div>
              <div className="stat-label">Keys</div>
            </div>
            <div className="tool-stat-card">
              <div className="stat-value text-lg">{result.stats.depth}</div>
              <div className="stat-label">Depth</div>
            </div>
            <div className="tool-stat-card">
              <div className="stat-value text-lg">{result.stats.size}B</div>
              <div className="stat-label">Size</div>
            </div>
            <div className="tool-stat-card">
              <div className="stat-value text-lg">{result.stats.isArray ? "Array" : "Object"}</div>
              <div className="stat-label">Type</div>
            </div>
          </div>
        )}

        {/* Output */}
        {result.output && (
          <div className="tool-section-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold gradient-text">📋 Formatted Output</h3>
              <button onClick={() => { navigator.clipboard.writeText(result.output); toast.success("Copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="p-4 bg-primary/5 rounded-xl border border-primary/10 overflow-x-auto text-xs font-mono max-h-[300px] overflow-y-auto">{result.output}</pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

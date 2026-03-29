import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Code, Copy, ArrowDownUp, Trash2 } from "lucide-react";

function htmlEncode(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlDecode(str: string): string {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return doc.documentElement.textContent || "";
}

function urlEncode(str: string): string { return encodeURIComponent(str); }
function urlDecode(str: string): string { try { return decodeURIComponent(str); } catch { return str; } }

export default function TextEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encType, setEncType] = useState<"html" | "url" | "unicode" | "binary">("html");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    if (!input.trim()) { toast.error("Enter text first"); return; }
    let result = "";
    if (encType === "html") result = mode === "encode" ? htmlEncode(input) : htmlDecode(input);
    else if (encType === "url") result = mode === "encode" ? urlEncode(input) : urlDecode(input);
    else if (encType === "unicode") {
      if (mode === "encode") result = Array.from(input).map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
      else result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    } else if (encType === "binary") {
      if (mode === "encode") result = Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
      else result = input.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
    }
    setOutput(result);
    toast.success(mode === "encode" ? "Encoded!" : "Decoded!");
  };

  return (
    <ToolLayout title="Text Encoder/Decoder" description="Encode & decode text in HTML, URL, Unicode, and Binary formats">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Type */}
        <div className="tool-section-card p-4 space-y-3">
          <h3 className="text-sm font-bold gradient-text">Encoding Type</h3>
          <div className="grid grid-cols-4 gap-2">
            {(["html", "url", "unicode", "binary"] as const).map(t => (
              <button key={t} onClick={() => setEncType(t)}
                className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${encType === t ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["encode", "decode"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${mode === m ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {m === "encode" ? "🔒 Encode" : "🔓 Decode"}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-2">Input</h3>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="tool-input-colorful rounded-xl min-h-[100px] font-mono text-sm" placeholder="Enter text..." />
        </div>

        <div className="flex gap-3">
          <button onClick={process} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <Code className="w-4 h-4" /> {mode === "encode" ? "Encode" : "Decode"}
          </button>
          <button onClick={() => { setInput(output); setOutput(""); setMode(mode === "encode" ? "decode" : "encode"); }} className="tool-btn-primary px-4 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(270 80% 50%))" }}>
            <ArrowDownUp className="w-4 h-4" /> Swap
          </button>
        </div>

        {output && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tool-result-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold gradient-text">Output</h3>
              <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-mono text-sm break-all whitespace-pre-wrap">{output}</pre>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card"><div className="stat-value text-lg">{input.length}</div><div className="stat-label">Input</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg">{output.length}</div><div className="stat-label">Output</div></div>
          <div className="tool-stat-card"><div className="stat-value text-lg uppercase">{encType}</div><div className="stat-label">Type</div></div>
        </div>
      </div>
    </ToolLayout>
  );
}

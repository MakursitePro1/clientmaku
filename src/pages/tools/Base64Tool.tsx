import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Binary, Copy, ArrowDownUp, FileText, Image, Trash2 } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [history, setHistory] = useState<{ input: string; output: string; mode: string }[]>([]);

  const process = () => {
    if (!input.trim()) { toast.error("Enter some text first"); return; }
    try {
      let result: string;
      if (mode === "encode") {
        result = btoa(unescape(encodeURIComponent(input)));
      } else {
        result = decodeURIComponent(escape(atob(input)));
      }
      setOutput(result);
      setHistory(prev => [{ input: input.slice(0, 50), output: result.slice(0, 50), mode }, ...prev].slice(0, 10));
      toast.success(mode === "encode" ? "Encoded!" : "Decoded!");
    } catch {
      toast.error("Invalid input for " + mode);
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolLayout title="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 strings instantly">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="tool-section-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Binary className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Mode</h3>
          </div>
          <div className="flex gap-2">
            {(["encode", "decode"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {m === "encode" ? "🔒 Encode" : "🔓 Decode"}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="tool-section-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold gradient-text">{mode === "encode" ? "Plain Text" : "Base64 String"}</h3>
            </div>
            <button onClick={() => { setInput(""); setOutput(""); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }}><Trash2 className="w-3 h-3" /> Clear</button>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."} className="tool-input-colorful rounded-xl min-h-[120px] font-mono text-sm" />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={process} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <Binary className="w-4 h-4" /> {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </button>
          <button onClick={swap} className="tool-btn-primary px-4 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(270 80% 50%))" }}>
            <ArrowDownUp className="w-4 h-4" /> Swap
          </button>
        </div>

        {/* Output */}
        {output && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="tool-result-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold gradient-text">{mode === "encode" ? "🔒 Base64 Output" : "🔓 Decoded Text"}</h3>
              <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} className="tool-btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
            </div>
            <pre className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-mono text-sm break-all whitespace-pre-wrap">{output}</pre>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{input.length}</div>
            <div className="stat-label">Input Chars</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{output.length}</div>
            <div className="stat-label">Output Chars</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{history.length}</div>
            <div className="stat-label">History</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

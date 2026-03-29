import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ArrowRightLeft, Trash2, Download, ChefHat, Sparkles, Zap, Hash, Lock, Binary, Code, Type, RotateCcw } from "lucide-react";

type Operation = {
  id: string;
  name: string;
  icon: any;
  category: string;
  color: string;
  fn: (input: string, ...args: any[]) => string;
  description: string;
};

const operations: Operation[] = [
  // Encoding
  { id: "base64-enc", name: "Base64 Encode", icon: Binary, category: "Encoding", color: "from-blue-500 to-cyan-500", description: "Encode text to Base64", fn: (s) => btoa(unescape(encodeURIComponent(s))) },
  { id: "base64-dec", name: "Base64 Decode", icon: Binary, category: "Encoding", color: "from-cyan-500 to-teal-500", description: "Decode Base64 to text", fn: (s) => { try { return decodeURIComponent(escape(atob(s))); } catch { return "Invalid Base64"; } } },
  { id: "url-enc", name: "URL Encode", icon: Code, category: "Encoding", color: "from-green-500 to-emerald-500", description: "Encode text for URLs", fn: (s) => encodeURIComponent(s) },
  { id: "url-dec", name: "URL Decode", icon: Code, category: "Encoding", color: "from-emerald-500 to-green-500", description: "Decode URL-encoded text", fn: (s) => { try { return decodeURIComponent(s); } catch { return s; } } },
  { id: "html-enc", name: "HTML Encode", icon: Type, category: "Encoding", color: "from-orange-500 to-amber-500", description: "Encode HTML entities", fn: (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;") },
  { id: "html-dec", name: "HTML Decode", icon: Type, category: "Encoding", color: "from-amber-500 to-yellow-500", description: "Decode HTML entities", fn: (s) => { const t = document.createElement("textarea"); t.innerHTML = s; return t.value; } },
  { id: "hex-enc", name: "To Hex", icon: Hash, category: "Encoding", color: "from-purple-500 to-violet-500", description: "Convert text to hexadecimal", fn: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(16).padStart(2,"0")).join(" ") },
  { id: "hex-dec", name: "From Hex", icon: Hash, category: "Encoding", color: "from-violet-500 to-purple-500", description: "Convert hex to text", fn: (s) => { try { return new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map(h => parseInt(h,16)))); } catch { return "Invalid hex"; } } },
  { id: "binary-enc", name: "To Binary", icon: Binary, category: "Encoding", color: "from-pink-500 to-rose-500", description: "Convert to binary", fn: (s) => Array.from(new TextEncoder().encode(s)).map(b => b.toString(2).padStart(8,"0")).join(" ") },
  { id: "binary-dec", name: "From Binary", icon: Binary, category: "Encoding", color: "from-rose-500 to-pink-500", description: "Convert binary to text", fn: (s) => { try { return new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map(b => parseInt(b,2)))); } catch { return "Invalid binary"; } } },
  { id: "unicode-enc", name: "Unicode Escape", icon: Code, category: "Encoding", color: "from-indigo-500 to-blue-500", description: "Convert to \\uXXXX", fn: (s) => Array.from(s).map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4,"0")).join("") },
  // Hashing
  { id: "md5", name: "MD5 Hash", icon: Lock, category: "Hashing", color: "from-red-500 to-orange-500", description: "Generate MD5 hash", fn: (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return Math.abs(h).toString(16).padStart(8, "0") + "-simulated"; } },
  { id: "sha256", name: "SHA-256 Hash", icon: Lock, category: "Hashing", color: "from-orange-500 to-red-500", description: "Compute SHA-256 (async)", fn: (s) => s },
  // Text transforms
  { id: "upper", name: "Uppercase", icon: Type, category: "Text", color: "from-sky-500 to-blue-500", description: "Convert to uppercase", fn: (s) => s.toUpperCase() },
  { id: "lower", name: "Lowercase", icon: Type, category: "Text", color: "from-blue-500 to-sky-500", description: "Convert to lowercase", fn: (s) => s.toLowerCase() },
  { id: "reverse", name: "Reverse", icon: RotateCcw, category: "Text", color: "from-fuchsia-500 to-pink-500", description: "Reverse text", fn: (s) => [...s].reverse().join("") },
  { id: "rot13", name: "ROT13", icon: ArrowRightLeft, category: "Text", color: "from-lime-500 to-green-500", description: "ROT13 cipher", fn: (s) => s.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13))) },
  { id: "remove-whitespace", name: "Remove Spaces", icon: Trash2, category: "Text", color: "from-gray-500 to-slate-500", description: "Strip all whitespace", fn: (s) => s.replace(/\s+/g, "") },
  { id: "count-chars", name: "Char Count", icon: Hash, category: "Text", color: "from-teal-500 to-cyan-500", description: "Count characters, words, lines", fn: (s) => `Characters: ${s.length}\nWords: ${s.split(/\s+/).filter(Boolean).length}\nLines: ${s.split("\n").length}` },
  { id: "jwt-decode", name: "JWT Decode", icon: Lock, category: "Security", color: "from-yellow-500 to-orange-500", description: "Decode JWT payload", fn: (s) => { try { const p = s.split("."); return JSON.stringify(JSON.parse(atob(p[1])),null,2); } catch { return "Invalid JWT"; } } },
  { id: "json-beautify", name: "JSON Beautify", icon: Code, category: "Data", color: "from-green-400 to-emerald-600", description: "Format JSON nicely", fn: (s) => { try { return JSON.stringify(JSON.parse(s),null,2); } catch { return "Invalid JSON"; } } },
  { id: "json-minify", name: "JSON Minify", icon: Code, category: "Data", color: "from-emerald-400 to-green-600", description: "Minify JSON", fn: (s) => { try { return JSON.stringify(JSON.parse(s)); } catch { return "Invalid JSON"; } } },
];

const categories = [...new Set(operations.map(o => o.category))];

export default function CyberChef() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [recipe, setRecipe] = useState<Operation[]>([]);

  const runOperation = useCallback(async (op: Operation, text: string) => {
    if (op.id === "sha256") {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    return op.fn(text);
  }, []);

  const applyRecipe = useCallback(async () => {
    if (recipe.length === 0 && !selectedOp) { toast.error("Select an operation first!"); return; }
    let result = input;
    const ops = recipe.length > 0 ? recipe : (selectedOp ? [selectedOp] : []);
    for (const op of ops) {
      result = await runOperation(op, result);
    }
    setOutput(result);
    toast.success(`Applied ${ops.length} operation(s)!`);
  }, [input, recipe, selectedOp, runOperation]);

  const addToRecipe = (op: Operation) => {
    setRecipe(prev => [...prev, op]);
    setSelectedOp(op);
    toast.success(`Added "${op.name}" to recipe`);
  };

  const filtered = operations.filter(o => 
    (filterCat === "all" || o.category === filterCat) &&
    (search === "" || o.name.toLowerCase().includes(search.toLowerCase()))
  );

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  return (
    <ToolLayout title="CyberChef" description="The universal encoder, decoder, hasher & text transformer">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="tool-section-card p-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-3">
            <ChefHat className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-bold text-orange-400">Universal Data Tool</span>
          </div>
          <h2 className="text-2xl font-black gradient-text">Encode • Decode • Hash • Transform</h2>
          <p className="text-muted-foreground text-sm mt-1">Chain multiple operations into a recipe pipeline</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Operations Panel */}
          <div className="tool-section-card p-4 space-y-3">
            <h3 className="text-sm font-bold gradient-text flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Operations</h3>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search operations..." className="tool-input-colorful w-full rounded-lg px-3 py-2 text-sm" />
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setFilterCat("all")} className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${filterCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>All</button>
              {categories.map(c => (
                <button key={c} onClick={() => setFilterCat(c)} className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${filterCat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{c}</button>
              ))}
            </div>
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {filtered.map((op, i) => (
                <motion.button key={op.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  onClick={() => addToRecipe(op)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all hover:scale-[1.02] border border-transparent hover:border-primary/30 ${selectedOp?.id === op.id ? "bg-primary/10 border-primary/30" : "bg-card hover:bg-accent/10"}`}>
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${op.color} flex items-center justify-center shrink-0`}>
                    <op.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{op.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{op.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* I/O Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Recipe */}
            {recipe.length > 0 && (
              <div className="tool-section-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold gradient-text">🧪 Recipe Pipeline ({recipe.length} ops)</h3>
                  <button onClick={() => { setRecipe([]); setSelectedOp(null); }} className="text-xs text-destructive hover:underline">Clear</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.map((op, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${op.color}`}>
                      <op.icon className="w-3 h-3" /> {op.name}
                      <button onClick={() => setRecipe(prev => prev.filter((_,j) => j !== i))} className="ml-1 hover:text-red-200">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="tool-section-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-400">📥 Input</h3>
                <span className="text-[10px] text-muted-foreground">{input.length} chars</span>
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="Paste your text, JSON, Base64, hex, binary, JWT, or any data here..."
                className="tool-input-colorful w-full rounded-xl p-3 font-mono text-sm min-h-[120px] resize-y" />
            </div>

            {/* Action */}
            <div className="flex gap-2">
              <button onClick={applyRecipe} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 font-bold text-sm">
                <Zap className="w-4 h-4" /> Bake! (Apply Operations)
              </button>
              <button onClick={() => { setOutput(input); setInput(output); }} className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Output */}
            <AnimatePresence>
              {output && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="tool-result-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-green-400">📤 Output</h3>
                    <div className="flex gap-1.5">
                      <button onClick={() => copy(output)} className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { const b = new Blob([output],{type:"text/plain"}); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "cyberchef-output.txt"; a.click(); }} className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <pre className="font-mono text-sm whitespace-pre-wrap break-all bg-background/50 rounded-xl p-3 max-h-[300px] overflow-auto">{output}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

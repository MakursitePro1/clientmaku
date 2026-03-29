import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FileText, Copy, RefreshCw } from "lucide-react";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function genWords(n: number) {
  return Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
}

function genSentence() {
  const len = Math.floor(Math.random() * 10) + 5;
  const s = genWords(len);
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function genParagraph() {
  const sentences = Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: sentences }, genSentence).join(" ");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const output = useMemo(() => {
    let text = "";
    if (type === "paragraphs") {
      text = Array.from({ length: count }, genParagraph).join("\n\n");
    } else if (type === "sentences") {
      text = Array.from({ length: count }, genSentence).join(" ");
    } else {
      text = genWords(count);
    }
    if (startWithLorem) {
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    }
    return text;
  }, [count, type, startWithLorem]);

  const [key, setKey] = useState(0);
  const regenerate = () => setKey(k => k + 1);

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text for your designs and projects">
      <div className="space-y-5 max-w-2xl mx-auto" key={key}>
        {/* Controls */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Configure</h3>
          </div>
          <div className="flex gap-2">
            {(["paragraphs", "sentences", "words"] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${type === t ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Count:</span>
            <input type="range" min={1} max={type === "words" ? 500 : type === "sentences" ? 50 : 20} value={count}
              onChange={e => setCount(Number(e.target.value))} className="flex-1 accent-primary" />
            <span className="font-bold text-sm w-8 text-center">{count}</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} className="accent-primary w-4 h-4" />
            <span className="text-xs font-semibold">Start with "Lorem ipsum..."</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <Copy className="w-4 h-4" /> Copy Text
          </button>
          <button onClick={regenerate} className="tool-btn-primary px-5 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(270 80% 50%))" }}>
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{output.split(/\s+/).length}</div>
            <div className="stat-label">Words</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{output.length}</div>
            <div className="stat-label">Characters</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{output.split(/[.!?]+/).filter(Boolean).length}</div>
            <div className="stat-label">Sentences</div>
          </div>
        </div>

        {/* Output */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-3">📝 Generated Text</h3>
          <Textarea value={output} readOnly className="tool-input-colorful rounded-xl min-h-[200px] text-sm leading-relaxed" />
        </motion.div>
      </div>
    </ToolLayout>
  );
}

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash2, Download, FileText } from "lucide-react";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [converted, setConverted] = useState("");

  const convert = (fn: (t: string) => string, label: string) => {
    if (!text.trim()) return;
    setConverted(fn(text));
    toast.success(`Converted to ${label}`);
  };

  const toTitle = (t: string) => t.replace(/\b\w/g, c => c.toUpperCase());
  const toSentence = (t: string) => t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
  const toAlternate = (t: string) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
  const toInverse = (t: string) => t.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
  const toSlug = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  const toCamel = (t: string) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
  const toPascal = (t: string) => { const c = toCamel(t); return c[0]?.toUpperCase() + c.slice(1); };
  const toSnake = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
  const toConstant = (t: string) => t.toUpperCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
  const toDot = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, ".");
  const toKebab = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
  const toMock = (t: string) => t.split("").map((c, i) => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join("");
  const removeSpaces = (t: string) => t.replace(/\s+/g, "");
  const removeExtraSpaces = (t: string) => t.replace(/\s+/g, " ").trim();

  const buttons = [
    { label: "UPPERCASE", fn: (t: string) => t.toUpperCase(), icon: "AA" },
    { label: "lowercase", fn: (t: string) => t.toLowerCase(), icon: "aa" },
    { label: "Title Case", fn: toTitle, icon: "Aa" },
    { label: "Sentence case", fn: toSentence, icon: "Aa." },
    { label: "aLtErNaTe", fn: toAlternate, icon: "aA" },
    { label: "InVeRsE", fn: toInverse, icon: "↕" },
    { label: "slug-case", fn: toSlug, icon: "-" },
    { label: "camelCase", fn: toCamel, icon: "cC" },
    { label: "PascalCase", fn: toPascal, icon: "PC" },
    { label: "snake_case", fn: toSnake, icon: "_" },
    { label: "CONSTANT_CASE", fn: toConstant, icon: "C_" },
    { label: "dot.case", fn: toDot, icon: "." },
    { label: "kebab-case", fn: toKebab, icon: "k-" },
    { label: "mOcKiNg", fn: toMock, icon: "🤪" },
    { label: "RemoveSpaces", fn: removeSpaces, icon: "⌫" },
    { label: "Trim Extra Spaces", fn: removeExtraSpaces, icon: "✂️" },
  ];

  const stats = useMemo(() => {
    const t = text;
    const words = t.trim() ? t.trim().split(/\s+/).length : 0;
    const sentences = t.trim() ? t.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = t.trim() ? t.split(/\n\n+/).filter(s => s.trim()).length : 0;
    const lines = t ? t.split("\n").length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const speakTime = Math.max(1, Math.ceil(words / 130));
    return { chars: t.length, charsNoSpace: t.replace(/\s/g, "").length, words, sentences, paragraphs, lines, readTime, speakTime };
  }, [text]);

  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied!"); };
  
  const downloadTxt = () => {
    const blob = new Blob([converted || text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted-text.txt";
    a.click();
  };

  const output = converted || text;

  return (
    <ToolLayout title="Text Case Converter" description="Convert text between 16+ different cases with text analysis">
      <div className="space-y-5 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Input</label>
            <Textarea value={text} onChange={e => { setText(e.target.value); setConverted(""); }}
              className="min-h-[200px] rounded-xl bg-card border-border/50 resize-none text-sm" placeholder="Type or paste your text here..." />
          </div>
          {/* Output */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Output</label>
            <Textarea value={output} readOnly
              className="min-h-[200px] rounded-xl bg-accent/30 border-border/50 resize-none text-sm" placeholder="Converted text appears here..." />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          {buttons.map(b => (
            <button key={b.label} onClick={() => convert(b.fn, b.label)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-card border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
              {b.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => copy(output)} variant="outline" className="rounded-xl gap-1.5 text-sm" disabled={!text}>
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
          <Button onClick={downloadTxt} variant="outline" className="rounded-xl gap-1.5 text-sm" disabled={!text}>
            <Download className="w-3.5 h-3.5" /> Download .txt
          </Button>
          <Button onClick={() => { setText(""); setConverted(""); }} variant="outline" className="rounded-xl gap-1.5 text-sm">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="p-3 bg-accent/30 border-b border-border/30 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold">Text Statistics</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 divide-x divide-border/30">
            {[
              { label: "Characters", val: stats.chars },
              { label: "No Spaces", val: stats.charsNoSpace },
              { label: "Words", val: stats.words },
              { label: "Sentences", val: stats.sentences },
              { label: "Paragraphs", val: stats.paragraphs },
              { label: "Lines", val: stats.lines },
              { label: "Read Time", val: `${stats.readTime}m` },
              { label: "Speak Time", val: `${stats.speakTime}m` },
            ].map(s => (
              <div key={s.label} className="p-2 text-center">
                <div className="text-sm font-bold text-primary">{s.val}</div>
                <div className="text-[9px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CaseConverter;

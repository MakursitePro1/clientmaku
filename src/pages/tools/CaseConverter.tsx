import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, ArrowUpDown } from "lucide-react";

const CaseConverter = () => {
  const [text, setText] = useState("");

  const convert = (fn: (t: string) => string, label: string) => {
    if (!text.trim()) return;
    setText(fn(text));
    toast({ title: `Converted to ${label}` });
  };

  const toTitle = (t: string) => t.replace(/\b\w/g, c => c.toUpperCase());
  const toSentence = (t: string) => {
    return t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
  };
  const toAlternate = (t: string) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
  const toInverse = (t: string) => t.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
  const toSlug = (t: string) => t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  const toCamel = (t: string) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
  const toSnake = (t: string) => t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
  const toConstant = (t: string) => t.toUpperCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "_");

  const buttons = [
    { label: "UPPERCASE", fn: (t: string) => t.toUpperCase() },
    { label: "lowercase", fn: (t: string) => t.toLowerCase() },
    { label: "Title Case", fn: toTitle },
    { label: "Sentence case", fn: toSentence },
    { label: "aLtErNaTe", fn: toAlternate },
    { label: "InVeRsE", fn: toInverse },
    { label: "slug-case", fn: toSlug },
    { label: "camelCase", fn: toCamel },
    { label: "snake_case", fn: toSnake },
    { label: "CONSTANT_CASE", fn: toConstant },
  ];

  const copy = () => { navigator.clipboard.writeText(text); toast({ title: "Copied!" }); };

  return (
    <ToolLayout title="Case Converter" description="Convert text between different cases instantly">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)}
          className="min-h-[200px] rounded-xl bg-card border-border/50 resize-none text-base" placeholder="Type or paste your text here..." />
        <div className="flex flex-wrap gap-2">
          {buttons.map(b => (
            <button key={b.label} onClick={() => convert(b.fn, b.label)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-card border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={copy} variant="outline" className="rounded-xl gap-2" disabled={!text}><Copy className="w-4 h-4" /> Copy</Button>
          <Button onClick={() => setText("")} variant="outline" className="rounded-xl">Clear</Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Words: {text.trim() ? text.trim().split(/\s+/).length : 0} • Characters: {text.length}
        </p>
      </div>
    </ToolLayout>
  );
};

export default CaseConverter;

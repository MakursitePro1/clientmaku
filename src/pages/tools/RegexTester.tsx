import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Regex, Copy, Check, AlertTriangle, Trash2, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PRESETS = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*", flags: "g" },
  { label: "Phone", pattern: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g" },
];

const FLAGS = [
  { flag: "g", label: "Global", desc: "Find all matches" },
  { flag: "i", label: "Case Insensitive", desc: "Ignore case" },
  { flag: "m", label: "Multiline", desc: "^ and $ match line boundaries" },
  { flag: "s", label: "Dotall", desc: ". matches newlines" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("Hello world! Test email: user@example.com and URL: https://example.com");
  const [replaceWith, setReplaceWith] = useState("");

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replaced: testString };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number; groups: string[] }[] = [];
      let m;
      const r = new RegExp(pattern, flags);
      while ((m = r.exec(testString)) !== null) {
        matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
        if (!flags.includes("g")) break;
      }
      const replaced = replaceWith ? testString.replace(regex, replaceWith) : testString;
      return { matches, error: null, replaced };
    } catch (e: any) {
      return { matches: [], error: e.message, replaced: testString };
    }
  }, [pattern, flags, testString, replaceWith]);

  const highlightedText = useMemo(() => {
    if (!pattern || result.error) return testString;
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return testString.replace(regex, (match) => `<<MATCH>>${match}<<END>>`);
    } catch { return testString; }
  }, [pattern, flags, testString, result.error]);

  return (
    <ToolLayout
      toolId="regex-tester"
      title="Regex Tester"
      description="Test, debug & visualize regular expressions in real-time"
     
     
    >
      <div className="space-y-6">
        {/* Presets */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 block">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <Button key={p.label} variant="outline" size="sm"
                className="border-[hsl(145,80%,42%)]/30 hover:bg-[hsl(145,80%,42%)]/10 hover:border-[hsl(145,80%,42%)]/50"
                onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}>
                <BookOpen className="w-3 h-3 mr-1" />{p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Pattern Input */}
        <div className="p-5 rounded-2xl border border-[hsl(145,80%,42%)]/20 bg-card/80 space-y-4">
          <div className="flex gap-3 items-center">
            <span className="text-2xl font-mono text-[hsl(145,80%,42%)]">/</span>
            <Input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="font-mono text-base border-[hsl(145,80%,42%)]/30 focus:border-[hsl(145,80%,42%)]"
            />
            <span className="text-2xl font-mono text-[hsl(145,80%,42%)]">/</span>
            <span className="font-mono text-lg font-bold text-[hsl(145,80%,42%)]">{flags}</span>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {FLAGS.map(f => (
              <button key={f.flag} onClick={() => toggleFlag(f.flag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  flags.includes(f.flag)
                    ? "bg-[hsl(145,80%,42%)] text-white shadow-lg"
                    : "bg-accent/50 text-muted-foreground hover:bg-accent"
                }`}
                title={f.desc}>
                {f.flag} - {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {result.error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-destructive font-medium">{result.error}</span>
          </div>
        )}

        {/* Test String */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 block">Test String</label>
          <Textarea
            value={testString}
            onChange={e => setTestString(e.target.value)}
            rows={5}
            className="font-mono text-sm border-border/60"
            placeholder="Enter test string..."
          />
        </div>

        {/* Highlighted Result */}
        {pattern && !result.error && (
          <div className="p-5 rounded-2xl border border-[hsl(145,80%,42%)]/20 bg-card/80">
            <h3 className="text-sm font-bold mb-3 text-[hsl(145,80%,42%)]">
              Highlighted Matches ({result.matches.length} found)
            </h3>
            <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed bg-background/50 p-4 rounded-xl">
              {highlightedText.split(/<<MATCH>>|<<END>>/).map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} className="bg-[hsl(145,80%,42%)]/25 text-[hsl(145,80%,42%)] px-1 py-0.5 rounded font-bold border border-[hsl(145,80%,42%)]/40">{part}</span>
                ) : <span key={i}>{part}</span>
              )}
            </div>
          </div>
        )}

        {/* Matches Table */}
        {result.matches.length > 0 && (
          <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
            <h3 className="text-sm font-bold mb-3">Match Details</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {result.matches.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 text-sm font-mono">
                  <span className="text-xs font-bold text-muted-foreground w-8">#{i+1}</span>
                  <span className="font-bold text-[hsl(145,80%,42%)]">"{m.text}"</span>
                  <span className="text-muted-foreground text-xs">at index {m.index}</span>
                  {m.groups.length > 0 && (
                    <span className="text-xs text-primary">Groups: {m.groups.join(", ")}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replace */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80 space-y-3">
          <h3 className="text-sm font-bold">Replace (Optional)</h3>
          <Input value={replaceWith} onChange={e => setReplaceWith(e.target.value)}
            placeholder="Replace matches with..." className="font-mono" />
          {replaceWith && (
            <div className="bg-background/50 p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Result:</p>
              <p className="font-mono text-sm whitespace-pre-wrap">{result.replaced}</p>
              <Button size="sm" variant="outline" className="mt-2"
                onClick={() => { navigator.clipboard.writeText(result.replaced); toast.success("Copied!"); }}>
                <Copy className="w-3 h-3 mr-1" />Copy Result
              </Button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    let s = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, separator);
    if (lowercase) s = s.toLowerCase();
    if (maxLength > 0) s = s.slice(0, maxLength);
    return s;
  }, [text, separator, lowercase, maxLength]);

  const copy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    "How to Build a Website in 2024!",
    "10 Best JavaScript Frameworks & Libraries",
    "বাংলা থেকে ইংরেজি (Bangla to English)",
    "The Quick Brown Fox — Jumps Over the Lazy Dog",
  ];

  return (
    <ToolLayout title="Slug Generator" description="Convert any text into a clean, SEO-friendly URL slug">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Enter Text</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your title here..."
            className="rounded-xl min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Separator</Label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Dot (.)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Max Length (0 = unlimited)</Label>
            <Input type="number" min={0} value={maxLength} onChange={(e) => setMaxLength(Number(e.target.value))} className="rounded-xl" />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="rounded" />
              <span className="text-sm">Lowercase</span>
            </label>
          </div>
        </div>

        {slug && (
          <div className="bg-accent/30 rounded-xl p-5 border border-border/50 space-y-3">
            <Label className="text-muted-foreground">Generated Slug</Label>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-background rounded-lg p-3 text-sm font-mono break-all">{slug}</code>
              <Button onClick={copy} variant="outline" className="rounded-xl shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">{slug.length} characters</div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-muted-foreground">Try Examples</Label>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <Button key={ex} variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setText(ex)}>
                {ex.slice(0, 35)}...
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

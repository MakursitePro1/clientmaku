import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Hello World! Hello Everyone!");

  let matches: RegExpMatchArray[] = [];
  let error = "";
  try {
    if (pattern) {
      const regex = new RegExp(pattern, flags);
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(text)) !== null) {
          matches.push(m);
          if (!m[0]) break;
        }
      } else {
        m = regex.exec(text);
        if (m) matches = [m];
      }
    }
  } catch (e: any) {
    error = e.message;
  }

  const highlightText = () => {
    if (!pattern || error) return text;
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return text.replace(regex, (match) => `【${match}】`);
    } catch { return text; }
  };

  return (
    <ToolLayout title="RegEx Tester" description="Test and debug regular expressions">
      <div className="space-y-5">
        <div className="flex gap-3">
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regular expression..." className="rounded-xl font-mono flex-1" />
          <Input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" className="rounded-xl font-mono w-24" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Test string..." className="rounded-xl font-mono text-sm" rows={6} />
        <div className="bg-accent/50 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-semibold text-sm">Matches:</span>
            <Badge variant="secondary">{matches.length} found</Badge>
          </div>
          <pre className="text-sm font-mono whitespace-pre-wrap">{highlightText()}</pre>
          {matches.length > 0 && (
            <div className="mt-4 space-y-1">
              {matches.map((m, i) => (
                <div key={i} className="text-xs font-mono text-muted-foreground">
                  Match {i + 1}: "{m[0]}" at index {m.index}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

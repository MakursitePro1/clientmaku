import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, Trash2 } from "lucide-react";

const TextReplacer = () => {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const matchCount = (() => {
    if (!find || !text) return 0;
    try {
      if (useRegex) {
        return (text.match(new RegExp(find, caseSensitive ? "g" : "gi")) || []).length;
      }
      const flags = caseSensitive ? "g" : "gi";
      return (text.match(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags)) || []).length;
    } catch { return 0; }
  })();

  const doReplace = () => {
    if (!find) return;
    try {
      let result: string;
      if (useRegex) {
        result = text.replace(new RegExp(find, caseSensitive ? "g" : "gi"), replace);
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = text.replace(new RegExp(escaped, caseSensitive ? "g" : "gi"), replace);
      }
      setText(result);
      toast({ title: `Replaced ${matchCount} occurrences` });
    } catch (e) {
      toast({ title: "Invalid regex", variant: "destructive" });
    }
  };

  const copy = () => { navigator.clipboard.writeText(text); toast({ title: "Copied!" }); };

  return (
    <ToolLayout title="Find & Replace" description="Find and replace text with regex support">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)}
          className="min-h-[200px] rounded-xl bg-card border-border/50 resize-none" placeholder="Paste your text here..." />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Find</label>
            <input value={find} onChange={e => setFind(e.target.value)}
              className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm" placeholder="Search text..." />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Replace with</label>
            <input value={replace} onChange={e => setReplace(e.target.value)}
              className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm" placeholder="Replacement..." />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-primary" />
            Case Sensitive
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} className="accent-primary" />
            Use Regex
          </label>
          {find && <span className="text-sm text-primary font-semibold">{matchCount} matches found</span>}
        </div>

        <div className="flex gap-3">
          <Button onClick={doReplace} className="gradient-bg text-primary-foreground rounded-xl font-semibold" disabled={!find || matchCount === 0}>
            Replace All
          </Button>
          <Button onClick={copy} variant="outline" className="rounded-xl gap-2" disabled={!text}><Copy className="w-4 h-4" /> Copy</Button>
          <Button onClick={() => { setText(""); setFind(""); setReplace(""); }} variant="outline" className="rounded-xl gap-2"><Trash2 className="w-4 h-4" /> Clear</Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TextReplacer;

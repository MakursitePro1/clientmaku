import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TextTruncator() {
  const [input, setInput] = useState("");
  const [maxLen, setMaxLen] = useState(100);
  const [suffix, setSuffix] = useState("...");

  const result = input.length > maxLen ? input.slice(0, maxLen) + suffix : input;

  return (
    <ToolLayout title="Text Truncator" description="Truncate text to a specific length with custom suffix">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to truncate..." className="min-h-[120px] rounded-xl" />
        <div className="flex gap-3">
          <div className="flex items-center gap-1"><label className="text-sm text-muted-foreground">Max Length:</label><Input type="number" value={maxLen} onChange={e => setMaxLen(+e.target.value)} min={1} className="w-20 rounded-xl" /></div>
          <div className="flex items-center gap-1"><label className="text-sm text-muted-foreground">Suffix:</label><Input value={suffix} onChange={e => setSuffix(e.target.value)} className="w-20 rounded-xl" /></div>
        </div>
        {input && (
          <>
            <p className="text-sm text-muted-foreground">Original: {input.length} chars → Truncated: {result.length} chars</p>
            <Textarea value={result} readOnly className="min-h-[80px] rounded-xl bg-accent/50" />
            <Button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

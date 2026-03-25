import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TextRepeater() {
  const [text, setText] = useState("Hello World");
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("\\n");

  const sep = separator === "\\n" ? "\n" : separator === "\\t" ? "\t" : separator;
  const result = Array(count).fill(text).join(sep);

  return (
    <ToolLayout title="Text Repeater" description="Repeat text multiple times with custom separator">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to repeat..." className="min-h-[80px] rounded-xl" />
        <div className="flex gap-3">
          <div className="flex items-center gap-1"><label className="text-sm text-muted-foreground">Count:</label><Input type="number" value={count} onChange={e => setCount(+e.target.value)} min={1} max={1000} className="w-20 rounded-xl" /></div>
          <div className="flex items-center gap-1"><label className="text-sm text-muted-foreground">Separator:</label><Input value={separator} onChange={e => setSeparator(e.target.value)} className="w-24 rounded-xl" placeholder="\n" /></div>
        </div>
        <Textarea value={result} readOnly className="min-h-[150px] rounded-xl bg-accent/50" />
        <Button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy Result</Button>
      </div>
    </ToolLayout>
  );
}

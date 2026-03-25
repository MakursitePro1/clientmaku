import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function HtmlEntityConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");

  const encode = (text: string) => text.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c] || c));

  const decode = (text: string) => {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
  };

  const process = () => setOutput(mode === "encode" ? encode(input) : decode(input));

  return (
    <ToolLayout title="HTML Entity Converter" description="Encode and decode HTML entities">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("encode")} variant={mode === "encode" ? "default" : "outline"} className="rounded-xl">Encode</Button>
          <Button onClick={() => setMode("decode")} variant={mode === "decode" ? "default" : "outline"} className="rounded-xl">Decode</Button>
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text..." className="min-h-[120px] rounded-xl" />
        <Button onClick={process} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
        {output && <Textarea value={output} readOnly className="min-h-[120px] rounded-xl bg-accent/50" />}
      </div>
    </ToolLayout>
  );
}

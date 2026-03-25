import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BinaryConverter() {
  const [text, setText] = useState("");
  const [binary, setBinary] = useState("");

  const toBinary = () => setBinary(text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "));
  const toText = () => setText(binary.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join(""));

  return (
    <ToolLayout title="Binary Converter" description="Convert between text and binary code">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div>
          <label className="text-sm font-semibold mb-1 block">Text</label>
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." className="rounded-xl min-h-[100px]" />
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={toBinary} className="gradient-bg text-primary-foreground rounded-xl">Text → Binary</Button>
          <Button onClick={toText} variant="outline" className="rounded-xl">Binary → Text</Button>
        </div>
        <div>
          <label className="text-sm font-semibold mb-1 block">Binary</label>
          <Textarea value={binary} onChange={e => setBinary(e.target.value)} placeholder="Binary code..." className="rounded-xl min-h-[100px] font-mono" />
        </div>
      </div>
    </ToolLayout>
  );
}

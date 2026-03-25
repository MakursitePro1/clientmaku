import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HexEditor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toHex"|"toText">("toHex");

  const convert = () => {
    if (mode === "toHex") {
      setOutput(input.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" "));
    } else {
      try {
        setOutput(input.split(" ").filter(Boolean).map(h => String.fromCharCode(parseInt(h, 16))).join(""));
      } catch { setOutput("Invalid hex input"); }
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <ToolLayout title="Hex Editor" description="Convert text to hexadecimal and back">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("toHex")} variant={mode === "toHex" ? "default" : "outline"} className="rounded-xl">Text → Hex</Button>
          <Button onClick={() => setMode("toText")} variant={mode === "toText" ? "default" : "outline"} className="rounded-xl">Hex → Text</Button>
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "toHex" ? "Enter text..." : "Enter hex (space-separated)..."} className="min-h-[100px] rounded-xl font-mono" />
        <div className="flex gap-2">
          <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
          {output && <Button onClick={copy} variant="outline" className="rounded-xl">Copy</Button>}
        </div>
        {output && <Textarea value={output} readOnly className="min-h-[100px] rounded-xl bg-accent/50 font-mono" />}
      </div>
    </ToolLayout>
  );
}

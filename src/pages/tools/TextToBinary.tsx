import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextToBinary() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toBin"|"toText">("toBin");

  const convert = () => {
    if (mode === "toBin") {
      setOutput(input.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "));
    } else {
      try {
        setOutput(input.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join(""));
      } catch { setOutput("Invalid binary input"); }
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <ToolLayout title="Text to Binary Converter" description="Convert text to binary and binary to text">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("toBin")} variant={mode === "toBin" ? "default" : "outline"} className="rounded-xl">Text → Binary</Button>
          <Button onClick={() => setMode("toText")} variant={mode === "toText" ? "default" : "outline"} className="rounded-xl">Binary → Text</Button>
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "toBin" ? "Enter text..." : "Enter binary (space-separated)..."} className="min-h-[100px] rounded-xl" />
        <div className="flex gap-2">
          <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
          {output && <Button onClick={copy} variant="outline" className="rounded-xl">Copy</Button>}
        </div>
        {output && <Textarea value={output} readOnly className="min-h-[100px] rounded-xl bg-accent/50 font-mono" />}
      </div>
    </ToolLayout>
  );
}

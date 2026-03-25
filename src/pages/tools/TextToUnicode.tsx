import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextToUnicode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toUni"|"toText">("toUni");

  const convert = () => {
    if (mode === "toUni") {
      setOutput(input.split("").map(c => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(" "));
    } else {
      try {
        setOutput(input.split(" ").map(u => String.fromCharCode(parseInt(u.replace("U+", ""), 16))).join(""));
      } catch { setOutput("Invalid input"); }
    }
  };

  return (
    <ToolLayout title="Text to Unicode Converter" description="Convert text to Unicode code points and back">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("toUni")} variant={mode === "toUni" ? "default" : "outline"} className="rounded-xl">Text → Unicode</Button>
          <Button onClick={() => setMode("toText")} variant={mode === "toText" ? "default" : "outline"} className="rounded-xl">Unicode → Text</Button>
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "toUni" ? "Enter text..." : "Enter Unicode (e.g. U+0048 U+0069)..."} className="min-h-[100px] rounded-xl" />
        <div className="flex gap-2">
          <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
          {output && <Button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy</Button>}
        </div>
        {output && <Textarea value={output} readOnly className="min-h-[100px] rounded-xl bg-accent/50 font-mono" />}
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextReverser() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chars"|"words"|"lines">("chars");

  const reverse = () => {
    switch (mode) {
      case "chars": return input.split("").reverse().join("");
      case "words": return input.split(" ").reverse().join(" ");
      case "lines": return input.split("\n").reverse().join("\n");
    }
  };

  const result = input ? reverse() : "";

  return (
    <ToolLayout title="Text Reverser" description="Reverse text by characters, words, or lines">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          {(["chars", "words", "lines"] as const).map(m => (
            <Button key={m} onClick={() => setMode(m)} variant={mode === m ? "default" : "outline"} className="rounded-xl capitalize">{m}</Button>
          ))}
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to reverse..." className="min-h-[120px] rounded-xl" />
        {result && (
          <>
            <Textarea value={result} readOnly className="min-h-[120px] rounded-xl bg-accent/50" />
            <Button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy Result</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

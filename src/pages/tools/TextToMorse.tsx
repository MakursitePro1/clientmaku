import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",
  " ":"/"
};
const REV = Object.fromEntries(Object.entries(MORSE).map(([k,v])=>[v,k]));

export default function TextToMorse() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toMorse"|"toText">("toMorse");

  const convert = () => {
    if (mode === "toMorse") {
      setOutput(input.toUpperCase().split("").map(c => MORSE[c] || c).join(" "));
    } else {
      setOutput(input.split(" ").map(c => c === "/" ? " " : REV[c] || c).join(""));
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <ToolLayout title="Text to Morse Code" description="Convert text to Morse code and vice versa">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <Button onClick={() => setMode("toMorse")} variant={mode === "toMorse" ? "default" : "outline"} className="rounded-xl">Text → Morse</Button>
          <Button onClick={() => setMode("toText")} variant={mode === "toText" ? "default" : "outline"} className="rounded-xl">Morse → Text</Button>
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "toMorse" ? "Enter text..." : "Enter morse code (dots and dashes)..."} className="min-h-[100px] rounded-xl" />
        <div className="flex gap-2">
          <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
          {output && <Button onClick={copy} variant="outline" className="rounded-xl">Copy</Button>}
        </div>
        {output && <Textarea value={output} readOnly className="min-h-[100px] rounded-xl bg-accent/50 font-mono text-lg" />}
      </div>
    </ToolLayout>
  );
}

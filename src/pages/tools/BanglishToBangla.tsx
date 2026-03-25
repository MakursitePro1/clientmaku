import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Simple Banglish to Bangla phonetic mapping
const banglishMap: [string, string][] = [
  ["kh", "খ"], ["gh", "ঘ"], ["ng", "ং"], ["ch", "চ"], ["chh", "ছ"], ["jh", "ঝ"],
  ["th", "থ"], ["dh", "ধ"], ["ph", "ফ"], ["bh", "ভ"], ["sh", "শ"],
  ["ee", "ী"], ["oo", "ূ"], ["ou", "ৌ"], ["oi", "ৈ"],
  ["k", "ক"], ["g", "গ"], ["c", "চ"], ["j", "জ"], ["t", "ত"], ["d", "দ"],
  ["n", "ন"], ["p", "প"], ["f", "ফ"], ["b", "ব"], ["m", "ম"],
  ["r", "র"], ["l", "ল"], ["s", "স"], ["h", "হ"], ["z", "য"],  ["y", "য়"],
  ["a", "া"], ["i", "ি"], ["u", "ু"], ["e", "ে"], ["o", "ো"],
];

function banglishToBangla(text: string): string {
  let result = text.toLowerCase();
  for (const [en, bn] of banglishMap) {
    result = result.split(en).join(bn);
  }
  return result;
}

export default function BanglishToBangla() {
  const [input, setInput] = useState("");
  const output = banglishToBangla(input);

  return (
    <ToolLayout title="Banglish to Bangla Converter" description="Convert Banglish text to Bangla">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Banglish Text</label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type in Banglish..." className="rounded-xl" rows={5} />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Bangla Output</label>
          <Textarea readOnly value={output} className="rounded-xl bg-accent/50" rows={5} />
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied!" }); }}>Copy Output</Button>
      </div>
    </ToolLayout>
  );
}

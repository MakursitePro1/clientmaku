import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Simple Bangla to Banglish mapping
const banglaMap: Record<string, string> = {
  "অ": "o", "আ": "a", "ই": "i", "ঈ": "ee", "উ": "u", "ঊ": "oo", "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou",
  "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng",
  "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "n",
  "ট": "t", "ঠ": "th", "ড": "d", "ঢ": "dh", "ণ": "n",
  "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", "ন": "n",
  "প": "p", "ফ": "f", "ব": "b", "ভ": "bh", "ম": "m",
  "য": "z", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh", "স": "s", "হ": "h",
  "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t",
  "া": "a", "ি": "i", "ী": "ee", "ু": "u", "ূ": "oo", "ে": "e", "ৈ": "oi", "ো": "o", "ৌ": "ou",
  "্": "", "ং": "ng", "ঃ": "h", "ঁ": "n",
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

function banglaToBanglish(text: string): string {
  return text.split("").map((ch) => banglaMap[ch] ?? ch).join("");
}

export default function BanglaToBanglish() {
  const [input, setInput] = useState("");
  const output = banglaToBanglish(input);

  return (
    <ToolLayout title="Bangla to Banglish Converter" description="Convert Bangla text to Banglish">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Bangla Text</label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="বাংলা টেক্সট লিখুন..." className="rounded-xl" rows={5} />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Banglish Output</label>
          <Textarea readOnly value={output} className="rounded-xl bg-accent/50" rows={5} />
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied!" }); }}>Copy Output</Button>
      </div>
    </ToolLayout>
  );
}

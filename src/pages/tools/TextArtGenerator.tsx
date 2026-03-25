import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy } from "lucide-react";

const asciiStyles: Record<string, Record<string, string>> = {
  block: {
    A: " █████╗ ", B: "██████╗ ", C: " ██████╗", D: "██████╗ ", E: "███████╗", F: "███████╗",
    G: " ██████╗ ", H: "██╗  ██╗", I: "██╗", J: "     ██╗", K: "██╗  ██╗", L: "██╗     ",
    M: "███╗   ███╗", N: "███╗   ██╗", O: " ██████╗ ", P: "██████╗ ", Q: " ██████╗  ", R: "██████╗ ",
    S: "███████╗", T: "████████╗", U: "██╗   ██╗", V: "██╗   ██╗", W: "██╗    ██╗", X: "██╗  ██╗",
    Y: "██╗   ██╗", Z: "███████╗",
  },
  simple: Object.fromEntries("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(c => [c, c])),
};

function textToAscii(text: string, style: string): string {
  if (style === "banner") {
    const lines = ["", "", "", "", ""];
    const bannerChars: Record<string, string[]> = {
      A: ["  █  ", " █ █ ", "█████", "█   █", "█   █"],
      B: ["████ ", "█   █", "████ ", "█   █", "████ "],
      C: [" ████", "█    ", "█    ", "█    ", " ████"],
      D: ["████ ", "█   █", "█   █", "█   █", "████ "],
      E: ["█████", "█    ", "████ ", "█    ", "█████"],
      F: ["█████", "█    ", "████ ", "█    ", "█    "],
      " ": ["     ", "     ", "     ", "     ", "     "],
    };
    for (const ch of text.toUpperCase()) {
      const b = bannerChars[ch] || bannerChars[" "] || ["?????", "?????", "?????", "?????", "?????"];
      b.forEach((line, i) => { lines[i] += line + " "; });
    }
    return lines.join("\n");
  }
  if (style === "shadow") {
    return text.split("").map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + code - 97);
      return c;
    }).join("");
  }
  return text.toUpperCase().split("").map(c => asciiStyles[style]?.[c] || c).join("");
}

export default function TextArtGenerator() {
  const [text, setText] = useState("HELLO");
  const [style, setStyle] = useState("banner");
  const result = textToAscii(text, style);

  return (
    <ToolLayout title="ASCII Art Generator" description="Convert text to ASCII art typography">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." className="rounded-xl" rows={2} />
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger className="rounded-xl w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="shadow">Math Bold</SelectItem>
            <SelectItem value="block">Block</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-accent/30 rounded-2xl p-6 overflow-x-auto">
          <pre className="font-mono text-sm whitespace-pre">{result}</pre>
        </div>
        <Button onClick={() => navigator.clipboard.writeText(result)} className="gradient-bg text-primary-foreground rounded-xl"><Copy className="w-4 h-4 mr-2" /> Copy Art</Button>
      </div>
    </ToolLayout>
  );
}

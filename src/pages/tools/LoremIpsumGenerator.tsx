import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const loremWords = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateLorem(count: number, type: string): string {
  if (type === "words") return Array.from({ length: count }, () => loremWords[Math.floor(Math.random() * loremWords.length)]).join(" ") + ".";
  if (type === "sentences") return Array.from({ length: count }, () => {
    const len = Math.floor(Math.random() * 10) + 5;
    const s = Array.from({ length: len }, () => loremWords[Math.floor(Math.random() * loremWords.length)]).join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }).join(" ");
  return Array.from({ length: count }, () => generateLorem(Math.floor(Math.random() * 3) + 3, "sentences")).join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState("3");
  const [type, setType] = useState("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => setOutput(generateLorem(parseInt(count) || 1, type));

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text for your designs">
      <div className="space-y-5">
        <div className="flex gap-3">
          <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(e.target.value)} className="w-24 rounded-xl" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-40 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Generate</Button>
        </div>
        {output && (
          <>
            <div className="bg-accent/50 rounded-2xl p-6 text-sm whitespace-pre-wrap max-h-96 overflow-auto">{output}</div>
            <Button variant="outline" className="rounded-xl" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied!" }); }}>Copy Text</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

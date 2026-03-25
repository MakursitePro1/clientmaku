import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [order, setOrder] = useState<"asc"|"desc"|"random"|"length">("asc");

  const sort = () => {
    const lines = input.split("\n").filter(l => l.trim());
    switch (order) {
      case "asc": return lines.sort((a, b) => a.localeCompare(b)).join("\n");
      case "desc": return lines.sort((a, b) => b.localeCompare(a)).join("\n");
      case "random": return lines.sort(() => Math.random() - 0.5).join("\n");
      case "length": return lines.sort((a, b) => a.length - b.length).join("\n");
    }
  };

  const result = input ? sort() : "";

  return (
    <ToolLayout title="Text Line Sorter" description="Sort text lines alphabetically, by length, or randomly">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-2 flex-wrap">
          {(["asc", "desc", "random", "length"] as const).map(o => (
            <Button key={o} onClick={() => setOrder(o)} variant={order === o ? "default" : "outline"} className="rounded-xl capitalize">{o === "asc" ? "A→Z" : o === "desc" ? "Z→A" : o === "random" ? "Random" : "By Length"}</Button>
          ))}
        </div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter lines to sort..." className="min-h-[150px] rounded-xl" />
        {result && (
          <>
            <Textarea value={result} readOnly className="min-h-[150px] rounded-xl bg-accent/50" />
            <Button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy Result</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

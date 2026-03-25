import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TextDiffChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<{ type: string; value: string }[]>([]);

  const compare = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLen = Math.max(lines1.length, lines2.length);
    const result: { type: string; value: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] ?? "";
      const l2 = lines2[i] ?? "";
      if (l1 === l2) {
        result.push({ type: "same", value: l1 });
      } else {
        if (l1) result.push({ type: "removed", value: l1 });
        if (l2) result.push({ type: "added", value: l2 });
      }
    }
    setDiff(result);
  };

  return (
    <ToolLayout title="Text Diff Checker" description="Compare two texts and find differences">
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Original Text</label>
            <Textarea value={text1} onChange={(e) => setText1(e.target.value)} placeholder="Paste original text..." className="rounded-xl font-mono text-sm" rows={10} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Modified Text</label>
            <Textarea value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Paste modified text..." className="rounded-xl font-mono text-sm" rows={10} />
          </div>
        </div>
        <Button onClick={compare} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Compare</Button>
        {diff.length > 0 && (
          <div className="bg-accent/50 rounded-2xl p-5 space-y-1 font-mono text-sm">
            {diff.map((d, i) => (
              <div key={i} className={`px-3 py-1 rounded ${d.type === "added" ? "bg-green-100 text-green-800" : d.type === "removed" ? "bg-red-100 text-red-800" : ""}`}>
                {d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  "}{d.value || "(empty line)"}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

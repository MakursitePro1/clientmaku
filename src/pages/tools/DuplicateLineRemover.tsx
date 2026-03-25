import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DuplicateLineRemover() {
  const [input, setInput] = useState("");

  const lines = input.split("\n");
  const unique = [...new Set(lines)];
  const removed = lines.length - unique.length;

  return (
    <ToolLayout title="Duplicate Line Remover" description="Remove duplicate lines from text">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text with duplicate lines..." className="min-h-[150px] rounded-xl" />
        {input && (
          <>
            <p className="text-sm text-muted-foreground">{removed} duplicate line{removed !== 1 ? "s" : ""} removed ({unique.length} unique lines)</p>
            <Textarea value={unique.join("\n")} readOnly className="min-h-[150px] rounded-xl bg-accent/50" />
            <Button onClick={() => { navigator.clipboard.writeText(unique.join("\n")); toast.success("Copied!"); }} variant="outline" className="rounded-xl">Copy Result</Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

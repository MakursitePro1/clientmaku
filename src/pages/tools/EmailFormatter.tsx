import { useState } from "react";

import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EmailFormatter() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<"professional" | "casual" | "formal">("professional");

  const formatEmail = () => {
    const lines = input.trim().split(/\n/).map(l => l.trim()).filter(Boolean);
    let formatted = "";

    if (format === "professional") {
      formatted = lines.map((line, i) => {
        if (i === 0) return line; // Subject or greeting
        return line;
      }).join("\n\n");

      // Auto-add greeting if missing
      if (!formatted.toLowerCase().startsWith("hi") && !formatted.toLowerCase().startsWith("hello") && !formatted.toLowerCase().startsWith("dear")) {
        formatted = "Hi,\n\n" + formatted;
      }
      // Auto-add closing if missing
      if (!formatted.toLowerCase().includes("regards") && !formatted.toLowerCase().includes("sincerely") && !formatted.toLowerCase().includes("best")) {
        formatted += "\n\nBest regards,\n[Your Name]";
      }
    } else if (format === "formal") {
      if (!formatted.toLowerCase().startsWith("dear")) {
        formatted = "Dear Sir/Madam,\n\n" + lines.join("\n\n");
      } else {
        formatted = lines.join("\n\n");
      }
      if (!formatted.toLowerCase().includes("sincerely") && !formatted.toLowerCase().includes("faithfully")) {
        formatted += "\n\nYours sincerely,\n[Your Name]\n[Your Title]\n[Your Organization]";
      }
    } else {
      if (!formatted.toLowerCase().startsWith("hey") && !formatted.toLowerCase().startsWith("hi")) {
        formatted = "Hey!\n\n" + lines.join("\n\n");
      } else {
        formatted = lines.join("\n\n");
      }
      if (!formatted.toLowerCase().includes("cheers") && !formatted.toLowerCase().includes("thanks")) {
        formatted += "\n\nCheers! 👋";
      }
    }

    setInput(formatted);
    toast.success("Email formatted!");
  };

  const stats = {
    words: input.trim().split(/\s+/).filter(Boolean).length,
    chars: input.length,
    paragraphs: input.split(/\n\s*\n/).filter(s => s.trim()).length,
    readTime: Math.max(1, Math.ceil(input.trim().split(/\s+/).filter(Boolean).length / 200)),
  };

  const copy = () => { navigator.clipboard.writeText(input); toast.success("Email copied!"); };

  return (
    <ToolLayout title="Email Formatter" description="Format and beautify email content">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          {(["professional", "formal", "casual"] as const).map(f => (
            <Button key={f} variant={format === f ? "default" : "outline"} size="sm" onClick={() => setFormat(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        <div>
          <Label>Email Content</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={12} placeholder="Paste or type your email content here..." className="text-sm" />
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Read Time", value: `${stats.readTime}m` },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-accent/50">
              <div className="font-bold text-sm">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={formatEmail} className="flex-1" disabled={!input.trim()}>Format Email</Button>
          <Button onClick={copy} variant="outline" className="flex-1" disabled={!input.trim()}>Copy</Button>
        </div>
      </div>
    </ToolLayout>
  );
}

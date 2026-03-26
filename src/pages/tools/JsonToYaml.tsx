import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function jsonToYaml(obj: any, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj !== "object") return typeof obj === "string" ? `"${obj}"` : String(obj);
  if (Array.isArray(obj)) return obj.map(v => `${pad}- ${jsonToYaml(v, indent + 1).trimStart()}`).join("\n");
  return Object.entries(obj).map(([k, v]) => {
    if (typeof v === "object" && v !== null) return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
    return `${pad}${k}: ${jsonToYaml(v, indent)}`;
  }).join("\n");
}

export default function JsonToYaml() {
  const [input, setInput] = useState('{\n  "name": "Makursite",\n  "version": "1.0",\n  "features": ["tools", "speed", "design"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(jsonToYaml(obj));
      setError("");
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <ToolLayout title="JSON to YAML Converter" description="Convert JSON to YAML format">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">JSON Input</label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[250px] rounded-xl font-mono text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">YAML Output</label>
            <Textarea value={output} readOnly className="min-h-[250px] rounded-xl font-mono text-sm bg-accent/50" />
          </div>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl">Convert</Button>
          {output && <Button onClick={copy} variant="outline" className="rounded-xl">Copy YAML</Button>}
        </div>
      </div>
    </ToolLayout>
  );
}

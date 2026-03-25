import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy, Minimize2, Maximize2 } from "lucide-react";

const CssMinifier = () => {
  const [input, setInput] = useState(`/* Main container styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background-color: #1a1a2e;
  color: #ffffff;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #7c3aed;
  color: white;
}

.btn-primary:hover {
  background-color: #6d28d9;
}`);
  const [output, setOutput] = useState("");

  const minify = () => {
    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*{\s*/g, "{")
      .replace(/\s*}\s*/g, "}")
      .replace(/\s*;\s*/g, ";")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",")
      .replace(/;}/g, "}")
      .trim();
    setOutput(minified);
    const saved = ((1 - minified.length / input.length) * 100).toFixed(1);
    toast({ title: "Minified!", description: `Reduced by ${saved}% (${input.length} → ${minified.length} chars)` });
  };

  const beautify = () => {
    let level = 0;
    const result = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*{\s*/g, " {\n")
      .replace(/\s*}\s*/g, "\n}\n\n")
      .replace(/\s*;\s*/g, ";\n")
      .replace(/\s*:\s*/g, ": ")
      .trim();
    
    const lines = result.split("\n");
    const formatted = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed === "}") {
        level = Math.max(0, level - 1);
        return "  ".repeat(level) + trimmed;
      }
      const indented = "  ".repeat(level) + trimmed;
      if (trimmed.endsWith("{")) level++;
      return indented;
    }).filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");
    
    setOutput(formatted);
    toast({ title: "Beautified!", description: "CSS has been formatted" });
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Output copied to clipboard" });
  };

  return (
    <ToolLayout title="CSS Minifier" description="Minify or beautify your CSS code">
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Input CSS</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm rounded-xl bg-card border-border/50 resize-none"
              placeholder="Paste your CSS here..."
            />
            <p className="text-xs text-muted-foreground">{input.length} characters</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Output</label>
            <Textarea
              value={output}
              readOnly
              className="min-h-[400px] font-mono text-sm rounded-xl bg-card border-border/50 resize-none"
              placeholder="Output will appear here..."
            />
            <p className="text-xs text-muted-foreground">{output.length} characters</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={minify} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2">
            <Minimize2 className="w-4 h-4" /> Minify
          </Button>
          <Button onClick={beautify} variant="outline" className="rounded-xl font-semibold gap-2">
            <Maximize2 className="w-4 h-4" /> Beautify
          </Button>
          <Button onClick={copyOutput} variant="outline" className="rounded-xl font-semibold gap-2" disabled={!output}>
            <Copy className="w-4 h-4" /> Copy Output
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CssMinifier;

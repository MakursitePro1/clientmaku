import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"John","age":30,"city":"Dhaka","skills":["JavaScript","React","Node.js"],"address":{"street":"123 Main St","zip":"1200"}}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const validate = () => {
    setError("");
    try {
      JSON.parse(input);
      toast({ title: "✅ Valid JSON!", description: "The JSON is correctly formatted." });
    } catch (e: any) {
      setError(e.message);
      toast({ title: "❌ Invalid JSON", description: e.message, variant: "destructive" });
    }
  };

  return (
    <ToolLayout title="JSON Formatter" description="Format, minify, and validate JSON data">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-2 block">Input JSON</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="rounded-xl font-mono text-sm"
            rows={8}
          />
        </div>
        {error && <p className="text-sm text-destructive font-medium">Error: {error}</p>}
        <div className="flex flex-wrap gap-3 items-center">
          <Button onClick={format} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Format</Button>
          <Button onClick={minify} variant="outline" className="rounded-xl">Minify</Button>
          <Button onClick={validate} variant="outline" className="rounded-xl">Validate</Button>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-muted-foreground">Indent:</label>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${indent === n ? "gradient-bg text-primary-foreground" : "bg-accent text-accent-foreground"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Output</label>
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied!" }); }}>Copy</Button>
            </div>
            <pre className="bg-accent/50 rounded-2xl p-5 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

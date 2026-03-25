import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";

export default function JsonToCsv() {
  const [json, setJson] = useState("");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setCsv("");
    try {
      let data = JSON.parse(json);
      if (!Array.isArray(data)) data = [data];
      if (data.length === 0) { setError("Empty array"); return; }

      const headers = [...new Set(data.flatMap((obj: any) => Object.keys(obj)))];
      const escape = (val: any) => {
        if (val === null || val === undefined) return "";
        const s = typeof val === "object" ? JSON.stringify(val) : String(val);
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = data.map((obj: Record<string, unknown>) => headers.map((h) => escape(obj[h])).join(","));
      setCsv([headers.join(","), ...rows].join("\n"));
    } catch {
      setError("Invalid JSON input. Please provide a valid JSON array.");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "data.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout title="JSON to CSV" description="Convert JSON data to CSV format">
      <div className="space-y-5">
        <Textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]' className="rounded-xl font-mono text-sm min-h-[200px]" />
        <Button onClick={convert} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Convert to CSV</Button>
        {error && <div className="text-destructive bg-destructive/10 rounded-xl p-4 text-sm">{error}</div>}
        {csv && (
          <>
            <div className="flex gap-3">
              <Button onClick={copy} variant="outline" className="rounded-xl">
                {copied ? <><Check className="w-4 h-4 mr-2" />Copied</> : <><Copy className="w-4 h-4 mr-2" />Copy</>}
              </Button>
              <Button onClick={download} variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />Download CSV
              </Button>
            </div>
            <pre className="bg-accent/50 rounded-2xl p-5 text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">{csv}</pre>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

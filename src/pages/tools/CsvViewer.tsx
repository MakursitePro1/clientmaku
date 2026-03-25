import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CsvViewer() {
  const [csv, setCsv] = useState("Name,Age,City\nAlice,25,Dhaka\nBob,30,Chittagong\nCharlie,28,Sylhet");
  const [rows, setRows] = useState<string[][]>([]);

  const parse = () => {
    const lines = csv.trim().split("\n").map(l => l.split(",").map(c => c.trim()));
    setRows(lines);
  };

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { setCsv(reader.result as string); };
    reader.readAsText(file);
  };

  return (
    <ToolLayout title="CSV Viewer" description="View and parse CSV data in a table">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex gap-3 items-center flex-wrap">
          <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} className="text-sm" />
          <Button onClick={parse} className="gradient-bg text-primary-foreground rounded-xl">Parse CSV</Button>
        </div>
        <Textarea value={csv} onChange={e => setCsv(e.target.value)} className="min-h-[120px] rounded-xl font-mono text-sm" placeholder="Paste CSV data..." />
        {rows.length > 0 && (
          <div className="overflow-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr>{rows[0].map((h, i) => <th key={i} className="bg-accent/50 p-3 text-left font-semibold border-b border-border">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-border/50 hover:bg-accent/20">
                    {row.map((cell, ci) => <td key={ci} className="p-3">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

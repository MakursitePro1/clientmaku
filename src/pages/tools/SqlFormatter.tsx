import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SqlFormatter() {
  const [input, setInput] = useState("SELECT id, name, email FROM users WHERE status = 'active' AND role = 'admin' ORDER BY created_at DESC LIMIT 10;");
  const [output, setOutput] = useState("");

  const format = () => {
    const keywords = ["SELECT","FROM","WHERE","AND","OR","ORDER BY","GROUP BY","HAVING","LIMIT","OFFSET","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","ON","INSERT INTO","VALUES","UPDATE","SET","DELETE","CREATE TABLE","ALTER TABLE","DROP TABLE","AS","IN","NOT","NULL","IS","LIKE","BETWEEN","UNION","ALL","DISTINCT","COUNT","SUM","AVG","MAX","MIN","CASE","WHEN","THEN","ELSE","END","ASC","DESC"];
    let sql = input.trim();
    keywords.forEach(kw => {
      const re = new RegExp(`\\b${kw}\\b`, "gi");
      sql = sql.replace(re, `\n${kw.toUpperCase()}`);
    });
    setOutput(sql.trim().replace(/^\n/, ""));
  };

  const minify = () => setOutput(input.replace(/\s+/g, " ").trim());
  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <ToolLayout title="SQL Formatter" description="Format and beautify SQL queries">
      <div className="space-y-4 max-w-3xl mx-auto">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste SQL query..." className="min-h-[150px] rounded-xl font-mono text-sm" />
        <div className="flex gap-2">
          <Button onClick={format} className="gradient-bg text-primary-foreground rounded-xl">Format</Button>
          <Button onClick={minify} variant="outline" className="rounded-xl">Minify</Button>
          {output && <Button onClick={copy} variant="outline" className="rounded-xl">Copy</Button>}
        </div>
        {output && <Textarea value={output} readOnly className="min-h-[200px] rounded-xl font-mono text-sm bg-accent/50" />}
      </div>
    </ToolLayout>
  );
}

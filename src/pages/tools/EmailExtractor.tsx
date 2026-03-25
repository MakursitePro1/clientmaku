import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EmailExtractor() {
  const [text, setText] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [unique, setUnique] = useState(true);

  const extract = () => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const found = text.match(regex) || [];
    setEmails(unique ? [...new Set(found)] : found);
  };

  const copy = () => {
    navigator.clipboard.writeText(emails.join("\n"));
    toast.success(`${emails.length} emails copied!`);
  };

  const download = () => {
    const blob = new Blob([emails.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "extracted-emails.txt";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout title="Email Extractor" description="Extract email addresses from any text">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Label>Paste Text Containing Emails</Label>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={8} placeholder="Paste any text here, emails will be extracted automatically..." />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} className="rounded" />
            Remove duplicates
          </label>
          <Button onClick={extract} disabled={!text.trim()}>Extract Emails</Button>
        </div>

        {emails.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{emails.length} email(s) found</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}>Copy All</Button>
                <Button size="sm" variant="outline" onClick={download}>Download TXT</Button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 max-h-80 overflow-y-auto">
              {emails.map((e, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-sm font-mono">{e}</span>
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => { navigator.clipboard.writeText(e); toast.success("Copied!"); }}>Copy</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

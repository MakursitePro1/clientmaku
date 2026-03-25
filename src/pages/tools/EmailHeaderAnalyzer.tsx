import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface HeaderEntry { key: string; value: string; }

export default function EmailHeaderAnalyzer() {
  const [raw, setRaw] = useState("");
  const [headers, setHeaders] = useState<HeaderEntry[]>([]);

  const analyze = () => {
    const lines = raw.split(/\r?\n/);
    const result: HeaderEntry[] = [];
    let current: HeaderEntry | null = null;

    for (const line of lines) {
      if (/^\s/.test(line) && current) {
        current.value += " " + line.trim();
      } else {
        const match = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
        if (match) {
          current = { key: match[1], value: match[2] };
          result.push(current);
        }
      }
    }
    setHeaders(result);
  };

  const importantKeys = ["from", "to", "subject", "date", "received", "message-id", "return-path", "dkim-signature", "authentication-results", "spf", "x-mailer"];

  const getCategory = (key: string) => {
    const k = key.toLowerCase();
    if (["from", "to", "cc", "bcc", "reply-to"].includes(k)) return "🟢 Sender/Recipient";
    if (["subject", "date", "message-id"].includes(k)) return "🔵 Basic Info";
    if (k.startsWith("received")) return "🟡 Routing";
    if (["dkim-signature", "authentication-results", "arc-seal", "spf"].some(s => k.includes(s))) return "🔴 Authentication";
    return "⚪ Other";
  };

  return (
    <ToolLayout title="Email Header Analyzer" description="Parse and analyze raw email headers">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Label>Paste Raw Email Headers</Label>
          <Textarea value={raw} onChange={e => setRaw(e.target.value)} rows={10} placeholder="Paste full email headers here..." className="font-mono text-xs" />
        </div>
        <Button onClick={analyze} className="w-full" disabled={!raw.trim()}>Analyze Headers</Button>

        {headers.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{headers.length} headers found</p>
            <div className="space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="p-3 rounded-lg bg-card border border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-xs">{getCategory(h.key)}</span>
                    <span className="font-bold text-sm text-primary">{h.key}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-1 break-all">{h.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

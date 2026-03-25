import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Result { email: string; valid: boolean; reason: string; }

const validateEmail = (email: string): Result => {
  const trimmed = email.trim();
  if (!trimmed) return { email: trimmed, valid: false, reason: "Empty" };
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(trimmed)) return { email: trimmed, valid: false, reason: "Invalid format" };
  const [local, domain] = trimmed.split("@");
  if (local.length > 64) return { email: trimmed, valid: false, reason: "Local part too long" };
  if (domain.length > 253) return { email: trimmed, valid: false, reason: "Domain too long" };
  if (local.startsWith(".") || local.endsWith(".")) return { email: trimmed, valid: false, reason: "Local part starts/ends with dot" };
  if (local.includes("..")) return { email: trimmed, valid: false, reason: "Consecutive dots in local part" };
  return { email: trimmed, valid: true, reason: "Valid" };
};

export default function BulkEmailValidator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  const validate = () => {
    const emails = input.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
    setResults(emails.map(validateEmail));
  };

  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;

  const exportValid = () => {
    const valid = results.filter(r => r.valid).map(r => r.email).join("\n");
    navigator.clipboard.writeText(valid);
    toast.success(`${validCount} valid emails copied!`);
  };

  const downloadCsv = () => {
    const csv = "Email,Valid,Reason\n" + results.map(r => `"${r.email}",${r.valid},"${r.reason}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "email-validation-results.csv";
    a.click();
    toast.success("CSV downloaded!");
  };

  return (
    <ToolLayout title="Bulk Email Validator" description="Validate multiple email addresses at once">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Label>Enter Emails (one per line, or comma/semicolon separated)</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder={"user1@example.com\nuser2@test.com\ninvalid-email\nuser3@domain.org"} className="font-mono text-sm" />
        </div>
        <Button onClick={validate} className="w-full" disabled={!input.trim()}>Validate All Emails</Button>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-accent/50"><div className="text-2xl font-bold">{results.length}</div><div className="text-xs text-muted-foreground">Total</div></div>
              <div className="p-4 rounded-xl bg-green-500/10"><div className="text-2xl font-bold text-green-500">{validCount}</div><div className="text-xs text-muted-foreground">Valid</div></div>
              <div className="p-4 rounded-xl bg-red-500/10"><div className="text-2xl font-bold text-red-500">{invalidCount}</div><div className="text-xs text-muted-foreground">Invalid</div></div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportValid}>Copy Valid Emails</Button>
              <Button size="sm" variant="outline" onClick={downloadCsv}>Download CSV Report</Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-2.5 border-b border-border/30 last:border-0 ${r.valid ? "" : "bg-red-500/5"}`}>
                    <span className="font-mono text-sm truncate flex-1">{r.email}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${r.valid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{r.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

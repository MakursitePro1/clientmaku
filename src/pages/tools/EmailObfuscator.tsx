import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EmailObfuscator() {
  const [email, setEmail] = useState("");

  const methods = email ? [
    {
      label: "HTML Entities",
      description: "Convert characters to HTML entities",
      code: email.split("").map(c => `&#${c.charCodeAt(0)};`).join(""),
    },
    {
      label: "JavaScript Decode",
      description: "Use JavaScript to render the email",
      code: `<script>document.write('${email.split("").map(c => `\\x${c.charCodeAt(0).toString(16)}`).join("")}')</script>`,
    },
    {
      label: "CSS Direction Trick",
      description: "Reverse text with CSS direction",
      code: `<span style="unicode-bidi:bidi-override;direction:rtl;">${email.split("").reverse().join("")}</span>`,
    },
    {
      label: "Replace @ and .",
      description: "Human-readable but bot-resistant",
      code: email.replace("@", " [at] ").replace(/\./g, " [dot] "),
    },
    {
      label: "ROT13 Encoded",
      description: "Caesar cipher encoding",
      code: email.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13))),
    },
  ] : [];

  return (
    <ToolLayout title="Email Obfuscator" description="Obfuscate emails to prevent spam bots">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label>Enter Email Address</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" />
        </div>

        {methods.length > 0 && (
          <div className="space-y-4">
            {methods.map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(m.code); toast.success(`${m.label} copied!`); }}>Copy</Button>
                </div>
                <pre className="text-xs font-mono bg-accent/50 p-3 rounded-lg overflow-x-auto break-all whitespace-pre-wrap">{m.code}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

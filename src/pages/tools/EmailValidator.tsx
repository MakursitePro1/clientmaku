import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function validateEmail(email: string) {
  const checks = [
    { label: "Contains @ symbol", pass: email.includes("@") },
    { label: "Has domain part", pass: email.split("@")[1]?.includes(".") || false },
    { label: "No spaces", pass: !email.includes(" ") },
    { label: "Valid format", pass: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
    { label: "Domain has valid TLD", pass: /\.[a-z]{2,}$/i.test(email) },
    { label: "No consecutive dots", pass: !email.includes("..") },
    { label: "Starts with alphanumeric", pass: /^[a-zA-Z0-9]/.test(email) },
  ];
  const allPass = checks.every(c => c.pass);
  return { checks, valid: allPass };
}

export default function EmailValidator() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ReturnType<typeof validateEmail> | null>(null);

  return (
    <ToolLayout title="Email Validator" description="Validate email address format and structure">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address..." className="rounded-xl" />
          <Button onClick={() => setResult(validateEmail(email))} className="gradient-bg text-primary-foreground rounded-xl shrink-0">Validate</Button>
        </div>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border text-center text-lg font-bold ${result.valid ? "bg-green-500/10 border-green-500/30 text-green-700" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
              {result.valid ? "✅ Valid Email" : "❌ Invalid Email"}
            </div>
            <div className="space-y-2">
              {result.checks.map(c => (
                <div key={c.label} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-accent/20">
                  <span>{c.pass ? "✅" : "❌"}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DataLeakChecker() {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ safe: boolean; tips: string[] } | null>(null);

  const check = () => {
    if (!email.trim() || !email.includes("@")) return;
    setChecking(true);
    // Simulate - real check would use haveibeenpwned API
    setTimeout(() => {
      const safe = Math.random() > 0.4;
      setResult({
        safe,
        tips: safe
          ? ["Your email appears safe!", "Still, use unique passwords for each site.", "Enable 2FA where possible."]
          : ["Your email may have been found in data breaches.", "Change passwords for affected accounts immediately.", "Use a password manager.", "Enable two-factor authentication.", "Don't reuse passwords across sites."],
      });
      setChecking(false);
    }, 2000);
  };

  return (
    <ToolLayout title="Data Leak Checker" description="Check if your email has been in a data breach">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl flex-1" />
          <Button onClick={check} disabled={checking} className="gradient-bg text-primary-foreground rounded-xl">{checking ? "Checking..." : "Check"}</Button>
        </div>
        {result && (
          <div className={`rounded-2xl p-6 border ${result.safe ? "bg-green-500/10 border-green-500/20" : "bg-destructive/10 border-destructive/20"}`}>
            <div className="text-center mb-4">
              <p className="text-5xl mb-2">{result.safe ? "✅" : "⚠️"}</p>
              <p className={`text-xl font-bold ${result.safe ? "text-green-600" : "text-destructive"}`}>
                {result.safe ? "No breaches found!" : "Potential breach detected!"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Recommendations:</p>
              {result.tips.map((t, i) => <p key={i} className="text-sm text-muted-foreground">• {t}</p>)}
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">Note: This is a simulated check. For real breach data, integrate with haveibeenpwned.com API.</p>
      </div>
    </ToolLayout>
  );
}

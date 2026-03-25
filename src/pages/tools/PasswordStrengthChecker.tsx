import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

function checkStrength(pw: string) {
  let score = 0;
  const checks = [
    { label: "At least 8 characters", pass: pw.length >= 8 },
    { label: "At least 12 characters", pass: pw.length >= 12 },
    { label: "Contains uppercase", pass: /[A-Z]/.test(pw) },
    { label: "Contains lowercase", pass: /[a-z]/.test(pw) },
    { label: "Contains number", pass: /\d/.test(pw) },
    { label: "Contains special character", pass: /[^A-Za-z0-9]/.test(pw) },
    { label: "No common patterns", pass: !/^(123|abc|password|qwerty)/i.test(pw) },
  ];
  checks.forEach(c => { if (c.pass) score++; });
  const level = score <= 2 ? "Weak" : score <= 4 ? "Fair" : score <= 5 ? "Strong" : "Very Strong";
  const color = score <= 2 ? "hsl(0, 84%, 60%)" : score <= 4 ? "hsl(47, 95%, 55%)" : "hsl(142, 71%, 45%)";
  return { score, checks, level, color, percent: Math.round((score / checks.length) * 100) };
}

export default function PasswordStrengthChecker() {
  const [pw, setPw] = useState("");
  const result = pw ? checkStrength(pw) : null;

  return (
    <ToolLayout title="Password Strength Checker" description="Check how strong your password is">
      <div className="space-y-4 max-w-md mx-auto">
        <Input value={pw} onChange={e => setPw(e.target.value)} type="text" placeholder="Enter password to check..." className="rounded-xl text-lg" />
        {result && (
          <>
            <div className="h-3 rounded-full bg-accent/30 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${result.percent}%`, backgroundColor: result.color }} />
            </div>
            <p className="text-center text-lg font-bold" style={{ color: result.color }}>{result.level}</p>
            <div className="space-y-2">
              {result.checks.map(c => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span>{c.pass ? "✅" : "❌"}</span>
                  <span className={c.pass ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const checkStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const estimateCrackTime = (pw: string): string => {
  const charset = ((/[a-z]/.test(pw) ? 26 : 0) + (/[A-Z]/.test(pw) ? 26 : 0) + (/[0-9]/.test(pw) ? 10 : 0) + (/[^A-Za-z0-9]/.test(pw) ? 32 : 0)) || 1;
  const combinations = Math.pow(charset, pw.length);
  const guessesPerSec = 1e10;
  const seconds = combinations / guessesPerSec / 2;
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365 * 1000) return `${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6) return `${Math.round(seconds / (86400 * 365 * 1000))}K years`;
  return "Millions of years+";
};

const issues = (pw: string): string[] => {
  const r: string[] = [];
  if (pw.length < 8) r.push("Too short (min 8 characters)");
  if (!/[A-Z]/.test(pw)) r.push("Add uppercase letters");
  if (!/[a-z]/.test(pw)) r.push("Add lowercase letters");
  if (!/[0-9]/.test(pw)) r.push("Add numbers");
  if (!/[^A-Za-z0-9]/.test(pw)) r.push("Add special characters (!@#$%)");
  if (/(.)\1{2,}/.test(pw)) r.push("Avoid repeated characters");
  if (/^(123|abc|qwerty|password)/i.test(pw)) r.push("Avoid common patterns");
  return r;
};

export default function PasswordExpiryChecker() {
  const [password, setPassword] = useState("");

  const score = checkStrength(password);
  const maxScore = 7;
  const pct = (score / maxScore) * 100;
  const crackTime = estimateCrackTime(password);
  const pwIssues = issues(password);
  const level = score <= 2 ? "Weak" : score <= 4 ? "Moderate" : score <= 5 ? "Strong" : "Very Strong";
  const color = score <= 2 ? "bg-destructive" : score <= 4 ? "bg-yellow-500" : "bg-green-500";

  return (
    <ToolLayout title="Password Security Analyzer" description="Analyze password strength and estimated crack time">
      <div className="space-y-6 max-w-md mx-auto">
        <Input type="text" placeholder="Enter password to analyze..." value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl text-lg h-12" />
        {password && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Strength</span><span className="font-bold">{level}</span></div>
              <div className="h-3 bg-accent/30 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="bg-accent/50 rounded-xl p-5 text-center">
              <p className="text-sm text-muted-foreground">Estimated crack time</p>
              <p className="text-2xl font-bold text-primary mt-1">{crackTime}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-accent/30 rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">Length</p><p className="font-bold text-lg">{password.length}</p></div>
              <div className="bg-accent/30 rounded-xl p-3 text-center"><p className="text-xs text-muted-foreground">Score</p><p className="font-bold text-lg">{score}/{maxScore}</p></div>
            </div>
            {pwIssues.length > 0 && (
              <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
                <p className="text-sm font-bold mb-2 text-destructive">⚠️ Recommendations</p>
                <ul className="space-y-1">{pwIssues.map((iss, i) => <li key={i} className="text-sm text-muted-foreground">• {iss}</li>)}</ul>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

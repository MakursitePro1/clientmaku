import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PhishingLinkChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | { safe: boolean; issues: string[] }>(null);

  const check = () => {
    const issues: string[] = [];
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (u.hostname.includes("--") || u.hostname.includes("..")) issues.push("Suspicious hostname pattern");
      if (/\d{4,}/.test(u.hostname)) issues.push("IP-like domain detected");
      if (u.hostname.split(".").length > 4) issues.push("Too many subdomains");
      if (u.pathname.length > 100) issues.push("Unusually long path");
      if (u.search.includes("redirect") || u.search.includes("url=")) issues.push("Contains redirect parameter");
      if (u.hostname.includes("login") && !["google","facebook","microsoft","apple","amazon"].some(s => u.hostname.includes(s))) issues.push("Suspicious login domain");
      if (u.protocol === "http:") issues.push("Not using HTTPS");
      if (/[а-яА-Я]/.test(u.hostname)) issues.push("Contains Cyrillic characters (homograph attack)");
      const typos = ["g00gle","faceb00k","amaz0n","paypa1","micr0soft"];
      if (typos.some(t => u.hostname.includes(t))) issues.push("Possible typosquatting domain");
      if (u.hostname.length > 50) issues.push("Unusually long hostname");
    } catch { issues.push("Invalid URL format"); }
    setResult({ safe: issues.length === 0, issues });
  };

  return (
    <ToolLayout title="Phishing Link Checker" description="Check if a URL looks suspicious or potentially phishing">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL to check..." className="rounded-xl" />
          <Button onClick={check} className="gradient-bg text-primary-foreground rounded-xl shrink-0">Check</Button>
        </div>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border text-center text-lg font-bold ${result.safe ? "bg-green-500/10 border-green-500/30 text-green-700" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
              {result.safe ? "✅ URL appears safe" : `⚠️ ${result.issues.length} suspicious indicator${result.issues.length > 1 ? "s" : ""} found`}
            </div>
            {result.issues.length > 0 && (
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 text-sm">
                    <span>🚩</span><span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center">⚠️ This is a basic heuristic check. Always verify URLs manually before entering sensitive information.</p>
      </div>
    </ToolLayout>
  );
}

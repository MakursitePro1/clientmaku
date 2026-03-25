import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { error: "Invalid JWT: must have 3 parts" };
    const header = JSON.parse(atob(parts[0].replace(/-/g,"+").replace(/_/g,"/")));
    const payload = JSON.parse(atob(parts[1].replace(/-/g,"+").replace(/_/g,"/")));
    const exp = payload.exp ? new Date(payload.exp * 1000) : null;
    const isExpired = exp ? exp < new Date() : null;
    return { header, payload, signature: parts[2], exp, isExpired };
  } catch (e: any) { return { error: e.message }; }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);

  const decode = () => setResult(decodeJwt(token));

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JSON Web Tokens">
      <div className="space-y-4 max-w-2xl mx-auto">
        <Textarea value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here..." className="min-h-[80px] rounded-xl font-mono text-sm" />
        <Button onClick={decode} className="gradient-bg text-primary-foreground rounded-xl">Decode JWT</Button>
        {result && (
          result.error ? <p className="text-destructive">{result.error}</p> : (
            <div className="space-y-3">
              <div className="p-4 bg-accent/30 rounded-xl border border-border">
                <h3 className="font-semibold mb-2 text-sm">Header</h3>
                <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.header, null, 2)}</pre>
              </div>
              <div className="p-4 bg-accent/30 rounded-xl border border-border">
                <h3 className="font-semibold mb-2 text-sm">Payload</h3>
                <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.payload, null, 2)}</pre>
              </div>
              {result.exp && (
                <div className={`p-3 rounded-xl border text-sm ${result.isExpired ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-green-500/10 border-green-500/30 text-green-700"}`}>
                  {result.isExpired ? "⚠️ Token EXPIRED" : "✅ Token is valid"} — Expires: {result.exp.toLocaleString()}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}

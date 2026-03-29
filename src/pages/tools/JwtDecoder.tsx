import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileKey, Copy, AlertTriangle, Clock, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return JSON.parse(atob(str));
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) return { error: "Invalid JWT: must have 3 parts separated by dots" };
      const header = base64UrlDecode(parts[0]);
      const payload = base64UrlDecode(parts[1]);
      const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
      const issuedAt = payload.iat ? new Date(payload.iat * 1000).toLocaleString() : null;
      const expiresAt = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null;
      return { header, payload, signature: parts[2], isExpired, issuedAt, expiresAt, error: null };
    } catch (e: any) {
      return { error: "Failed to decode: " + e.message };
    }
  }, [token]);

  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  return (
    <ToolLayout toolId="jwt-decoder" title="JWT Decoder" description="Decode, inspect & verify JSON Web Tokens"
      icon={FileKey} color="hsl(35, 90%, 50%)">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-muted-foreground">Paste JWT Token</label>
            <Button variant="outline" size="sm" onClick={() => setToken(sampleJwt)}
              className="border-[hsl(35,90%,50%)]/30 hover:bg-[hsl(35,90%,50%)]/10 text-xs">
              Load Sample
            </Button>
          </div>
          <Textarea value={token} onChange={e => setToken(e.target.value)} rows={4}
            className="font-mono text-xs break-all" placeholder="eyJhbGciOiJIUzI1NiIs..." />
        </div>

        {decoded?.error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-destructive">{decoded.error}</span>
          </div>
        )}

        {decoded && !decoded.error && (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                decoded.isExpired ? "bg-destructive/10 text-destructive border border-destructive/30" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              }`}>
                {decoded.isExpired ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {decoded.isExpired ? "Expired" : "Valid (Not Expired)"}
              </div>
              {decoded.issuedAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Issued: {decoded.issuedAt}
                </span>
              )}
              {decoded.expiresAt && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Expires: {decoded.expiresAt}
                </span>
              )}
            </div>

            {/* Header */}
            <div className="p-5 rounded-2xl border border-[hsl(35,90%,50%)]/20 bg-card/80">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[hsl(35,90%,50%)]">Header</h3>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(JSON.stringify(decoded.header, null, 2)); toast.success("Copied!"); }}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="font-mono text-sm bg-background/50 p-4 rounded-xl overflow-auto whitespace-pre-wrap text-foreground">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-5 rounded-2xl border border-primary/20 bg-card/80">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-primary">Payload</h3>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2)); toast.success("Copied!"); }}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="font-mono text-sm bg-background/50 p-4 rounded-xl overflow-auto whitespace-pre-wrap text-foreground">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              {/* Payload fields */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(decoded.payload).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-accent/30">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{key}</p>
                    <p className="text-sm font-semibold truncate">{String(val)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
              <h3 className="text-sm font-bold mb-3 text-muted-foreground">Signature</h3>
              <p className="font-mono text-xs break-all bg-background/50 p-3 rounded-xl text-muted-foreground">{decoded.signature}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

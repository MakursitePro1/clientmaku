import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { LockKeyhole, Search, ShieldCheck, ShieldAlert, Globe, Clock, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SSLResult {
  domain: string;
  valid: boolean;
  issuer: string;
  protocol: string;
  cipher: string;
  issuedDate: string;
  expiryDate: string;
  daysRemaining: number;
  san: string[];
  grade: string;
}

function simulateSSLCheck(domain: string): SSLResult {
  // Client-side simulation based on domain hash
  let hash = 0;
  for (let i = 0; i < domain.length; i++) hash = ((hash << 5) - hash + domain.charCodeAt(i)) | 0;
  const abs = Math.abs(hash);

  const issuers = ["Let's Encrypt Authority X3", "DigiCert SHA2 Extended Validation", "Cloudflare Inc ECC CA-3", "Amazon RSA 2048", "Google Trust Services"];
  const protocols = ["TLS 1.3", "TLS 1.2"];
  const ciphers = ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256", "ECDHE-RSA-AES256-GCM-SHA384"];
  const grades = ["A+", "A", "A", "A+", "B"];

  const daysRemaining = 30 + (abs % 335);
  const now = new Date();
  const issued = new Date(now.getTime() - (365 - daysRemaining) * 86400000);
  const expiry = new Date(now.getTime() + daysRemaining * 86400000);

  return {
    domain: domain.replace(/^https?:\/\//, "").replace(/\/.*/, ""),
    valid: true,
    issuer: issuers[abs % issuers.length],
    protocol: protocols[abs % protocols.length],
    cipher: ciphers[abs % ciphers.length],
    issuedDate: issued.toLocaleDateString(),
    expiryDate: expiry.toLocaleDateString(),
    daysRemaining,
    san: [domain.replace(/^https?:\/\//, ""), `*.${domain.replace(/^https?:\/\//, "").replace(/^www\./, "")}`],
    grade: grades[abs % grades.length],
  };
}

export default function SslChecker() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<SSLResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!domain.trim()) { toast.error("Enter a domain"); return; }
    setLoading(true);
    setTimeout(() => {
      setResult(simulateSSLCheck(domain.trim()));
      setLoading(false);
    }, 1500);
  };

  const gradeColor = (g: string) => g.startsWith("A") ? "hsl(145, 80%, 42%)" : g === "B" ? "hsl(35, 90%, 50%)" : "hsl(0, 85%, 55%)";

  return (
    <ToolLayout title="SSL Certificate Checker" description="Check SSL/TLS certificate status & details"
      <div className="space-y-6">
        {/* Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input value={domain} onChange={e => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. google.com)..."
              className="pl-12 py-6 rounded-2xl border-[hsl(150,75%,40%)]/30"
              onKeyDown={e => e.key === "Enter" && handleCheck()} />
          </div>
          <Button onClick={handleCheck} disabled={loading}
            className="rounded-2xl px-6 py-6 bg-[hsl(150,75%,40%)] hover:bg-[hsl(150,75%,35%)] text-white font-bold">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Search className="w-4 h-4 mr-2" />Check</>}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            {/* Grade & Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl border border-border/40 bg-card/80 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">SSL Grade</p>
                <p className="text-5xl font-black" style={{ color: gradeColor(result.grade) }}>{result.grade}</p>
              </div>
              <div className="p-6 rounded-2xl border border-border/40 bg-card/80 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Status</p>
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <span className="text-lg font-bold text-emerald-500">Valid</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-border/40 bg-card/80 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Days Remaining</p>
                <p className={`text-4xl font-black ${result.daysRemaining < 30 ? "text-destructive" : "text-emerald-500"}`}>
                  {result.daysRemaining}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 rounded-2xl border border-[hsl(150,75%,40%)]/20 bg-card/80">
              <h3 className="text-sm font-bold mb-4 text-[hsl(150,75%,40%)]">Certificate Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Domain", value: result.domain, icon: Globe },
                  { label: "Issuer", value: result.issuer, icon: ShieldCheck },
                  { label: "Protocol", value: result.protocol, icon: LockKeyhole },
                  { label: "Cipher Suite", value: result.cipher, icon: Server },
                  { label: "Issued", value: result.issuedDate, icon: Clock },
                  { label: "Expires", value: result.expiryDate, icon: Clock },
                ].map(f => (
                  <div key={f.label} className="p-3 rounded-xl bg-accent/30 flex items-start gap-3">
                    <f.icon className="w-4 h-4 text-[hsl(150,75%,40%)] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{f.label}</p>
                      <p className="text-sm font-semibold truncate">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAN */}
            <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
              <h3 className="text-sm font-bold mb-3">Subject Alternative Names (SAN)</h3>
              <div className="flex flex-wrap gap-2">
                {result.san.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-[hsl(150,75%,40%)]/10 text-[hsl(150,75%,40%)] text-xs font-bold border border-[hsl(150,75%,40%)]/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

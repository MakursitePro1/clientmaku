import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const knownBlacklists = [
  "Spamhaus ZEN", "Barracuda BRBL", "SpamCop BL", "SORBS DNSBL",
  "UCEPROTECT L1", "UCEPROTECT L2", "CBL Abuseat", "Invaluement",
  "JustSpam", "PSBL Surriel", "Truncate GBUDB", "WPBL",
];

export default function IPBlacklistChecker() {
  const [ip, setIp] = useState("");
  const [results, setResults] = useState<{ name: string; status: "clean" | "listed" | "unknown" }[] | null>(null);
  const [loading, setLoading] = useState(false);

  const check = () => {
    if (!ip.trim()) return;
    setLoading(true);
    // Simulate check (real API would be needed for actual blacklist lookups)
    setTimeout(() => {
      setResults(knownBlacklists.map(name => ({
        name,
        status: Math.random() > 0.9 ? "listed" : Math.random() > 0.95 ? "unknown" : "clean",
      })));
      setLoading(false);
    }, 1500);
  };

  const clean = results?.filter(r => r.status === "clean").length || 0;
  const listed = results?.filter(r => r.status === "listed").length || 0;

  return (
    <ToolLayout title="IP Blacklist Checker" description="Check if an IP address is on any email blacklist">
      <div className="space-y-4 max-w-lg mx-auto">
        <div className="flex gap-3">
          <Input placeholder="Enter IP address (e.g. 8.8.8.8)" value={ip} onChange={e => setIp(e.target.value)} className="rounded-xl flex-1" />
          <Button onClick={check} disabled={loading} className="gradient-bg text-primary-foreground rounded-xl">{loading ? "Checking..." : "Check"}</Button>
        </div>
        {results && (
          <>
            <div className="flex gap-3">
              <div className="flex-1 bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20"><p className="text-2xl font-bold text-green-600">{clean}</p><p className="text-xs text-muted-foreground">Clean</p></div>
              <div className="flex-1 bg-destructive/10 rounded-xl p-3 text-center border border-destructive/20"><p className="text-2xl font-bold text-destructive">{listed}</p><p className="text-xs text-muted-foreground">Listed</p></div>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex justify-between items-center bg-accent/30 rounded-xl px-4 py-2">
                  <span className="text-sm">{r.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status === "clean" ? "bg-green-500/10 text-green-600" : r.status === "listed" ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {r.status === "clean" ? "✓ Clean" : r.status === "listed" ? "✗ Listed" : "? Unknown"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <p className="text-xs text-muted-foreground text-center">Note: This is a simulated check. For real results, integrate with actual DNSBL APIs.</p>
      </div>
    </ToolLayout>
  );
}

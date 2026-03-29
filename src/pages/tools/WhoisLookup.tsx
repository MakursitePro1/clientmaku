import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Globe, Copy } from "lucide-react";

interface WhoisResult {
  domain: string;
  info: Record<string, string>;
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const clean = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();

    try {
      // Using a free WHOIS API
      const res = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${encodeURIComponent(clean)}`, {
        headers: { "X-Api-Key": "free" }
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      if (data && Object.keys(data).length > 0) {
        const info: Record<string, string> = {};
        if (data.domain_name) info["Domain"] = Array.isArray(data.domain_name) ? data.domain_name[0] : data.domain_name;
        if (data.registrar) info["Registrar"] = data.registrar;
        if (data.creation_date) info["Created"] = Array.isArray(data.creation_date) ? data.creation_date[0] : data.creation_date;
        if (data.expiration_date) info["Expires"] = Array.isArray(data.expiration_date) ? data.expiration_date[0] : data.expiration_date;
        if (data.name_servers) info["Name Servers"] = Array.isArray(data.name_servers) ? data.name_servers.join(", ") : data.name_servers;
        if (data.dnssec) info["DNSSEC"] = data.dnssec;
        if (data.org) info["Organization"] = data.org;
        if (data.state) info["State"] = data.state;
        if (data.country) info["Country"] = data.country;

        if (Object.keys(info).length === 0) {
          info["Domain"] = clean;
          info["Status"] = "No detailed WHOIS data available";
        }

        setResult({ domain: clean, info });
        toast.success("WHOIS lookup complete!");
      } else {
        // Fallback with basic info
        setResult({
          domain: clean,
          info: {
            "Domain": clean,
            "Status": "WHOIS data not available via free API",
            "Tip": "Try rdap.org or whois.domaintools.com for detailed results"
          }
        });
      }
    } catch {
      // Provide fallback result
      setResult({
        domain: clean,
        info: {
          "Domain": clean,
          "Status": "Could not fetch WHOIS data",
          "Suggestion": "Try visiting whois.domaintools.com/" + clean
        }
      });
      toast.info("Showing basic info - external API unavailable");
    }

    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    const text = Object.entries(result.info).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <ToolLayout title="Whois Lookup" description="Look up domain registration and ownership details">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex gap-2">
          <Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="Enter domain (e.g. google.com)..." className="rounded-xl" onKeyDown={e => e.key === "Enter" && lookup()} />
          <Button onClick={lookup} disabled={loading || !domain.trim()} className="rounded-xl gap-2 gradient-bg text-primary-foreground shrink-0">
            <Search className="w-4 h-4" /> {loading ? "..." : "Lookup"}
          </Button>
        </div>

        {result && (
          <div className="p-4 bg-card rounded-xl border border-border/50 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{result.domain}</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(result.info).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start gap-4 py-1.5 border-b border-border/20 last:border-0">
                  <span className="text-xs text-muted-foreground font-medium shrink-0">{key}</span>
                  <span className="text-sm text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            <Button onClick={copyAll} variant="outline" size="sm" className="rounded-lg gap-1 mt-2">
              <Copy className="w-3 h-3" /> Copy All
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

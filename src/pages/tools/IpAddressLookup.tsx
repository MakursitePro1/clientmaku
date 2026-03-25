import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, MapPin, Building, Wifi, Shield, Clock } from "lucide-react";

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
  postal: string;
  hostname?: string;
}

export default function IpAddressLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (customIp?: string) => {
    setLoading(true);
    setError("");
    setInfo(null);
    try {
      const target = customIp || ip.trim();
      const url = target
        ? `https://ipinfo.io/${target}/json`
        : `https://ipinfo.io/json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch IP info");
      const data = await res.json();
      if (data.bogon) throw new Error("This is a private/bogon IP address");
      setInfo(data);
      if (!customIp && !ip.trim()) setIp(data.ip);
    } catch (err: any) {
      setError(err.message || "Lookup failed");
    }
    setLoading(false);
  };

  const cards = info
    ? [
        { icon: Globe, label: "IP Address", value: info.ip },
        { icon: MapPin, label: "Location", value: `${info.city || "N/A"}, ${info.region || "N/A"}` },
        { icon: Building, label: "Country", value: info.country || "N/A" },
        { icon: Wifi, label: "ISP / Org", value: info.org || "N/A" },
        { icon: Clock, label: "Timezone", value: info.timezone || "N/A" },
        { icon: Shield, label: "Postal Code", value: info.postal || "N/A" },
      ]
    : [];

  return (
    <ToolLayout title="IP Address Lookup" description="Find geolocation and details of any IP address">
      <div className="space-y-6">
        <div className="flex gap-3">
          <Input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address or leave empty for your IP"
            className="rounded-xl flex-1"
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <Button onClick={() => lookup()} disabled={loading} className="gradient-bg text-primary-foreground rounded-xl font-semibold shrink-0">
            {loading ? "Looking up..." : "Lookup"}
          </Button>
        </div>

        <Button variant="outline" className="rounded-xl" onClick={() => lookup("")} disabled={loading}>
          Find My IP Address
        </Button>

        {error && <div className="text-destructive bg-destructive/10 rounded-xl p-4 text-sm">{error}</div>}

        {info && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((c) => (
                <div key={c.label} className="bg-accent/30 rounded-xl border border-border/50 p-4 flex items-start gap-3">
                  <c.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="font-semibold text-sm break-all">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {info.loc && (
              <div className="rounded-xl overflow-hidden border border-border/50">
                <iframe
                  title="Location Map"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    Number(info.loc.split(",")[1]) - 0.05
                  },${Number(info.loc.split(",")[0]) - 0.05},${
                    Number(info.loc.split(",")[1]) + 0.05
                  },${Number(info.loc.split(",")[0]) + 0.05}&layer=mapnik&marker=${info.loc}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

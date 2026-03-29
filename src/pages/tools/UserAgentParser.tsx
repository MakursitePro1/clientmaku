import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { MonitorSmartphone, Copy, RefreshCw, Globe, Cpu, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function parseUA(ua: string) {
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[\s/]?([\d.]+)?/i);
  const os = ua.match(/(Windows NT [\d.]+|Mac OS X [\d._]+|Linux|Android [\d.]+|iPhone OS [\d_]+|iPad)/i);
  const engine = ua.match(/(Gecko|WebKit|Blink|Trident|Presto)[\s/]?([\d.]+)?/i);
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isBot = /bot|crawl|spider|slurp|googlebot/i.test(ua);
  
  let browserName = browser?.[1] || "Unknown";
  let browserVersion = browser?.[2] || "Unknown";
  if (browserName === "Trident") { browserName = "Internet Explorer"; browserVersion = ua.match(/rv:([\d.]+)/)?.[1] || "11"; }

  let osName = os?.[1] || "Unknown";
  if (osName.startsWith("Windows NT")) {
    const ver: Record<string, string> = { "10.0": "Windows 10/11", "6.3": "Windows 8.1", "6.2": "Windows 8", "6.1": "Windows 7" };
    osName = ver[osName.replace("Windows NT ", "")] || osName;
  }
  if (osName.includes("Mac OS X")) osName = "macOS " + osName.replace("Mac OS X ", "").replace(/_/g, ".");
  if (osName.includes("iPhone OS")) osName = "iOS " + osName.replace("iPhone OS ", "").replace(/_/g, ".");

  return {
    browser: browserName,
    browserVersion,
    os: osName,
    engine: engine?.[1] || "Unknown",
    engineVersion: engine?.[2] || "",
    isMobile, isBot,
    deviceType: isBot ? "Bot/Crawler" : isMobile ? "Mobile" : "Desktop",
  };
}

export default function UserAgentParser() {
  const [ua, setUa] = useState(navigator.userAgent);
  const parsed = useMemo(() => parseUA(ua), [ua]);

  const fields = [
    { label: "Browser", value: `${parsed.browser} ${parsed.browserVersion}`, icon: Globe, color: "hsl(200, 85%, 48%)" },
    { label: "Operating System", value: parsed.os, icon: Monitor, color: "hsl(145, 80%, 42%)" },
    { label: "Engine", value: `${parsed.engine} ${parsed.engineVersion}`, icon: Cpu, color: "hsl(35, 90%, 50%)" },
    { label: "Device Type", value: parsed.deviceType, icon: parsed.isMobile ? Smartphone : Monitor, color: "hsl(310, 75%, 50%)" },
  ];

  return (
    <ToolLayout toolId="user-agent-parser" title="User Agent Parser" description="Parse & analyze browser user agent strings"
      icon={MonitorSmartphone} color="hsl(310, 75%, 50%)">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-muted-foreground">User Agent String</label>
            <Button variant="outline" size="sm" onClick={() => setUa(navigator.userAgent)}
              className="border-[hsl(310,75%,50%)]/30 hover:bg-[hsl(310,75%,50%)]/10 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />Use Current
            </Button>
          </div>
          <Textarea value={ua} onChange={e => setUa(e.target.value)} rows={3}
            className="font-mono text-xs" placeholder="Paste a user agent string..." />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.label} className="p-5 rounded-2xl border border-border/40 bg-card/80 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: f.color + "20", color: f.color }}>
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase">{f.label}</span>
              </div>
              <p className="text-lg font-bold">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Raw Analysis */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">Full Analysis</h3>
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(JSON.stringify(parsed, null, 2)); toast.success("Copied!"); }}>
              <Copy className="w-3 h-3 mr-1" />Copy JSON
            </Button>
          </div>
          <pre className="font-mono text-xs bg-background/50 p-4 rounded-xl overflow-auto whitespace-pre-wrap text-foreground">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-3">
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${parsed.isMobile ? "bg-amber-500/10 text-amber-500 border border-amber-500/30" : "bg-accent/50 text-muted-foreground border border-border/40"}`}>
            📱 Mobile: {parsed.isMobile ? "Yes" : "No"}
          </span>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${parsed.isBot ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-accent/50 text-muted-foreground border border-border/40"}`}>
            🤖 Bot: {parsed.isBot ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UserAgentParser() {
  const [ua, setUa] = useState(navigator.userAgent);

  const parse = (s: string) => {
    const browser = s.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[\/\s]?([\d.]+)/i);
    const os = s.match(/(Windows NT [\d.]+|Mac OS X [\d_.]+|Linux|Android [\d.]+|iPhone OS [\d_]+|iPad)/i);
    const mobile = /Mobile|Android|iPhone|iPad/i.test(s);
    const bot = /bot|crawl|spider|slurp/i.test(s);
    return {
      browser: browser ? `${browser[1]} ${browser[2]}` : "Unknown",
      os: os ? os[1].replace(/_/g, ".") : "Unknown",
      mobile, bot,
      engine: s.includes("Gecko") ? "Gecko" : s.includes("WebKit") ? "WebKit" : s.includes("Trident") ? "Trident" : "Unknown",
    };
  };

  const info = parse(ua);

  return (
    <ToolLayout title="User Agent Parser" description="Parse and analyze browser user agent strings">
      <div className="space-y-4 max-w-lg mx-auto">
        <Input value={ua} onChange={e => setUa(e.target.value)} className="rounded-xl font-mono text-xs" />
        <Button onClick={() => setUa(navigator.userAgent)} variant="outline" className="rounded-xl" size="sm">Use My User Agent</Button>
        <div className="space-y-2">
          {[
            { label: "Browser", value: info.browser },
            { label: "Operating System", value: info.os },
            { label: "Engine", value: info.engine },
            { label: "Device Type", value: info.mobile ? "📱 Mobile" : "💻 Desktop" },
            { label: "Bot", value: info.bot ? "🤖 Yes" : "👤 No" },
          ].map(i => (
            <div key={i.label} className="flex justify-between p-3 rounded-xl bg-accent/30 border border-border">
              <span className="text-sm text-muted-foreground">{i.label}</span>
              <span className="font-bold">{i.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

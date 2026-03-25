import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const zones = ["UTC","America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Tokyo","Asia/Kolkata","Asia/Dhaka","Asia/Dubai","Australia/Sydney","Pacific/Auckland","America/Chicago","Asia/Shanghai","Asia/Singapore"];

export default function TimeZoneConverter() {
  const [from, setFrom] = useState("UTC");
  const [to, setTo] = useState("Asia/Dhaka");
  const [now, setNow] = useState(new Date());

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  const fmt = (tz: string) => now.toLocaleString("en-US", { timeZone: tz, hour12: true, weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <ToolLayout title="Time Zone Converter" description="Convert time between world time zones">
      <div className="space-y-6 max-w-lg mx-auto">
        {[{ label: "From", value: from, set: setFrom }, { label: "To", value: to, set: setTo }].map(z => (
          <div key={z.label} className="bg-accent/50 rounded-xl p-5">
            <label className="text-sm font-semibold mb-2 block">{z.label}</label>
            <Select value={z.value} onValueChange={z.set}>
              <SelectTrigger className="rounded-xl mb-3"><SelectValue /></SelectTrigger>
              <SelectContent>{zones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
            </Select>
            <div className="text-lg font-mono font-bold gradient-text">{fmt(z.value)}</div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

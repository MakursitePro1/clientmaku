import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Clock, Copy, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday 9 AM", cron: "0 9 * * 1" },
  { label: "Every month 1st", cron: "0 0 1 * *" },
  { label: "Weekdays 8 AM", cron: "0 8 * * 1-5" },
  { label: "Every Sunday 6 PM", cron: "0 18 * * 0" },
];

const FIELDS = [
  { name: "Minute", range: "0-59", specials: "* , - /", index: 0 },
  { name: "Hour", range: "0-23", specials: "* , - /", index: 1 },
  { name: "Day of Month", range: "1-31", specials: "* , - / L W", index: 2 },
  { name: "Month", range: "1-12", specials: "* , - /", index: 3 },
  { name: "Day of Week", range: "0-6 (Sun=0)", specials: "* , - / L #", index: 4 },
];

function describeCron(parts: string[]): string {
  if (parts.length !== 5) return "Invalid cron expression";
  const [min, hr, dom, mon, dow] = parts;
  let desc = "";
  if (min === "*" && hr === "*") desc = "Every minute";
  else if (min.startsWith("*/")) desc = `Every ${min.slice(2)} minutes`;
  else if (hr === "*") desc = `At minute ${min} of every hour`;
  else if (min === "0" && hr === "0") desc = "At midnight (00:00)";
  else if (min === "0") desc = `At ${hr}:00`;
  else desc = `At ${hr}:${min.padStart(2, "0")}`;
  if (dom !== "*") desc += `, on day ${dom} of the month`;
  if (mon !== "*") desc += `, in month ${mon}`;
  if (dow !== "*") {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    if (dow.includes("-")) { const [a,b] = dow.split("-"); desc += `, ${days[+a]||dow} to ${days[+b]||dow}`; }
    else if (dow.includes(",")) desc += `, on days ${dow}`;
    else desc += `, on ${days[+dow] || dow}`;
  }
  return desc;
}

export default function CronGenerator() {
  const [cron, setCron] = useState("* * * * *");
  const parts = cron.trim().split(/\s+/);

  const updateField = (index: number, value: string) => {
    const p = [...parts];
    while (p.length < 5) p.push("*");
    p[index] = value;
    setCron(p.join(" "));
  };

  const description = useMemo(() => describeCron(parts), [cron]);

  // Next 5 runs simulation
  const nextRuns = useMemo(() => {
    const runs: string[] = [];
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      const d = new Date(now.getTime() + i * 60000 * (parts[0]?.startsWith("*/") ? parseInt(parts[0].slice(2)) || 1 : 1));
      runs.push(d.toLocaleString());
    }
    return runs;
  }, [cron]);

  return (
    <ToolLayout title="Cron Expression Generator" description="Build & explain cron schedule expressions visually">
      <div className="space-y-6">
        {/* Presets */}
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-2 block">Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <Button key={p.label} variant="outline" size="sm" onClick={() => setCron(p.cron)}
                className="border-[hsl(200,85%,48%)]/30 hover:bg-[hsl(200,85%,48%)]/10 text-xs">
                <BookOpen className="w-3 h-3 mr-1" />{p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Input */}
        <div className="p-5 rounded-2xl border border-[hsl(200,85%,48%)]/20 bg-card/80">
          <label className="text-sm font-semibold mb-2 block">Cron Expression</label>
          <div className="flex items-center gap-2">
            <Input value={cron} onChange={e => setCron(e.target.value)}
              className="font-mono text-xl text-center tracking-widest font-bold border-[hsl(200,85%,48%)]/30" />
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(cron); toast.success("Copied!"); }}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="mt-3 text-sm text-[hsl(200,85%,48%)] font-medium text-center">{description}</p>
        </div>

        {/* Field Editor */}
        <div className="grid grid-cols-5 gap-3">
          {FIELDS.map(f => (
            <div key={f.name} className="p-3 rounded-xl border border-border/40 bg-card/80 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{f.name}</p>
              <Input value={parts[f.index] || "*"} onChange={e => updateField(f.index, e.target.value)}
                className="text-center font-mono font-bold text-lg h-12" />
              <p className="text-[9px] text-muted-foreground mt-1">{f.range}</p>
              <p className="text-[9px] text-muted-foreground/60">{f.specials}</p>
            </div>
          ))}
        </div>

        {/* Next Runs */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[hsl(200,85%,48%)]" /> Approximate Next Runs
          </h3>
          <div className="space-y-2">
            {nextRuns.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent/30 text-sm">
                <span className="w-6 h-6 rounded-full bg-[hsl(200,85%,48%)]/20 text-[hsl(200,85%,48%)] text-xs font-bold flex items-center justify-center">{i+1}</span>
                <span className="font-mono">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
          <h3 className="text-sm font-bold mb-3">Cron Syntax Reference</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["*", "Any value"],
              [",", "Value list (1,3,5)"],
              ["-", "Range (1-5)"],
              ["/", "Step (*/5 = every 5)"],
              ["L", "Last (day of month/week)"],
              ["W", "Nearest weekday"],
            ].map(([sym, desc]) => (
              <div key={sym} className="flex items-center gap-2 p-2 rounded-lg bg-accent/20">
                <code className="font-mono font-bold text-[hsl(200,85%,48%)]">{sym}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

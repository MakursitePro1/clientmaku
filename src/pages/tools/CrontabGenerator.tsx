import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const presets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every month 1st at noon", value: "0 12 1 * *" },
  { label: "Every Sunday at 3 PM", value: "0 15 * * 0" },
];

const fields = ["Minute (0-59)", "Hour (0-23)", "Day of Month (1-31)", "Month (1-12)", "Day of Week (0-6)"];

function describeCron(parts: string[]) {
  if (parts.length !== 5) return "Invalid cron expression";
  const [min, hr, dom, mon, dow] = parts;
  let desc = "Runs ";
  if (min === "*" && hr === "*") desc += "every minute";
  else if (min.startsWith("*/")) desc += `every ${min.slice(2)} minutes`;
  else if (hr === "*") desc += `at minute ${min} of every hour`;
  else desc += `at ${hr.padStart(2,"0")}:${min.padStart(2,"0")}`;
  if (dom !== "*") desc += ` on day ${dom}`;
  if (mon !== "*") desc += ` of month ${mon}`;
  if (dow !== "*") { const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; desc += ` on ${days[+dow] || dow}`; }
  return desc;
}

export default function CrontabGenerator() {
  const [parts, setParts] = useState(["*","*","*","*","*"]);
  const cron = parts.join(" ");

  const update = (i: number, v: string) => { const n = [...parts]; n[i] = v; setParts(n); };
  const copy = () => { navigator.clipboard.writeText(cron); toast.success("Copied!"); };

  return (
    <ToolLayout title="Crontab Generator" description="Generate and understand cron expressions">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {fields.map((f, i) => (
            <div key={f}>
              <label className="text-xs text-muted-foreground block mb-1">{f}</label>
              <Input value={parts[i]} onChange={e => update(i, e.target.value)} className="rounded-xl text-center font-mono" />
            </div>
          ))}
        </div>
        <div className="p-4 bg-accent/30 rounded-xl border border-border text-center">
          <p className="font-mono text-2xl font-bold mb-2">{cron}</p>
          <p className="text-sm text-muted-foreground">{describeCron(parts)}</p>
        </div>
        <Button onClick={copy} className="gradient-bg text-primary-foreground rounded-xl w-full">Copy Cron Expression</Button>
        <div>
          <h3 className="font-semibold mb-2">Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <Button key={p.value} size="sm" variant="outline" className="rounded-xl" onClick={() => setParts(p.value.split(" "))}>{p.label}</Button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

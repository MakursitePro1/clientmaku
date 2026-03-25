import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

export default function DateDiffCalculator() {
  const [d1, setD1] = useState(new Date().toISOString().split("T")[0]);
  const [d2, setD2] = useState("");

  const ms = d1 && d2 ? Math.abs(new Date(d2).getTime() - new Date(d1).getTime()) : 0;
  const days = Math.floor(ms / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  const hours = days * 24;

  const stats = [
    { label: "Years", value: years },
    { label: "Months", value: months },
    { label: "Weeks", value: weeks },
    { label: "Days", value: days },
    { label: "Hours", value: hours },
  ];

  return (
    <ToolLayout title="Date Difference Calculator" description="Calculate the exact difference between two dates">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-semibold mb-1 block">Start Date</label><Input type="date" value={d1} onChange={e => setD1(e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm font-semibold mb-1 block">End Date</label><Input type="date" value={d2} onChange={e => setD2(e.target.value)} className="rounded-xl" /></div>
        </div>
        {d1 && d2 && (
          <div className="grid grid-cols-5 gap-2">
            {stats.map(s => (
              <div key={s.label} className="bg-accent/50 rounded-xl p-3 text-center">
                <div className="text-xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

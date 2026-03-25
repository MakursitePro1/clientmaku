import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [diff, setDiff] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);
  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!targetDate) { setDiff(null); return; }
    const update = () => {
      const ms = new Date(targetDate).getTime() - Date.now();
      if (ms <= 0) { setDiff({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setDiff({ days: Math.floor(ms/86400000), hours: Math.floor((ms%86400000)/3600000), mins: Math.floor((ms%3600000)/60000), secs: Math.floor((ms%60000)/1000) });
    };
    update();
    interval.current = setInterval(update, 1000);
    return () => clearInterval(interval.current);
  }, [targetDate]);

  const boxes = diff ? [
    { label: "Days", value: diff.days },
    { label: "Hours", value: diff.hours },
    { label: "Minutes", value: diff.mins },
    { label: "Seconds", value: diff.secs },
  ] : [];

  return (
    <ToolLayout title="Countdown Timer" description="Set a countdown to any future date and time">
      <div className="space-y-6 max-w-xl mx-auto text-center">
        <Input type="datetime-local" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="rounded-xl mx-auto max-w-xs" />
        {diff && (
          <div className="grid grid-cols-4 gap-3">
            {boxes.map(b => (
              <div key={b.label} className="bg-accent/50 rounded-2xl p-4">
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text">{b.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

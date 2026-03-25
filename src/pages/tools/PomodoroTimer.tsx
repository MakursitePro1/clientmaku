import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

const PomodoroTimer = () => {
  const [mode, setMode] = useState<"work" | "short" | "long">("work");
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durations = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setRunning(false);
            if (mode === "work") setSessions(s => s + 1);
            new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczFj2markup").play().catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const switchMode = (m: "work" | "short" | "long") => { setMode(m); setTime(durations[m]); setRunning(false); };
  const reset = () => { setTime(durations[mode]); setRunning(false); };

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const progress = ((durations[mode] - time) / durations[mode]) * 100;

  return (
    <ToolLayout title="Pomodoro Timer" description="Stay focused with the Pomodoro technique">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex gap-2">
          {([
            { key: "work" as const, label: "Focus", icon: Brain },
            { key: "short" as const, label: "Short Break", icon: Coffee },
            { key: "long" as const, label: "Long Break", icon: Coffee },
          ]).map(m => (
            <button key={m.key} onClick={() => switchMode(m.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${mode === m.key ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground"}`}>
              <m.icon className="w-3.5 h-3.5" /> {m.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000" />
            <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(263, 85%, 58%)" /><stop offset="100%" stopColor="hsl(290, 90%, 60%)" />
            </linearGradient></defs>
          </svg>
          <div className="absolute text-center">
            <div className="text-5xl font-mono font-bold">{mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}</div>
            <div className="text-sm text-muted-foreground mt-1 capitalize">{mode === "work" ? "Focus Time" : mode === "short" ? "Short Break" : "Long Break"}</div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => setRunning(!running)} className={`rounded-xl font-semibold gap-2 px-8 ${running ? "bg-destructive text-destructive-foreground" : "gradient-bg text-primary-foreground"}`}>
            {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {time < durations[mode] ? "Resume" : "Start"}</>}
          </Button>
          <Button variant="outline" onClick={reset} className="rounded-xl gap-2"><RotateCcw className="w-4 h-4" /> Reset</Button>
        </div>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">Sessions completed: </span>
          <span className="font-bold gradient-text text-lg">{sessions}</span>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PomodoroTimer;

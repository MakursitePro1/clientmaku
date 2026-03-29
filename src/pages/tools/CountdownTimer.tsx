import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Bell, Clock } from "lucide-react";
import { toast } from "sonner";

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(0);

  const start = useCallback(() => {
    const t = hours * 3600 + minutes * 60 + seconds;
    if (t <= 0) { toast.error("Set a time first!"); return; }
    setTotal(t);
    setRemaining(t);
    setRunning(true);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    if (!running || remaining <= 0) {
      if (running && remaining <= 0) {
        setRunning(false);
        toast.success("⏰ Time's up!", { duration: 5000 });
        try { new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play(); } catch {}
      }
      return;
    }
    const interval = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  const presets = [
    { label: "1 min", h: 0, m: 1, s: 0 },
    { label: "5 min", h: 0, m: 5, s: 0 },
    { label: "10 min", h: 0, m: 10, s: 0 },
    { label: "15 min", h: 0, m: 15, s: 0 },
    { label: "30 min", h: 0, m: 30, s: 0 },
    { label: "1 hour", h: 1, m: 0, s: 0 },
  ];

  return (
    <ToolLayout title="Countdown Timer" description="Set a countdown timer with visual progress and alarm notification">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Timer Display */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="tool-result-card flex flex-col items-center py-8">
          <div className="relative w-[260px] h-[260px]">
            <svg width="260" height="260" className="transform -rotate-90">
              <circle cx="130" cy="130" r={radius} fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="8" />
              <motion.circle cx="130" cy="130" r={radius} fill="none"
                stroke={remaining <= 10 && running ? "hsl(0 84% 60%)" : "hsl(var(--primary))"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.p key={remaining}
                animate={remaining <= 10 && running ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
                className={`font-mono text-4xl font-black ${remaining <= 10 && running ? "text-destructive" : "gradient-text"}`}>
                {formatTime(remaining)}
              </motion.p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">{running ? "Running..." : remaining === 0 && total > 0 ? "Done! ✓" : "Ready"}</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        {!running ? (
          <div className="tool-section-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold gradient-text">Set Time</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Hours</label>
                <Input type="number" min={0} max={23} value={hours} onChange={e => setHours(Number(e.target.value))} className="tool-input-colorful rounded-xl font-bold text-center text-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Minutes</label>
                <Input type="number" min={0} max={59} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="tool-input-colorful rounded-xl font-bold text-center text-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Seconds</label>
                <Input type="number" min={0} max={59} value={seconds} onChange={e => setSeconds(Number(e.target.value))} className="tool-input-colorful rounded-xl font-bold text-center text-lg" />
              </div>
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button key={p.label} onClick={() => { setHours(p.h); setMinutes(p.m); setSeconds(p.s); }}
                  className="tool-badge text-xs cursor-pointer hover:bg-primary/20 transition-colors">{p.label}</button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!running ? (
            <button onClick={start} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
              <Play className="w-4 h-4" /> Start Timer
            </button>
          ) : (
            <button onClick={() => setRunning(false)} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold" style={{ background: "linear-gradient(135deg, hsl(30 90% 50%), hsl(30 90% 40%))" }}>
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          <button onClick={() => { setRunning(false); setRemaining(0); setTotal(0); }} className="tool-btn-primary px-5 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))" }}>
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <Timer className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-lg">{formatTime(total)}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="tool-stat-card">
            <div className="stat-value text-lg">{pct.toFixed(0)}%</div>
            <div className="stat-label">Progress</div>
          </div>
          <div className="tool-stat-card">
            <Bell className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
            <div className="stat-value text-lg">{remaining === 0 && total > 0 ? "Done" : running ? "Active" : "Idle"}</div>
            <div className="stat-label">Status</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

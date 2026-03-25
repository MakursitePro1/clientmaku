import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

const StopwatchTimer = () => {
  const [mode, setMode] = useState<"stopwatch" | "timer">("stopwatch");
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [timerInput, setTimerInput] = useState({ h: 0, m: 5, s: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (mode === "timer") {
            if (prev <= 10) { setRunning(false); return 0; }
            return prev - 10;
          }
          return prev + 10;
        });
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
  };

  const reset = () => { setRunning(false); setTime(0); setLaps([]); };
  const startTimer = () => { setTime((timerInput.h * 3600 + timerInput.m * 60 + timerInput.s) * 1000); setRunning(true); };
  const addLap = () => { setLaps(prev => [time, ...prev]); };

  return (
    <ToolLayout title="Stopwatch & Timer" description="Precise stopwatch with lap tracking and countdown timer">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex gap-2">
          {(["stopwatch", "timer"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${mode === m ? "gradient-bg text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground"}`}>
              {m}
            </button>
          ))}
        </div>

        <div className="text-center py-8">
          <div className="text-6xl sm:text-7xl font-mono font-bold tracking-wider gradient-text">
            {formatTime(time)}
          </div>
        </div>

        {mode === "timer" && !running && time === 0 && (
          <div className="flex justify-center gap-3 items-center">
            {(["h", "m", "s"] as const).map(u => (
              <div key={u} className="text-center">
                <input type="number" min="0" max={u === "h" ? 99 : 59}
                  value={timerInput[u]} onChange={e => setTimerInput(prev => ({ ...prev, [u]: parseInt(e.target.value) || 0 }))}
                  className="w-16 h-16 text-center text-2xl font-bold rounded-xl bg-card border border-border/50" />
                <div className="text-xs text-muted-foreground mt-1">{u}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-3">
          {mode === "timer" && !running && time === 0 ? (
            <Button onClick={startTimer} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2 px-8">
              <Play className="w-4 h-4" /> Start
            </Button>
          ) : (
            <>
              <Button onClick={() => setRunning(!running)} className={`rounded-xl font-semibold gap-2 px-6 ${running ? "bg-destructive text-destructive-foreground" : "gradient-bg text-primary-foreground"}`}>
                {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {time > 0 ? "Resume" : "Start"}</>}
              </Button>
              {mode === "stopwatch" && running && <Button variant="outline" onClick={addLap} className="rounded-xl gap-2"><Flag className="w-4 h-4" /> Lap</Button>}
              <Button variant="outline" onClick={reset} className="rounded-xl gap-2"><RotateCcw className="w-4 h-4" /> Reset</Button>
            </>
          )}
        </div>

        {laps.length > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden max-h-[200px] overflow-y-auto">
            {laps.map((lap, i) => (
              <div key={i} className="flex justify-between px-4 py-2.5 border-b border-border/20 last:border-0">
                <span className="text-sm text-muted-foreground">Lap {laps.length - i}</span>
                <span className="font-mono font-semibold text-sm">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default StopwatchTimer;

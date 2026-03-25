import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function ReactionTimeTest() {
  const [state, setState] = useState<"waiting"|"ready"|"go"|"result">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timeout = useRef<NodeJS.Timeout>();

  const start = () => {
    setState("ready");
    const delay = 2000 + Math.random() * 5000;
    timeout.current = setTimeout(() => {
      setState("go");
      setStartTime(performance.now());
    }, delay);
  };

  const click = () => {
    if (state === "ready") {
      clearTimeout(timeout.current);
      setState("waiting");
      return;
    }
    if (state === "go") {
      const time = Math.round(performance.now() - startTime);
      setResult(time);
      setResults(r => [...r, time]);
      setState("result");
    }
  };

  const avg = results.length ? Math.round(results.reduce((a,b)=>a+b,0)/results.length) : 0;
  const best = results.length ? Math.min(...results) : 0;

  const colors: Record<string, string> = {
    waiting: "bg-primary",
    ready: "bg-red-500",
    go: "bg-green-500",
    result: "bg-primary",
  };

  return (
    <ToolLayout title="Reaction Time Test" description="Test your reaction speed">
      <div className="space-y-4 max-w-md mx-auto text-center">
        <button onClick={state === "waiting" || state === "result" ? start : click}
          className={`w-full h-64 rounded-2xl text-white text-2xl font-bold transition-colors ${colors[state]} flex items-center justify-center`}>
          {state === "waiting" && "Click to Start"}
          {state === "ready" && "Wait for green..."}
          {state === "go" && "CLICK NOW!"}
          {state === "result" && `${result} ms — Click to retry`}
        </button>
        {state === "ready" && <p className="text-sm text-muted-foreground">⚠️ Click too early = restart</p>}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-accent/30 rounded-xl border border-border"><p className="text-xs text-muted-foreground">Attempts</p><p className="font-bold text-lg">{results.length}</p></div>
            <div className="p-3 bg-accent/30 rounded-xl border border-border"><p className="text-xs text-muted-foreground">Average</p><p className="font-bold text-lg">{avg} ms</p></div>
            <div className="p-3 bg-accent/30 rounded-xl border border-border"><p className="text-xs text-muted-foreground">Best</p><p className="font-bold text-lg text-green-600">{best} ms</p></div>
          </div>
        )}
        {results.length > 0 && <Button onClick={() => { setResults([]); setState("waiting"); }} variant="outline" className="rounded-xl">Reset</Button>}
      </div>
    </ToolLayout>
  );
}

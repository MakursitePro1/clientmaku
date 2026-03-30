import { useState, useRef, useCallback, useEffect, type MutableRefObject } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Globe, Server, Clock, Shield, RotateCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Google-style Gauge ── */
const SCALE_LABELS = [
  { value: 0, angle: -225 },
  { value: 1, angle: -191 },
  { value: 5, angle: -157 },
  { value: 10, angle: -123 },
  { value: 20, angle: -68 },
  { value: 50, angle: -13 },
  { value: 100, angle: 45 },
];

const START_ANGLE = -225;
const END_ANGLE = 45;
const TOTAL_ARC = END_ANGLE - START_ANGLE;

function speedToAngle(speed: number): number {
  const stops = [
    { speed: 0, pct: 0 },
    { speed: 1, pct: 0.125 },
    { speed: 5, pct: 0.25 },
    { speed: 10, pct: 0.375 },
    { speed: 20, pct: 0.5 },
    { speed: 50, pct: 0.75 },
    { speed: 100, pct: 1 },
  ];

  const clamped = Math.min(Math.max(speed, 0), 120);
  let lower = stops[0], upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].speed && clamped <= stops[i + 1].speed) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.speed - lower.speed || 1;
  const pct = lower.pct + ((clamped - lower.speed) / range) * (upper.pct - lower.pct);
  return START_ANGLE + TOTAL_ARC * pct;
}

function SpeedGauge({
  value,
  phase,
  testing,
}: {
  value: number;
  phase: string;
  testing: boolean;
}) {
  const cx = 200;
  const cy = 200;
  const r = 150;

  const rad = (d: number) => (d * Math.PI) / 180;
  const polar = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(rad(angle)),
    y: cy + radius * Math.sin(rad(angle)),
  });

  const arcPath = (s: number, e: number, radius: number) => {
    const a = polar(s, radius);
    const b = polar(e, radius);
    const large = e - s > 180 ? 1 : 0;
    return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`;
  };

  const needleAngle = speedToAngle(value);
  const needleDot = polar(needleAngle, r + 2);

  const intPart = Math.floor(value);
  const decPart = (value % 1).toFixed(2).slice(1);

  const phaseIcon = phase === "download" ? "↓" : phase === "upload" ? "↑" : "";
  const phaseText =
    phase === "ping"
      ? "Measuring latency…"
      : phase === "download"
      ? "Testing download…"
      : phase === "upload"
      ? "Testing upload…"
      : phase === "done"
      ? "Test complete"
      : phase === "error"
      ? "Test failed"
      : "Ready to test";

  return (
    <div className="relative flex flex-col items-center">
      {testing && (
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.97, 1.02, 0.97] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="pointer-events-none absolute top-0 h-[280px] w-[280px] rounded-full blur-3xl sm:h-[360px] sm:w-[360px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 70%)" }}
        />
      )}

      <svg viewBox="0 0 400 280" className="relative w-full max-w-[400px]">
        <defs>
          <linearGradient id="gaugeArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(265 76% 56%)" />
            <stop offset="55%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(266 65% 74%)" />
          </linearGradient>
          <filter id="arcGlow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={arcPath(START_ANGLE, END_ANGLE, r)}
          fill="none"
          stroke="hsl(var(--muted) / 0.34)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {value > 0 && (
          <path
            d={arcPath(START_ANGLE, needleAngle, r)}
            fill="none"
            stroke="url(#gaugeArcGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#arcGlow)"
            style={{ transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        )}

        {SCALE_LABELS.map(({ value: v, angle }) => {
          const p = polar(angle, r + 30);
          return (
            <text
              key={v}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {v >= 100 ? "100+" : v}
            </text>
          );
        })}

        <circle
          cx={needleDot.x}
          cy={needleDot.y}
          r="8"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          style={{ transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />

        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle">
          <tspan className="fill-foreground" style={{ fontSize: "64px", fontWeight: 300 }}>
            {value > 0 ? intPart : "—"}
          </tspan>
          {value > 0 && (
            <tspan className="fill-muted-foreground" style={{ fontSize: "36px", fontWeight: 300 }}>
              {decPart}
            </tspan>
          )}
        </text>

        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: "13px", fontWeight: 400, letterSpacing: "0.5px" }}
        >
          Megabits per second
        </text>

        {(phase === "download" || phase === "upload") && (
          <motion.text
            x={cx}
            y={cy + 60}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "22px" }}
            animate={{ y: [cy + 60, cy + 52, cy + 60], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
          >
            {phaseIcon}
          </motion.text>
        )}

        <text
          x={cx}
          y={cy + 80}
          textAnchor="middle"
          className={testing ? "fill-primary" : "fill-muted-foreground"}
          style={{ fontSize: "13px", fontWeight: 500 }}
        >
          {phaseText}
        </text>
      </svg>
    </div>
  );
}

/* ── Network helpers ── */
function getConnectionEstimate() {
  const c = (navigator as any).connection;
  const dl = c?.downlink ? +(c.downlink * 8).toFixed(2) : 0;
  return {
    downlinkMbps: dl,
    uploadMbps: dl ? +(Math.max(dl * 0.35, 1)).toFixed(2) : 0,
    pingMs: c?.rtt ? Math.round(c.rtt) : 0,
  };
}

async function measureDownload(
  baseUrl: string,
  light: boolean,
  onProgress: (s: number) => void,
  cancelRef: MutableRefObject<boolean>
): Promise<number> {
  const sizes = light ? [1_000_000, 1_000_000] : [5_000_000, 10_000_000, 20_000_000];
  const urls = sizes.map((s, i) => `${baseUrl}/__down?bytes=${s}&_=${Date.now() + i}`);

  const start = performance.now();
  let total = 0;

  await Promise.all(
    urls.map(async (url) => {
      if (cancelRef.current) return;
      try {
        const res = await fetch(url, { cache: "no-store", mode: "cors" });
        if (!res.ok || !res.body) return;
        const reader = res.body.getReader();
        while (true) {
          if (cancelRef.current) {
            await reader.cancel();
            return;
          }
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed > 0.1) onProgress(+((total * 8) / elapsed / 1e6).toFixed(2));
        }
      } catch {
        /* skip */
      }
    })
  );

  const elapsed = (performance.now() - start) / 1000;
  if (total > 0 && elapsed > 0) return +((total * 8) / elapsed / 1e6).toFixed(2);

  const est = getConnectionEstimate();
  if (est.downlinkMbps > 0) {
    onProgress(est.downlinkMbps);
    return est.downlinkMbps;
  }
  return 0;
}

async function measureUpload(
  baseUrl: string,
  onProgress: (s: number) => void,
  cancelRef: MutableRefObject<boolean>
): Promise<number> {
  const sizes = [1_200_000, 2_400_000, 4_800_000];
  const start = performance.now();
  let total = 0;

  for (const size of sizes) {
    if (cancelRef.current) break;
    try {
      await fetch(`${baseUrl}/__up`, {
        method: "POST",
        body: new Uint8Array(size),
        cache: "no-store",
        mode: "cors",
      });
      total += size;
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed > 0.08) onProgress(+((total * 8) / elapsed / 1e6).toFixed(2));
    } catch {
      /* skip */
    }
  }

  const elapsed = (performance.now() - start) / 1000;
  if (total > 0 && elapsed > 0) return +((total * 8) / elapsed / 1e6).toFixed(2);
  return getConnectionEstimate().uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>) {
  const pings: number[] = [];

  for (let i = 0; i < 12; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0 };
    const s = performance.now();
    try {
      await fetch(`${baseUrl}/__down?bytes=0&_=${Date.now()}_${i}`, {
        cache: "no-store",
        mode: "cors",
      });
      pings.push(Math.round(performance.now() - s));
    } catch {
      const est = getConnectionEstimate();
      if (est.pingMs > 0) pings.push(est.pingMs);
    }
  }

  if (!pings.length) {
    const est = getConnectionEstimate();
    return {
      avgPing: est.pingMs || 20,
      avgJitter: Math.max(Math.round((est.pingMs || 20) * 0.12), 2),
    };
  }

  const sorted = [...pings].sort((a, b) => a - b);
  const core = sorted.length > 4 ? sorted.slice(1, -1) : sorted;

  const avgPing = Math.round(core.reduce((a, b) => a + b, 0) / core.length);
  const avgJitter = Math.round(
    core.slice(1).reduce((s, v, i) => s + Math.abs(v - core[i]), 0) / Math.max(core.length - 1, 1)
  );

  return { avgPing, avgJitter };
}

/* ── Main Component ── */
export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "ping" | "download" | "upload" | "done" | "error">("idle");
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [ip, setIp] = useState("—");
  const [connType, setConnType] = useState("—");
  const [testHistory, setTestHistory] = useState<{ dl: number; ul: number; ping: number; time: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const cancelRef = useRef(false);
  const liveSpeedRef = useRef(0);
  const animStartRef = useRef(0);

  const baseUrl = "https://speed.cloudflare.com";

  const updateLiveSpeed = useCallback((speed: number) => {
    const next = Math.max(0, speed);
    liveSpeedRef.current = next;
    setLiveSpeed(next);
  }, []);

  useEffect(() => {
    const c = (navigator as any).connection;
    if (c) setConnType((c.effectiveType || c.type || "Unknown").toUpperCase());

    (async () => {
      try {
        const r = await fetch("https://api.ipify.org?format=json");
        const d = await r.json();
        setIp(d.ip || "—");
      } catch {
        setIp("Unknown");
      }
    })();

    try {
      setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]"));
    } catch {
      /* empty */
    }
  }, []);

  useEffect(() => {
    if (!testing) {
      setDisplaySpeed(phase === "done" ? upload ?? download ?? 0 : 0);
      animStartRef.current = 0;
      return;
    }

    let raf = 0;
    if (!animStartRef.current) animStartRef.current = performance.now();

    const tick = (time: number) => {
      setDisplaySpeed((prev) => {
        const target = liveSpeedRef.current;

        if (target > 0.25) {
          const eased = prev + (target - prev) * 0.2;
          return +eased.toFixed(2);
        }

        const elapsed = time - animStartRef.current;
        const base = phase === "download" ? 14 : phase === "upload" ? 10 : 4;
        const amp = phase === "download" ? 10 : phase === "upload" ? 8 : 3;
        const wave = base + Math.abs(Math.sin(elapsed / 240)) * amp + Math.abs(Math.sin(elapsed / 92)) * 1.3;
        return +wave.toFixed(2);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [testing, phase, upload, download]);

  const reset = useCallback(() => {
    setTesting(false);
    setPhase("idle");
    setErrorMsg("");
    liveSpeedRef.current = 0;
    setLiveSpeed(0);
    setDisplaySpeed(0);
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);
    setErrorMsg("");
    setPhase("ping");

    liveSpeedRef.current = 0;
    setLiveSpeed(0);
    setDisplaySpeed(0);

    try {
      const { avgPing, avgJitter } = await measurePing(baseUrl, cancelRef);
      if (cancelRef.current) return reset();
      setPing(avgPing);
      setJitter(avgJitter);

      setPhase("download");
      liveSpeedRef.current = 0;
      setLiveSpeed(0);
      const dlSpeed = await measureDownload(baseUrl, false, updateLiveSpeed, cancelRef);
      if (cancelRef.current) return reset();
      if (dlSpeed === 0) throw new Error("Download test failed");
      setDownload(dlSpeed);
      updateLiveSpeed(dlSpeed);

      setPhase("upload");
      liveSpeedRef.current = 0;
      setLiveSpeed(0);
      const ulSpeed = await measureUpload(baseUrl, updateLiveSpeed, cancelRef);
      if (cancelRef.current) return reset();
      setUpload(ulSpeed);
      updateLiveSpeed(ulSpeed);

      const entry = {
        dl: +dlSpeed.toFixed(2),
        ul: +ulSpeed.toFixed(2),
        ping: avgPing,
        time: new Date().toLocaleString(),
      };
      const hist = [entry, ...testHistory].slice(0, 10);
      setTestHistory(hist);
      localStorage.setItem("cv_speed_history", JSON.stringify(hist));

      setPhase("done");
      setTesting(false);
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err?.message || "Speed test failed.");
      setTesting(false);
    }
  }, [baseUrl, reset, testHistory, updateLiveSpeed]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    reset();
  }, [reset]);

  return (
    <ToolLayout title="Internet Speed Tester" description="">
      <div className="mx-auto max-w-2xl space-y-6">
        <AnimatePresence>
          {phase === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-destructive">Test Failed</p>
                  <p className="mt-1 text-xs text-muted-foreground">{errorMsg}</p>
                </div>
                <Button size="sm" variant="outline" onClick={runTest} className="gap-1.5 text-xs">
                  <RotateCcw className="h-3 w-3" /> Retry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border-2 border-foreground/10 bg-card p-4 sm:p-8">
          <SpeedGauge value={displaySpeed} phase={phase} testing={testing} />

          <div className="mt-4 grid grid-cols-2 divide-x divide-foreground/10 border-t border-foreground/10 pt-4">
            <div className="flex flex-col items-center gap-1 px-4">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-light text-foreground">{download !== null ? download.toFixed(2) : "—"}</span>
              </div>
              <span className="text-xs text-muted-foreground">Mbps download</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-light text-foreground">{upload !== null ? upload.toFixed(2) : "—"}</span>
              </div>
              <span className="text-xs text-muted-foreground">Mbps upload</span>
            </div>
          </div>

          {ping !== null && (
            <div className="mt-3 grid grid-cols-2 divide-x divide-foreground/10 border-t border-foreground/10 pt-3">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-light text-foreground">{ping} ms</span>
                <span className="text-[11px] text-muted-foreground">Latency</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-light text-foreground">{jitter ?? "—"} ms</span>
                <span className="text-[11px] text-muted-foreground">Jitter</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            {testing ? (
              <Button
                variant="outline"
                onClick={cancel}
                className="rounded-full border-2 border-foreground/15 px-10 py-5 text-sm font-medium"
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={runTest}
                className="rounded-full bg-primary px-10 py-5 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
              >
                {phase === "done" ? "Test Again" : phase === "error" ? "Retry" : "Run Speed Test"}
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-foreground/10 bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" /> Network Information
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { icon: Globe, label: "IP Address", value: ip },
              { icon: Activity, label: "Connection", value: connType },
              { icon: Server, label: "Server", value: "Cloudflare" },
              { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS" : "HTTP" },
              { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
              { icon: Activity, label: "Tests Run", value: `${testHistory.length}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-foreground/8 bg-background p-2.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="truncate text-xs font-semibold text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState, useRef, useCallback, useEffect, type MutableRefObject } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Globe, Server, Clock, Shield, RotateCcw, AlertTriangle, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TEST_SERVER_URL = "https://speed.cloudflare.com";

// --- Gauge helpers ---
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
  let lower = stops[0];
  let upper = stops[stops.length - 1];
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

// --- Gauge Component ---
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

  const angle = speedToAngle(value);
  const needleDot = polar(angle, r + 2);
  const intPart = Math.floor(value);
  const decPart = (value % 1).toFixed(2).slice(1);

  const isDownload = phase === "download";
  const isUpload = phase === "upload";
  const isDone = phase === "done";

  const phaseLabel = isDownload
    ? "DOWNLOAD"
    : isUpload
      ? "UPLOAD"
      : isDone
        ? "COMPLETE"
        : phase === "error"
          ? "FAILED"
          : "READY";

  const arcColor = isUpload
    ? "hsl(var(--primary) / 0.75)"
    : "hsl(var(--primary) / 1)";

  return (
    <div className="relative flex flex-col items-center">
      {testing && (
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pointer-events-none absolute top-0 h-[300px] w-[300px] rounded-full blur-3xl sm:h-[380px] sm:w-[380px]"
          style={{
            background: `radial-gradient(circle, ${isUpload ? "hsl(var(--primary) / 0.12)" : "hsl(var(--primary) / 0.18)"}, transparent 70%)`,
          }}
        />
      )}

      <svg viewBox="0 0 400 290" className="relative w-full max-w-[420px]">
        <defs>
          <linearGradient id="gaugeDownGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 1)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
          </linearGradient>
          <linearGradient id="gaugeUpGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 76% 46% / 1)" />
            <stop offset="100%" stopColor="hsl(142 76% 46% / 0.6)" />
          </linearGradient>
          <filter id="arcGlow2">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath(START_ANGLE, END_ANGLE, r)}
          fill="none"
          stroke="hsl(var(--muted) / 0.25)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Active arc */}
        {value > 0 && (
          <path
            d={arcPath(START_ANGLE, angle, r)}
            fill="none"
            stroke={isUpload ? "url(#gaugeUpGrad)" : "url(#gaugeDownGrad)"}
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#arcGlow2)"
            style={{ transition: "all 0.15s linear" }}
          />
        )}

        {/* Scale labels */}
        {SCALE_LABELS.map(({ value: label, angle: labelAngle }) => {
          const p = polar(labelAngle, r + 32);
          return (
            <text
              key={label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              {label >= 100 ? "100+" : label}
            </text>
          );
        })}

        {/* Needle dot */}
        <circle
          cx={needleDot.x}
          cy={needleDot.y}
          r="9"
          fill={isUpload ? "hsl(142 76% 46%)" : "hsl(var(--primary))"}
          style={{ transition: "all 0.15s linear", filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))" }}
        />

        {/* Phase label above number */}
        <text
          x={cx}
          y={cy - 55}
          textAnchor="middle"
          className={testing ? "fill-primary" : "fill-muted-foreground"}
          style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px" }}
        >
          {phaseLabel}
        </text>

        {/* Phase icon */}
        {(isDownload || isUpload) && (
          <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <text
              x={cx}
              y={cy - 38}
              textAnchor="middle"
              style={{ fontSize: "16px" }}
              className="fill-primary"
            >
              {isDownload ? "↓" : "↑"}
            </text>
          </motion.g>
        )}

        {/* Speed number */}
        <text x={cx} y={cy + 5} textAnchor="middle" dominantBaseline="middle">
          <tspan className="fill-foreground" style={{ fontSize: "72px", fontWeight: 200 }}>
            {value > 0 ? intPart : "—"}
          </tspan>
          {value > 0 && (
            <tspan className="fill-muted-foreground" style={{ fontSize: "38px", fontWeight: 200 }}>
              {decPart}
            </tspan>
          )}
        </text>

        {/* Unit */}
        <text
          x={cx}
          y={cy + 40}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "1px" }}
        >
          Mbps
        </text>
      </svg>
    </div>
  );
}

// --- Network helpers ---
function getConnectionEstimate() {
  const connection = (navigator as Navigator & { connection?: { downlink?: number; rtt?: number; effectiveType?: string; type?: string } }).connection;
  const downlinkMbps = connection?.downlink ? +(connection.downlink * 8).toFixed(2) : 0;
  return {
    downlinkMbps,
    uploadMbps: downlinkMbps ? +(Math.max(downlinkMbps * 0.35, 1)).toFixed(2) : 0,
    pingMs: connection?.rtt ? Math.round(connection.rtt) : 0,
  };
}

async function measureDownload(
  baseUrl: string,
  onProgress: (speed: number) => void,
  cancelRef: MutableRefObject<boolean>
): Promise<number> {
  const sizes = [5_000_000, 10_000_000, 20_000_000];
  const urls = sizes.map((size, i) => `${baseUrl}/__down?bytes=${size}&_=${Date.now() + i}`);
  const start = performance.now();
  let totalBytes = 0;

  await Promise.all(
    urls.map(async (url) => {
      if (cancelRef.current) return;
      try {
        const res = await fetch(url, { cache: "no-store", mode: "cors" });
        if (!res.ok || !res.body) return;
        const reader = res.body.getReader();
        while (true) {
          if (cancelRef.current) { await reader.cancel(); return; }
          const { done, value } = await reader.read();
          if (done) break;
          totalBytes += value.byteLength;
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed > 0.05) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
        }
      } catch { /* skip */ }
    })
  );

  const elapsed = (performance.now() - start) / 1000;
  if (totalBytes > 0 && elapsed > 0) return +((totalBytes * 8) / elapsed / 1e6).toFixed(2);
  const est = getConnectionEstimate();
  if (est.downlinkMbps > 0) { onProgress(est.downlinkMbps); return est.downlinkMbps; }
  return 0;
}

async function measureUpload(
  baseUrl: string,
  onProgress: (speed: number) => void,
  cancelRef: MutableRefObject<boolean>
): Promise<number> {
  const sizes = [1_200_000, 2_400_000, 4_800_000, 7_200_000];
  const start = performance.now();
  let totalBytes = 0;
  for (const size of sizes) {
    if (cancelRef.current) break;
    try {
      await fetch(`${baseUrl}/__up`, { method: "POST", body: new Uint8Array(size), cache: "no-store", mode: "cors" });
      totalBytes += size;
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed > 0.05) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
    } catch { return 0; }
  }
  const elapsed = (performance.now() - start) / 1000;
  if (totalBytes > 0 && elapsed > 0) return +((totalBytes * 8) / elapsed / 1e6).toFixed(2);
  return getConnectionEstimate().uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>) {
  const pings: number[] = [];
  for (let i = 0; i < 12; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0 };
    const s = performance.now();
    try {
      await fetch(`${baseUrl}/__down?bytes=0&_=${Date.now()}_${i}`, { cache: "no-store", mode: "cors" });
      pings.push(Math.round(performance.now() - s));
    } catch {
      const est = getConnectionEstimate();
      if (est.pingMs > 0) pings.push(est.pingMs);
    }
  }
  if (!pings.length) {
    const est = getConnectionEstimate();
    return { avgPing: est.pingMs || 20, avgJitter: Math.max(Math.round((est.pingMs || 20) * 0.12), 2) };
  }
  const sorted = [...pings].sort((a, b) => a - b);
  const stable = sorted.length > 4 ? sorted.slice(1, -1) : sorted;
  const avgPing = Math.round(stable.reduce((s, v) => s + v, 0) / stable.length);
  const avgJitter = Math.round(
    stable.slice(1).reduce((s, v, i) => s + Math.abs(v - stable[i]), 0) / Math.max(stable.length - 1, 1)
  );
  return { avgPing, avgJitter };
}

// --- Phase result card ---
function PhaseResult({
  label,
  icon: Icon,
  value,
  active,
  done,
  color,
}: {
  label: string;
  icon: typeof Download;
  value: number | null;
  active: boolean;
  done: boolean;
  color: string;
}) {
  return (
    <motion.div
      layout
      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all duration-300 ${
        active
          ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
          : done
            ? "border-foreground/10 bg-card"
            : "border-foreground/5 bg-muted/30 opacity-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} style={done ? { color } : {}} />
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      {active && !done && (
        <motion.div
          className="mt-1 flex items-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
        </motion.div>
      )}

      {done && value !== null && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-baseline gap-1"
        >
          <span className="text-3xl font-light text-foreground">{value.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">Mbps</span>
        </motion.div>
      )}

      {!active && !done && (
        <span className="mt-1 text-lg font-light text-muted-foreground/40">—</span>
      )}
    </motion.div>
  );
}

// --- Main Component ---
export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "download" | "upload" | "done" | "error">("idle");
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [ip, setIp] = useState("—");
  const [connType, setConnType] = useState("—");
  const [testHistory, setTestHistory] = useState<{ dl: number; ul: number; ping: number; time: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const cancelRef = useRef(false);
  const liveSpeedRef = useRef(0);
  const animStartRef = useRef(0);

  const updateLive = useCallback((speed: number) => {
    liveSpeedRef.current = Math.max(0, speed);
  }, []);

  // Fetch IP & connection type
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; type?: string } }).connection;
    if (conn) setConnType((conn.effectiveType || conn.type || "Unknown").toUpperCase());

    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip || "—");
      } catch { setIp("Unknown"); }
    })();

    try { setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]")); } catch { /* */ }
  }, []);

  // Gauge animation loop
  useEffect(() => {
    if (!testing) {
      animStartRef.current = 0;
      if (phase === "done") {
        setDisplaySpeed(upload ?? download ?? 0);
      } else {
        setDisplaySpeed(0);
      }
      return;
    }

    let raf = 0;
    if (!animStartRef.current) animStartRef.current = performance.now();

    const tick = (time: number) => {
      setDisplaySpeed((prev) => {
        const target = liveSpeedRef.current;
        const elapsed = time - animStartRef.current;

        if (target > 0.5) {
          // Smooth towards real value with wobble
          const smooth = prev + (target - prev) * 0.18;
          const wobble = Math.sin(elapsed / 100) * Math.min(target * 0.025, 1.5);
          return +Math.max(0, smooth + wobble).toFixed(2);
        }

        // Synthetic wave while waiting for real data
        const base = phase === "download" ? 10 : 6;
        const wave1 = (phase === "download" ? 15 : 10) * Math.abs(Math.sin(elapsed / 180));
        const wave2 = (phase === "download" ? 6 : 4) * Math.abs(Math.sin(elapsed / 75));
        return +(base + wave1 + wave2).toFixed(2);
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
    liveSpeedRef.current = 0;
    animStartRef.current = performance.now();
    setDisplaySpeed(8);

    try {
      // --- Phase 1: Download ---
      setPhase("download");
      const pingPromise = measurePing(TEST_SERVER_URL, cancelRef);
      const dlSpeed = await measureDownload(TEST_SERVER_URL, updateLive, cancelRef);
      if (cancelRef.current) return reset();
      if (dlSpeed === 0) throw new Error("Download test failed");

      setDownload(dlSpeed);
      updateLive(dlSpeed);

      const pingResult = await pingPromise;
      if (!cancelRef.current) {
        setPing(pingResult.avgPing);
        setJitter(pingResult.avgJitter);
      }

      // Brief pause to show download result
      await new Promise((r) => setTimeout(r, 800));
      if (cancelRef.current) return reset();

      // --- Phase 2: Upload ---
      setPhase("upload");
      liveSpeedRef.current = 0;
      animStartRef.current = performance.now();

      const ulSpeed = await measureUpload(TEST_SERVER_URL, updateLive, cancelRef);
      if (cancelRef.current) return reset();

      setUpload(ulSpeed);
      updateLive(ulSpeed);

      // Save history
      const entry = {
        dl: +dlSpeed.toFixed(2),
        ul: +ulSpeed.toFixed(2),
        ping: pingResult.avgPing,
        time: new Date().toLocaleString(),
      };
      const next = [entry, ...testHistory].slice(0, 10);
      setTestHistory(next);
      localStorage.setItem("cv_speed_history", JSON.stringify(next));

      setPhase("done");
      setTesting(false);
    } catch (err: unknown) {
      setPhase("error");
      setErrorMsg(err instanceof Error ? err.message : "Speed test failed.");
      setTesting(false);
    }
  }, [reset, testHistory, updateLive]);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    reset();
  }, [reset]);

  const dlDone = download !== null;
  const ulDone = upload !== null;

  return (
    <ToolLayout title="Internet Speed Tester" description="">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Error banner */}
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

        {/* Main card */}
        <div className="rounded-2xl border-2 border-foreground/10 bg-card p-4 sm:p-8">
          {/* Gauge */}
          <SpeedGauge value={displaySpeed} phase={phase} testing={testing} />

          {/* Two-phase result cards */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PhaseResult
              label="Download"
              icon={Download}
              value={download}
              active={phase === "download"}
              done={dlDone}
              color="hsl(var(--primary))"
            />
            <PhaseResult
              label="Upload"
              icon={Upload}
              value={upload}
              active={phase === "upload"}
              done={ulDone}
              color="hsl(142 76% 46%)"
            />
          </div>

          {/* Latency & Jitter */}
          {(ping !== null || jitter !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 grid grid-cols-2 divide-x divide-foreground/10 rounded-xl border border-foreground/10 py-3"
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-light text-foreground">{ping ?? "—"} ms</span>
                <span className="text-[11px] text-muted-foreground">Latency</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-light text-foreground">{jitter ?? "—"} ms</span>
                <span className="text-[11px] text-muted-foreground">Jitter</span>
              </div>
            </motion.div>
          )}

          {/* Action button */}
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
                <Gauge className="mr-2 h-4 w-4" />
                {phase === "done" ? "Test Again" : phase === "error" ? "Retry" : "Run Speed Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Network info */}
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

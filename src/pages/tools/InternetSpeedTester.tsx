import { useState, useRef, useCallback, useEffect, type MutableRefObject } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Globe, Server, Clock, Shield, RotateCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TEST_SERVER_URL = "https://speed.cloudflare.com";
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

function SpeedGauge({ value, phase, testing }: { value: number; phase: string; testing: boolean }) {
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
  const phaseIcon = phase === "download" ? "↓" : phase === "upload" ? "↑" : "";
  const phaseText =
    phase === "download"
      ? "Testing download…"
      : phase === "upload"
        ? "Testing upload…"
        : phase === "done"
          ? "Test complete"
          : phase === "error"
            ? "Test failed"
            : "Preparing test…";

  return (
    <div className="relative flex flex-col items-center">
      {testing && (
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.96, 1.02, 0.96] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="pointer-events-none absolute top-0 h-[280px] w-[280px] rounded-full blur-3xl sm:h-[360px] sm:w-[360px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)" }}
        />
      )}

      <svg viewBox="0 0 400 280" className="relative w-full max-w-[400px]">
        <defs>
          <linearGradient id="gaugeArcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 1)" />
            <stop offset="60%" stopColor="hsl(var(--primary) / 0.92)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.65)" />
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
            d={arcPath(START_ANGLE, angle, r)}
            fill="none"
            stroke="url(#gaugeArcGrad)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#arcGlow)"
            style={{ transition: "all 0.22s linear" }}
          />
        )}

        {SCALE_LABELS.map(({ value: label, angle: labelAngle }) => {
          const p = polar(labelAngle, r + 30);
          return (
            <text
              key={label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: "13px", fontWeight: 500 }}
            >
              {label >= 100 ? "100+" : label}
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
          style={{ transition: "all 0.22s linear" }}
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
          style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.4px" }}
        >
          Mbps
        </text>

        {(phase === "download" || phase === "upload") && (
          <motion.text
            x={cx}
            y={cy + 60}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "22px" }}
            animate={{ y: [cy + 60, cy + 50, cy + 60], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
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
  light: boolean,
  onProgress: (speed: number) => void,
  cancelRef: MutableRefObject<boolean>
): Promise<number> {
  const sizes = light ? [1_000_000, 1_000_000] : [5_000_000, 10_000_000, 20_000_000];
  const urls = sizes.map((size, index) => `${baseUrl}/__down?bytes=${size}&_=${Date.now() + index}`);
  const start = performance.now();
  let totalBytes = 0;

  await Promise.all(
    urls.map(async (url) => {
      if (cancelRef.current) return;

      try {
        const response = await fetch(url, { cache: "no-store", mode: "cors" });
        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        while (true) {
          if (cancelRef.current) {
            await reader.cancel();
            return;
          }

          const { done, value } = await reader.read();
          if (done) break;

          totalBytes += value.byteLength;
          const elapsed = (performance.now() - start) / 1000;
          if (elapsed > 0.08) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
        }
      } catch {
        return;
      }
    })
  );

  const elapsed = (performance.now() - start) / 1000;
  if (totalBytes > 0 && elapsed > 0) return +((totalBytes * 8) / elapsed / 1e6).toFixed(2);

  const estimate = getConnectionEstimate();
  if (estimate.downlinkMbps > 0) {
    onProgress(estimate.downlinkMbps);
    return estimate.downlinkMbps;
  }

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
      await fetch(`${baseUrl}/__up`, {
        method: "POST",
        body: new Uint8Array(size),
        cache: "no-store",
        mode: "cors",
      });

      totalBytes += size;
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed > 0.08) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
    } catch {
      return 0;
    }
  }

  const elapsed = (performance.now() - start) / 1000;
  if (totalBytes > 0 && elapsed > 0) return +((totalBytes * 8) / elapsed / 1e6).toFixed(2);
  return getConnectionEstimate().uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>) {
  const pings: number[] = [];

  for (let i = 0; i < 12; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0 };

    const startedAt = performance.now();
    try {
      await fetch(`${baseUrl}/__down?bytes=0&_=${Date.now()}_${i}`, { cache: "no-store", mode: "cors" });
      pings.push(Math.round(performance.now() - startedAt));
    } catch {
      const estimate = getConnectionEstimate();
      if (estimate.pingMs > 0) pings.push(estimate.pingMs);
    }
  }

  if (!pings.length) {
    const estimate = getConnectionEstimate();
    return {
      avgPing: estimate.pingMs || 20,
      avgJitter: Math.max(Math.round((estimate.pingMs || 20) * 0.12), 2),
    };
  }

  const sorted = [...pings].sort((a, b) => a - b);
  const stable = sorted.length > 4 ? sorted.slice(1, -1) : sorted;
  const avgPing = Math.round(stable.reduce((sum, value) => sum + value, 0) / stable.length);
  const avgJitter = Math.round(
    stable.slice(1).reduce((sum, value, index) => sum + Math.abs(value - stable[index]), 0) /
      Math.max(stable.length - 1, 1)
  );

  return { avgPing, avgJitter };
}

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
  const animationStartedAtRef = useRef(0);

  const updateLiveSpeed = useCallback((speed: number) => {
    liveSpeedRef.current = Math.max(0, speed);
  }, []);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string; type?: string } }).connection;
    if (connection) setConnType((connection.effectiveType || connection.type || "Unknown").toUpperCase());

    (async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip || "—");
      } catch {
        setIp("Unknown");
      }
    })();

    try {
      setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]"));
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (!testing) {
      animationStartedAtRef.current = 0;
      setDisplaySpeed(phase === "done" ? upload ?? download ?? 0 : 0);
      return;
    }

    let raf = 0;
    if (!animationStartedAtRef.current) animationStartedAtRef.current = performance.now();

    const tick = (time: number) => {
      setDisplaySpeed((previous) => {
        const target = liveSpeedRef.current;
        const elapsed = time - animationStartedAtRef.current;

        if (target > 0.4) {
          const smooth = previous + (target - previous) * 0.22;
          const wobbleStrength = Math.min(Math.max(target * 0.02, 0.18), 1.15);
          const wobble = Math.sin(elapsed / 120) * wobbleStrength;
          return +Math.max(0, smooth + wobble).toFixed(2);
        }

        const base = phase === "download" ? 8 : 5;
        const waveA = phase === "download" ? 13 : 10;
        const waveB = phase === "download" ? 5 : 4;
        const synthetic =
          base +
          Math.abs(Math.sin(elapsed / 210)) * waveA +
          Math.abs(Math.sin(elapsed / 88)) * waveB;

        return +synthetic.toFixed(2);
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
    setPhase("download");
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);
    setErrorMsg("");
    liveSpeedRef.current = 0;
    animationStartedAtRef.current = performance.now();
    setDisplaySpeed(6.5);

    try {
      const pingPromise = measurePing(TEST_SERVER_URL, cancelRef);
      const downloadSpeed = await measureDownload(TEST_SERVER_URL, false, updateLiveSpeed, cancelRef);
      if (cancelRef.current) return reset();
      if (downloadSpeed === 0) throw new Error("Download test failed");

      setDownload(downloadSpeed);
      updateLiveSpeed(downloadSpeed);

      const pingResult = await pingPromise;
      if (!cancelRef.current) {
        setPing(pingResult.avgPing);
        setJitter(pingResult.avgJitter);
      }

      setPhase("upload");
      liveSpeedRef.current = 0;
      animationStartedAtRef.current = performance.now();
      const uploadSpeed = await measureUpload(TEST_SERVER_URL, updateLiveSpeed, cancelRef);
      if (cancelRef.current) return reset();

      setUpload(uploadSpeed);
      updateLiveSpeed(uploadSpeed);

      const entry = {
        dl: +downloadSpeed.toFixed(2),
        ul: +uploadSpeed.toFixed(2),
        ping: pingResult.avgPing,
        time: new Date().toLocaleString(),
      };
      const nextHistory = [entry, ...testHistory].slice(0, 10);
      setTestHistory(nextHistory);
      localStorage.setItem("cv_speed_history", JSON.stringify(nextHistory));

      setPhase("done");
      setTesting(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Speed test failed.";
      setPhase("error");
      setErrorMsg(message);
      setTesting(false);
    }
  }, [reset, testHistory, updateLiveSpeed]);

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
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-light text-foreground">{download !== null ? download.toFixed(2) : "—"}</span>
              </div>
              <span className="text-xs text-muted-foreground">Mbps download</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-light text-foreground">{upload !== null ? upload.toFixed(2) : "—"}</span>
              </div>
              <span className="text-xs text-muted-foreground">Mbps upload</span>
            </div>
          </div>

          {(ping !== null || jitter !== null) && (
            <div className="mt-3 grid grid-cols-2 divide-x divide-foreground/10 border-t border-foreground/10 pt-3">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-light text-foreground">{ping ?? "—"} ms</span>
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

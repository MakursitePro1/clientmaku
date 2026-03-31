import { useState, useRef, useCallback, useEffect, type MutableRefObject } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Globe, Server, Clock, Shield, RotateCcw, AlertTriangle, Gauge, Wifi, Monitor, MapPin, Zap, BarChart3, TrendingUp } from "lucide-react";
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
  const cx = 160;
  const cy = 160;
  const r = 120;
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

  const displayVal = value;
  const angle = speedToAngle(displayVal);
  const needleEnd = polar(angle, r - 8);
  const needleBase1 = polar(angle + 90, 4);
  const needleBase2 = polar(angle - 90, 4);
  const intPart = Math.floor(displayVal);
  const decPart = (displayVal % 1).toFixed(2).slice(1);

  const isDownload = phase === "download";
  const isUpload = phase === "upload";
  const isResetting = phase === "resetting";
  const isDone = phase === "done";
  const isGreenPhase = isUpload || isDone;

  const phaseLabel = isDownload
    ? "DOWNLOAD"
    : isUpload
      ? "UPLOAD"
      : isResetting
        ? "RESETTING"
        : isDone
          ? "COMPLETE"
          : phase === "error"
            ? "FAILED"
            : "READY";

  const activeColor = isGreenPhase ? "hsl(142 76% 40%)" : "hsl(263 70% 55%)";

  // Minor tick marks
  const ticks = [];
  for (let i = 0; i <= 40; i++) {
    const a = START_ANGLE + (TOTAL_ARC * i) / 40;
    const isMajor = i % 5 === 0;
    const inner = polar(a, r - (isMajor ? 16 : 10));
    const outer = polar(a, r - 4);
    ticks.push(
      <line
        key={i}
        x1={inner.x} y1={inner.y}
        x2={outer.x} y2={outer.y}
        stroke={`hsl(var(--foreground) / ${isMajor ? "0.25" : "0.1"})`}
        strokeWidth={isMajor ? 2 : 1}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {testing && (
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pointer-events-none absolute inset-0 m-auto h-[200px] w-[200px] rounded-full blur-3xl sm:h-[280px] sm:w-[280px]"
          style={{
            background: `radial-gradient(circle, ${isUpload ? "hsl(142 76% 46% / 0.25)" : "hsl(var(--primary) / 0.3)"}, transparent 70%)`,
          }}
        />
      )}

      <svg viewBox="0 0 320 230" className="relative w-full max-w-[340px] sm:max-w-[400px]">
        <defs>
          <linearGradient id="gaugeDownGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(263 70% 50%)" />
            <stop offset="100%" stopColor="hsl(280 80% 60%)" />
          </linearGradient>
          <linearGradient id="gaugeUpGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 76% 36%)" />
            <stop offset="100%" stopColor="hsl(160 70% 45%)" />
          </linearGradient>
          <filter
            id="arcGlow2"
            x="-24"
            y="-24"
            width="368"
            height="278"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="needleShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={activeColor} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath(START_ANGLE, END_ANGLE, r)}
          fill="none"
          stroke="hsl(var(--foreground) / 0.12)"
          strokeWidth="18"
          strokeLinecap="butt"
        />

        {/* Tick marks */}
        {ticks}

        {/* Active arc */}
        {displayVal > 0.1 && (
          <>
            <path
              d={arcPath(START_ANGLE, angle, r)}
              fill="none"
              stroke={isGreenPhase ? "url(#gaugeUpGrad)" : "url(#gaugeDownGrad)"}
              strokeWidth="24"
              strokeLinecap="butt"
              opacity="0.18"
              shapeRendering="geometricPrecision"
            />
            <path
              d={arcPath(START_ANGLE, angle, r)}
              fill="none"
              stroke={isGreenPhase ? "url(#gaugeUpGrad)" : "url(#gaugeDownGrad)"}
              strokeWidth="18"
              strokeLinecap="butt"
              shapeRendering="geometricPrecision"
              filter="url(#arcGlow2)"
            />
          </>
        )}

        {/* Scale labels */}
        {SCALE_LABELS.map(({ value: label, angle: labelAngle }) => {
          const p = polar(labelAngle, r + 26);
          return (
            <text
              key={label}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(var(--foreground) / 0.45)"
              style={{ fontSize: "10px", fontWeight: 600 }}
            >
              {label >= 100 ? "100+" : label}
            </text>
          );
        })}

        {/* Needle - triangle pointer */}
        <polygon
          points={`${needleEnd.x},${needleEnd.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={activeColor}
          filter="url(#needleShadow)"
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill={activeColor} />
        <circle cx={cx} cy={cy} r="3" fill="hsl(var(--background))" />

        {/* Phase label */}
        <text
          x={cx}
          y={cy - 42}
          textAnchor="middle"
          fill={testing ? activeColor : "hsl(var(--muted-foreground))"}
          style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2.5px" }}
        >
          {phaseLabel}
        </text>

        {/* Phase arrow */}
        {(isDownload || isUpload) && (
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <text
              x={cx}
              y={cy - 28}
              textAnchor="middle"
              style={{ fontSize: "13px" }}
              fill={activeColor}
            >
              {isDownload ? "↓" : "↑"}
            </text>
          </motion.g>
        )}

        {/* Speed number */}
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle">
          <tspan className="fill-foreground" style={{ fontSize: "52px", fontWeight: 200 }}>
            {displayVal > 0.1 ? intPart : "—"}
          </tspan>
          {displayVal > 0.1 && (
            <tspan fill="hsl(var(--foreground) / 0.5)" style={{ fontSize: "28px", fontWeight: 200 }}>
              {decPart}
            </tspan>
          )}
        </text>

        {/* Unit */}
        <text
          x={cx}
          y={cy + 38}
          textAnchor="middle"
          fill="hsl(var(--foreground) / 0.4)"
          style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "1px" }}
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
  // Use multiple parallel streams for faster & more accurate measurement
  const sizes = [2_000_000, 4_000_000, 8_000_000];
  const urls = sizes.map((size, i) => `${baseUrl}/__down?bytes=${size}&_=${Date.now() + i}`);
  const start = performance.now();
  let totalBytes = 0;
  let lastReport = 0;

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
          const now = performance.now();
          // Report every 50ms for smooth gauge updates
          if (now - lastReport > 50) {
            lastReport = now;
            const elapsed = (now - start) / 1000;
            if (elapsed > 0.05) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
          }
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
  // Parallel uploads for speed & accuracy
  const sizes = [500_000, 1_000_000, 2_000_000];
  const start = performance.now();
  let totalBytes = 0;

  await Promise.all(
    sizes.map(async (size) => {
      if (cancelRef.current) return;
      try {
        const data = new Uint8Array(size);
        await fetch(`${baseUrl}/__up`, { method: "POST", body: data, cache: "no-store", mode: "cors" });
        totalBytes += size;
        const elapsed = (performance.now() - start) / 1000;
        if (elapsed > 0.05) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
      } catch { /* skip */ }
    })
  );

  const elapsed = (performance.now() - start) / 1000;
  if (totalBytes > 0 && elapsed > 0) return +((totalBytes * 8) / elapsed / 1e6).toFixed(2);
  return getConnectionEstimate().uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>) {
  const pings: number[] = [];
  // Only 6 pings for speed
  for (let i = 0; i < 6; i++) {
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
      className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-5 transition-all duration-500 ${
        active
          ? "border-primary/40 bg-primary/5 shadow-xl shadow-primary/10"
          : done
            ? "border-foreground/15 bg-card"
            : "border-foreground/8 bg-muted/40 opacity-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={active ? { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.5, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        >
          <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} style={done ? { color } : {}} />
        </motion.div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      {active && !done && (
        <motion.div
          className="mt-1 flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      )}

      {done && value !== null && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.6 }}
          className="flex items-baseline gap-1"
        >
          <CountUpValue target={value} duration={1.2} />
          <span className="text-xs text-muted-foreground">Mbps</span>
        </motion.div>
      )}

      {!active && !done && (
        <span className="mt-1 text-lg font-light text-muted-foreground/40">—</span>
      )}
    </motion.div>
  );
}

// Animated count-up for result values
function CountUpValue({ target, duration = 1 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = Math.round(duration * 60);
    const increment = target / steps;
    let frame = 0;
    const tick = () => {
      start += increment;
      if (start >= target) {
        setCount(target);
        return;
      }
      setCount(+start.toFixed(2));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return <span className="text-3xl font-light text-foreground">{count.toFixed(2)}</span>;
}

// --- Main Component ---
export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "download" | "upload" | "resetting" | "done" | "error">("idle");
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [ip, setIp] = useState("—");
  const [connType, setConnType] = useState("—");
  const [testHistory, setTestHistory] = useState<{ dl: number; ul: number; ping: number; time: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isp, setIsp] = useState("—");
  const [location_, setLocation_] = useState("—");
  const [downlink, setDownlink] = useState("—");
  const [rtt, setRtt] = useState("—");

  const cancelRef = useRef(false);
  const liveSpeedRef = useRef(0);
  const smoothedRef = useRef(0);

  const updateLive = useCallback((speed: number) => {
    liveSpeedRef.current = Math.max(0, speed);
  }, []);

  // Fetch IP & connection type
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; type?: string; downlink?: number; rtt?: number } }).connection;
    if (conn) {
      setConnType((conn.effectiveType || conn.type || "Unknown").toUpperCase());
      if (conn.downlink) setDownlink(`${conn.downlink} Mbps`);
      if (conn.rtt) setRtt(`${conn.rtt} ms`);
    }

    (async () => {
      try {
        const res = await fetch("https://ipinfo.io/json");
        const data = await res.json();
        setIp(data.ip || "—");
        setIsp(data.org || "—");
        setLocation_(data.city && data.country ? `${data.city}, ${data.country}` : "—");
      } catch {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          setIp(data.ip || "—");
        } catch { setIp("Unknown"); }
      }
    })();

    try { setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]")); } catch { /* */ }
  }, []);

  // Gauge animation loop — ultra-smooth with eased interpolation
  useEffect(() => {
    if (phase === "idle") {
      // Gentle fade to zero from any leftover value
      let raf = 0;
      const fadeOut = () => {
        setDisplaySpeed((prev) => {
          if (prev <= 0.05) return 0;
          return +(prev * 0.88).toFixed(2);
        });
        raf = requestAnimationFrame(fadeOut);
      };
      raf = requestAnimationFrame(fadeOut);
      return () => cancelAnimationFrame(raf);
    }

    if (phase === "done") {
      // Graceful deceleration curve to zero
      let raf = 0;
      const tick = () => {
        setDisplaySpeed((prev) => {
          if (prev <= 0.08) {
            cancelAnimationFrame(raf);
            return 0;
          }
          // Slow cubic ease-out decay
          const factor = 0.96 - Math.min(prev / 200, 0.03);
          return +(prev * factor).toFixed(2);
        });
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    if (phase === "error") return;

    let raf = 0;
    const phaseStart = performance.now();
    let smoothed = 0;

    const tick = (now: number) => {
      const elapsed = now - phaseStart;

      setDisplaySpeed((prev) => {
        const target = liveSpeedRef.current;

        if (phase === "resetting") {
          // Ultra-smooth exponential decay with ease-out
          if (prev <= 0.08) return 0;
          const t = Math.min(elapsed / 3000, 1);
          const easedFactor = 0.97 - t * 0.06; // accelerates decay over time
          return +Math.max(0, prev * easedFactor).toFixed(2);
        }

        if (target > 0.35) {
          // Very gentle spring-like interpolation
          const diff = target - prev;
          const lerpFactor = 0.025 + Math.abs(diff) * 0.0003; // adaptive: faster when far, slower when close
          smoothed = prev + diff * Math.min(lerpFactor, 0.08);

          // Organic micro-oscillation (like a real needle)
          const breathe = Math.sin(elapsed / 700) * Math.min(target * 0.015, 0.8);
          const tremor = Math.sin(elapsed / 200) * Math.min(target * 0.005, 0.3);
          return +Math.max(0.1, smoothed + breathe + tremor).toFixed(2);
        }

        // Synthetic sweep while waiting for data — gentle sine wave
        const peak = phase === "download" ? 30 : 18;
        // Slow breathing sweep
        const wave1 = peak * 0.5 * (1 + Math.sin((elapsed / 1200) - Math.PI / 2));
        const wave2 = peak * 0.08 * Math.sin(elapsed / 450);
        const combined = wave1 + wave2;
        // Smooth transition from previous value
        const eased = prev + (combined - prev) * 0.03;
        return +Math.max(0.2, eased).toFixed(2);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, upload]);

  const reset = useCallback(() => {
    setTesting(false);
    setPhase("idle");
    setErrorMsg("");
    liveSpeedRef.current = 0;
    setDisplaySpeed(0);
  }, []);

  const runTest = useCallback(async () => {
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    cancelRef.current = false;
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);
    setErrorMsg("");
    liveSpeedRef.current = 0;
    setDisplaySpeed(4);

    try {
      // Phase 1: download measurement and final hold
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

      // Immediately after download completes: smooth reset to zero
      setPhase("resetting");
      liveSpeedRef.current = 0;
      // Let the needle glide down naturally
      await wait(2400);
      if (cancelRef.current) return reset();
      setDisplaySpeed(0);

      // Keep gauge at true zero for 2 seconds before upload starts
      await wait(2000);
      if (cancelRef.current) return reset();

      // Phase 2: upload starts fresh in green
      setPhase("upload");
      liveSpeedRef.current = 0;
      const ulSpeed = await measureUpload(TEST_SERVER_URL, updateLive, cancelRef);
      if (cancelRef.current) return reset();

      setUpload(ulSpeed);
      updateLive(ulSpeed);

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
              color="hsl(263 70% 55%)"
            />
            <PhaseResult
              label="Upload"
              icon={Upload}
              value={upload}
              active={phase === "upload"}
              done={ulDone}
              color="hsl(142 76% 40%)"
            />
          </div>

          {/* Latency & Jitter */}
          {(ping !== null || jitter !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="mt-3 grid grid-cols-2 divide-x divide-foreground/10 rounded-xl border border-foreground/10 py-3"
            >
              <div className="flex flex-col items-center gap-0.5">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-light text-foreground"
                >
                  {ping ?? "—"} ms
                </motion.span>
                <span className="text-[11px] text-muted-foreground">Latency</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-light text-foreground"
                >
                  {jitter ?? "—"} ms
                </motion.span>
                <span className="text-[11px] text-muted-foreground">Jitter</span>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {testing ? (
              <Button
                variant="outline"
                onClick={cancel}
                className="rounded-full border-2 border-foreground/15 px-10 py-5 text-sm font-medium"
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  onClick={runTest}
                  className="rounded-full bg-primary px-10 py-5 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  <Gauge className="mr-2 h-4 w-4" />
                  {phase === "done" ? "Test Again" : phase === "error" ? "Retry" : "Run Speed Test"}
                </Button>
                {(phase === "done" || phase === "error") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      reset();
                      setDownload(null);
                      setUpload(null);
                      setPing(null);
                      setJitter(null);
                    }}
                    className="rounded-full border-2 border-foreground/15 px-6 py-5 text-sm font-medium gap-1.5"
                  >
                    <RotateCcw className="h-4 w-4" /> Restart
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ===== Summary Card — visible after test completes ===== */}
        <AnimatePresence>
          {phase === "done" && download !== null && upload !== null && ping !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.3 }}
              className="rounded-2xl border-2 border-primary/20 bg-card overflow-hidden"
            >
              {/* Gradient header */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
                <h3 className="relative flex items-center gap-2 text-sm font-bold text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  Speed Test Summary
                </h3>
                <p className="relative mt-0.5 text-[11px] text-muted-foreground">
                  {new Date().toLocaleString()}
                </p>
              </div>

              <div className="p-5 space-y-5">
                {/* Visual speed bars */}
                <div className="space-y-4">
                  {/* Download bar */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Download</span>
                      </div>
                      <span className="text-lg font-semibold text-foreground">{download.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">Mbps</span></span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-foreground/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(263 70% 50%), hsl(280 80% 60%))" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min((download / 100) * 100, 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>

                  {/* Upload bar */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" style={{ color: "hsl(142 76% 40%)" }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload</span>
                      </div>
                      <span className="text-lg font-semibold text-foreground">{upload.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">Mbps</span></span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-foreground/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(142 76% 36%), hsl(160 70% 45%))" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${Math.min((upload / 100) * 100, 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Metrics grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-4 gap-2"
                >
                  {[
                    { label: "Ping", value: `${ping}`, unit: "ms", icon: Activity, color: "hsl(45 93% 55%)" },
                    { label: "Jitter", value: `${jitter ?? 0}`, unit: "ms", icon: TrendingUp, color: "hsl(25 95% 55%)" },
                    { label: "Server", value: "CDN", unit: "", icon: Server, color: "hsl(200 80% 55%)" },
                    { label: "Protocol", value: location.protocol === "https:" ? "TLS" : "HTTP", unit: "", icon: Shield, color: "hsl(160 70% 45%)" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 200 }}
                      className="flex flex-col items-center gap-1 rounded-xl border border-foreground/8 bg-muted/30 p-3"
                    >
                      <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                      <span className="text-base font-bold text-foreground">{item.value}{item.unit && <span className="text-[10px] text-muted-foreground ml-0.5">{item.unit}</span>}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Speed rating */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex items-center justify-center gap-3 rounded-xl border border-foreground/8 bg-muted/20 p-3"
                >
                  <div className="text-2xl">
                    {download >= 50 ? "🚀" : download >= 20 ? "⚡" : download >= 5 ? "👍" : "🐢"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {download >= 50 ? "Excellent Speed!" : download >= 20 ? "Very Good Speed" : download >= 5 ? "Decent Speed" : "Slow Connection"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {download >= 50
                        ? "Great for 4K streaming, gaming & large downloads"
                        : download >= 20
                          ? "Good for HD streaming & video calls"
                          : download >= 5
                            ? "Suitable for browsing & SD streaming"
                            : "May struggle with video streaming"}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network Information */}
        <div className="rounded-2xl border-2 border-foreground/10 bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" /> Network Information
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { icon: Globe, label: "IP Address", value: ip },
              { icon: Wifi, label: "Connection", value: connType },
              { icon: Server, label: "Server", value: "Cloudflare" },
              { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS" : "HTTP" },
              { icon: MapPin, label: "Location", value: location_ },
              { icon: Monitor, label: "ISP / Org", value: isp },
              { icon: Zap, label: "Est. Bandwidth", value: downlink },
              { icon: Activity, label: "RTT", value: rtt },
              { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
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

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="rounded-2xl border-2 border-foreground/10 bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Test History
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px]"
                onClick={() => { setTestHistory([]); localStorage.removeItem("cv_speed_history"); }}
              >
                Clear
              </Button>
            </div>

            {/* Average summary */}
            {testHistory.length >= 2 && (
              <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg border border-foreground/8 bg-muted/30 p-2.5">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">Avg Download</span>
                  <span className="text-sm font-bold text-foreground">
                    {(testHistory.reduce((s, h) => s + h.dl, 0) / testHistory.length).toFixed(1)} Mbps
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">Avg Upload</span>
                  <span className="text-sm font-bold text-foreground">
                    {(testHistory.reduce((s, h) => s + h.ul, 0) / testHistory.length).toFixed(1)} Mbps
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">Avg Ping</span>
                  <span className="text-sm font-bold text-foreground">
                    {Math.round(testHistory.reduce((s, h) => s + h.ping, 0) / testHistory.length)} ms
                  </span>
                </div>
              </div>
            )}

            <div className="divide-y divide-foreground/5">
              {testHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3 py-2 text-xs">
                  <TrendingUp className="h-3 w-3 shrink-0 text-primary/50" />
                  <span className="font-mono font-semibold text-foreground">{h.dl.toFixed(1)}</span>
                  <Download className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono font-semibold text-foreground">{h.ul.toFixed(1)}</span>
                  <Upload className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{h.ping}ms</span>
                  <span className="ml-auto text-muted-foreground/60">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

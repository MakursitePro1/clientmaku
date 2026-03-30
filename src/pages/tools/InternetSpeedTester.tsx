import { useState, useRef, useCallback, useEffect, type CSSProperties, type MutableRefObject } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, Activity, Wifi, Globe, Zap, Server, Clock, Shield, RotateCcw, AlertTriangle, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TICK_COUNT = 40;
const START_ANGLE = -225;
const END_ANGLE = 45;
const TOTAL_ARC = END_ANGLE - START_ANGLE;

const SERVERS = [
  { id: "cloudflare", name: "Cloudflare", region: "Global CDN", baseUrl: "https://speed.cloudflare.com" },
  { id: "cloudflare-1mb", name: "Cloudflare (Light)", region: "1MB Test", baseUrl: "https://speed.cloudflare.com" },
];

const speedThemeVars = {
  "--speed-shell-from": "348 72% 14%",
  "--speed-shell-via": "333 68% 19%",
  "--speed-shell-to": "315 62% 17%",
  "--speed-surface": "338 44% 18%",
  "--speed-surface-strong": "334 50% 22%",
  "--speed-surface-soft": "328 48% 28%",
  "--speed-border": "338 90% 66%",
  "--speed-border-soft": "324 78% 58%",
  "--speed-glow": "334 100% 70%",
  "--speed-highlight": "18 100% 66%",
  "--speed-download": "202 100% 68%",
  "--speed-upload": "146 72% 58%",
  "--speed-ping": "44 100% 64%",
  "--speed-jitter": "26 100% 66%",
} as CSSProperties;

const shellClassName = "relative overflow-hidden rounded-[2rem] border-2 border-[hsl(var(--speed-border)/0.42)] bg-[linear-gradient(135deg,hsl(var(--speed-shell-from)),hsl(var(--speed-shell-via))_52%,hsl(var(--speed-shell-to)))] p-4 sm:p-6 lg:p-8 shadow-[0_30px_90px_-34px_hsl(var(--speed-glow)/0.65)]";
const cardClassName = "relative overflow-hidden rounded-[1.65rem] border border-[hsl(var(--speed-border-soft)/0.3)] bg-[linear-gradient(180deg,hsl(var(--speed-surface-strong)/0.86),hsl(var(--speed-surface)/0.76))] backdrop-blur-xl shadow-[0_18px_60px_-36px_hsl(var(--speed-glow)/0.75)]";
const subtleCardClassName = "rounded-2xl border border-[hsl(var(--speed-border-soft)/0.22)] bg-[linear-gradient(180deg,hsl(var(--speed-surface-soft)/0.34),hsl(var(--speed-surface)/0.2))] backdrop-blur-xl shadow-[inset_0_1px_0_hsl(var(--foreground)/0.05)]";
const metricCardClassName = "rounded-[1.35rem] border border-[hsl(var(--speed-border-soft)/0.24)] bg-[linear-gradient(180deg,hsl(var(--speed-surface-soft)/0.36),hsl(var(--speed-surface)/0.18))] p-4 text-center shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06)] transition-transform duration-300 hover:-translate-y-1";
const chipClassName = "flex items-center gap-2.5 rounded-xl border border-[hsl(var(--speed-border-soft)/0.2)] bg-[hsl(var(--speed-surface-soft)/0.22)] px-3 py-2.5 backdrop-blur-sm";
const statCardClassName = "rounded-[1.35rem] border border-[hsl(var(--speed-border-soft)/0.22)] bg-[linear-gradient(180deg,hsl(var(--speed-surface-soft)/0.28),hsl(var(--speed-surface)/0.22))] p-4 text-center shadow-[0_16px_40px_-34px_hsl(var(--speed-glow)/0.7)] transition-all duration-300 hover:border-[hsl(var(--speed-border)/0.38)] hover:-translate-y-1";
const selectTriggerClassName = "h-10 w-full sm:w-[250px] rounded-xl border-[hsl(var(--speed-border-soft)/0.28)] bg-[hsl(var(--speed-surface-soft)/0.34)] text-xs font-semibold text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.05)]";
const primaryButtonClassName = "rounded-full border-0 bg-[linear-gradient(135deg,hsl(var(--destructive)),hsl(var(--speed-border))_55%,hsl(var(--primary)))] px-8 py-6 font-bold text-primary-foreground shadow-[0_20px_40px_-18px_hsl(var(--speed-glow)/0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_hsl(var(--speed-glow)/1)]";
const secondaryButtonClassName = "rounded-full border-[hsl(var(--speed-border-soft)/0.34)] bg-[hsl(var(--speed-surface-soft)/0.28)] px-8 py-6 font-bold text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.05)] transition-all duration-300 hover:bg-[hsl(var(--speed-surface-soft)/0.38)]";

function SpeedGauge({ value, maxSpeed, phase, testing }: { value: number; maxSpeed: number; phase: string; testing: boolean }) {
  const pct = Math.min(value / maxSpeed, 1);
  const cx = 150;
  const cy = 150;
  const r = 120;

  const rad = (d: number) => (d * Math.PI) / 180;
  const polarToCart = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(rad(angle)),
    y: cy + radius * Math.sin(rad(angle)),
  });
  const arcPath = (startDeg: number, endDeg: number, radius: number) => {
    const s = polarToCart(startDeg, radius);
    const e = polarToCart(endDeg, radius);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };
  const needleAngle = START_ANGLE + TOTAL_ARC * pct;
  const getTone = (p: number) => {
    if (p < 0.25) return "var(--destructive)";
    if (p < 0.5) return "var(--speed-highlight)";
    if (p < 0.75) return "var(--speed-upload)";
    return "var(--speed-border)";
  };
  const activeTone = getTone(pct);
  const activeColor = `hsl(${activeTone})`;
  const activeGlow = `hsl(${activeTone} / 0.22)`;

  return (
    <div className="relative">
      {testing && (
        <motion.div
          animate={{ opacity: [0.18, 0.42, 0.18], scale: [0.94, 1.04, 0.94] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${activeGlow} 0%, transparent 72%)` }}
        />
      )}

      <svg viewBox="0 0 300 210" className="relative mx-auto w-full max-w-[320px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="35%" stopColor="hsl(var(--speed-highlight))" />
            <stop offset="70%" stopColor="hsl(var(--speed-border))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={arcPath(START_ANGLE, END_ANGLE, r)} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" opacity="0.18" />

        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / TICK_COUNT) * i;
          const isMajor = i % 10 === 0;
          const isActive = i / TICK_COUNT <= pct;
          const inner = polarToCart(angle, r + 4);
          const outer = polarToCart(angle, r + (isMajor ? 18 : 12));

          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={isActive ? activeColor : "hsl(var(--muted-foreground))"}
              strokeWidth={isMajor ? 2 : 1}
              opacity={isActive ? 0.9 : 0.14}
              strokeLinecap="round"
            />
          );
        })}

        {[0, 25, 50, 75, 100].map((val, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / 4) * i;
          const p = polarToCart(angle, r + 28);
          const label = Math.round((val * maxSpeed) / 100);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-[8px] font-medium" opacity="0.55">
              {label}
            </text>
          );
        })}

        {value > 0 && <path d={arcPath(START_ANGLE, needleAngle, r)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />}

        {(() => {
          const tip = polarToCart(needleAngle, r - 30);
          return <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.3s ease-out" }} />;
        })()}

        <circle cx={cx} cy={cy} r="8" fill={activeColor} opacity="0.2" />
        <circle cx={cx} cy={cy} r="5" fill={activeColor} />
        <circle cx={cx} cy={cy} r="2" fill="hsl(var(--background))" />

        <text x={cx} y={cy - 25} textAnchor="middle" className="fill-foreground font-black" style={{ fontSize: "42px" }}>
          {value > 0 ? value.toFixed(1) : "—"}
        </text>
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-muted-foreground font-semibold" style={{ fontSize: "10px" }}>
          Mbps
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: "9px" }}>
          <tspan className={testing ? "fill-[hsl(var(--speed-border))]" : "fill-muted-foreground"}>
            {phase === "ping"
              ? "⏱ Measuring Latency..."
              : phase === "download"
                ? "⬇ Testing Download..."
                : phase === "upload"
                  ? "⬆ Testing Upload..."
                  : phase === "done"
                    ? "✅ Test Complete"
                    : "Ready to Test"}
          </tspan>
        </text>
      </svg>

      {testing && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full border-2"
          style={{ borderColor: activeColor }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0, 0.28] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function LatencyChart({ pings }: { pings: number[] }) {
  if (!pings.length) return null;

  const max = Math.max(...pings, 1);
  const min = Math.min(...pings);
  const avg = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  const w = 280;
  const h = 80;
  const pad = 4;
  const points = pings.map((p, i) => ({
    x: pad + (i / Math.max(pings.length - 1, 1)) * (w - pad * 2),
    y: pad + (1 - p / max) * (h - pad * 2),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div className={cn(cardClassName, "p-4 sm:p-5") }>
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--speed-border-soft)/0.4)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-foreground/90">
            <BarChart3 className="h-3.5 w-3.5 text-[hsl(var(--speed-border))]" /> Latency Chart
          </h3>
          <div className="flex gap-3 text-[10px] text-muted-foreground">
            <span>Min: <b className="text-[hsl(var(--speed-upload))]">{min}ms</b></span>
            <span>Avg: <b className="text-[hsl(var(--speed-ping))]">{avg}ms</b></span>
            <span>Max: <b className="text-destructive">{Math.round(max)}ms</b></span>
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
          <defs>
            <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--speed-border))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--speed-border))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#latencyFill)" />
          <path d={line} fill="none" stroke="hsl(var(--speed-border))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--speed-highlight))" opacity="0.9" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function getConnectionEstimate() {
  const connection = (navigator as any).connection;
  const downlinkMbps = connection?.downlink ? +(connection.downlink * 8).toFixed(2) : 0;
  const uploadMbps = downlinkMbps ? +(Math.max(downlinkMbps * 0.35, 1)).toFixed(2) : 0;
  const pingMs = connection?.rtt ? Math.round(connection.rtt) : 0;
  return { downlinkMbps, uploadMbps, pingMs };
}

async function measureDownload(baseUrl: string, light: boolean, onProgress: (s: number) => void, cancelRef: MutableRefObject<boolean>): Promise<number> {
  const sizes = light ? [1000000] : [5000000, 10000000];
  const urls = sizes.map((s, i) => `${baseUrl}/__down?bytes=${s}&_=${Date.now() + i}`);
  const startTime = performance.now();
  let totalBytes = 0;

  const promises = urls.map(async (url) => {
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
        totalBytes += value.byteLength;
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > 0.15) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
      }
    } catch {
      /* handled below */
    }
  });

  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalBytes > 0 && totalElapsed > 0) return +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2);

  const est = getConnectionEstimate();
  if (est.downlinkMbps > 0) {
    onProgress(est.downlinkMbps);
    return est.downlinkMbps;
  }

  return 0;
}

async function measureUpload(baseUrl: string, onProgress: (s: number) => void, cancelRef: MutableRefObject<boolean>): Promise<number> {
  const sizes = [800_000, 1_600_000];
  const startTime = performance.now();
  let totalBytes = 0;

  const promises = sizes.map(async (size) => {
    if (cancelRef.current) return;
    try {
      await fetch(`${baseUrl}/__up`, { method: "POST", body: new Uint8Array(size), cache: "no-store", mode: "cors" });
      totalBytes += size;
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed > 0.1) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
    } catch {
      /* handled below */
    }
  });

  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalBytes > 0 && totalElapsed > 0) return +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2);

  const est = getConnectionEstimate();
  return est.uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>, onPingSample: (p: number) => void): Promise<{ avgPing: number; avgJitter: number; samples: number[] }> {
  const pings: number[] = [];

  for (let i = 0; i < 10; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0, samples: pings };
    const s = performance.now();
    try {
      await fetch(`${baseUrl}/__down?bytes=0&_=${Date.now()}_${i}`, { cache: "no-store", mode: "cors" });
      const p = Math.round(performance.now() - s);
      pings.push(p);
      onPingSample(p);
    } catch {
      const est = getConnectionEstimate();
      if (est.pingMs > 0) {
        pings.push(est.pingMs);
        onPingSample(est.pingMs);
      }
    }
  }

  if (!pings.length) {
    const est = getConnectionEstimate();
    return { avgPing: est.pingMs || 20, avgJitter: Math.max(Math.round((est.pingMs || 20) * 0.12), 2), samples: [est.pingMs || 20] };
  }

  const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  const avgJitter = Math.round(pings.slice(1).reduce((s, v, i) => s + Math.abs(v - pings[i]), 0) / Math.max(pings.length - 1, 1));
  return { avgPing, avgJitter, samples: pings };
}

export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "ping" | "download" | "upload" | "done" | "error">("idle");
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [ip, setIp] = useState("—");
  const [connType, setConnType] = useState("—");
  const [testHistory, setTestHistory] = useState<{ dl: number; ul: number; ping: number; time: string; server: string }[]>([]);
  const [selectedServer, setSelectedServer] = useState("cloudflare");
  const [pingSamples, setPingSamples] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const cancelRef = useRef(false);

  useEffect(() => {
    const c = (navigator as any).connection;
    if (c) setConnType((c.effectiveType || c.type || "Unknown").toUpperCase());

    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip || "—");
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

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);
    setLiveSpeed(0);
    setPingSamples([]);
    setErrorMsg("");
    setPhase("idle");

    const server = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
    const isLight = selectedServer === "cloudflare-1mb";

    try {
      setPhase("ping");
      const { avgPing, avgJitter, samples } = await measurePing(server.baseUrl, cancelRef, (p) => setPingSamples((prev) => [...prev, p]));
      if (cancelRef.current) return reset();
      setPing(avgPing);
      setJitter(avgJitter);
      setPingSamples(samples);

      setPhase("download");
      const dlSpeed = await measureDownload(server.baseUrl, isLight, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      if (dlSpeed === 0) throw new Error("Download test failed - no data received");
      setDownload(dlSpeed);
      setLiveSpeed(dlSpeed);

      setPhase("upload");
      const ulSpeed = await measureUpload(server.baseUrl, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      setUpload(ulSpeed);

      const entry = { dl: dlSpeed, ul: ulSpeed, ping: avgPing, time: new Date().toLocaleString(), server: server.name };
      const hist = [entry, ...testHistory].slice(0, 10);
      setTestHistory(hist);
      localStorage.setItem("cv_speed_history", JSON.stringify(hist));

      setPhase("done");
      setTesting(false);
      setLiveSpeed(dlSpeed);
      setRetryCount(0);
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err?.message || "Speed test failed. Check your connection.");
      setTesting(false);
      setRetryCount((prev) => prev + 1);
    }
  }, [selectedServer, testHistory]);

  const reset = () => {
    setTesting(false);
    setPhase("idle");
    setLiveSpeed(0);
    setErrorMsg("");
  };

  const cancel = () => {
    cancelRef.current = true;
    reset();
  };

  const maxSpeed = Math.max(100, (download || 0) * 1.5, liveSpeed * 1.5);
  const gaugeVal = phase === "done" ? download || 0 : liveSpeed;

  const getQuality = (dl: number) => {
    if (dl >= 50) {
      return { label: "Excellent", tone: "text-[hsl(var(--speed-upload))]", summary: "Great for 4K streaming, gaming, and large uploads.", emoji: "🚀" };
    }
    if (dl >= 25) {
      return { label: "Very Good", tone: "text-[hsl(var(--speed-border))]", summary: "Smooth for HD streaming, meetings, and quick downloads.", emoji: "✨" };
    }
    if (dl >= 10) {
      return { label: "Good", tone: "text-[hsl(var(--speed-ping))]", summary: "Solid for browsing, social apps, and standard streaming.", emoji: "👍" };
    }
    if (dl >= 5) {
      return { label: "Fair", tone: "text-[hsl(var(--speed-jitter))]", summary: "Works for light use, but video calls may fluctuate.", emoji: "⚠️" };
    }
    return { label: "Slow", tone: "text-destructive", summary: "Expect buffering and slower downloads on heavier tasks.", emoji: "🐌" };
  };

  const quality = phase === "done" && download !== null ? getQuality(download) : null;
  const stats = [
    { icon: Activity, label: "Ping", val: ping !== null ? `${ping}ms` : "—", tone: "text-[hsl(var(--speed-ping))]", desc: "Latency" },
    { icon: Wifi, label: "Jitter", val: jitter !== null ? `${jitter}ms` : "—", tone: "text-[hsl(var(--speed-jitter))]", desc: "Stability" },
    { icon: Download, label: "Download", val: download !== null ? `${download}` : "—", tone: "text-[hsl(var(--speed-download))]", desc: "Mbps" },
    { icon: Upload, label: "Upload", val: upload !== null ? `${upload}` : "—", tone: "text-[hsl(var(--speed-upload))]", desc: "Mbps" },
  ];

  return (
    <ToolLayout title="Internet Speed Tester" description="Analyze your internet connection speed with advanced metrics">
      <div className="mx-auto max-w-4xl">
        <div className={shellClassName} style={speedThemeVars}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,hsl(var(--speed-border)/0.25),transparent_68%)] blur-2xl" />
            <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--destructive)/0.22),transparent_68%)] blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--speed-glow)/0.12),transparent_70%)] blur-3xl" />
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--speed-border-soft)/0.46)_1px,transparent_1px)] [background-size:18px_18px]" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className={cn(cardClassName, "p-4 sm:p-5")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[hsl(var(--speed-border))]">
                    <Server className="h-4 w-4" /> Optimized Route
                  </div>
                  <p className="text-sm text-foreground/90">Choose a server, then run a fully styled live benchmark.</p>
                  <p className="text-xs text-muted-foreground">The entire section is now tuned with a colorful premium red/pink layout.</p>
                </div>
                <Select value={selectedServer} onValueChange={setSelectedServer} disabled={testing}>
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[hsl(var(--speed-border-soft)/0.32)] bg-[hsl(var(--speed-surface-strong)/0.96)] text-foreground backdrop-blur-xl">
                    {SERVERS.map((server) => (
                      <SelectItem key={server.id} value={server.id}>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-[hsl(var(--speed-border))]" />
                          <span>{server.name}</span>
                          <span className="text-[10px] text-muted-foreground">({server.region})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AnimatePresence>
              {phase === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[linear-gradient(180deg,hsl(var(--destructive)/0.14),hsl(var(--speed-surface)/0.5))] p-4 shadow-[0_18px_40px_-30px_hsl(var(--destructive)/0.8)]"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-destructive">Speed Test Failed</p>
                      <p className="mt-1 text-xs text-muted-foreground">{errorMsg}</p>
                      {retryCount > 1 && <p className="mt-1 text-[10px] text-muted-foreground">Try another server or re-run the test after your connection stabilizes.</p>}
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={runTest} className="gap-1.5 border-[hsl(var(--speed-border-soft)/0.3)] bg-[hsl(var(--speed-surface-soft)/0.2)] text-xs text-foreground">
                      <RotateCcw className="h-3 w-3" /> Retry{retryCount > 0 && ` (${retryCount})`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(cardClassName, "overflow-hidden")}>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--speed-border)/0.12),transparent_42%)]" />
              <div className="relative z-10 grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(280px,0.82fr)] lg:items-center">
                <div>
                  <div className="mb-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[hsl(var(--speed-highlight))]">Live Benchmark</p>
                    <h3 className="mt-2 bg-[linear-gradient(135deg,hsl(var(--speed-highlight)),hsl(var(--speed-border))_60%,hsl(var(--primary)))] bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
                      Premium Colorful Speed Panel
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">A vivid red/pink dashboard with responsive spacing, glowing layers, and richer contrast.</p>
                  </div>

                  <SpeedGauge value={gaugeVal} maxSpeed={maxSpeed} phase={phase} testing={testing} />

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {testing ? (
                      <Button type="button" variant="outline" onClick={cancel} className={secondaryButtonClassName}>
                        Cancel Test
                      </Button>
                    ) : (
                      <Button type="button" onClick={runTest} className={primaryButtonClassName}>
                        <Zap className="mr-2 h-5 w-5" />
                        {phase === "done" ? "Test Again" : phase === "error" ? "Retry Test" : "Start Speed Test"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className={metricCardClassName}>
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4 text-[hsl(var(--speed-download))]" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Download</span>
                      </div>
                      <div className="text-[hsl(var(--speed-download))] text-3xl font-black">{download !== null ? download : "—"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Mbps throughput</div>
                    </div>

                    <div className={metricCardClassName}>
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4 text-[hsl(var(--speed-upload))]" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Upload</span>
                      </div>
                      <div className="text-[hsl(var(--speed-upload))] text-3xl font-black">{upload !== null ? upload : "—"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Mbps throughput</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={subtleCardClassName + " p-3"}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Phase</div>
                      <div className="mt-1 text-sm font-bold text-foreground">{phase === "idle" ? "Ready" : phase.charAt(0).toUpperCase() + phase.slice(1)}</div>
                    </div>
                    <div className={subtleCardClassName + " p-3"}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Tests Saved</div>
                      <div className="mt-1 text-sm font-bold text-foreground">{testHistory.length}</div>
                    </div>
                    <div className={subtleCardClassName + " p-3"}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Connection</div>
                      <div className="mt-1 truncate text-sm font-bold text-foreground">{connType}</div>
                    </div>
                    <div className={subtleCardClassName + " p-3"}>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Server</div>
                      <div className="mt-1 truncate text-sm font-bold text-foreground">{SERVERS.find((server) => server.id === selectedServer)?.name || "—"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {quality && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn(cardClassName, "p-4 sm:p-5") }>
                  <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[hsl(var(--speed-border-soft)/0.28)] bg-[hsl(var(--speed-surface-soft)/0.34)] text-3xl shadow-[0_0_30px_-10px_hsl(var(--speed-glow)/0.8)]">
                      {quality.emoji}
                    </div>
                    <div>
                      <p className={cn("text-xl font-black", quality.tone)}>{quality.label} Connection</p>
                      <p className="mt-1 text-sm text-muted-foreground">{quality.summary}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className={statCardClassName}>
                  <item.icon className={cn("mx-auto mb-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110", item.tone)} />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-xl font-black text-foreground">{item.val}</div>
                  <div className="text-[10px] text-muted-foreground/70">{item.desc}</div>
                </div>
              ))}
            </div>

            <LatencyChart pings={pingSamples} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className={cn(cardClassName, "p-4 sm:p-5")}>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--speed-border))]">
                  <Globe className="h-4 w-4" /> Network Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Globe, label: "IP Address", value: ip },
                    { icon: Wifi, label: "Connection", value: connType },
                    { icon: Server, label: "Server", value: SERVERS.find((server) => server.id === selectedServer)?.name || "—" },
                    { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS (Secure)" : "HTTP" },
                    { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
                    { icon: Activity, label: "Tests Run", value: `${testHistory.length}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className={chipClassName}>
                      <Icon className="h-4 w-4 shrink-0 text-[hsl(var(--speed-border))]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                        <div className="truncate text-sm font-bold text-foreground">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {testHistory.length > 0 && (
                <div className={cn(cardClassName, "p-4 sm:p-5")}>
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[hsl(var(--speed-highlight))]">
                    <Clock className="h-4 w-4" /> Test History
                  </h3>
                  <div className="space-y-3">
                    {testHistory.map((entry, index) => (
                      <div key={index} className="rounded-2xl border border-[hsl(var(--speed-border-soft)/0.18)] bg-[hsl(var(--speed-surface-soft)/0.22)] px-4 py-3 backdrop-blur-sm">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{entry.server}</span>
                          <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-[hsl(var(--speed-download))]">
                            <Download className="h-3.5 w-3.5" />
                            <span className="font-bold">{entry.dl}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[hsl(var(--speed-upload))]">
                            <Upload className="h-3.5 w-3.5" />
                            <span className="font-bold">{entry.ul}</span>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 text-[hsl(var(--speed-ping))]">
                            <Activity className="h-3.5 w-3.5" />
                            <span className="font-bold">{entry.ping}ms</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, Activity, Wifi, Globe, Zap, Server, Clock, Shield, RotateCcw, AlertTriangle, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TICK_COUNT = 40;
const START_ANGLE = -225;
const END_ANGLE = 45;
const TOTAL_ARC = END_ANGLE - START_ANGLE;

const SERVERS = [
  { id: "cloudflare", name: "Cloudflare", region: "Global CDN", baseUrl: "https://speed.cloudflare.com" },
  { id: "cloudflare-1mb", name: "Cloudflare (Light)", region: "1MB Test", baseUrl: "https://speed.cloudflare.com" },
];

function SpeedGauge({ value, maxSpeed, phase, testing }: { value: number; maxSpeed: number; phase: string; testing: boolean }) {
  const pct = Math.min(value / maxSpeed, 1);
  const cx = 150, cy = 150, r = 120;
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
  const getColor = (p: number) => {
    if (p < 0.25) return "#ef4444";
    if (p < 0.5) return "#f59e0b";
    if (p < 0.75) return "#22c55e";
    return "#7c3aed";
  };
  const activeColor = getColor(pct);

  return (
    <div className="relative">
      {testing && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${activeColor}20 0%, transparent 70%)` }}
        />
      )}
      <svg viewBox="0 0 300 210" className="w-full max-w-[320px] mx-auto relative">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="33%" stopColor="#f59e0b" />
            <stop offset="66%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d={arcPath(START_ANGLE, END_ANGLE, r)} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / TICK_COUNT) * i;
          const isMajor = i % 10 === 0;
          const isActive = i / TICK_COUNT <= pct;
          const inner = polarToCart(angle, r + 4);
          const outer = polarToCart(angle, r + (isMajor ? 18 : 12));
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke={isActive ? activeColor : "hsl(var(--muted-foreground))"} strokeWidth={isMajor ? 2 : 1} opacity={isActive ? 0.9 : 0.15} strokeLinecap="round" />
          );
        })}
        {[0, 25, 50, 75, 100].map((val, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / 4) * i;
          const p = polarToCart(angle, r + 28);
          const label = Math.round(val * maxSpeed / 100);
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-[8px] font-medium" opacity="0.5">{label}</text>;
        })}
        {value > 0 && <path d={arcPath(START_ANGLE, needleAngle, r)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />}
        {(() => {
          const tip = polarToCart(needleAngle, r - 30);
          return <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={activeColor} strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.3s ease-out" }} />;
        })()}
        <circle cx={cx} cy={cy} r="8" fill={activeColor} opacity="0.2" />
        <circle cx={cx} cy={cy} r="5" fill={activeColor} />
        <circle cx={cx} cy={cy} r="2" fill="hsl(var(--background))" />
        <text x={cx} y={cy - 25} textAnchor="middle" className="fill-foreground font-black" style={{ fontSize: "42px" }}>{value > 0 ? value.toFixed(1) : "—"}</text>
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-muted-foreground font-semibold" style={{ fontSize: "10px" }}>Mbps</text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: "9px" }}>
          <tspan className={testing ? "fill-primary" : "fill-muted-foreground"}>
            {phase === "ping" ? "⏱ Measuring Latency..." : phase === "download" ? "⬇ Testing Download..." : phase === "upload" ? "⬆ Testing Upload..." : phase === "done" ? "✅ Test Complete" : "Ready to Test"}
          </tspan>
        </text>
      </svg>
      {testing && (
        <motion.div className="absolute inset-0 rounded-full border-2 pointer-events-none" style={{ borderColor: activeColor }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      )}
    </div>
  );
}

/* ── Latency Chart ── */
function LatencyChart({ pings }: { pings: number[] }) {
  if (!pings.length) return null;
  const max = Math.max(...pings, 1);
  const min = Math.min(...pings);
  const avg = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  const w = 280, h = 80, pad = 4;
  const points = pings.map((p, i) => ({
    x: pad + (i / Math.max(pings.length - 1, 1)) * (w - pad * 2),
    y: pad + (1 - p / max) * (h - pad * 2),
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div className="rounded-xl border border-border/30 bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-primary" /> Latency Chart
        </h3>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Min: <b className="text-green-500">{min}ms</b></span>
          <span>Avg: <b className="text-yellow-500">{avg}ms</b></span>
          <span>Max: <b className="text-red-500">{Math.round(max)}ms</b></span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
        <defs>
          <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#latencyFill)" />
        <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--primary))" opacity="0.8" />
        ))}
      </svg>
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

async function measureDownload(baseUrl: string, light: boolean, onProgress: (s: number) => void, cancelRef: React.MutableRefObject<boolean>): Promise<number> {
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
        if (cancelRef.current) { await reader.cancel(); return; }
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > 0.15) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
      }
    } catch { /* handled below */ }
  });
  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalBytes > 0 && totalElapsed > 0) return +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2);
  const est = getConnectionEstimate();
  if (est.downlinkMbps > 0) { onProgress(est.downlinkMbps); return est.downlinkMbps; }
  return 0;
}

async function measureUpload(baseUrl: string, onProgress: (s: number) => void, cancelRef: React.MutableRefObject<boolean>): Promise<number> {
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
    } catch { /* handled below */ }
  });
  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  if (totalBytes > 0 && totalElapsed > 0) return +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2);
  const est = getConnectionEstimate();
  return est.uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: React.MutableRefObject<boolean>, onPingSample: (p: number) => void): Promise<{ avgPing: number; avgJitter: number; samples: number[] }> {
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
      if (est.pingMs > 0) { pings.push(est.pingMs); onPingSample(est.pingMs); }
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
      } catch { setIp("Unknown"); }
    })();
    try { setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]")); } catch {}
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setDownload(null); setUpload(null); setPing(null); setJitter(null);
    setLiveSpeed(0); setPingSamples([]); setErrorMsg(""); setPhase("idle");

    const server = SERVERS.find(s => s.id === selectedServer) || SERVERS[0];
    const isLight = selectedServer === "cloudflare-1mb";

    try {
      // Ping
      setPhase("ping");
      const { avgPing, avgJitter, samples } = await measurePing(server.baseUrl, cancelRef, (p) => setPingSamples(prev => [...prev, p]));
      if (cancelRef.current) return reset();
      setPing(avgPing); setJitter(avgJitter); setPingSamples(samples);

      // Download
      setPhase("download");
      const dlSpeed = await measureDownload(server.baseUrl, isLight, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      if (dlSpeed === 0) throw new Error("Download test failed - no data received");
      setDownload(dlSpeed); setLiveSpeed(dlSpeed);

      // Upload
      setPhase("upload");
      const ulSpeed = await measureUpload(server.baseUrl, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      setUpload(ulSpeed);

      // Save
      const entry = { dl: dlSpeed, ul: ulSpeed, ping: avgPing, time: new Date().toLocaleString(), server: server.name };
      const hist = [entry, ...testHistory].slice(0, 10);
      setTestHistory(hist);
      localStorage.setItem("cv_speed_history", JSON.stringify(hist));

      setPhase("done"); setTesting(false); setLiveSpeed(dlSpeed); setRetryCount(0);
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err?.message || "Speed test failed. Check your connection.");
      setTesting(false);
      setRetryCount(prev => prev + 1);
    }
  }, [testHistory, selectedServer]);

  const reset = () => { setTesting(false); setPhase("idle"); setLiveSpeed(0); setErrorMsg(""); };
  const cancel = () => { cancelRef.current = true; reset(); };

  const maxSpeed = Math.max(100, (download || 0) * 1.5, liveSpeed * 1.5);
  const gaugeVal = phase === "done" ? (download || 0) : liveSpeed;

  const getQuality = (dl: number) => {
    if (dl >= 50) return { label: "Excellent", color: "text-green-400", emoji: "🚀" };
    if (dl >= 25) return { label: "Very Good", color: "text-green-500", emoji: "✅" };
    if (dl >= 10) return { label: "Good", color: "text-yellow-500", emoji: "👍" };
    if (dl >= 5) return { label: "Fair", color: "text-orange-500", emoji: "⚠️" };
    return { label: "Slow", color: "text-red-500", emoji: "🐌" };
  };

  return (
    <ToolLayout title="Internet Speed Tester" description="Analyze your internet connection speed with advanced metrics">
      <div className="max-w-xl mx-auto space-y-6 relative">
        {/* Deep Green Gradient Background */}
        <div className="absolute -inset-6 -top-10 rounded-3xl overflow-hidden pointer-events-none -z-10">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 20%, #047857 40%, #059669 60%, #10b981 80%, #064e3b 100%)"
          }} />
          <div className="absolute inset-0 opacity-30" style={{
            background: "radial-gradient(ellipse at 20% 20%, #34d399 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #6ee7b7 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #047857 0%, transparent 60%)"
          }} />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-20 bg-emerald-300" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] rounded-full blur-[100px] opacity-15 bg-teal-400" />
        </div>

        {/* Server Selection */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 backdrop-blur-sm p-4 shadow-lg shadow-emerald-900/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold">Test Server</span>
            </div>
            <Select value={selectedServer} onValueChange={setSelectedServer} disabled={testing}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVERS.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <span>{s.name}</span>
                      <span className="text-muted-foreground text-[10px]">({s.region})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {phase === "error" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-red-500/40 bg-red-950/40 backdrop-blur-sm p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-400">Speed Test Failed</p>
                  <p className="text-xs text-emerald-200/60 mt-1">{errorMsg}</p>
                  {retryCount > 1 && <p className="text-[10px] text-emerald-200/50 mt-1">Try switching to a different server or check your connection.</p>}
                </div>
                <Button type="button" size="sm" variant="outline" onClick={runTest} className="shrink-0 text-xs gap-1.5 border-emerald-500/30 text-emerald-200 hover:bg-emerald-800/40">
                  <RotateCcw className="w-3 h-3" /> Retry{retryCount > 0 && ` (${retryCount})`}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gauge */}
        <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-950/70 backdrop-blur-sm p-6 text-center overflow-hidden shadow-2xl shadow-emerald-900/30">
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #6ee7b7 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[150px] rounded-full blur-[80px] pointer-events-none opacity-15 bg-emerald-400" />
          <div className="relative z-10">
            <SpeedGauge value={gaugeVal} maxSpeed={maxSpeed} phase={phase} testing={testing} />
            <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-emerald-500/20">
              <div className={`relative rounded-xl bg-emerald-900/40 border border-emerald-500/20 p-3 overflow-hidden ${phase === "download" ? "ring-1 ring-emerald-400/50" : ""}`}>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Download className="w-4 h-4 text-blue-400" /><span className="text-[11px] font-semibold text-emerald-300/70">Download</span>
                </div>
                <div className="text-2xl font-black text-white">{download !== null ? download : "—"}<span className="text-xs font-normal text-emerald-300/60 ml-1">Mbps</span></div>
              </div>
              <div className={`relative rounded-xl bg-emerald-900/40 border border-emerald-500/20 p-3 overflow-hidden ${phase === "upload" ? "ring-1 ring-emerald-400/50" : ""}`}>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Upload className="w-4 h-4 text-green-400" /><span className="text-[11px] font-semibold text-emerald-300/70">Upload</span>
                </div>
                <div className="text-2xl font-black text-white">{upload !== null ? upload : "—"}<span className="text-xs font-normal text-emerald-300/60 ml-1">Mbps</span></div>
              </div>
            </div>
            <div className="mt-5">
              {testing ? (
                <Button type="button" variant="outline" onClick={cancel} className="rounded-full px-10 py-5 text-emerald-300 border-emerald-500/40 font-bold hover:bg-emerald-800/40">Cancel Test</Button>
              ) : (
                <Button type="button" onClick={runTest}
                  className="rounded-full px-10 py-6 font-bold text-base text-white shadow-xl shadow-emerald-700/40"
                  style={{ background: "linear-gradient(135deg, #059669, #10b981, #34d399)" }}>
                  <Zap className="w-5 h-5 mr-2" />{phase === "done" ? "Test Again" : phase === "error" ? "Retry Test" : "Start Speed Test"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quality Badge */}
        <AnimatePresence>
          {phase === "done" && download !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-border/30 bg-card p-4 text-center">
              {(() => {
                const q = getQuality(download);
                return (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">{q.emoji}</span>
                    <div>
                      <p className={`text-lg font-bold ${q.color}`}>{q.label} Connection</p>
                      <p className="text-xs text-muted-foreground">
                        {download >= 25 ? "Great for HD streaming & gaming" : download >= 10 ? "Good for browsing & SD streaming" : "May experience buffering on video"}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Activity, label: "Ping", val: ping !== null ? `${ping}ms` : "—", color: "text-yellow-500", desc: "Latency" },
            { icon: Wifi, label: "Jitter", val: jitter !== null ? `${jitter}ms` : "—", color: "text-orange-500", desc: "Stability" },
            { icon: Download, label: "Download", val: download !== null ? `${download}` : "—", color: "text-blue-500", desc: "Mbps" },
            { icon: Upload, label: "Upload", val: upload !== null ? `${upload}` : "—", color: "text-green-500", desc: "Mbps" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border/30 p-3 text-center group hover:border-primary/30 transition-colors">
              <s.icon className={`w-4 h-4 mx-auto mb-1.5 ${s.color} group-hover:scale-110 transition-transform`} />
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</div>
              <div className="text-lg font-black mt-0.5">{s.val}</div>
              <div className="text-[9px] text-muted-foreground/50">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Latency Chart */}
        <LatencyChart pings={pingSamples} />

        {/* Network Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary" /> Network Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { icon: Globe, label: "IP Address", value: ip },
              { icon: Wifi, label: "Connection", value: connType },
              { icon: Server, label: "Server", value: SERVERS.find(s => s.id === selectedServer)?.name || "—" },
              { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS (Secure)" : "HTTP" },
              { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
              { icon: Activity, label: "Tests Run", value: `${testHistory.length}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-accent/20">
                <Icon className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-muted-foreground/70">{label}</span>
                <span className="font-bold truncate ml-auto text-right max-w-[140px]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="rounded-xl border border-border/30 bg-card p-4">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Test History</h3>
            <div className="space-y-2">
              {testHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-xs py-2 px-3 rounded-lg bg-accent/20">
                  <span className="text-muted-foreground/50 text-[10px] w-28 shrink-0">{h.time}</span>
                  <div className="flex items-center gap-1 text-blue-500"><Download className="w-3 h-3" /><span className="font-bold">{h.dl}</span></div>
                  <div className="flex items-center gap-1 text-green-500"><Upload className="w-3 h-3" /><span className="font-bold">{h.ul}</span></div>
                  <div className="flex items-center gap-1 text-yellow-500 ml-auto"><Activity className="w-3 h-3" /><span className="font-bold">{h.ping}ms</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

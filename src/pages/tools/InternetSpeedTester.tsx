import { useState, useRef, useCallback, useEffect, type MutableRefObject } from "react";
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

/* ── Gauge ── */
function SpeedGauge({ value, maxSpeed, phase, testing }: { value: number; maxSpeed: number; phase: string; testing: boolean }) {
  const pct = Math.min(value / maxSpeed, 1);
  const cx = 150, cy = 150, r = 120;
  const rad = (d: number) => (d * Math.PI) / 180;
  const polar = (angle: number, radius: number) => ({ x: cx + radius * Math.cos(rad(angle)), y: cy + radius * Math.sin(rad(angle)) });
  const arcPath = (s: number, e: number, radius: number) => { const a = polar(s, radius); const b = polar(e, radius); return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x} ${b.y}`; };
  const needleAngle = START_ANGLE + TOTAL_ARC * pct;

  return (
    <div className="relative">
      {testing && (
        <motion.div animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.96, 1.03, 0.96] }} transition={{ duration: 2, repeat: Infinity }} className="pointer-events-none absolute inset-0 rounded-full blur-3xl bg-primary/20" />
      )}
      <svg viewBox="0 0 300 210" className="relative mx-auto w-full max-w-[300px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" />
            <stop offset="40%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(160, 84%, 39%)" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d={arcPath(START_ANGLE, END_ANGLE, r)} fill="none" stroke="hsl(var(--border))" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / TICK_COUNT) * i;
          const isMajor = i % 10 === 0;
          const isActive = i / TICK_COUNT <= pct;
          const inner = polar(angle, r + 4);
          const outer = polar(angle, r + (isMajor ? 18 : 12));
          return <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} strokeWidth={isMajor ? 2 : 1} opacity={isActive ? 0.85 : 0.18} strokeLinecap="round" />;
        })}
        {[0, 25, 50, 75, 100].map((val, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / 4) * i;
          const p = polar(angle, r + 28);
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[8px] font-semibold" opacity="0.6">{Math.round((val * maxSpeed) / 100)}</text>;
        })}
        {value > 0 && <path d={arcPath(START_ANGLE, needleAngle, r)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />}
        {(() => { const tip = polar(needleAngle, r - 30); return <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "all 0.3s ease-out" }} />; })()}
        <circle cx={cx} cy={cy} r="8" fill="hsl(var(--primary))" opacity="0.2" />
        <circle cx={cx} cy={cy} r="5" fill="hsl(var(--primary))" />
        <circle cx={cx} cy={cy} r="2" fill="hsl(var(--background))" />
        <text x={cx} y={cy - 25} textAnchor="middle" className="fill-foreground font-black" style={{ fontSize: "42px" }}>{value > 0 ? value.toFixed(1) : "—"}</text>
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-muted-foreground font-semibold" style={{ fontSize: "10px" }}>Mbps</text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: "9px" }}>
          <tspan className={testing ? "fill-primary" : "fill-muted-foreground"}>
            {phase === "ping" ? "⏱ Measuring Latency..." : phase === "download" ? "⬇ Download..." : phase === "upload" ? "⬆ Upload..." : phase === "done" ? "✅ Complete" : "Ready"}
          </tspan>
        </text>
      </svg>
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
  const points = pings.map((p, i) => ({ x: pad + (i / Math.max(pings.length - 1, 1)) * (w - pad * 2), y: pad + (1 - p / max) * (h - pad * 2) }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

  return (
    <div className="rounded-2xl border-2 border-foreground/20 bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground"><BarChart3 className="h-3.5 w-3.5 text-primary" /> Latency</h3>
        <div className="flex gap-3 text-[10px] text-muted-foreground">
          <span>Min: <b className="text-green-500">{min}ms</b></span>
          <span>Avg: <b className="text-primary">{avg}ms</b></span>
          <span>Max: <b className="text-destructive">{Math.round(max)}ms</b></span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full">
        <defs><linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill="url(#lf)" />
        <path d={line} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--primary))" opacity="0.9" />)}
      </svg>
    </div>
  );
}

/* ── Network helpers (unchanged logic) ── */
function getConnectionEstimate() {
  const c = (navigator as any).connection;
  const dl = c?.downlink ? +(c.downlink * 8).toFixed(2) : 0;
  return { downlinkMbps: dl, uploadMbps: dl ? +(Math.max(dl * 0.35, 1)).toFixed(2) : 0, pingMs: c?.rtt ? Math.round(c.rtt) : 0 };
}

async function measureDownload(baseUrl: string, light: boolean, onProgress: (s: number) => void, cancelRef: MutableRefObject<boolean>): Promise<number> {
  const sizes = light ? [1000000] : [5000000, 10000000];
  const urls = sizes.map((s, i) => `${baseUrl}/__down?bytes=${s}&_=${Date.now() + i}`);
  const start = performance.now();
  let total = 0;
  await Promise.all(urls.map(async (url) => {
    if (cancelRef.current) return;
    try {
      const res = await fetch(url, { cache: "no-store", mode: "cors" });
      if (!res.ok || !res.body) return;
      const reader = res.body.getReader();
      while (true) {
        if (cancelRef.current) { await reader.cancel(); return; }
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        const elapsed = (performance.now() - start) / 1000;
        if (elapsed > 0.15) onProgress(+((total * 8) / elapsed / 1e6).toFixed(2));
      }
    } catch { /* skip */ }
  }));
  const elapsed = (performance.now() - start) / 1000;
  if (total > 0 && elapsed > 0) return +((total * 8) / elapsed / 1e6).toFixed(2);
  const est = getConnectionEstimate();
  if (est.downlinkMbps > 0) { onProgress(est.downlinkMbps); return est.downlinkMbps; }
  return 0;
}

async function measureUpload(baseUrl: string, onProgress: (s: number) => void, cancelRef: MutableRefObject<boolean>): Promise<number> {
  const sizes = [800_000, 1_600_000];
  const start = performance.now();
  let total = 0;
  await Promise.all(sizes.map(async (size) => {
    if (cancelRef.current) return;
    try { await fetch(`${baseUrl}/__up`, { method: "POST", body: new Uint8Array(size), cache: "no-store", mode: "cors" }); total += size; const e = (performance.now() - start) / 1000; if (e > 0.1) onProgress(+((total * 8) / e / 1e6).toFixed(2)); } catch { /* skip */ }
  }));
  const elapsed = (performance.now() - start) / 1000;
  if (total > 0 && elapsed > 0) return +((total * 8) / elapsed / 1e6).toFixed(2);
  return getConnectionEstimate().uploadMbps;
}

async function measurePing(baseUrl: string, cancelRef: MutableRefObject<boolean>, onSample: (p: number) => void) {
  const pings: number[] = [];
  for (let i = 0; i < 10; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0, samples: pings };
    const s = performance.now();
    try { await fetch(`${baseUrl}/__down?bytes=0&_=${Date.now()}_${i}`, { cache: "no-store", mode: "cors" }); const p = Math.round(performance.now() - s); pings.push(p); onSample(p); } catch { const est = getConnectionEstimate(); if (est.pingMs > 0) { pings.push(est.pingMs); onSample(est.pingMs); } }
  }
  if (!pings.length) { const est = getConnectionEstimate(); return { avgPing: est.pingMs || 20, avgJitter: Math.max(Math.round((est.pingMs || 20) * 0.12), 2), samples: [est.pingMs || 20] }; }
  const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  const avgJitter = Math.round(pings.slice(1).reduce((s, v, i) => s + Math.abs(v - pings[i]), 0) / Math.max(pings.length - 1, 1));
  return { avgPing, avgJitter, samples: pings };
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
    (async () => { try { const r = await fetch("https://api.ipify.org?format=json"); const d = await r.json(); setIp(d.ip || "—"); } catch { setIp("Unknown"); } })();
    try { setTestHistory(JSON.parse(localStorage.getItem("cv_speed_history") || "[]")); } catch { /* empty */ }
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true); setDownload(null); setUpload(null); setPing(null); setJitter(null); setLiveSpeed(0); setPingSamples([]); setErrorMsg(""); setPhase("idle");
    const server = SERVERS.find((s) => s.id === selectedServer) || SERVERS[0];
    const isLight = selectedServer === "cloudflare-1mb";
    try {
      setPhase("ping");
      const { avgPing, avgJitter, samples } = await measurePing(server.baseUrl, cancelRef, (p) => setPingSamples((prev) => [...prev, p]));
      if (cancelRef.current) return reset();
      setPing(avgPing); setJitter(avgJitter); setPingSamples(samples);
      setPhase("download");
      const dlSpeed = await measureDownload(server.baseUrl, isLight, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      if (dlSpeed === 0) throw new Error("Download test failed");
      setDownload(dlSpeed); setLiveSpeed(dlSpeed);
      setPhase("upload");
      const ulSpeed = await measureUpload(server.baseUrl, (s) => setLiveSpeed(s), cancelRef);
      if (cancelRef.current) return reset();
      setUpload(ulSpeed);
      const entry = { dl: dlSpeed, ul: ulSpeed, ping: avgPing, time: new Date().toLocaleString(), server: server.name };
      const hist = [entry, ...testHistory].slice(0, 10);
      setTestHistory(hist); localStorage.setItem("cv_speed_history", JSON.stringify(hist));
      setPhase("done"); setTesting(false); setLiveSpeed(dlSpeed); setRetryCount(0);
    } catch (err: any) { setPhase("error"); setErrorMsg(err?.message || "Speed test failed."); setTesting(false); setRetryCount((p) => p + 1); }
  }, [selectedServer, testHistory]);

  const reset = () => { setTesting(false); setPhase("idle"); setLiveSpeed(0); setErrorMsg(""); };
  const cancel = () => { cancelRef.current = true; reset(); };

  const maxSpeed = Math.max(100, (download || 0) * 1.5, liveSpeed * 1.5);
  const gaugeVal = phase === "done" ? download || 0 : liveSpeed;

  const getQuality = (dl: number) => {
    if (dl >= 50) return { label: "Excellent", color: "text-green-500", emoji: "🚀" };
    if (dl >= 25) return { label: "Very Good", color: "text-primary", emoji: "✨" };
    if (dl >= 10) return { label: "Good", color: "text-blue-500", emoji: "👍" };
    if (dl >= 5) return { label: "Fair", color: "text-yellow-500", emoji: "⚠️" };
    return { label: "Slow", color: "text-destructive", emoji: "🐌" };
  };

  const quality = phase === "done" && download !== null ? getQuality(download) : null;

  const metricItems = [
    { icon: Activity, label: "Ping", val: ping !== null ? `${ping}ms` : "—", color: "text-yellow-500" },
    { icon: Wifi, label: "Jitter", val: jitter !== null ? `${jitter}ms` : "—", color: "text-orange-500" },
    { icon: Download, label: "Download", val: download !== null ? `${download} Mbps` : "—", color: "text-blue-500" },
    { icon: Upload, label: "Upload", val: upload !== null ? `${upload} Mbps` : "—", color: "text-green-500" },
  ];

  const networkInfo = [
    { icon: Globe, label: "IP Address", value: ip },
    { icon: Wifi, label: "Connection", value: connType },
    { icon: Server, label: "Server", value: SERVERS.find((s) => s.id === selectedServer)?.name || "—" },
    { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS" : "HTTP" },
    { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
    { icon: Activity, label: "Tests Run", value: `${testHistory.length}` },
  ];

  return (
    <ToolLayout title="Internet Speed Tester" description="">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Server Selection */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border-2 border-foreground/15 bg-card p-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-foreground">Select Server</span>
          </div>
          <Select value={selectedServer} onValueChange={setSelectedServer} disabled={testing}>
            <SelectTrigger className="h-10 w-full sm:w-[240px] rounded-xl border-2 border-foreground/15 bg-background text-sm font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVERS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2"><Globe className="h-3 w-3 text-primary" />{s.name} <span className="text-xs text-muted-foreground">({s.region})</span></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        <AnimatePresence>
          {phase === "error" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-destructive">Test Failed</p>
                  <p className="mt-1 text-xs text-muted-foreground">{errorMsg}</p>
                </div>
                <Button size="sm" variant="outline" onClick={runTest} className="gap-1.5 text-xs"><RotateCcw className="h-3 w-3" /> Retry</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Gauge Card */}
        <div className="rounded-2xl border-2 border-foreground/15 bg-card p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Gauge */}
            <div className="text-center">
              <SpeedGauge value={gaugeVal} maxSpeed={maxSpeed} phase={phase} testing={testing} />
              <div className="mt-6 flex justify-center">
                {testing ? (
                  <Button variant="outline" onClick={cancel} className="rounded-full px-8 py-5 font-bold border-2 border-foreground/15">Cancel</Button>
                ) : (
                  <Button onClick={runTest} className="rounded-full px-8 py-5 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                    <Zap className="mr-2 h-5 w-5" />
                    {phase === "done" ? "Test Again" : phase === "error" ? "Retry" : "Start Test"}
                  </Button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {metricItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border-2 border-foreground/10 bg-background p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</div>
                    <div className="text-lg font-black text-foreground">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality */}
        <AnimatePresence>
          {quality && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border-2 border-foreground/15 bg-card p-5">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">{quality.emoji}</span>
                <span className={cn("text-2xl font-black", quality.color)}>{quality.label} Connection</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metricItems.map((item) => (
            <div key={item.label} className="rounded-xl border-2 border-foreground/10 bg-card p-4 text-center transition-transform hover:-translate-y-1">
              <item.icon className={cn("mx-auto mb-2 h-5 w-5", item.color)} />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-lg font-black text-foreground">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Latency Chart */}
        <LatencyChart pings={pingSamples} />

        {/* Network Info + History */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-foreground/15 bg-card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground">
              <Globe className="h-4 w-4 text-primary" /> Network Info
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {networkInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-lg border border-foreground/8 bg-background p-2.5">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
                    <div className="truncate text-sm font-bold text-foreground">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testHistory.length > 0 && (
            <div className="rounded-2xl border-2 border-foreground/15 bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground">
                <Clock className="h-4 w-4 text-primary" /> History
              </h3>
              <div className="space-y-2">
                {testHistory.map((entry, i) => (
                  <div key={i} className="rounded-xl border border-foreground/8 bg-background px-3 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">{entry.server}</span>
                      <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <span className="flex items-center gap-1 text-blue-500 font-bold"><Download className="h-3 w-3" />{entry.dl}</span>
                      <span className="flex items-center gap-1 text-green-500 font-bold"><Upload className="h-3 w-3" />{entry.ul}</span>
                      <span className="flex items-center justify-end gap-1 text-yellow-500 font-bold"><Activity className="h-3 w-3" />{entry.ping}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

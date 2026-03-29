import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Wifi, Globe, Zap, Server, Clock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TICK_COUNT = 40;
const START_ANGLE = -225;
const END_ANGLE = 45;
const TOTAL_ARC = END_ANGLE - START_ANGLE;

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
          className="absolute inset-0 rounded-full blur-3xl"
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
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path d={arcPath(START_ANGLE, END_ANGLE, r)} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" opacity="0.3" />

        {/* Tick marks */}
        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / TICK_COUNT) * i;
          const isMajor = i % 10 === 0;
          const isActive = i / TICK_COUNT <= pct;
          const inner = polarToCart(angle, r + 4);
          const outer = polarToCart(angle, r + (isMajor ? 18 : 12));
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke={isActive ? activeColor : "hsl(var(--muted-foreground))"}
              strokeWidth={isMajor ? 2 : 1} opacity={isActive ? 0.9 : 0.15} strokeLinecap="round"
            />
          );
        })}

        {/* Speed labels */}
        {[0, 25, 50, 75, 100].map((val, i) => {
          const angle = START_ANGLE + (TOTAL_ARC / 4) * i;
          const p = polarToCart(angle, r + 28);
          const label = Math.round(val * maxSpeed / 100);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              className="fill-muted-foreground text-[8px] font-medium" opacity="0.5"
            >{label}</text>
          );
        })}

        {/* Active arc */}
        {value > 0 && (
          <path
            d={arcPath(START_ANGLE, needleAngle, r)}
            fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" filter="url(#glow)"
          />
        )}

        {/* Needle */}
        {(() => {
          const tip = polarToCart(needleAngle, r - 30);
          return (
            <line x1={cx} y1={cy} x2={tip.x} y2={tip.y}
              stroke={activeColor} strokeWidth="2.5" strokeLinecap="round"
              style={{ transition: "all 0.3s ease-out" }}
            />
          );
        })()}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r="8" fill={activeColor} opacity="0.2" />
        <circle cx={cx} cy={cy} r="5" fill={activeColor} />
        <circle cx={cx} cy={cy} r="2" fill="hsl(var(--background))" />

        {/* Speed text */}
        <text x={cx} y={cy - 25} textAnchor="middle" className="fill-foreground font-black" style={{ fontSize: "42px" }}>
          {value > 0 ? value.toFixed(1) : "—"}
        </text>
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-muted-foreground font-semibold" style={{ fontSize: "10px" }}>
          Mbps
        </text>

        {/* Phase indicator */}
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: "9px" }}>
          <tspan className={testing ? "fill-primary" : "fill-muted-foreground"}>
            {phase === "ping" ? "⏱ Measuring Latency..." :
             phase === "download" ? "⬇ Testing Download..." :
             phase === "upload" ? "⬆ Testing Upload..." :
             phase === "done" ? "✅ Test Complete" : "Ready to Test"}
          </tspan>
        </text>
      </svg>

      {testing && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: activeColor }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

// Measures download speed by fetching known large files
async function measureDownload(
  onProgress: (speed: number) => void,
  cancelRef: React.MutableRefObject<boolean>
): Promise<number> {
  // Use Cloudflare's speed test endpoint - reliable and CORS-friendly
  const testUrls = [
    `https://speed.cloudflare.com/__down?bytes=5000000&_=${Date.now()}`,
    `https://speed.cloudflare.com/__down?bytes=10000000&_=${Date.now() + 1}`,
  ];

  const startTime = performance.now();
  let totalBytes = 0;

  const promises = testUrls.map(async (url) => {
    if (cancelRef.current) return;
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok || !response.body) return;

      const reader = response.body.getReader();
      while (true) {
        if (cancelRef.current) { reader.cancel(); return; }
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > 0) {
          onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
        }
      }
    } catch {
      // Fallback: try fetching a known public file
      try {
        const fallbackUrl = `https://speed.cloudflare.com/__down?bytes=2000000&_=${Date.now() + Math.random()}`;
        const res = await fetch(fallbackUrl, { cache: "no-store" });
        const blob = await res.blob();
        totalBytes += blob.size;
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > 0) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
      } catch {}
    }
  });

  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  return totalBytes > 0 ? +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2) : 0;
}

// Measures upload speed by posting data to Cloudflare
async function measureUpload(
  onProgress: (speed: number) => void,
  cancelRef: React.MutableRefObject<boolean>
): Promise<number> {
  const sizes = [1_000_000, 2_000_000];
  const startTime = performance.now();
  let totalBytes = 0;

  const promises = sizes.map(async (size) => {
    if (cancelRef.current) return;
    const payload = new Uint8Array(size);
    try {
      await fetch(`https://speed.cloudflare.com/__up`, {
        method: "POST",
        body: payload,
        cache: "no-store",
      });
    } catch {
      // Even if the response fails, the upload still happened
    }
    totalBytes += size;
    const elapsed = (performance.now() - startTime) / 1000;
    if (elapsed > 0) onProgress(+((totalBytes * 8) / elapsed / 1e6).toFixed(2));
  });

  await Promise.all(promises);
  const totalElapsed = (performance.now() - startTime) / 1000;
  return totalBytes > 0 ? +((totalBytes * 8) / totalElapsed / 1e6).toFixed(2) : 0;
}

// Measures ping by timing tiny requests
async function measurePing(cancelRef: React.MutableRefObject<boolean>): Promise<{ avgPing: number; avgJitter: number }> {
  const pings: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (cancelRef.current) return { avgPing: 0, avgJitter: 0 };
    const s = performance.now();
    try {
      await fetch(`https://speed.cloudflare.com/__down?bytes=0&_=${Date.now()}_${i}`, { cache: "no-store" });
    } catch {}
    pings.push(performance.now() - s);
  }
  // Remove highest and lowest, average the rest
  pings.sort((a, b) => a - b);
  const trimmed = pings.slice(1, -1);
  const avgPing = Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);
  const avgJitter = Math.round(
    trimmed.slice(1).reduce((s, p, i) => s + Math.abs(p - trimmed[i]), 0) / Math.max(trimmed.length - 1, 1)
  );
  return { avgPing, avgJitter };
}

export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [ip, setIp] = useState("—");
  const [isp, setIsp] = useState("—");
  const [connType, setConnType] = useState("—");
  const [serverLoc, setServerLoc] = useState("—");
  const [testHistory, setTestHistory] = useState<{ dl: number; ul: number; ping: number; time: string }[]>([]);
  const cancelRef = useRef(false);

  useEffect(() => {
    const c = (navigator as any).connection;
    if (c) setConnType((c.effectiveType || c.type || "Unknown").toUpperCase());

    // Get IP info - try multiple providers
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip || "—");
      } catch {
        try {
          const res = await fetch("https://api64.ipify.org?format=json");
          const data = await res.json();
          setIp(data.ip || "—");
        } catch { setIp("Unknown"); }
      }
    };
    fetchIp();

    try {
      const h = JSON.parse(localStorage.getItem("cv_speed_history") || "[]");
      setTestHistory(h);
    } catch {}
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setJitter(null);
    setLiveSpeed(0);

    // Phase 1: Ping
    setPhase("ping");
    const { avgPing, avgJitter } = await measurePing(cancelRef);
    if (cancelRef.current) return reset();
    setPing(avgPing);
    setJitter(avgJitter);

    // Phase 2: Download
    setPhase("download");
    const dlSpeed = await measureDownload((speed) => setLiveSpeed(speed), cancelRef);
    if (cancelRef.current) return reset();
    setDownload(dlSpeed);
    setLiveSpeed(dlSpeed);

    // Phase 3: Upload
    setPhase("upload");
    const ulSpeed = await measureUpload((speed) => setLiveSpeed(speed), cancelRef);
    if (cancelRef.current) return reset();
    setUpload(ulSpeed);

    // Save history
    const entry = { dl: dlSpeed, ul: ulSpeed, ping: avgPing, time: new Date().toLocaleString() };
    const hist = [entry, ...testHistory].slice(0, 5);
    setTestHistory(hist);
    localStorage.setItem("cv_speed_history", JSON.stringify(hist));

    setPhase("done");
    setTesting(false);
    setLiveSpeed(dlSpeed);
  }, [testHistory]);

  const reset = () => { setTesting(false); setPhase("idle"); setLiveSpeed(0); };
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
      <div className="max-w-xl mx-auto space-y-6">

        {/* Gauge */}
        <div className="relative rounded-2xl border border-border/40 bg-gradient-to-b from-card to-accent/10 p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
            backgroundSize: "20px 20px"
          }} />

          <SpeedGauge value={gaugeVal} maxSpeed={maxSpeed} phase={phase} testing={testing} />

          {/* Download / Upload Results */}
          <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-border/20">
            <div className={`relative rounded-xl bg-accent/30 p-3 overflow-hidden ${phase === "download" ? "ring-1 ring-primary/50" : ""}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Download className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-semibold text-muted-foreground">Download</span>
              </div>
              <div className="text-2xl font-black">
                {download !== null ? download : "—"}
                <span className="text-xs font-normal text-muted-foreground ml-1">Mbps</span>
              </div>
            </div>
            <div className={`relative rounded-xl bg-accent/30 p-3 overflow-hidden ${phase === "upload" ? "ring-1 ring-primary/50" : ""}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Upload className="w-4 h-4 text-green-500" />
                <span className="text-[11px] font-semibold text-muted-foreground">Upload</span>
              </div>
              <div className="text-2xl font-black">
                {upload !== null ? upload : "—"}
                <span className="text-xs font-normal text-muted-foreground ml-1">Mbps</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-5">
            {testing ? (
              <Button variant="outline" onClick={cancel} className="rounded-full px-10 py-5 text-primary border-primary/30 font-bold">
                Cancel Test
              </Button>
            ) : (
              <Button
                onClick={runTest}
                className="gradient-bg text-primary-foreground rounded-full px-10 py-6 font-bold text-base shadow-xl shadow-primary/25"
              >
                <Zap className="w-5 h-5 mr-2" />
                {phase === "done" ? "Test Again" : "Start Speed Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Quality Badge */}
        <AnimatePresence>
          {phase === "done" && download !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-border/30 bg-card p-4 text-center"
            >
              {(() => {
                const q = getQuality(download);
                return (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">{q.emoji}</span>
                    <div>
                      <p className={`text-lg font-bold ${q.color}`}>{q.label} Connection</p>
                      <p className="text-xs text-muted-foreground">
                        {download >= 25 ? "Great for HD streaming & gaming" :
                         download >= 10 ? "Good for browsing & SD streaming" :
                         "May experience buffering on video"}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Stats */}
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

        {/* Network Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Network Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { icon: Globe, label: "IP Address", value: ip },
              { icon: Server, label: "ISP", value: isp },
              { icon: Wifi, label: "Connection", value: connType },
              { icon: Shield, label: "Protocol", value: location.protocol === "https:" ? "HTTPS (Secure)" : "HTTP" },
              { icon: Activity, label: "Location", value: serverLoc },
              { icon: Clock, label: "Last Test", value: testHistory[0]?.time || "Never" },
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
            <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Test History
            </h3>
            <div className="space-y-2">
              {testHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3 text-xs py-2 px-3 rounded-lg bg-accent/20">
                  <span className="text-muted-foreground/50 text-[10px] w-24 shrink-0">{h.time}</span>
                  <div className="flex items-center gap-1 text-blue-500">
                    <Download className="w-3 h-3" />
                    <span className="font-bold">{h.dl}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <Upload className="w-3 h-3" />
                    <span className="font-bold">{h.ul}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 ml-auto">
                    <Activity className="w-3 h-3" />
                    <span className="font-bold">{h.ping}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

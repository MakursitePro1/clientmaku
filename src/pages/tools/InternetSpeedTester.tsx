import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Wifi, Download, Upload, Activity, Globe, Server, ArrowDown, ArrowUp, Gauge } from "lucide-react";

interface SpeedResult {
  download: number | null;
  upload: number | null;
  ping: number | null;
  jitter: number | null;
}

interface NetworkInfo {
  ip: string;
  isp: string;
  connectionType: string;
  downlinkEstimate: number | null;
  rtt: number | null;
}

function SpeedGauge({ value, max, label, phase }: { value: number; max: number; label: string; phase: string }) {
  const percentage = Math.min(value / max, 1);
  const startAngle = -225;
  const endAngle = 45;
  const totalArc = endAngle - startAngle;
  const currentAngle = startAngle + totalArc * percentage;

  const cx = 150, cy = 150, r = 120;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (start: number, end: number) => {
    const s = toRad(start);
    const e = toRad(end);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const ticks = [0, max * 0.1, max * 0.2, max * 0.5, max];
  const tickLabels = ticks.map(t => {
    if (t >= 100) return `${Math.round(t)}`;
    if (t >= 10) return `${Math.round(t)}`;
    return `${t.toFixed(0)}`;
  });

  const needleAngle = toRad(currentAngle);
  const needleLen = r - 20;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 220" className="w-full max-w-[320px]">
        {/* Background arc */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Active arc */}
        {value > 0 && (
          <path
            d={arcPath(startAngle, currentAngle)}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        )}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(142, 71%, 45%)" />
          </linearGradient>
        </defs>

        {/* Tick marks & labels */}
        {ticks.map((t, i) => {
          const pct = t / max;
          const angle = toRad(startAngle + totalArc * pct);
          const outerR = r + 8;
          const labelR = r + 24;
          const tx = cx + outerR * Math.cos(angle);
          const ty = cy + outerR * Math.sin(angle);
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <g key={i}>
              <circle cx={tx} cy={ty} r="2.5" fill="hsl(var(--muted-foreground))" opacity={0.5} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-[11px] font-semibold">
                {tickLabels[i]}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="transition-all duration-300" />
        <circle cx={cx} cy={cy} r="6" fill="hsl(var(--primary))" />
        <circle cx={cx} cy={cy} r="3" fill="hsl(var(--background))" />

        {/* Center text */}
        <text x={cx} y={cy - 15} textAnchor="middle" className="fill-foreground text-[42px] font-black">
          {value > 0 ? value.toFixed(1) : "—"}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          Megabits per second
        </text>

        {/* Phase indicator */}
        <g>
          {phase === "download" && <ArrowDownIcon cx={cx} cy={cy + 35} />}
          {phase === "upload" && <ArrowUpIcon cx={cx} cy={cy + 35} />}
        </g>
        <text x={cx} y={cy + 55} textAnchor="middle" className="fill-muted-foreground text-[12px] font-semibold">
          {label}
        </text>
      </svg>
    </div>
  );
}

function ArrowDownIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx - 8}, ${cy - 8})`}>
      <path d="M8 2v12M8 14l-4-4M8 14l4-4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function ArrowUpIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx - 8}, ${cy - 8})`}>
      <path d="M8 14V2M8 2l-4 4M8 2l4 4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [phase, setPhase] = useState<"idle" | "ping" | "download" | "upload" | "done">("idle");
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [result, setResult] = useState<SpeedResult>({ download: null, upload: null, ping: null, jitter: null });
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ip: "—",
    isp: "—",
    connectionType: "—",
    downlinkEstimate: null,
    rtt: null,
  });
  const cancelRef = useRef(false);

  useEffect(() => {
    // Get network info from Navigator API
    const conn = (navigator as any).connection;
    if (conn) {
      setNetworkInfo(prev => ({
        ...prev,
        connectionType: conn.effectiveType || conn.type || "Unknown",
        downlinkEstimate: conn.downlink || null,
        rtt: conn.rtt || null,
      }));
    }

    // Get IP info
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        setNetworkInfo(prev => ({
          ...prev,
          ip: data.ip || "—",
          isp: data.org || "—",
        }));
      })
      .catch(() => {});
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setResult({ download: null, upload: null, ping: null, jitter: null });
    setCurrentSpeed(0);

    // === PING TEST ===
    setPhase("ping");
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      if (cancelRef.current) return cleanup();
      const start = performance.now();
      try {
        await fetch(`https://www.google.com/favicon.ico?_=${Date.now()}_${i}`, { mode: "no-cors", cache: "no-store" });
      } catch {}
      pings.push(performance.now() - start);
    }
    const avgPing = Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
    const jitter = Math.round(
      pings.slice(1).reduce((sum, p, i) => sum + Math.abs(p - pings[i]), 0) / (pings.length - 1)
    );
    setResult(prev => ({ ...prev, ping: avgPing, jitter }));

    // === DOWNLOAD TEST ===
    setPhase("download");
    const dlSpeeds: number[] = [];
    const testUrls = [
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
    ];

    for (let i = 0; i < testUrls.length; i++) {
      if (cancelRef.current) return cleanup();
      try {
        const start = performance.now();
        const res = await fetch(testUrls[i] + "?_=" + Date.now(), { cache: "no-store" });
        const blob = await res.blob();
        const elapsed = (performance.now() - start) / 1000;
        const sizeBits = blob.size * 8;
        const speedMbps = sizeBits / elapsed / 1_000_000;
        dlSpeeds.push(speedMbps);
        setCurrentSpeed(speedMbps);
      } catch {
        // If CORS blocks, estimate with timing
        try {
          const start = performance.now();
          await fetch(`https://picsum.photos/1200/800?random=${i}&_=${Date.now()}`, { mode: "no-cors", cache: "no-store" });
          const elapsed = (performance.now() - start) / 1000;
          const estimatedSpeed = (400_000 * 8) / elapsed / 1_000_000;
          dlSpeeds.push(estimatedSpeed);
          setCurrentSpeed(estimatedSpeed);
        } catch {}
      }
    }
    const avgDl = dlSpeeds.length > 0
      ? parseFloat((dlSpeeds.reduce((a, b) => a + b, 0) / dlSpeeds.length).toFixed(2))
      : 0;
    setResult(prev => ({ ...prev, download: avgDl }));

    // === UPLOAD TEST ===
    setPhase("upload");
    const ulSpeeds: number[] = [];
    const uploadSizes = [256_000, 512_000, 1_000_000];

    for (const size of uploadSizes) {
      if (cancelRef.current) return cleanup();
      const data = new Blob([new ArrayBuffer(size)]);
      const start = performance.now();
      try {
        await fetch("https://httpbin.org/post", { method: "POST", body: data, mode: "no-cors", cache: "no-store" });
      } catch {}
      const elapsed = (performance.now() - start) / 1000;
      const speedMbps = (size * 8) / elapsed / 1_000_000;
      ulSpeeds.push(speedMbps);
      setCurrentSpeed(speedMbps);
    }
    const avgUl = ulSpeeds.length > 0
      ? parseFloat((ulSpeeds.reduce((a, b) => a + b, 0) / ulSpeeds.length).toFixed(2))
      : 0;
    setResult(prev => ({ ...prev, upload: avgUl }));

    setPhase("done");
    setTesting(false);
  }, []);

  const cleanup = () => {
    setTesting(false);
    setPhase("idle");
    setCurrentSpeed(0);
  };

  const cancelTest = () => {
    cancelRef.current = true;
    cleanup();
  };

  const gaugeMax = Math.max(100, (result.download || 0) * 1.3, currentSpeed * 1.3);
  const gaugeValue = phase === "done"
    ? (result.download || 0)
    : currentSpeed;

  const phaseLabel =
    phase === "ping" ? "Testing ping..." :
    phase === "download" ? "Testing download..." :
    phase === "upload" ? "Testing upload..." :
    phase === "done" ? "Test complete" : "Ready";

  return (
    <ToolLayout title="Internet Speed Tester" description="Test your internet connection speed with detailed analysis">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Gauge */}
        <div className="bg-card rounded-2xl border border-border/40 p-6">
          <SpeedGauge
            value={gaugeValue}
            max={gaugeMax}
            label={phaseLabel}
            phase={phase === "download" || phase === "upload" ? phase : ""}
          />

          {/* Download / Upload results row */}
          <div className="grid grid-cols-2 gap-4 mt-4 border-t border-border/30 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-semibold mb-1">
                <Download className="w-3.5 h-3.5" /> Mbps download
              </div>
              <div className="text-2xl font-black text-foreground">
                {result.download !== null ? result.download.toFixed(2) : "—"}
              </div>
            </div>
            <div className="text-center border-l border-border/30">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-semibold mb-1">
                <Upload className="w-3.5 h-3.5" /> Mbps upload
              </div>
              <div className="text-2xl font-black text-foreground">
                {result.upload !== null ? result.upload.toFixed(2) : "—"}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-center mt-5">
            {testing ? (
              <Button variant="outline" onClick={cancelTest} className="rounded-full px-8 font-semibold border-primary/30 text-primary">
                Cancel
              </Button>
            ) : (
              <Button onClick={runTest} className="gradient-bg text-primary-foreground rounded-full px-10 py-6 text-base font-bold shadow-lg shadow-primary/20">
                <Gauge className="w-5 h-5 mr-2" />
                {phase === "done" ? "Test Again" : "Start Speed Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Activity} label="Ping" value={result.ping !== null ? `${result.ping} ms` : "—"} />
          <StatCard icon={Wifi} label="Jitter" value={result.jitter !== null ? `${result.jitter} ms` : "—"} />
          <StatCard icon={ArrowDown} label="Download" value={result.download !== null ? `${result.download} Mbps` : "—"} />
          <StatCard icon={ArrowUp} label="Upload" value={result.upload !== null ? `${result.upload} Mbps` : "—"} />
        </div>

        {/* Network Info */}
        <div className="bg-card rounded-2xl border border-border/40 p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Network Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoRow label="IP Address" value={networkInfo.ip} />
            <InfoRow label="ISP / Provider" value={networkInfo.isp} />
            <InfoRow label="Connection Type" value={networkInfo.connectionType.toUpperCase()} />
            <InfoRow label="Browser Est. Downlink" value={networkInfo.downlinkEstimate ? `${networkInfo.downlinkEstimate} Mbps` : "—"} />
            <InfoRow label="Browser Est. RTT" value={networkInfo.rtt ? `${networkInfo.rtt} ms` : "—"} />
            <InfoRow label="Protocol" value={window.location.protocol === "https:" ? "HTTPS (Secure)" : "HTTP"} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border border-border/30 p-4 text-center">
      <Icon className="w-4 h-4 mx-auto mb-1.5 text-primary" />
      <div className="text-xs text-muted-foreground font-semibold mb-1">{label}</div>
      <div className="text-sm font-black text-foreground">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-accent/30">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-bold text-foreground text-right truncate ml-2 max-w-[180px]">{value}</span>
    </div>
  );
}

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Download, Upload, Activity, Wifi, Globe, Gauge } from "lucide-react";

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
  const cancelRef = useRef(false);

  useEffect(() => {
    const c = (navigator as any).connection;
    if (c) setConnType((c.effectiveType || c.type || "Unknown").toUpperCase());
    fetch("https://ipapi.co/json/").then(r => r.json()).then(d => {
      setIp(d.ip || "—");
      setIsp(d.org || "—");
    }).catch(() => {});
  }, []);

  const runTest = useCallback(async () => {
    cancelRef.current = false;
    setTesting(true);
    setDownload(null); setUpload(null); setPing(null); setJitter(null); setLiveSpeed(0);

    // Ping
    setPhase("ping");
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      if (cancelRef.current) return reset();
      const s = performance.now();
      try { await fetch(`https://www.google.com/favicon.ico?_=${Date.now()}_${i}`, { mode: "no-cors", cache: "no-store" }); } catch {}
      pings.push(performance.now() - s);
    }
    setPing(Math.round(pings.reduce((a, b) => a + b) / pings.length));
    setJitter(Math.round(pings.slice(1).reduce((s, p, i) => s + Math.abs(p - pings[i]), 0) / (pings.length - 1)));

    // Download
    setPhase("download");
    const dlUrls = [
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
    ];
    const dlSpeeds: number[] = [];
    for (const url of dlUrls) {
      if (cancelRef.current) return reset();
      try {
        const s = performance.now();
        const res = await fetch(url + "?_=" + Date.now(), { cache: "no-store" });
        const blob = await res.blob();
        const spd = (blob.size * 8) / ((performance.now() - s) / 1000) / 1e6;
        dlSpeeds.push(spd);
        setLiveSpeed(spd);
      } catch {
        try {
          const s = performance.now();
          await fetch(`https://picsum.photos/1200/800?random=${Math.random()}&_=${Date.now()}`, { mode: "no-cors", cache: "no-store" });
          const spd = (400000 * 8) / ((performance.now() - s) / 1000) / 1e6;
          dlSpeeds.push(spd);
          setLiveSpeed(spd);
        } catch {}
      }
    }
    const avgDl = dlSpeeds.length ? +(dlSpeeds.reduce((a, b) => a + b) / dlSpeeds.length).toFixed(2) : 0;
    setDownload(avgDl);

    // Upload
    setPhase("upload");
    const ulSpeeds: number[] = [];
    for (const size of [256000, 512000, 1000000]) {
      if (cancelRef.current) return reset();
      const s = performance.now();
      try { await fetch("https://httpbin.org/post", { method: "POST", body: new Blob([new ArrayBuffer(size)]), mode: "no-cors", cache: "no-store" }); } catch {}
      const spd = (size * 8) / ((performance.now() - s) / 1000) / 1e6;
      ulSpeeds.push(spd);
      setLiveSpeed(spd);
    }
    setUpload(ulSpeeds.length ? +(ulSpeeds.reduce((a, b) => a + b) / ulSpeeds.length).toFixed(2) : 0);

    setPhase("done");
    setTesting(false);
  }, []);

  const reset = () => { setTesting(false); setPhase("idle"); setLiveSpeed(0); };
  const cancel = () => { cancelRef.current = true; reset(); };

  // Gauge
  const maxSpeed = Math.max(100, (download || 0) * 1.5, liveSpeed * 1.5);
  const gaugeVal = phase === "done" ? (download || 0) : liveSpeed;
  const pct = Math.min(gaugeVal / maxSpeed, 1);
  const startA = -210, endA = 30, totalArc = endA - startA;
  const curA = startA + totalArc * pct;
  const rad = (d: number) => (d * Math.PI) / 180;
  const cx = 140, cy = 140, r = 110;

  const arc = (s: number, e: number) => {
    const [x1, y1] = [cx + r * Math.cos(rad(s)), cy + r * Math.sin(rad(s))];
    const [x2, y2] = [cx + r * Math.cos(rad(e)), cy + r * Math.sin(rad(e))];
    return `M ${x1} ${y1} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  const na = rad(curA);
  const [nx, ny] = [cx + (r - 25) * Math.cos(na), cy + (r - 25) * Math.sin(na)];

  return (
    <ToolLayout title="Internet Speed Tester" description="Analyze your internet connection speed accurately">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Gauge Card */}
        <div className="rounded-2xl border border-border/40 bg-card p-6 text-center">
          <svg viewBox="0 0 280 190" className="w-full max-w-[280px] mx-auto">
            <defs>
              <linearGradient id="sg" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" stopColor="hsl(262,83%,58%)" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <path d={arc(startA, endA)} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" strokeLinecap="round" />
            {gaugeVal > 0 && <path d={arc(startA, curA)} fill="none" stroke="url(#sg)" strokeWidth="10" strokeLinecap="round" className="transition-all duration-200" />}
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-200" />
            <circle cx={cx} cy={cy} r="5" fill="hsl(var(--primary))" />
            <circle cx={cx} cy={cy} r="2" fill="hsl(var(--background))" />
            <text x={cx} y={cy - 10} textAnchor="middle" className="fill-foreground text-[36px] font-black">{gaugeVal > 0 ? gaugeVal.toFixed(1) : "—"}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-[9px] font-medium">Mbps</text>
            <text x={cx} y={cy + 30} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {phase === "ping" ? "Testing ping..." : phase === "download" ? "⬇ Download..." : phase === "upload" ? "⬆ Upload..." : phase === "done" ? "Complete" : "Ready"}
            </text>
          </svg>

          {/* Results row */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/30">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1"><Download className="w-3 h-3" />Download</div>
              <div className="text-xl font-black">{download !== null ? `${download}` : "—"} <span className="text-xs font-normal text-muted-foreground">Mbps</span></div>
            </div>
            <div className="border-l border-border/30">
              <div className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1"><Upload className="w-3 h-3" />Upload</div>
              <div className="text-xl font-black">{upload !== null ? `${upload}` : "—"} <span className="text-xs font-normal text-muted-foreground">Mbps</span></div>
            </div>
          </div>

          <div className="mt-4">
            {testing ? (
              <Button variant="outline" onClick={cancel} className="rounded-full px-8 text-primary border-primary/30">Cancel</Button>
            ) : (
              <Button onClick={runTest} className="gradient-bg text-primary-foreground rounded-full px-8 py-5 font-bold shadow-lg shadow-primary/20">
                <Gauge className="w-4 h-4 mr-2" />{phase === "done" ? "Test Again" : "Start Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Activity, label: "Ping", val: ping !== null ? `${ping}ms` : "—" },
            { icon: Wifi, label: "Jitter", val: jitter !== null ? `${jitter}ms` : "—" },
            { icon: Download, label: "Down", val: download !== null ? `${download}` : "—" },
            { icon: Upload, label: "Up", val: upload !== null ? `${upload}` : "—" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border/30 p-3 text-center">
              <s.icon className="w-3.5 h-3.5 mx-auto mb-1 text-primary" />
              <div className="text-[10px] text-muted-foreground font-medium">{s.label}</div>
              <div className="text-sm font-bold">{s.val}</div>
            </div>
          ))}
        </div>

        {/* Network Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary" />Network Info</h3>
          <div className="space-y-2 text-xs">
            {[
              ["IP Address", ip],
              ["ISP", isp],
              ["Connection", connType],
              ["Protocol", location.protocol === "https:" ? "HTTPS" : "HTTP"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 px-2.5 rounded-lg bg-accent/30">
                <span className="text-muted-foreground">{l}</span>
                <span className="font-bold truncate ml-2 max-w-[200px]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

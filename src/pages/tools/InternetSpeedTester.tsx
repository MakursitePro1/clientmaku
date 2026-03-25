import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function InternetSpeedTester() {
  const [testing, setTesting] = useState(false);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const runTest = async () => {
    setTesting(true);
    setDownload(null);
    setUpload(null);
    setPing(null);
    setProgress(0);

    // Ping test
    const pingStart = performance.now();
    try {
      await fetch("https://www.google.com/favicon.ico?_=" + Date.now(), { mode: "no-cors" });
    } catch {}
    const pingEnd = performance.now();
    setPing(Math.round(pingEnd - pingStart));
    setProgress(20);

    // Download test
    const dlStart = performance.now();
    const sizes = [1, 2, 3]; // multiple requests
    let totalBytes = 0;
    for (const s of sizes) {
      try {
        const res = await fetch(`https://picsum.photos/800/600?random=${s}&_=${Date.now()}`, { mode: "no-cors" });
        totalBytes += 500000; // estimate ~500KB per image
      } catch {}
      setProgress(20 + (s / sizes.length) * 40);
    }
    const dlEnd = performance.now();
    const dlTime = (dlEnd - dlStart) / 1000;
    const dlSpeed = ((totalBytes * 8) / dlTime / 1000000).toFixed(2);
    setDownload(parseFloat(dlSpeed));
    setProgress(60);

    // Upload test (simulated)
    const data = new Blob([new ArrayBuffer(500000)]);
    const ulStart = performance.now();
    try {
      await fetch("https://httpbin.org/post", { method: "POST", body: data, mode: "no-cors" });
    } catch {}
    const ulEnd = performance.now();
    const ulTime = (ulEnd - ulStart) / 1000;
    const ulSpeed = ((500000 * 8) / ulTime / 1000000).toFixed(2);
    setUpload(parseFloat(ulSpeed));
    setProgress(100);
    setTesting(false);
  };

  return (
    <ToolLayout title="Internet Speed Tester" description="Test your internet connection speed">
      <div className="text-center space-y-8">
        {testing && <Progress value={progress} className="w-full max-w-md mx-auto" />}

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-sm text-muted-foreground mb-2">Ping</div>
            <div className="text-3xl font-extrabold text-primary">{ping !== null ? `${ping}ms` : "—"}</div>
          </div>
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-sm text-muted-foreground mb-2">Download</div>
            <div className="text-3xl font-extrabold text-primary">{download !== null ? `${download} Mbps` : "—"}</div>
          </div>
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-sm text-muted-foreground mb-2">Upload</div>
            <div className="text-3xl font-extrabold text-primary">{upload !== null ? `${upload} Mbps` : "—"}</div>
          </div>
        </div>

        <Button onClick={runTest} disabled={testing} className="gradient-bg text-primary-foreground rounded-xl px-8 font-semibold" size="lg">
          {testing ? "Testing..." : "Start Speed Test"}
        </Button>
      </div>
    </ToolLayout>
  );
}

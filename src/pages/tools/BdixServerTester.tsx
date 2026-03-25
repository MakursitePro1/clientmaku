import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const bdixServers = [
  { name: "BDIX Mirror", url: "https://mirror.xeonbd.com", desc: "XeonBD Mirror" },
  { name: "Alpha Net Mirror", url: "https://alpha.net.bd", desc: "Alpha Net BD" },
  { name: "Link3 Mirror", url: "https://mirror.link3.net", desc: "Link3 Technologies" },
  { name: "Brac Net", url: "https://www.bracnet.net", desc: "Brac Net Limited" },
  { name: "Carnival", url: "https://carnival.com.bd", desc: "Carnival Internet" },
];

export default function BdixServerTester() {
  const [results, setResults] = useState<{ name: string; status: string; time: number }[]>([]);
  const [testing, setTesting] = useState(false);

  const testAll = async () => {
    setTesting(true);
    setResults([]);
    const res = [];
    for (const server of bdixServers) {
      const start = performance.now();
      try {
        await fetch(server.url, { mode: "no-cors", signal: AbortSignal.timeout(5000) });
        res.push({ name: server.name, status: "reachable", time: Math.round(performance.now() - start) });
      } catch {
        res.push({ name: server.name, status: "unreachable", time: Math.round(performance.now() - start) });
      }
      setResults([...res]);
    }
    setTesting(false);
  };

  return (
    <ToolLayout title="BDIX Server Tester" description="Test BDIX server connectivity">
      <div className="space-y-6">
        <Button onClick={testAll} disabled={testing} className="gradient-bg text-primary-foreground rounded-xl font-semibold" size="lg">
          {testing ? "Testing..." : "Test All Servers"}
        </Button>
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-accent/50 rounded-xl px-5 py-4">
                <div className="font-semibold">{r.name}</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{r.time}ms</span>
                  <Badge variant={r.status === "reachable" ? "secondary" : "destructive"}>
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

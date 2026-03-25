import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ApiTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);

  const sendRequest = async () => {
    setLoading(true);
    setResponse("");
    setStatus(null);
    const start = performance.now();
    try {
      const opts: RequestInit = { method, headers: JSON.parse(headers) };
      if (method !== "GET" && method !== "HEAD" && body) opts.body = body;
      const res = await fetch(url, opts);
      setStatus(res.status);
      const data = await res.text();
      try { setResponse(JSON.stringify(JSON.parse(data), null, 2)); } catch { setResponse(data); }
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    }
    setTime(Math.round(performance.now() - start));
    setLoading(false);
  };

  return (
    <ToolLayout title="API Tester" description="Test REST APIs with custom requests">
      <div className="space-y-5">
        <div className="flex gap-3">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="API URL" className="rounded-xl flex-1" />
          <Button onClick={sendRequest} disabled={loading} className="gradient-bg text-primary-foreground rounded-xl font-semibold shrink-0">
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
        <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder="Headers (JSON)" className="rounded-xl font-mono text-sm" rows={3} />
        {method !== "GET" && (
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Request Body" className="rounded-xl font-mono text-sm" rows={4} />
        )}
        {status !== null && (
          <div className="flex items-center gap-3">
            <Badge variant={status < 400 ? "secondary" : "destructive"}>Status: {status}</Badge>
            {time !== null && <span className="text-sm text-muted-foreground">{time}ms</span>}
          </div>
        )}
        {response && (
          <pre className="bg-accent/50 rounded-2xl p-5 text-sm overflow-auto max-h-96 font-mono whitespace-pre-wrap">{response}</pre>
        )}
      </div>
    </ToolLayout>
  );
}

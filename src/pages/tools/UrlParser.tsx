import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function UrlParser() {
  const [url, setUrl] = useState("https://example.com:8080/path/to/page?name=John&age=30#section");

  let parsed: any = {};
  try {
    const u = new URL(url);
    parsed = {
      Protocol: u.protocol,
      Host: u.host,
      Hostname: u.hostname,
      Port: u.port || "(default)",
      Pathname: u.pathname,
      Search: u.search || "(none)",
      Hash: u.hash || "(none)",
      Origin: u.origin,
    };
  } catch {
    parsed = null;
  }

  let params: [string, string][] = [];
  try { params = [...new URL(url).searchParams.entries()]; } catch {}

  return (
    <ToolLayout title="URL Parser" description="Parse and analyze URL components">
      <div className="space-y-6">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter a URL..." className="rounded-xl font-mono" />
        {parsed ? (
          <div className="space-y-3">
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3 bg-accent/50 rounded-xl px-5 py-3">
                <span className="font-semibold text-sm w-28 shrink-0">{key}</span>
                <code className="text-sm font-mono text-primary">{val as string}</code>
              </div>
            ))}
            {params.length > 0 && (
              <div className="bg-accent/50 rounded-2xl p-5">
                <div className="font-semibold text-sm mb-3">Query Parameters</div>
                <div className="space-y-2">
                  {params.map(([k, v], i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Badge variant="secondary">{k}</Badge>
                      <span className="text-sm font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-destructive text-sm">Invalid URL format</p>
        )}
      </div>
    </ToolLayout>
  );
}

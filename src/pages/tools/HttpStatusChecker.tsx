import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Network, Search, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const STATUS_CODES: Record<string, { code: number; text: string; desc: string; category: string }[]> = {
  "1xx Informational": [
    { code: 100, text: "Continue", desc: "Server received headers, client should proceed", category: "info" },
    { code: 101, text: "Switching Protocols", desc: "Server switching to protocol requested by client", category: "info" },
    { code: 103, text: "Early Hints", desc: "Allows preloading resources while server prepares response", category: "info" },
  ],
  "2xx Success": [
    { code: 200, text: "OK", desc: "Request succeeded", category: "success" },
    { code: 201, text: "Created", desc: "New resource was created", category: "success" },
    { code: 202, text: "Accepted", desc: "Request accepted for processing", category: "success" },
    { code: 204, text: "No Content", desc: "Successful but no body to return", category: "success" },
    { code: 206, text: "Partial Content", desc: "Partial resource delivered (range request)", category: "success" },
  ],
  "3xx Redirection": [
    { code: 301, text: "Moved Permanently", desc: "Resource permanently moved to new URL", category: "redirect" },
    { code: 302, text: "Found", desc: "Resource temporarily at different URL", category: "redirect" },
    { code: 304, text: "Not Modified", desc: "Cached version is still valid", category: "redirect" },
    { code: 307, text: "Temporary Redirect", desc: "Temporary redirect preserving method", category: "redirect" },
    { code: 308, text: "Permanent Redirect", desc: "Permanent redirect preserving method", category: "redirect" },
  ],
  "4xx Client Errors": [
    { code: 400, text: "Bad Request", desc: "Server cannot process malformed request", category: "client" },
    { code: 401, text: "Unauthorized", desc: "Authentication required", category: "client" },
    { code: 403, text: "Forbidden", desc: "Server refuses to authorize", category: "client" },
    { code: 404, text: "Not Found", desc: "Resource not found", category: "client" },
    { code: 405, text: "Method Not Allowed", desc: "HTTP method not supported for this resource", category: "client" },
    { code: 408, text: "Request Timeout", desc: "Server timed out waiting for request", category: "client" },
    { code: 409, text: "Conflict", desc: "Request conflicts with current state", category: "client" },
    { code: 413, text: "Payload Too Large", desc: "Request body exceeds server limit", category: "client" },
    { code: 422, text: "Unprocessable Entity", desc: "Request well-formed but semantically incorrect", category: "client" },
    { code: 429, text: "Too Many Requests", desc: "Rate limit exceeded", category: "client" },
    { code: 451, text: "Unavailable For Legal Reasons", desc: "Censored or legally restricted", category: "client" },
  ],
  "5xx Server Errors": [
    { code: 500, text: "Internal Server Error", desc: "Generic server error", category: "server" },
    { code: 501, text: "Not Implemented", desc: "Server does not support the functionality", category: "server" },
    { code: 502, text: "Bad Gateway", desc: "Invalid response from upstream server", category: "server" },
    { code: 503, text: "Service Unavailable", desc: "Server temporarily overloaded or down", category: "server" },
    { code: 504, text: "Gateway Timeout", desc: "Upstream server timed out", category: "server" },
  ],
};

const categoryColors: Record<string, string> = {
  info: "hsl(200, 85%, 48%)",
  success: "hsl(145, 80%, 42%)",
  redirect: "hsl(35, 90%, 50%)",
  client: "hsl(340, 82%, 52%)",
  server: "hsl(0, 85%, 55%)",
};

export default function HttpStatusChecker() {
  const [search, setSearch] = useState("");

  const allCodes = useMemo(() => Object.values(STATUS_CODES).flat(), []);
  const filtered = useMemo(() => {
    if (!search) return null;
    return allCodes.filter(c =>
      c.code.toString().includes(search) ||
      c.text.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allCodes]);

  return (
    <ToolLayout toolId="http-status-checker" title="HTTP Status Code Lookup" description="Look up all HTTP status codes with descriptions"
      icon={Network} color="hsl(260, 80%, 58%)">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by code or keyword (e.g. 404, timeout)..."
            className="pl-12 py-6 text-base rounded-2xl border-[hsl(260,80%,58%)]/30" />
        </div>

        {/* Search Results */}
        {filtered && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-semibold">{filtered.length} results</p>
            {filtered.map(c => (
              <div key={c.code} className="p-4 rounded-2xl border border-border/40 bg-card/80 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => { navigator.clipboard.writeText(`${c.code} ${c.text}`); toast.success("Copied!"); }}>
                <span className="text-2xl font-black font-mono" style={{ color: categoryColors[c.category] }}>{c.code}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm">{c.text}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <Copy className="w-4 h-4 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        )}

        {/* All Codes by Category */}
        {!filtered && Object.entries(STATUS_CODES).map(([group, codes]) => (
          <div key={group} className="p-5 rounded-2xl border border-border/40 bg-card/80">
            <h3 className="text-sm font-bold mb-4" style={{ color: categoryColors[codes[0].category] }}>{group}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {codes.map(c => (
                <div key={c.code} className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all cursor-pointer"
                  onClick={() => { navigator.clipboard.writeText(`${c.code} ${c.text}`); toast.success("Copied!"); }}>
                  <span className="text-lg font-black font-mono w-12" style={{ color: categoryColors[c.category] }}>{c.code}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.text}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

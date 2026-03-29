import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Server, Search, Copy, Shield, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PortInfo { port: number; service: string; protocol: string; desc: string; risk: "low" | "medium" | "high" }

const PORTS: PortInfo[] = [
  { port: 20, service: "FTP Data", protocol: "TCP", desc: "File Transfer Protocol data channel", risk: "high" },
  { port: 21, service: "FTP Control", protocol: "TCP", desc: "File Transfer Protocol control channel", risk: "high" },
  { port: 22, service: "SSH", protocol: "TCP", desc: "Secure Shell – encrypted remote access", risk: "low" },
  { port: 23, service: "Telnet", protocol: "TCP", desc: "Unencrypted remote access (deprecated)", risk: "high" },
  { port: 25, service: "SMTP", protocol: "TCP", desc: "Simple Mail Transfer Protocol", risk: "medium" },
  { port: 53, service: "DNS", protocol: "TCP/UDP", desc: "Domain Name System", risk: "low" },
  { port: 80, service: "HTTP", protocol: "TCP", desc: "Hypertext Transfer Protocol (web)", risk: "medium" },
  { port: 110, service: "POP3", protocol: "TCP", desc: "Post Office Protocol v3 (email)", risk: "medium" },
  { port: 143, service: "IMAP", protocol: "TCP", desc: "Internet Message Access Protocol", risk: "medium" },
  { port: 443, service: "HTTPS", protocol: "TCP", desc: "HTTP over TLS/SSL (secure web)", risk: "low" },
  { port: 445, service: "SMB", protocol: "TCP", desc: "Server Message Block (file sharing)", risk: "high" },
  { port: 465, service: "SMTPS", protocol: "TCP", desc: "SMTP over SSL", risk: "low" },
  { port: 587, service: "SMTP Submission", protocol: "TCP", desc: "Email submission with STARTTLS", risk: "low" },
  { port: 993, service: "IMAPS", protocol: "TCP", desc: "IMAP over SSL", risk: "low" },
  { port: 995, service: "POP3S", protocol: "TCP", desc: "POP3 over SSL", risk: "low" },
  { port: 1433, service: "MSSQL", protocol: "TCP", desc: "Microsoft SQL Server", risk: "high" },
  { port: 1521, service: "Oracle DB", protocol: "TCP", desc: "Oracle Database listener", risk: "high" },
  { port: 3306, service: "MySQL", protocol: "TCP", desc: "MySQL/MariaDB database server", risk: "high" },
  { port: 3389, service: "RDP", protocol: "TCP", desc: "Remote Desktop Protocol", risk: "high" },
  { port: 5432, service: "PostgreSQL", protocol: "TCP", desc: "PostgreSQL database server", risk: "high" },
  { port: 5672, service: "AMQP", protocol: "TCP", desc: "RabbitMQ message broker", risk: "medium" },
  { port: 6379, service: "Redis", protocol: "TCP", desc: "Redis in-memory database", risk: "high" },
  { port: 8080, service: "HTTP Alt", protocol: "TCP", desc: "Alternative HTTP / proxy port", risk: "medium" },
  { port: 8443, service: "HTTPS Alt", protocol: "TCP", desc: "Alternative HTTPS port", risk: "low" },
  { port: 27017, service: "MongoDB", protocol: "TCP", desc: "MongoDB NoSQL database", risk: "high" },
];

const riskColors = { low: "hsl(145, 80%, 42%)", medium: "hsl(35, 90%, 50%)", high: "hsl(0, 85%, 55%)" };
const riskLabels = { low: "Low Risk", medium: "Medium Risk", high: "High Risk" };

export default function PortScanner() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return PORTS;
    return PORTS.filter(p =>
      p.port.toString().includes(search) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const stats = useMemo(() => ({
    total: PORTS.length,
    low: PORTS.filter(p => p.risk === "low").length,
    medium: PORTS.filter(p => p.risk === "medium").length,
    high: PORTS.filter(p => p.risk === "high").length,
  }), []);

  return (
    <ToolLayout title="Port Reference Guide" description="Common network ports reference & info lookup"
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Ports", value: stats.total, color: "hsl(180, 70%, 42%)" },
            { label: "Low Risk", value: stats.low, color: riskColors.low },
            { label: "Medium Risk", value: stats.medium, color: riskColors.medium },
            { label: "High Risk", value: stats.high, color: riskColors.high },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl border border-border/40 bg-card/80 text-center">
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by port number, service name..."
            className="pl-12 py-6 rounded-2xl border-[hsl(180,70%,42%)]/30" />
        </div>

        {/* Port List */}
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.port} className="p-4 rounded-2xl border border-border/40 bg-card/80 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => { navigator.clipboard.writeText(`${p.port} - ${p.service}`); toast.success("Copied!"); }}>
              <div className="w-16 text-center">
                <p className="text-xl font-black font-mono" style={{ color: riskColors[p.risk] }}>{p.port}</p>
                <p className="text-[9px] text-muted-foreground">{p.protocol}</p>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{p.service}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                style={{ backgroundColor: riskColors[p.risk] + "15", color: riskColors[p.risk], border: `1px solid ${riskColors[p.risk]}30` }}>
                {p.risk === "high" ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {riskLabels[p.risk]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

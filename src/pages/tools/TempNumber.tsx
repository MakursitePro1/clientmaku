import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Phone, MessageSquare, Trash2, Globe, Shield, Clock, Signal, Smartphone } from "lucide-react";

const countries = [
  { code: "US", name: "United States", prefix: "+1", format: "XXX-XXX-XXXX", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", prefix: "+44", format: "XXXX XXXXXX", flag: "🇬🇧" },
  { code: "BD", name: "Bangladesh", prefix: "+880", format: "1XXX-XXXXXX", flag: "🇧🇩" },
  { code: "IN", name: "India", prefix: "+91", format: "XXXXX XXXXX", flag: "🇮🇳" },
  { code: "CA", name: "Canada", prefix: "+1", format: "XXX-XXX-XXXX", flag: "🇨🇦" },
  { code: "AU", name: "Australia", prefix: "+61", format: "XXX XXX XXX", flag: "🇦🇺" },
  { code: "DE", name: "Germany", prefix: "+49", format: "XXX XXXXXXX", flag: "🇩🇪" },
  { code: "JP", name: "Japan", prefix: "+81", format: "XXX-XXXX-XXXX", flag: "🇯🇵" },
];

function randomDigits(n: number) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
}

function generateNumber(countryCode: string) {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return "";
  switch (countryCode) {
    case "US": case "CA": return `${country.prefix} ${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;
    case "UK": return `${country.prefix} ${randomDigits(4)} ${randomDigits(6)}`;
    case "BD": return `${country.prefix} 1${randomDigits(3)}-${randomDigits(6)}`;
    case "IN": return `${country.prefix} ${randomDigits(5)} ${randomDigits(5)}`;
    case "AU": return `${country.prefix} ${randomDigits(3)} ${randomDigits(3)} ${randomDigits(3)}`;
    case "DE": return `${country.prefix} ${randomDigits(3)} ${randomDigits(7)}`;
    case "JP": return `${country.prefix} ${randomDigits(3)}-${randomDigits(4)}-${randomDigits(4)}`;
    default: return `${country.prefix} ${randomDigits(10)}`;
  }
}

interface FakeSMS {
  id: string;
  from: string;
  message: string;
  time: Date;
  icon: string;
}

const sampleSMS = [
  { from: "Google", message: "G-847293 is your Google verification code. Don't share this code with anyone.", icon: "🔍" },
  { from: "Facebook", message: "Your Facebook code is 529184. Don't share this code.", icon: "📘" },
  { from: "WhatsApp", message: "Your WhatsApp code: 631-847. You can also tap on this link to verify.", icon: "💬" },
  { from: "Twitter", message: "Your Twitter confirmation code is 294817.", icon: "🐦" },
  { from: "Amazon", message: "Your Amazon OTP is 738492. Do not share with anyone.", icon: "📦" },
  { from: "Uber", message: "Your Uber code is 4829. Never share this code.", icon: "🚗" },
  { from: "Telegram", message: "Telegram code: 84729. Do not give this code to anyone.", icon: "✈️" },
  { from: "Instagram", message: "284 739 is your Instagram code. Don't share it.", icon: "📸" },
  { from: "Netflix", message: "Your Netflix verification code is 592847.", icon: "🎬" },
  { from: "Spotify", message: "Your Spotify code: 839204. Don't share this code.", icon: "🎵" },
];

export default function TempNumber() {
  const [country, setCountry] = useState("US");
  const [number, setNumber] = useState("");
  const [messages, setMessages] = useState<FakeSMS[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selected, setSelected] = useState<FakeSMS | null>(null);
  const [numberHistory, setNumberHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const newNum = generateNumber(country);
    setNumber(newNum);
    setMessages([]);
    setSelected(null);
    setNumberHistory(prev => [newNum, ...prev].slice(0, 5));
  }, [country]);

  useEffect(() => { generate(); }, [generate]);

  useEffect(() => {
    if (!autoRefresh || !number) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const sample = sampleSMS[Math.floor(Math.random() * sampleSMS.length)];
        setMessages(prev => [{
          id: Math.random().toString(36).slice(2),
          ...sample,
          time: new Date(),
        }, ...prev].slice(0, 30));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [number, autoRefresh]);

  const copyNumber = () => {
    navigator.clipboard.writeText(number);
    toast.success("Number copied!");
  };

  const timeDiff = (d: Date) => {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  const currentCountry = countries.find(c => c.code === country);

  return (
    <ToolLayout title="Temp Number" description="Get a temporary phone number for receiving SMS verification codes">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Country Select */}
        <div className="tool-section-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold">Select Country</h3>
          </div>
          <div className="flex gap-2">
            <Select value={country} onValueChange={v => setCountry(v)}>
              <SelectTrigger className="rounded-xl flex-1 tool-input-colorful">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">{c.flag} {c.name} ({c.prefix})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={generate} className="tool-btn-primary px-5 py-2.5 flex items-center gap-2 text-sm shrink-0">
              <RefreshCw className="w-4 h-4" /> New Number
            </button>
          </div>
        </div>

        {/* Phone Number Display */}
        <motion.div
          key={number}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="tool-result-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{currentCountry?.flag} {currentCountry?.name}</p>
              <p className="font-mono text-xl sm:text-2xl font-extrabold gradient-text">{number}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={copyNumber} className="shrink-0 hover:text-primary hover:bg-primary/10 rounded-xl">
              <Copy className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <MessageSquare className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-lg">{messages.length}</div>
            <div className="stat-label">Messages</div>
          </div>
          <div className="tool-stat-card">
            <Signal className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <div className="stat-value text-lg">{autoRefresh ? "Active" : "Paused"}</div>
            <div className="stat-label">Status</div>
          </div>
          <div className="tool-stat-card">
            <Shield className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="stat-value text-lg">{numberHistory.length}</div>
            <div className="stat-label">Generated</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{messages.length} messages received</span>
            {autoRefresh && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2.5 h-2.5 rounded-full bg-green-500" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-xl text-xs border-2 ${autoRefresh ? "border-green-500/30 text-green-600" : "border-border"}`}>
              {autoRefresh ? "⏸ Pause" : "▶ Resume"}
            </Button>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { setMessages([]); setSelected(null); toast.success("Cleared!"); }}
                className="rounded-xl text-xs gap-1 border-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages / SMS View */}
        <div className="min-h-[300px] tool-section-card overflow-hidden">
          {selected ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-5 space-y-4">
              <button onClick={() => setSelected(null)} className="text-xs text-primary hover:underline font-bold">← Back to Inbox</button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{selected.from}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {selected.time.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm leading-relaxed">
                {selected.message}
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => { navigator.clipboard.writeText(selected.message); toast.success("Message copied!"); }}>
                <Copy className="w-3.5 h-3.5" /> Copy Message
              </Button>
            </motion.div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground/50">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <MessageSquare className="w-14 h-14 mb-3 text-primary/20" />
              </motion.div>
              <p className="font-bold text-sm">Waiting for SMS...</p>
              <p className="text-xs mt-1">Messages will appear here automatically</p>
              <div className="flex items-center gap-1.5 mt-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {messages.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(m)}
                  className="w-full text-left p-3.5 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-bold text-sm">{m.from}</span>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0">{timeDiff(m.time)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{m.message}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Number History */}
        {numberHistory.length > 1 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10">
              <span className="text-xs font-bold gradient-text">📋 Recent Numbers</span>
            </div>
            <div className="divide-y divide-border/20">
              {numberHistory.slice(1).map((h, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-accent/10 transition-colors">
                  <span className="font-mono font-semibold">{h}</span>
                  <button onClick={() => { navigator.clipboard.writeText(h); toast.success("Copied!"); }} className="text-muted-foreground hover:text-primary">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center tool-badge mx-auto">
          ⚠️ Demo tool — Numbers and messages are simulated locally
        </p>
      </div>
    </ToolLayout>
  );
}

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Phone, MessageSquare, Trash2 } from "lucide-react";

const countries = [
  { code: "US", name: "United States", prefix: "+1", format: "XXX-XXX-XXXX" },
  { code: "UK", name: "United Kingdom", prefix: "+44", format: "XXXX XXXXXX" },
  { code: "BD", name: "Bangladesh", prefix: "+880", format: "1XXX-XXXXXX" },
  { code: "IN", name: "India", prefix: "+91", format: "XXXXX XXXXX" },
  { code: "CA", name: "Canada", prefix: "+1", format: "XXX-XXX-XXXX" },
  { code: "AU", name: "Australia", prefix: "+61", format: "XXX XXX XXX" },
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
    default: return `${country.prefix} ${randomDigits(10)}`;
  }
}

interface FakeSMS {
  id: string;
  from: string;
  message: string;
  time: Date;
}

const sampleSMS = [
  { from: "Google", message: "G-847293 is your Google verification code. Don't share this code with anyone." },
  { from: "Facebook", message: "Your Facebook code is 529184. Don't share this code." },
  { from: "WhatsApp", message: "Your WhatsApp code: 631-847. You can also tap on this link to verify: v.whatsapp.com/631847" },
  { from: "Twitter", message: "Your Twitter confirmation code is 294817." },
  { from: "Amazon", message: "Your Amazon OTP is 738492. Do not share with anyone." },
  { from: "Uber", message: "Your Uber code is 4829. Never share this code." },
  { from: "Telegram", message: "Telegram code: 84729. Do not give this code to anyone." },
  { from: "Instagram", message: "284 739 is your Instagram code. Don't share it." },
];

export default function TempNumber() {
  const [country, setCountry] = useState("US");
  const [number, setNumber] = useState("");
  const [messages, setMessages] = useState<FakeSMS[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generate = useCallback(() => {
    setNumber(generateNumber(country));
    setMessages([]);
  }, [country]);

  useEffect(() => { generate(); }, [generate]);

  // Simulate incoming SMS
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

  return (
    <ToolLayout title="Temp Number" description="Get a temporary phone number for receiving SMS">
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Country Select */}
        <div className="flex gap-2">
          <Select value={country} onValueChange={v => { setCountry(v); }}>
            <SelectTrigger className="rounded-xl flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name} ({c.prefix})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generate} className="rounded-xl gap-2">
            <RefreshCw className="w-4 h-4" /> New Number
          </Button>
        </div>

        {/* Phone Number Display */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Phone className="w-6 h-6 text-primary shrink-0" />
          <span className="font-mono text-lg sm:text-xl font-bold flex-1">{number}</span>
          <Button variant="ghost" size="icon" onClick={copyNumber} className="shrink-0">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{messages.length} messages</span>
            {autoRefresh && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="rounded-lg text-xs">
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => { setMessages([]); toast.success("Cleared!"); }} className="rounded-lg text-xs gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-[300px] rounded-xl border border-border/50 bg-card overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground/50">
              <MessageSquare className="w-12 h-12 mb-3" />
              <p className="font-medium">Waiting for SMS...</p>
              <p className="text-xs mt-1">Messages will appear here automatically</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {messages.map(m => (
                <div key={m.id} className="p-3 hover:bg-accent/20 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm">{m.from}</span>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">{timeDiff(m.time)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ This is a demo tool. Numbers and messages are simulated locally. For real temporary numbers, use dedicated services.
        </p>
      </div>
    </ToolLayout>
  );
}

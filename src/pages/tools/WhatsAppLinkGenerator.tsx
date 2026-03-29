import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ExternalLink, MessageCircle, QrCode, Phone, Smartphone, Globe, History, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const templates = [
  { label: "Greeting", emoji: "👋", text: "Hello! I'd like to connect with you." },
  { label: "Order Inquiry", emoji: "🛍️", text: "Hi, I'm interested in placing an order. Could you share the details?" },
  { label: "Support", emoji: "🔧", text: "Hello, I need help with an issue. Can you assist?" },
  { label: "Appointment", emoji: "📅", text: "Hi, I'd like to book an appointment. When are you available?" },
  { label: "Price Inquiry", emoji: "💰", text: "Hi, could you please share the pricing for your services?" },
  { label: "Feedback", emoji: "⭐", text: "Hello! I wanted to share some feedback about your service." },
];

const countryCodes = [
  { code: "+880", country: "🇧🇩 Bangladesh" },
  { code: "+1", country: "🇺🇸 USA/Canada" },
  { code: "+44", country: "🇬🇧 UK" },
  { code: "+91", country: "🇮🇳 India" },
  { code: "+61", country: "🇦🇺 Australia" },
  { code: "+81", country: "🇯🇵 Japan" },
  { code: "+49", country: "🇩🇪 Germany" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+971", country: "🇦🇪 UAE" },
  { code: "+966", country: "🇸🇦 Saudi Arabia" },
  { code: "+65", country: "🇸🇬 Singapore" },
  { code: "+60", country: "🇲🇾 Malaysia" },
];

export default function WhatsAppLinkGenerator() {
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [history, setHistory] = useState<{ phone: string; msg: string; time: string }[]>([]);

  const cleanPhone = useMemo(() => {
    return (countryCode + phone).replace(/[^0-9+]/g, "").replace("+", "");
  }, [countryCode, phone]);

  const link = useMemo(() => {
    const base = `https://wa.me/${cleanPhone}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }, [cleanPhone, message]);

  const isValid = cleanPhone.length >= 10;

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
    saveToHistory();
  };

  const saveToHistory = () => {
    const entry = { phone: countryCode + phone, msg: message.slice(0, 50), time: new Date().toLocaleTimeString() };
    setHistory(prev => [entry, ...prev].slice(0, 10));
  };

  const charCount = message.length;

  return (
    <ToolLayout title="WhatsApp Link Generator" description="Create direct WhatsApp chat links with QR codes and message templates">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Phone Input */}
        <div className="tool-section-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-bold">Phone Number</h3>
          </div>
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countryCodes.map(c => (
                <option key={c.code} value={c.code}>{c.country} ({c.code})</option>
              ))}
            </select>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="1712345678"
              className="rounded-xl flex-1 font-mono text-lg"
              maxLength={15}
            />
          </div>
        </div>

        {/* Message Templates */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-green-500" /> Message Templates
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {templates.map(t => (
              <button
                key={t.label}
                onClick={() => setMessage(t.text)}
                className={`p-3 rounded-xl text-left border transition-all hover:border-green-500/40 hover:bg-green-500/5 ${
                  message === t.text ? "border-green-500/50 bg-green-500/10" : "border-border/50 bg-card"
                }`}
              >
                <span className="text-lg">{t.emoji}</span>
                <p className="text-xs font-semibold mt-1">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold">Custom Message</label>
            <span className="text-xs text-muted-foreground">{charCount}/1000</span>
          </div>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 1000))}
            placeholder="Hello! I'm interested in..."
            className="rounded-xl min-h-[80px] resize-none"
          />
        </div>

        {/* Generated Link */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-bold text-green-600">Generated Link</h3>
              </div>

              <div className="p-3 bg-card rounded-xl border border-border/30">
                <p className="font-mono text-sm break-all select-all">{link}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={copyLink} className="rounded-xl gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                  <Copy className="w-4 h-4" /> Copy Link
                </Button>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-xl gap-1.5 border-green-500/30 text-green-600 hover:bg-green-500/10">
                    <ExternalLink className="w-4 h-4" /> Open WhatsApp
                  </Button>
                </a>
                <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="w-4 h-4" /> {showQR ? "Hide QR" : "Show QR"}
                </Button>
              </div>

              {/* QR Code */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="flex justify-center pt-2 overflow-hidden"
                  >
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-sm">
                      <QRCodeSVG value={link} size={200} fgColor="#25D366" level="H" includeMargin />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preview Card */}
              <div className="bg-card rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{countryCode} {phone || "..."}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[250px]">{message || "No message"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-accent/30 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Recent Links</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => setHistory([])}>
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            </div>
            <div className="divide-y divide-border/20 max-h-40 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs hover:bg-accent/10">
                  <span className="font-mono font-semibold shrink-0">{h.phone}</span>
                  <span className="text-muted-foreground truncate flex-1">{h.msg || "No message"}</span>
                  <span className="text-muted-foreground/50 shrink-0">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

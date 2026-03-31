import { useState, useEffect, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Phone, MessageSquare, Trash2, Globe, Shield, Clock, Signal, Smartphone, Search, X, Check, KeyRound, ArrowLeft, Volume2, VolumeX, Bell, BellOff, Download, FileJson, FileSpreadsheet, Eye, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ── Helpers ──
async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly","true"); ta.setAttribute("aria-hidden","true");
    ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
  } catch { return false; }
}

function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination); osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

function extractOTP(text: string): string | null {
  if (!text) return null;
  const patterns = [
    /\b(?:code|otp|pin|verification|verify|confirm|token)[:\s]+(\d{4,8})\b/i,
    /\b(\d{4,8})\s*(?:is your|is the|as your|verification|code|otp|pin)\b/i,
    /(?:code is|code:)\s*(\d{4,8})\b/i,
    /\b(\d{6})\b/,
  ];
  for (const p of patterns) { const m = text.match(p); if (m?.[1]) return m[1]; }
  return null;
}

const countryFlags: Record<string, string> = {
  "united states": "🇺🇸", "canada": "🇨🇦", "united kingdom": "🇬🇧", "germany": "🇩🇪",
  "france": "🇫🇷", "netherlands": "🇳🇱", "sweden": "🇸🇪", "denmark": "🇩🇰",
  "finland": "🇫🇮", "poland": "🇵🇱", "spain": "🇪🇸", "italy": "🇮🇹",
  "australia": "🇦🇺", "india": "🇮🇳", "russia": "🇷🇺", "brazil": "🇧🇷",
  "mexico": "🇲🇽", "japan": "🇯🇵", "china": "🇨🇳", "south korea": "🇰🇷",
  "indonesia": "🇮🇩", "philippines": "🇵🇭", "thailand": "🇹🇭", "vietnam": "🇻🇳",
  "malaysia": "🇲🇾", "singapore": "🇸🇬", "hong kong": "🇭🇰", "taiwan": "🇹🇼",
  "nigeria": "🇳🇬", "south africa": "🇿🇦", "egypt": "🇪🇬", "kenya": "🇰🇪",
  "ukraine": "🇺🇦", "romania": "🇷🇴", "portugal": "🇵🇹", "czech republic": "🇨🇿",
  "austria": "🇦🇹", "belgium": "🇧🇪", "switzerland": "🇨🇭", "israel": "🇮🇱",
  "turkey": "🇹🇷", "pakistan": "🇵🇰", "bangladesh": "🇧🇩", "myanmar": "🇲🇲",
  "colombia": "🇨🇴", "argentina": "🇦🇷", "chile": "🇨🇱", "peru": "🇵🇪",
};
function getFlag(country: string) { return countryFlags[country.toLowerCase()] || "🌍"; }

interface NumberInfo { number: string; country: string; slug: string; source?: string; pageUrl?: string; }
interface SMSMessage { id: string; message: string; sender: string; time: string; }
interface CountryPage { country: string; url: string; count: number; code: string; }

async function callAPI(action: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("temp-number", { body: { action, ...params } });
  if (error) throw new Error(error.message || "API call failed");
  return data;
}

export default function TempNumber() {
  const [numbers, setNumbers] = useState<NumberInfo[]>([]);
  const [activeNumber, setActiveNumber] = useState<NumberInfo | null>(null);
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [selected, setSelected] = useState<SMSMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [numberHistory, setNumberHistory] = useState<NumberInfo[]>([]);
  const prevMsgCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [countryPages, setCountryPages] = useState<CountryPage[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedCountries, setLoadedCountries] = useState<Set<string>>(new Set());

  // Copy effect
  const triggerCopy = useCallback((key: string) => {
    setCopiedKey(key);
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopiedKey(c => c === key ? null : c), 1400);
  }, []);

  const handleCopy = useCallback(async (text: string, msg: string, key: string) => {
    const ok = await copyText(text);
    if (ok) { triggerCopy(key); toast.success(msg); }
    else toast.error("Copy failed");
  }, [triggerCopy]);

  // Fetch available numbers
  const fetchNumbers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callAPI("getNumbers");
      const nums: NumberInfo[] = data?.numbers || [];
      setNumbers(nums);
      if (nums.length > 0 && !activeNumber) {
        setActiveNumber(nums[0]);
        setNumberHistory([nums[0]]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch numbers");
    } finally {
      setLoading(false);
    }
  }, [activeNumber]);

  // Fetch messages for active number
  const fetchMessages = useCallback(async () => {
    if (!activeNumber) return;
    setRefreshing(true);
    try {
      const params: Record<string, string> = { numberSlug: activeNumber.slug };
      if (activeNumber.source === "receivesms-co" && activeNumber.pageUrl) {
        params.source = "receivesms-co";
        params.pageUrl = activeNumber.pageUrl;
      }
      const data = await callAPI("getMessages", params);
      const msgs: SMSMessage[] = data?.messages || [];
      if (msgs.length > prevMsgCountRef.current && prevMsgCountRef.current > 0) {
        if (soundEnabled) playNotifSound();
        if (notifEnabled && Notification.permission === "granted") {
          new Notification("📱 New SMS!", { body: msgs[0]?.message?.slice(0, 100) || "New message", icon: "/logo.jpg" });
        }
        toast.success("📱 New SMS received!");
      }
      prevMsgCountRef.current = msgs.length;
      setMessages(msgs);
    } catch {
      // silent
    } finally {
      setRefreshing(false);
    }
  }, [activeNumber, soundEnabled, notifEnabled]);

  // Fetch country pages list
  const fetchCountryPages = useCallback(async () => {
    try {
      const data = await callAPI("getCountryList");
      setCountryPages(data?.countries || []);
    } catch {}
  }, []);

  // Load more numbers from a specific country
  const loadMoreNumbers = useCallback(async (cp: CountryPage) => {
    setLoadingMore(true);
    try {
      const data = await callAPI("getCountryNumbers", { countryUrl: cp.url, countryName: cp.country });
      const newNums: NumberInfo[] = data?.numbers || [];
      if (newNums.length === 0) { toast.error("No additional numbers found"); return; }
      setNumbers(prev => {
        const existingSlugs = new Set(prev.map(n => n.slug));
        const unique = newNums.filter(n => !existingSlugs.has(n.slug));
        return [...prev, ...unique];
      });
      setLoadedCountries(prev => new Set(prev).add(cp.country));
      toast.success(`${newNums.length} numbers loaded for ${cp.country}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to load more numbers");
    } finally {
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchNumbers(); }, []);

  // Fetch messages when number changes
  useEffect(() => {
    if (!activeNumber) return;
    prevMsgCountRef.current = 0;
    setMessages([]);
    setSelected(null);
    fetchMessages();
  }, [activeNumber?.slug]);

  // Auto refresh
  useEffect(() => {
    if (!activeNumber || !autoRefresh) return;
    intervalRef.current = setInterval(fetchMessages, 10000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeNumber?.slug, autoRefresh, fetchMessages]);

  // Cleanup
  useEffect(() => () => { if (copyResetRef.current) clearTimeout(copyResetRef.current); }, []);

  const selectNumber = (num: NumberInfo) => {
    setActiveNumber(num);
    setNumberHistory(prev => {
      if (prev.some(n => n.slug === num.slug)) return prev;
      return [num, ...prev].slice(0, 10);
    });
  };

  const requestNotif = async () => {
    if (!("Notification" in window)) { toast.error("Not supported"); return; }
    const p = await Notification.requestPermission();
    setNotifEnabled(p === "granted");
    toast[p === "granted" ? "success" : "error"](p === "granted" ? "Notifications on!" : "Permission denied");
  };

  // Export
  const exportJSON = () => {
    if (!messages.length) { toast.error("No messages"); return; }
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `sms_${activeNumber?.slug || "export"}.json`; a.click();
    toast.success("Exported JSON!");
  };
  const exportCSV = () => {
    if (!messages.length) { toast.error("No messages"); return; }
    const h = "Sender,Message,Time\n";
    const rows = messages.map(m => {
      const esc = (s: string) => `"${(s||"").replace(/"/g,'""')}"`;
      return [esc(m.sender), esc(m.message), esc(m.time)].join(",");
    }).join("\n");
    const blob = new Blob([h + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `sms_${activeNumber?.slug || "export"}.csv`; a.click();
    toast.success("Exported CSV!");
  };

  // Country list from available numbers
  const availableCountries = [...new Set(numbers.map(n => n.country))].sort();

  // Filtered numbers by country
  const filteredNumbers = countryFilter
    ? numbers.filter(n => n.country.toLowerCase() === countryFilter.toLowerCase())
    : numbers;

  // Filtered messages by search
  const filteredMessages = searchQuery.trim()
    ? messages.filter(m => m.message.toLowerCase().includes(searchQuery.toLowerCase()) || m.sender.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <ToolLayout title="Temp Number" description="Get a real temporary phone number for receiving SMS verification codes online">
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Active Number Display */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="tool-result-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">
                {activeNumber ? `${getFlag(activeNumber.country)} ${activeNumber.country}` : "Loading..."}
              </p>
              {activeNumber ? (
                <p className="font-mono text-lg sm:text-2xl font-extrabold gradient-text truncate">{activeNumber.number}</p>
              ) : (
                <p className="text-sm text-muted-foreground animate-pulse">Fetching numbers...</p>
              )}
            </div>
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button variant="ghost" size="icon" disabled={!activeNumber}
                className={`shrink-0 h-9 w-9 rounded-xl transition-all ${copiedKey === "number" ? "bg-primary/10 text-primary" : "hover:text-primary hover:bg-primary/10"}`}
                onClick={() => activeNumber && handleCopy(activeNumber.number, "Number copied!", "number")}>
                {copiedKey === "number" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Country Filter + Number Selector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-xs sm:text-sm font-bold">Available Numbers</h3>
            <span className="text-[10px] text-muted-foreground ml-auto">{filteredNumbers.length} numbers</span>
          </div>

          {/* Country chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCountryFilter("")}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${!countryFilter ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"}`}
            >All</button>
            {availableCountries.map(c => (
              <button
                key={c}
                onClick={() => setCountryFilter(c === countryFilter ? "" : c)}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap ${c === countryFilter ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"}`}
              >{getFlag(c)} {c}</button>
            ))}
          </div>

          {/* Number list */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
              {filteredNumbers.map(n => (
                <button
                  key={n.slug}
                  onClick={() => selectNumber(n)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${n.slug === activeNumber?.slug ? "bg-primary/10 border border-primary/30 shadow-sm" : "bg-muted/30 border border-transparent hover:bg-muted/60 hover:border-border/50"}`}
                >
                  <span className="text-base">{getFlag(n.country)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs sm:text-sm font-bold truncate">{n.number}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">{n.country}</p>
                  </div>
                  {n.slug === activeNumber?.slug && <Signal className="w-3 h-3 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="tool-stat-card p-3 sm:p-4">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">{messages.length}</div>
            <div className="stat-label text-[9px] sm:text-xs">Messages</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Signal className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" style={{ color: autoRefresh ? "hsl(142, 71%, 45%)" : "hsl(var(--muted-foreground))" }} />
            <div className="stat-value text-base sm:text-lg">{autoRefresh ? "Active" : "Paused"}</div>
            <div className="stat-label text-[9px] sm:text-xs">Status</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">{numberHistory.length}</div>
            <div className="stat-label text-[9px] sm:text-xs">Used</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">10s</div>
            <div className="stat-label text-[9px] sm:text-xs">Refresh</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search messages by sender or content..."
            className="w-full h-9 sm:h-10 pl-9 pr-8 rounded-xl text-xs sm:text-sm bg-muted/50 border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30">
              <X className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium">{messages.length} messages</span>
              {autoRefresh && refreshing && <RefreshCw className="w-3 h-3 animate-spin text-primary" />}
              {autoRefresh && !refreshing && (
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <div className="grid grid-cols-4 sm:flex gap-1.5">
              <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}
                className={`rounded-xl text-[10px] sm:text-xs gap-1 h-7 sm:h-9 px-2 sm:px-3 ${soundEnabled ? "border-primary/30 text-primary" : "border-border"}`}>
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span className="hidden sm:inline">{soundEnabled ? "Sound" : "Mute"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => notifEnabled ? setNotifEnabled(false) : requestNotif()}
                className={`rounded-xl text-[10px] sm:text-xs gap-1 h-7 sm:h-9 px-2 sm:px-3 ${notifEnabled ? "border-primary/30 text-primary" : "border-border"}`}>
                {notifEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                <span className="hidden sm:inline">Notif</span>
              </Button>
              <Button variant="outline" size="sm" onClick={fetchMessages} disabled={!activeNumber || refreshing}
                className="rounded-xl text-[10px] sm:text-xs gap-1 h-7 sm:h-9 px-2 sm:px-3">
                <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}
                className={`rounded-xl text-[10px] sm:text-xs border-2 h-7 sm:h-9 px-2 sm:px-3 ${autoRefresh ? "border-primary/30 text-primary" : "border-border"}`}>
                {autoRefresh ? "⏸" : "▶"}
                <span className="hidden sm:inline">{autoRefresh ? "Pause" : "Resume"}</span>
              </Button>
            </div>
          </div>
          {messages.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Export:</span>
                <Button variant="outline" size="sm" onClick={exportJSON} className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2">
                  <FileJson className="w-3 h-3" /> JSON
                </Button>
                <Button variant="outline" size="sm" onClick={exportCSV} className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2">
                  <FileSpreadsheet className="w-3 h-3" /> CSV
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setMessages([]); setSelected(null); prevMsgCountRef.current = 0; toast.success("Cleared!"); }}
                className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 className="w-3 h-3" /> Clear ({messages.length})
              </Button>
            </div>
          )}
        </div>

        {/* Inbox / Detail */}
        <div className="min-h-[350px] tool-section-card overflow-hidden">
          <AnimatePresence mode="wait">
            {loadingMsgs ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <RefreshCw className="w-10 h-10 animate-spin text-primary mb-3" />
                <p className="text-sm font-medium">Loading messages...</p>
              </motion.div>
            ) : selected ? (
              <motion.div key="detail" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border/20 bg-accent/20 gap-2">
                  <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-primary hover:underline font-bold">
                    <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Back to Inbox
                  </button>
                  <div className="flex items-center gap-1">
                    <motion.div whileTap={{ scale: 0.94 }}>
                      <Button variant="ghost" size="sm" className={`h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 px-2 transition-all ${copiedKey === `detail-msg` ? "bg-primary/10 text-primary" : ""}`}
                        onClick={() => handleCopy(selected.message, "Message copied!", "detail-msg")}>
                        {copiedKey === "detail-msg" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedKey === "detail-msg" ? "Copied" : "Copy"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
                {/* Sender info */}
                <div className="mx-3 sm:mx-5 mt-3 p-2.5 sm:p-3 rounded-xl bg-accent/30 border border-border/20">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs sm:text-sm shrink-0">
                      📱
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold">{selected.sender || "Unknown"}</p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {selected.time}
                      </p>
                    </div>
                  </div>
                </div>
                {/* OTP Banner */}
                {(() => {
                  const otp = extractOTP(selected.message);
                  if (!otp) return null;
                  return (
                    <div className="mx-3 sm:mx-5 mt-2">
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.985 }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${copiedKey === "detail-otp" ? "bg-primary/15 border-primary/40" : "bg-primary/10 border-primary/20"}`}
                        onClick={() => handleCopy(otp, `OTP "${otp}" copied!`, "detail-otp")}>
                        <KeyRound className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-xs font-medium text-muted-foreground">OTP:</span>
                        <span className="font-mono font-extrabold text-base text-primary tracking-widest">{otp}</span>
                        <Button variant="ghost" size="sm" className={`ml-auto h-7 px-2 rounded-lg text-xs gap-1 ${copiedKey === "detail-otp" ? "bg-primary/15 text-primary" : "hover:bg-primary/10"}`}>
                          {copiedKey === "detail-otp" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedKey === "detail-otp" ? "Copied" : "Copy"}
                        </Button>
                      </motion.div>
                    </div>
                  );
                })()}
                {/* Message body */}
                <div className="px-3 sm:px-5 pt-3 pb-4">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Message</p>
                  <div className="p-4 rounded-xl bg-accent/20 border border-border/20 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div key="loading-init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <RefreshCw className="w-12 h-12 animate-spin text-primary mb-3" />
                <p className="font-bold text-sm">Loading numbers...</p>
              </motion.div>
            ) : filteredMessages.length === 0 && messages.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground/50">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <MessageSquare className="w-14 h-14 mb-3 text-primary/20" />
                </motion.div>
                <p className="font-bold text-sm">Waiting for SMS...</p>
                <p className="text-xs mt-1">Messages will appear here when received</p>
                <p className="text-[10px] mt-1 text-muted-foreground/40">Auto-refreshes every 10 seconds</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </motion.div>
            ) : filteredMessages.length === 0 && searchQuery ? (
              <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground/50">
                <Search className="w-10 h-10 mb-3 text-muted-foreground/20" />
                <p className="font-bold text-sm">No results found</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl text-xs" onClick={() => setSearchQuery("")}>Clear Search</Button>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="divide-y divide-border/20 max-h-[500px] overflow-y-auto">
                {filteredMessages.map((m, i) => {
                  const otp = extractOTP(m.message);
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                      className="relative p-3 sm:p-4 hover:bg-accent/50 transition-all group"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm shrink-0">
                          📱
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs sm:text-sm font-bold text-foreground truncate">{m.sender || "Unknown"}</span>
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground/50 shrink-0">{m.time}</span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">{m.message}</p>

                          {otp && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                              <KeyRound className="w-3.5 h-3.5 text-primary" />
                              <span className="font-mono font-extrabold text-sm text-primary tracking-widest">{otp}</span>
                              <button
                                className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${copiedKey === `otp-${m.id}` ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary hover:bg-primary/30"}`}
                                onClick={e => { e.stopPropagation(); handleCopy(otp, `OTP "${otp}" copied!`, `otp-${m.id}`); }}
                              >{copiedKey === `otp-${m.id}` ? "Copied" : "Copy OTP"}</button>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 ml-[42px] sm:ml-[52px]">
                        <motion.div whileTap={{ scale: 0.94 }}>
                          <Button variant="outline" size="sm"
                            className={`h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 sm:gap-1.5 font-semibold px-2 sm:px-3 transition-all ${copiedKey === `msg-${m.id}` ? "border-primary/40 bg-primary/10 text-primary" : "border-primary/20 text-primary hover:bg-primary/10"}`}
                            onClick={e => { e.stopPropagation(); const t = otp || m.message; handleCopy(t, otp ? `OTP "${otp}" copied!` : "Message copied!", `msg-${m.id}`); }}
                          >
                            {copiedKey === `msg-${m.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === `msg-${m.id}` ? "Copied" : otp ? "Copy OTP" : "Copy"}
                          </Button>
                        </motion.div>
                        <Button variant="outline" size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 sm:gap-1.5 font-semibold hover:bg-accent px-2 sm:px-3"
                          onClick={e => { e.stopPropagation(); setSelected(m); }}
                        >
                          <Eye className="w-3 h-3" /> Details
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 text-destructive/70 hover:text-destructive hover:bg-destructive/10 ml-auto px-1.5 sm:px-2"
                          onClick={e => { e.stopPropagation(); setMessages(prev => prev.filter(x => x.id !== m.id)); }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Number History */}
        {numberHistory.length > 1 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-accent/30 border-b border-border/30">
              <span className="text-xs font-bold flex items-center gap-1.5">📋 Number History ({numberHistory.length})</span>
            </div>
            <div className="divide-y divide-border/20 max-h-40 overflow-y-auto">
              {numberHistory.map((h, i) => (
                <div key={h.slug} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent/10 transition-colors">
                  <span>{getFlag(h.country)}</span>
                  <span className="font-mono font-semibold flex-1 truncate">{h.number}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{h.country}</span>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <button
                      className={`transition-all ${copiedKey === `hist-${h.slug}` ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      onClick={() => handleCopy(h.number, "Number copied!", `hist-${h.slug}`)}
                    >
                      {copiedKey === `hist-${h.slug}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </motion.div>
                  <button onClick={() => selectNumber(h)} className="text-[10px] text-primary hover:underline font-medium shrink-0">
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">How it works</p>
            <p>These are real public temporary phone numbers. Select a number, use it for SMS verification, and receive real messages here. Numbers are shared — anyone can see messages. Auto-refreshes every 10 seconds.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

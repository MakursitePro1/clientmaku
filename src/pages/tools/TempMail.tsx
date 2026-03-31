import { useState, useEffect, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Mail, Inbox, Trash2, Eye, Loader2, Shield, Clock, AlertTriangle, Globe, KeyRound, Bell, BellOff, Volume2, VolumeX, Download, FileJson, FileSpreadsheet, Timer, ArrowLeft, Paperclip, File, Calendar, User, Forward, Search, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function sendBrowserNotification(subject: string, from: string) {
  if (Notification.permission === "granted") {
    new Notification("📧 New Email Received!", {
      body: `From: ${from}\n${subject || "(No Subject)"}`,
      icon: "/logo.jpg",
      tag: "temp-mail-new",
    });
  }
}

interface MailAccount {
  id: string;
  address: string;
  token: string;
  password: string;
  providerBase: string;
}

interface MailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  downloadUrl?: string;
}

interface MailMessage {
  id: string;
  from: { address: string; name: string };
  to: { address: string; name: string }[];
  subject: string;
  intro: string;
  text?: string;
  html?: string[];
  createdAt: string;
  seen: boolean;
  hasAttachments?: boolean;
  attachments?: MailAttachment[];
}

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function extractOTP(text: string): string | null {
  if (!text) return null;
  // Match 4-8 digit codes commonly used as OTPs
  const patterns = [
    /\b(?:code|otp|pin|verification|verify|confirm|token)[:\s]+(\d{4,8})\b/i,
    /\b(\d{4,8})\s*(?:is your|is the|as your|as the|verification|code|otp|pin)\b/i,
    /(?:code is|code:)\s*(\d{4,8})\b/i,
    /\b(\d{6})\b/, // Fallback: standalone 6-digit number (most common OTP length)
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function OTPBanner({ text, subject }: { text: string; subject?: string }) {
  const otp = extractOTP(subject || "") || extractOTP(text);
  if (!otp) return null;
  
  const copyOTP = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(otp);
    toast.success(`OTP "${otp}" copied!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20"
      onClick={copyOTP}
    >
      <KeyRound className="w-4 h-4 text-primary shrink-0" />
      <span className="text-xs font-medium text-muted-foreground">OTP Detected:</span>
      <span className="font-mono font-extrabold text-base text-primary tracking-widest">{otp}</span>
      <Button variant="ghost" size="sm" className="ml-auto h-7 px-2 rounded-lg text-xs gap-1 hover:bg-primary/10"
        onClick={copyOTP}>
        <Copy className="w-3 h-3" /> Copy
      </Button>
    </motion.div>
  );
}

async function callMailAPI(action: string, params: Record<string, string> = {}) {
  const { data, error } = await supabase.functions.invoke("temp-mail", {
    body: { action, ...params },
  });
  if (error) throw new Error(error.message || "API call failed");
  return data;
}

export default function TempMail() {
  const [account, setAccount] = useState<MailAccount | null>(null);
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selected, setSelected] = useState<MailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [availableDomains, setAvailableDomains] = useState<{ domain: string }[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [providerBaseCache, setProviderBaseCache] = useState<string>("");
  const [domainsLoaded, setDomainsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [expiryText, setExpiryText] = useState("--:--");
  const [searchQuery, setSearchQuery] = useState("");
  const [inboxes, setInboxes] = useState<MailAccount[]>([]);
  const [activeInboxIdx, setActiveInboxIdx] = useState(0);
  const prevMsgCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiryRef = useRef<NodeJS.Timeout | null>(null);

  const EMAIL_LIFETIME_MS = 60 * 60 * 1000; // 1 hour

  // Expiry timer with auto-renew
  useEffect(() => {
    if (!createdAt) return;
    const tick = () => {
      const elapsed = Date.now() - createdAt;
      const remaining = Math.max(0, EMAIL_LIFETIME_MS - elapsed);
      if (remaining <= 0) {
        setExpiryText("Renewing...");
        createAccount();
        return;
      }
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setExpiryText(`${m}:${s.toString().padStart(2, "0")}`);
    };
    tick();
    expiryRef.current = setInterval(tick, 1000);
    return () => { if (expiryRef.current) clearInterval(expiryRef.current); };
  }, [createdAt]);

  // Forward email via mailto
  const forwardEmail = (msg: MailMessage) => {
    const subject = encodeURIComponent(`Fwd: ${msg.subject || "(No Subject)"}`);
    const body = encodeURIComponent(
      `---------- Forwarded message ----------\nFrom: ${msg.from?.name || msg.from?.address || "Unknown"}\nDate: ${new Date(msg.createdAt).toLocaleString()}\nSubject: ${msg.subject || "(No Subject)"}\n\n${msg.text || msg.intro || "No content"}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  };

  // Export functions
  const exportJSON = () => {
    if (!messages.length) { toast.error("No messages to export"); return; }
    const data = messages.map(m => ({
      from: m.from?.address || "",
      fromName: m.from?.name || "",
      subject: m.subject || "",
      preview: m.intro || "",
      date: m.createdAt,
      read: m.seen,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tempmail_${account?.address || "export"}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as JSON!");
  };

  const exportCSV = () => {
    if (!messages.length) { toast.error("No messages to export"); return; }
    const header = "From,From Name,Subject,Preview,Date,Read\n";
    const rows = messages.map(m => {
      const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
      return [esc(m.from?.address || ""), esc(m.from?.name || ""), esc(m.subject || ""), esc(m.intro || ""), esc(m.createdAt), m.seen ? "Yes" : "No"].join(",");
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tempmail_${account?.address || "export"}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV!");
  };

  // Request notification permission
  const requestNotifPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("This browser doesn't support notifications");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifEnabled(true);
      toast.success("Notifications enabled!");
    } else {
      setNotifEnabled(false);
      toast.error("Notification permission denied");
    }
  }, []);

  // Fetch domains on mount
  const fetchDomains = useCallback(async () => {
    try {
      const domainData = await callMailAPI("getDomains");
      const domains = domainData?.domains || [];
      const providerBase = domainData?.providerBase || "";
      setAvailableDomains(domains);
      setProviderBaseCache(providerBase);
      if (domains.length > 0 && !selectedDomain) {
        setSelectedDomain(domains[0].domain);
      }
      setDomainsLoaded(true);
      return { domains, providerBase };
    } catch {
      toast.error("Failed to fetch domains");
      setDomainsLoaded(true);
      return null;
    }
  }, [selectedDomain]);

  const createAccount = useCallback(async (domainOverride?: string) => {
    setCreating(true);
    setMessages([]);
    setSelected(null);
    prevMsgCountRef.current = 0;
    try {
      let domains = availableDomains;
      let providerBase = providerBaseCache;

      if (!domains.length) {
        const result = await fetchDomains();
        if (!result || !result.domains.length) {
          toast.error("No domains available. Please try again later.");
          setCreating(false);
          return;
        }
        domains = result.domains;
        providerBase = result.providerBase;
      }

      const domain = domainOverride || selectedDomain || domains[0].domain;
      const username = randomString(12);
      const address = `${username}@${domain}`;
      const password = randomString(16);

      const accResult = await callMailAPI("createAccount", { address, password, providerBase });
      if (accResult?.["@id"] || accResult?.id) {
        const loginResult = await callMailAPI("login", { address, password, providerBase });
        if (loginResult?.token) {
          const newAccount: MailAccount = {
            id: accResult.id || accResult["@id"]?.replace("/accounts/", ""),
            address,
            token: loginResult.token,
            password,
            providerBase,
          };
          setAccount(newAccount);
          setInboxes(prev => {
            const exists = prev.some(a => a.address === newAccount.address);
            if (!exists) {
              const updated = [...prev, newAccount];
              setActiveInboxIdx(updated.length - 1);
              return updated;
            }
            return prev;
          });
          setAutoRefresh(true);
          setCreatedAt(Date.now());
          toast.success("Temp email created successfully!");
        } else {
          toast.error("Failed to login. Please try again.");
        }
      } else {
        const errMsg = accResult?.detail || accResult?.message || "Failed to create account";
        toast.error(errMsg);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create temp email");
    } finally {
      setCreating(false);
    }
  }, [availableDomains, providerBaseCache, selectedDomain, fetchDomains]);

  // Auto-create on mount
  useEffect(() => {
    fetchDomains().then(() => {
      createAccount();
    });
  }, []);

  // Fetch messages with new-email detection
  const fetchMessages = useCallback(async () => {
    if (!account?.token) return;
    setRefreshing(true);
    try {
      const data = await callMailAPI("getMessages", { token: account.token, providerBase: account.providerBase });
      const msgs = data?.["hydra:member"] || data?.member || [];
      
      // Detect new emails
      if (msgs.length > prevMsgCountRef.current && prevMsgCountRef.current > 0) {
        const newMsg = msgs[0];
        if (soundEnabled) playNotificationSound();
        if (notifEnabled) sendBrowserNotification(newMsg?.subject || "", newMsg?.from?.name || newMsg?.from?.address || "Unknown");
        toast.success("📧 New email received!", { description: newMsg?.subject || "(No Subject)" });
      }
      prevMsgCountRef.current = msgs.length;
      
      setMessages(msgs);
    } catch (err) {
      // Silent fail for auto-refresh
    } finally {
      setRefreshing(false);
    }
  }, [account?.token, account?.providerBase, soundEnabled, notifEnabled]);

  // Auto-refresh messages
  useEffect(() => {
    if (!account?.token || !autoRefresh) return;
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [account?.token, autoRefresh, fetchMessages]);

  // View full message
  const viewMessage = async (msg: MailMessage) => {
    if (!account?.token) return;
    setLoadingMessage(true);
    try {
      const fullMsg = await callMailAPI("getMessage", { token: account.token, messageId: msg.id, providerBase: account.providerBase });
      setSelected(fullMsg);
    } catch (err) {
      toast.error("Failed to load message");
    } finally {
      setLoadingMessage(false);
    }
  };

  const deleteMessage = async (msgId: string) => {
    if (!account?.token) return;
    try {
      await callMailAPI("deleteMessage", { token: account.token, messageId: msgId, providerBase: account.providerBase });
      setMessages(prev => prev.filter(m => m.id !== msgId));
      if (selected?.id === msgId) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const clearAllMessages = async () => {
    if (!account?.token || !messages.length) return;
    const count = messages.length;
    try {
      await Promise.allSettled(messages.map(m => 
        callMailAPI("deleteMessage", { token: account.token, messageId: m.id, providerBase: account.providerBase })
      ));
      setMessages([]);
      setSelected(null);
      prevMsgCountRef.current = 0;
      toast.success(`${count} messages cleared!`);
    } catch {
      toast.error("Failed to clear messages");
    }
  };

  const copyEmail = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.address);
    toast.success("Email address copied!");
  };

  const timeDiff = (dateStr: string) => {
    const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <ToolLayout title="Temp Mail" description="Get a real temporary disposable email address instantly — receive OTPs, verification codes & more">
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Email Address */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="tool-result-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Your Temporary Email</p>
              {account ? (
                <p className="font-mono text-sm sm:text-base font-extrabold gradient-text truncate">{account.address}</p>
              ) : (
                <p className="text-sm text-muted-foreground animate-pulse">Creating email...</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={copyEmail} disabled={!account}
              className="shrink-0 h-9 w-9 hover:text-primary hover:bg-primary/10 rounded-xl">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => createAccount()} disabled={creating}
              className="shrink-0 h-9 w-9 hover:text-primary hover:bg-primary/10 rounded-xl">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Domain Selector */}
        {domainsLoaded && availableDomains.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="tool-result-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Select Domain</p>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="h-9 rounded-xl text-sm font-mono">
                    <SelectValue placeholder="Choose domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDomains.map((d) => (
                      <SelectItem key={d.domain} value={d.domain}>
                        @{d.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={() => createAccount(selectedDomain)} disabled={creating || !selectedDomain}
                className="rounded-xl text-xs gap-1 shrink-0">
                {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Generate
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="tool-stat-card p-3 sm:p-4">
            <Inbox className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">{messages.length}</div>
            <div className="stat-label text-[9px] sm:text-xs">Messages</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" style={{ color: expiryText === "Expired" ? "hsl(var(--destructive))" : "hsl(var(--primary))" }} />
            <div className={`stat-value text-base sm:text-lg font-mono ${expiryText === "Expired" ? "text-destructive" : ""}`}>{expiryText}</div>
            <div className="stat-label text-[9px] sm:text-xs">Expires In</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">{autoRefresh ? "Active" : "Paused"}</div>
            <div className="stat-label text-[9px] sm:text-xs">Auto Refresh</div>
          </div>
          <div className="tool-stat-card p-3 sm:p-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-base sm:text-lg">5s</div>
            <div className="stat-label text-[9px] sm:text-xs">Refresh Rate</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium">{messages.length} messages</span>
              {autoRefresh && refreshing && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
              {autoRefresh && !refreshing && (
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <div className="grid grid-cols-4 sm:flex gap-1.5">
              <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}
                className={`rounded-xl text-[10px] sm:text-xs gap-1 h-7 sm:h-9 px-2 sm:px-3 ${soundEnabled ? "border-primary/30 text-primary" : "border-border"}`}>
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span className="hidden sm:inline">{soundEnabled ? "Sound" : "Mute"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => notifEnabled ? setNotifEnabled(false) : requestNotifPermission()}
                className={`rounded-xl text-[10px] sm:text-xs gap-1 h-7 sm:h-9 px-2 sm:px-3 ${notifEnabled ? "border-primary/30 text-primary" : "border-border"}`}>
                {notifEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                <span className="hidden sm:inline">Notif</span>
              </Button>
              <Button variant="outline" size="sm" onClick={fetchMessages} disabled={!account || refreshing}
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
          {/* Export & Clear buttons */}
          {messages.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Export:</span>
                <Button variant="outline" size="sm" onClick={exportJSON}
                  className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2">
                  <FileJson className="w-3 h-3" /> JSON
                </Button>
                <Button variant="outline" size="sm" onClick={exportCSV}
                  className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2">
                  <FileSpreadsheet className="w-3 h-3" /> CSV
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllMessages}
                className="rounded-xl text-[10px] sm:text-xs gap-1 h-6 sm:h-7 px-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="w-3 h-3" /> Clear ({messages.length})
              </Button>
            </div>
          )}
        </div>

        {/* Inbox / Email View */}
        <div className="min-h-[350px] tool-section-card overflow-hidden">
          <AnimatePresence mode="wait">
            {loadingMessage ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                <p className="text-sm font-medium">Loading message...</p>
              </motion.div>
            ) : selected ? (
              <motion.div key="detail" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col">
                
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border/20 bg-accent/20 gap-2">
                  <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-primary hover:underline font-bold">
                    <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Back to Inbox
                  </button>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 px-2"
                      onClick={() => {
                        const content = selected.text || selected.intro || selected.subject || "";
                        navigator.clipboard.writeText(content);
                        toast.success("Content copied!");
                      }}>
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 px-2 text-primary hover:bg-primary/10"
                      onClick={() => forwardEmail(selected)}>
                      <Forward className="w-3 h-3" /> Fwd
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 px-2 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMessage(selected.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Subject */}
                <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3">
                  <h3 className="font-bold text-sm sm:text-lg leading-tight">{selected.subject || "(No Subject)"}</h3>
                </div>

                {/* OTP Banner */}
                <div className="px-3 sm:px-5">
                  <OTPBanner text={selected.text || selected.intro || ""} subject={selected.subject} />
                </div>

                {/* Sender Info Card */}
                <div className="mx-3 sm:mx-5 mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-xl bg-accent/30 border border-border/20">
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs sm:text-sm shrink-0">
                      {(selected.from?.name || selected.from?.address || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-muted-foreground hidden sm:block" />
                        <span className="text-xs sm:text-sm font-semibold text-foreground truncate">{selected.from?.name || "Unknown"}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{selected.from?.address}</p>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:hidden">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(selected.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {selected.to && selected.to.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/20 text-[10px] sm:text-[11px] text-muted-foreground">
                      <span className="font-medium">To:</span> {selected.to.map(t => t.address).join(", ")}
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="px-3 sm:px-5 pt-2 sm:pt-3 pb-2">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Message Body</p>
                  {selected.html && selected.html.length > 0 ? (
                    <div className="rounded-xl border border-border/20 bg-background overflow-auto max-h-[400px]">
                      <iframe
                        srcDoc={selected.html.join("")}
                        className="w-full min-h-[300px] border-0"
                        sandbox="allow-same-origin"
                        title="Email content"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-accent/20 border border-border/20 text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.text || selected.intro || "No content"}
                    </div>
                  )}
                </div>

                {/* Attachments Section */}
                {selected.attachments && selected.attachments.length > 0 && (
                  <div className="px-3 sm:px-5 pt-2 pb-3 sm:pb-4">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 flex items-center gap-1.5">
                      <Paperclip className="w-3 h-3" /> Attachments ({selected.attachments.length})
                    </p>
                    <div className="space-y-1.5">
                      {selected.attachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-accent/30 border border-border/20 hover:bg-accent/50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <File className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{att.filename}</p>
                            <p className="text-[10px] text-muted-foreground">{att.contentType} • {(att.size / 1024).toFixed(1)} KB</p>
                          </div>
                          {att.downloadUrl && (
                            <a href={att.downloadUrl} target="_blank" rel="noopener noreferrer"
                              className="shrink-0">
                              <Button variant="ghost" size="sm" className="h-7 rounded-lg text-[11px] gap-1">
                                <Download className="w-3 h-3" /> Save
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No attachments info */}
                {(!selected.attachments || selected.attachments.length === 0) && (
                  <div className="px-3 sm:px-5 pb-3 sm:pb-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
                      <Paperclip className="w-3 h-3" />
                      <span>No attachments</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : creating ? (
              <motion.div key="creating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-3" />
                <p className="font-bold text-sm">Creating your temp email...</p>
                <p className="text-xs mt-1">This may take a few seconds</p>
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[350px] text-muted-foreground/50">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Inbox className="w-14 h-14 mb-3 text-primary/20" />
                </motion.div>
                <p className="font-bold text-sm">Inbox is empty</p>
                <p className="text-xs mt-1">Emails will appear here automatically when received</p>
                <div className="flex items-center gap-1.5 mt-3">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="divide-y divide-border/20">
                {messages.map((m, i) => {
                  const otp = extractOTP(m.subject || "") || extractOTP(m.intro || "");
                  const isUnread = !m.seen;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={`relative p-4 transition-all group ${isUnread ? "bg-primary/[0.03]" : ""} hover:bg-accent/50`}
                    >
                      {/* Unread indicator bar */}
                      {isUnread && (
                        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-primary" />
                      )}

                       <div className="flex items-start gap-2.5 sm:gap-3">
                        {/* Avatar */}
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold ${isUnread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {(m.from?.name || m.from?.address || "?")[0].toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-xs sm:text-sm truncate ${isUnread ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                              {m.from?.name || m.from?.address || "Unknown"}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">{timeDiff(m.createdAt)}</span>
                          </div>
                          <p className={`text-[11px] sm:text-xs truncate mb-0.5 ${isUnread ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {m.subject || "(No Subject)"}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground/50 truncate leading-relaxed">{m.intro}</p>

                          {/* OTP Banner inline */}
                          {otp && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 w-fit"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-primary" />
                              <span className="font-mono font-extrabold text-sm text-primary tracking-widest">{otp}</span>
                              <button
                                className="ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(otp);
                                  toast.success(`OTP "${otp}" copied!`);
                                }}
                              >
                                Copy OTP
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 ml-[42px] sm:ml-[52px]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 sm:gap-1.5 font-semibold border-primary/20 text-primary hover:bg-primary/10 hover:text-primary px-2 sm:px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            const content = m.intro || m.subject || "";
                            navigator.clipboard.writeText(content);
                            toast.success("Email content copied!");
                          }}
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 sm:gap-1.5 font-semibold hover:bg-accent px-2 sm:px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewMessage(m);
                          }}
                        >
                          <Eye className="w-3 h-3" /> Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 sm:gap-1.5 font-semibold text-primary border-primary/20 hover:bg-primary/10 px-2 sm:px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            forwardEmail(m);
                          }}
                        >
                          <Forward className="w-3 h-3" /> Forward
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 sm:h-7 rounded-lg text-[10px] sm:text-[11px] gap-1 text-destructive/70 hover:text-destructive hover:bg-destructive/10 ml-auto px-1.5 sm:px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(m.id);
                          }}
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

        {/* Info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">How it works</p>
            <p>This generates a real temporary email. Copy the email, use it anywhere, and receive real OTPs & verification codes here. Emails auto-refresh every 5 seconds.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState, useEffect, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Mail, Inbox, Trash2, Eye, Loader2, Shield, Clock, AlertTriangle, Globe, KeyRound, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
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
  const prevMsgCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          setAutoRefresh(true);
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

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!account?.token) return;
    setRefreshing(true);
    try {
      const data = await callMailAPI("getMessages", { token: account.token, providerBase: account.providerBase });
      const msgs = data?.["hydra:member"] || data?.member || [];
      setMessages(msgs);
    } catch (err) {
      // Silent fail for auto-refresh
    } finally {
      setRefreshing(false);
    }
  }, [account?.token, account?.providerBase]);

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
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <Inbox className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-lg">{messages.length}</div>
            <div className="stat-label">Messages</div>
          </div>
          <div className="tool-stat-card">
            <Shield className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <div className="stat-value text-lg">{autoRefresh ? "Active" : "Paused"}</div>
            <div className="stat-label">Auto Refresh</div>
          </div>
          <div className="tool-stat-card">
            <Clock className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="stat-value text-lg">5s</div>
            <div className="stat-label">Refresh Rate</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{messages.length} messages</span>
            {autoRefresh && refreshing && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            {autoRefresh && !refreshing && (
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchMessages} disabled={!account || refreshing}
              className="rounded-xl text-xs gap-1">
              <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-xl text-xs border-2 ${autoRefresh ? "border-green-500/30 text-green-600" : "border-border"}`}>
              {autoRefresh ? "⏸ Pause" : "▶ Resume"}
            </Button>
          </div>
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
                className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelected(null)} className="text-xs text-primary hover:underline font-bold">← Back to Inbox</button>
                  <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10 rounded-lg gap-1"
                    onClick={() => deleteMessage(selected.id)}>
                    <Trash2 className="w-3 h-3" /> Delete
                  </Button>
                </div>
                <h3 className="font-bold text-lg leading-tight">{selected.subject || "(No Subject)"}</h3>
                <OTPBanner text={selected.text || selected.intro || ""} subject={selected.subject} />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>From: <strong className="text-foreground">{selected.from?.name || selected.from?.address}</strong></span>
                  <span>•</span>
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                </div>
                {selected.html && selected.html.length > 0 ? (
                  <div className="rounded-xl border border-border/30 bg-white dark:bg-zinc-900 overflow-auto max-h-[400px]">
                    <iframe
                      srcDoc={selected.html.join("")}
                      className="w-full min-h-[300px] border-0"
                      sandbox="allow-same-origin"
                      title="Email content"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-accent/30 border border-border/30 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.text || selected.intro || "No content"}
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
                className="divide-y divide-border/30">
                {messages.map((m, i) => (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => viewMessage(m)}
                    className="w-full text-left p-3.5 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${m.seen ? "bg-muted-foreground/30" : "bg-primary"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-sm truncate ${m.seen ? "font-medium" : "font-bold"}`}>
                            {m.from?.name || m.from?.address || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60 shrink-0">{timeDiff(m.createdAt)}</span>
                        </div>
                        <p className={`text-xs truncate ${m.seen ? "text-muted-foreground" : "text-foreground"}`}>
                          {m.subject || "(No Subject)"}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 truncate mt-0.5">{m.intro}</p>
                        {extractOTP(m.subject || "") || extractOTP(m.intro || "") ? (
                          <div className="flex items-center gap-1 mt-1">
                            <KeyRound className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-bold text-primary">OTP: {extractOTP(m.subject || "") || extractOTP(m.intro || "")}</span>
                            <button
                              className="text-[10px] text-primary/70 hover:text-primary underline ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const otp = extractOTP(m.subject || "") || extractOTP(m.intro || "");
                                if (otp) { navigator.clipboard.writeText(otp); toast.success(`OTP "${otp}" copied!`); }
                              }}
                            >Copy</button>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.button>
                ))}
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

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw, Mail, Inbox, Trash2 } from "lucide-react";

const domains = ["tempbox.test", "quickmail.test", "dropmail.test", "fastinbox.test", "nomail.test"];

function randomString(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface FakeEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  time: Date;
}

const sampleEmails: { from: string; subject: string; body: string }[] = [
  { from: "noreply@service.com", subject: "Welcome to Our Platform!", body: "Thank you for signing up. Your account has been successfully created. Please verify your email to continue." },
  { from: "support@example.com", subject: "Your Verification Code: 847293", body: "Your one-time verification code is 847293. This code expires in 10 minutes. Do not share this code with anyone." },
  { from: "newsletter@updates.com", subject: "Weekly Digest - Top Stories", body: "Here are your top stories this week. Check out the latest trends and updates in technology, science, and more." },
  { from: "security@account.com", subject: "Login Alert - New Device Detected", body: "A new login was detected from Chrome on Windows. If this wasn't you, please change your password immediately." },
  { from: "promo@deals.com", subject: "🎉 50% Off - Limited Time!", body: "Don't miss our biggest sale of the year! Use code SAVE50 at checkout. Offer valid until midnight." },
];

export default function TempMail() {
  const [email, setEmail] = useState("");
  const [inbox, setInbox] = useState<FakeEmail[]>([]);
  const [selected, setSelected] = useState<FakeEmail | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateEmail = useCallback(() => {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    setEmail(`${randomString(10)}@${domain}`);
    setInbox([]);
    setSelected(null);
  }, []);

  useEffect(() => { generateEmail(); }, [generateEmail]);

  // Simulate incoming emails
  useEffect(() => {
    if (!autoRefresh || !email) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const sample = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
        const newEmail: FakeEmail = {
          id: randomString(8),
          ...sample,
          time: new Date(),
        };
        setInbox(prev => [newEmail, ...prev].slice(0, 20));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [email, autoRefresh]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email address copied!");
  };

  const clearInbox = () => {
    setInbox([]);
    setSelected(null);
    toast.success("Inbox cleared!");
  };

  const timeDiff = (d: Date) => {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  return (
    <ToolLayout title="Temp Mail" description="Get a temporary disposable email address instantly">
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Email Address */}
        <div className="tool-result-card flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary shrink-0" />
          <span className="font-mono text-sm sm:text-base font-bold flex-1 truncate gradient-text">{email}</span>
          <Button variant="ghost" size="icon" onClick={copyEmail} className="shrink-0 h-8 w-8 hover:text-primary">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={generateEmail} className="shrink-0 h-8 w-8 hover:text-primary">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{inbox.length} messages</span>
            {autoRefresh && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="rounded-lg text-xs">
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            {inbox.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearInbox} className="rounded-lg text-xs gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Inbox / Email View */}
        <div className="min-h-[300px] rounded-xl border border-border/50 bg-card overflow-hidden">
          {selected ? (
            <div className="p-4 space-y-3">
              <button onClick={() => setSelected(null)} className="text-xs text-primary hover:underline">← Back to Inbox</button>
              <h3 className="font-bold text-lg">{selected.subject}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>From: <strong>{selected.from}</strong></span>
                <span>•</span>
                <span>{selected.time.toLocaleTimeString()}</span>
              </div>
              <div className="p-4 rounded-lg bg-accent/30 border border-border/30 text-sm leading-relaxed">
                {selected.body}
              </div>
            </div>
          ) : inbox.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground/50">
              <Inbox className="w-12 h-12 mb-3" />
              <p className="font-medium">Waiting for emails...</p>
              <p className="text-xs mt-1">Emails will appear here automatically</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {inbox.map(e => (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="w-full text-left p-3 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{e.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{e.from}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">{timeDiff(e.time)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ This is a demo temp mail. Emails are simulated locally and not real. For actual temporary email, use dedicated services.
        </p>
      </div>
    </ToolLayout>
  );
}

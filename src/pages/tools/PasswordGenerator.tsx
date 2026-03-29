import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, RefreshCw, Shield, Trash2, Eye, EyeOff } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [excludeChars, setExcludeChars] = useState("");
  const [password, setPassword] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [mode, setMode] = useState<"random" | "passphrase">("random");

  const words = ["correct","horse","battery","staple","apple","orange","sunset","ocean","mountain","river","shadow","crystal","thunder","silver","golden","dragon","phoenix","falcon","tiger","wolf","storm","frost","blaze","ember","spark","nebula","comet","lunar","solar","astral","cosmic","cipher","matrix","prism","quantum","vertex","zenith","plasma","vortex","nexus"];

  const generate = useCallback(() => {
    if (mode === "passphrase") {
      const results: string[] = [];
      for (let q = 0; q < quantity; q++) {
        const count = Math.max(3, Math.floor(length / 5));
        const phrase = Array.from({ length: count }, () => {
          let w = words[Math.floor(Math.random() * words.length)];
          if (uppercase) w = w[0].toUpperCase() + w.slice(1);
          return w;
        }).join(numbers ? String(Math.floor(Math.random() * 10)) : "-");
        results.push(symbols ? phrase + "!" : phrase);
      }
      setPasswords(results);
      setPassword(results[0]);
      setHistory(prev => [...results, ...prev].slice(0, 50));
      return;
    }

    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { toast.error("Select at least one character type"); return; }

    if (excludeAmbiguous) chars = chars.replace(/[ilLI|`oO0]/g, "");
    if (excludeChars) {
      for (const c of excludeChars) chars = chars.split(c).join("");
    }

    const results: string[] = [];
    for (let q = 0; q < quantity; q++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      const pw = Array.from(arr, v => chars[v % chars.length]).join("");
      results.push(pw);
    }
    setPasswords(results);
    setPassword(results[0]);
    setHistory(prev => [...results, ...prev].slice(0, 50));
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, excludeChars, quantity, mode]);

  const entropy = () => {
    let poolSize = 0;
    if (uppercase) poolSize += 26;
    if (lowercase) poolSize += 26;
    if (numbers) poolSize += 10;
    if (symbols) poolSize += 28;
    return poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
  };

  const strength = () => {
    const e = entropy();
    if (e < 40) return { label: "Very Weak", color: "bg-red-500", pct: 20 };
    if (e < 60) return { label: "Weak", color: "bg-orange-500", pct: 40 };
    if (e < 80) return { label: "Medium", color: "bg-yellow-500", pct: 60 };
    if (e < 100) return { label: "Strong", color: "bg-green-500", pct: 80 };
    return { label: "Very Strong", color: "bg-emerald-500", pct: 100 };
  };

  const crackTime = () => {
    const e = entropy();
    const guessesPerSec = 1e10;
    const seconds = Math.pow(2, e) / guessesPerSec;
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1e6) return `${Math.round(seconds / 31536000 / 1000)}K years`;
    if (seconds < 31536000 * 1e9) return `${Math.round(seconds / 31536000 / 1e6)}M years`;
    return `${(seconds / 31536000 / 1e9).toFixed(0)}B+ years`;
  };

  const s = strength();

  return (
    <ToolLayout title="Password Generator" description="Generate ultra-secure passwords with advanced options">
      <div className="space-y-6 max-w-xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex gap-2 p-1.5 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5 rounded-2xl border border-primary/10">
          {(["random", "passphrase"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === m ? "gradient-bg text-white shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-accent/40"}`}>
              {m === "random" ? "🔐 Random" : "📝 Passphrase"}
            </button>
          ))}
        </div>

        {/* Length */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold">{mode === "passphrase" ? "Approximate Length" : "Password Length"}: {length}</label>
            <span className="text-xs text-muted-foreground">{entropy()} bits entropy</span>
          </div>
          <Slider value={[length]} onValueChange={([v]) => setLength(v)} min={4} max={128} step={1} />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Uppercase (A-Z)", checked: uppercase, set: setUppercase },
            { label: "Lowercase (a-z)", checked: lowercase, set: setLowercase },
            { label: "Numbers (0-9)", checked: numbers, set: setNumbers },
            { label: "Symbols (!@#$)", checked: symbols, set: setSymbols },
            { label: "No Ambiguous (0O, 1lI)", checked: excludeAmbiguous, set: setExcludeAmbiguous },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={opt.checked} onCheckedChange={c => opt.set(!!c)} />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Exclude specific */}
        <Input value={excludeChars} onChange={e => setExcludeChars(e.target.value)} placeholder="Exclude specific characters..." className="rounded-xl" />

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold whitespace-nowrap">Generate:</label>
          <div className="flex gap-1">
            {[1,5,10,25].map(n => (
              <button key={n} onClick={() => setQuantity(n)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${quantity === n ? "bg-primary text-primary-foreground" : "bg-accent/50 text-muted-foreground hover:text-foreground"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={generate} className="w-full gradient-bg text-primary-foreground rounded-xl font-bold" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" /> Generate Password{quantity > 1 ? "s" : ""}
        </Button>

        {/* Result */}
        {password && (
          <div className="space-y-3">
            <div className="bg-accent/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <code className="text-lg font-mono font-bold break-all flex-1 select-all">
                  {showPassword ? password : "•".repeat(password.length)}
                </code>
                <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-muted-foreground flex items-center gap-1"><Shield className="w-3 h-3" />Crack time: {crackTime()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="rounded-xl gap-1.5 flex-1" onClick={() => { navigator.clipboard.writeText(password); toast.success("Copied!"); }}>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={generate}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Multiple passwords */}
            {passwords.length > 1 && (
              <div className="bg-card rounded-xl border border-border/50 max-h-60 overflow-y-auto">
                {passwords.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-border/20 last:border-0 hover:bg-accent/20">
                    <code className="text-xs font-mono truncate flex-1 mr-2">{p}</code>
                    <button onClick={() => { navigator.clipboard.writeText(p); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="p-2">
                  <Button variant="outline" size="sm" className="w-full rounded-lg text-xs" onClick={() => { navigator.clipboard.writeText(passwords.join("\n")); toast.success("All copied!"); }}>
                    Copy All ({passwords.length})
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-accent/30 border-b border-border/30">
              <span className="text-xs font-bold">📋 History ({history.length})</span>
              <button onClick={() => setHistory([])} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {history.slice(0, 20).map((h, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 border-b border-border/10 last:border-0 text-xs hover:bg-accent/10">
                  <code className="font-mono truncate flex-1 mr-2">{h}</code>
                  <button onClick={() => { navigator.clipboard.writeText(h); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Terminal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PERMS = ["Read", "Write", "Execute"] as const;
const TARGETS = ["Owner", "Group", "Others"] as const;
const PERM_VALUES = [4, 2, 1];

const PRESETS = [
  { label: "755", desc: "Standard executable" },
  { label: "644", desc: "Standard file" },
  { label: "777", desc: "Full access (unsafe)" },
  { label: "600", desc: "Owner only read/write" },
  { label: "700", desc: "Owner only full" },
  { label: "664", desc: "Owner & group read/write" },
];

export default function ChmodCalculator() {
  const [perms, setPerms] = useState([
    [true, true, true],   // owner: rwx
    [true, false, true],  // group: r-x
    [true, false, true],  // others: r-x
  ]);

  const toggle = (target: number, perm: number) => {
    const next = perms.map((t, ti) => ti === target ? t.map((p, pi) => pi === perm ? !p : p) : [...t]);
    setPerms(next);
  };

  const octal = useMemo(() => perms.map(t => t.reduce((s, p, i) => s + (p ? PERM_VALUES[i] : 0), 0)).join(""), [perms]);
  const symbolic = useMemo(() => {
    return perms.map(t => (t[0] ? "r" : "-") + (t[1] ? "w" : "-") + (t[2] ? "x" : "-")).join("");
  }, [perms]);

  const setFromOctal = (val: string) => {
    if (/^[0-7]{3}$/.test(val)) {
      setPerms(val.split("").map(d => {
        const n = parseInt(d);
        return [!!(n & 4), !!(n & 2), !!(n & 1)];
      }));
    }
  };

  const targetColors = ["hsl(145, 80%, 42%)", "hsl(200, 85%, 48%)", "hsl(35, 90%, 50%)"];

  return (
    <ToolLayout toolId="chmod-calculator" title="Chmod Calculator" description="Calculate Unix file permissions easily"
      icon={Terminal} color="hsl(120, 60%, 40%)">
      <div className="space-y-6">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <Button key={p.label} variant="outline" size="sm" onClick={() => setFromOctal(p.label)}
              className="border-[hsl(120,60%,40%)]/30 hover:bg-[hsl(120,60%,40%)]/10">
              <Terminal className="w-3 h-3 mr-1" />{p.label} <span className="text-muted-foreground ml-1">({p.desc})</span>
            </Button>
          ))}
        </div>

        {/* Permission Matrix */}
        <div className="p-5 rounded-2xl border border-[hsl(120,60%,40%)]/20 bg-card/80">
          <div className="grid grid-cols-4 gap-3">
            <div />
            {PERMS.map(p => (
              <div key={p} className="text-center text-xs font-bold text-muted-foreground uppercase">{p}</div>
            ))}
            {TARGETS.map((target, ti) => (
              <>
                <div key={target} className="text-sm font-bold flex items-center" style={{ color: targetColors[ti] }}>{target}</div>
                {PERMS.map((_, pi) => (
                  <div key={`${ti}-${pi}`} className="flex justify-center">
                    <button
                      onClick={() => toggle(ti, pi)}
                      className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                        perms[ti][pi]
                          ? "text-white shadow-lg"
                          : "bg-accent/50 text-muted-foreground/40 hover:bg-accent"
                      }`}
                      style={perms[ti][pi] ? { backgroundColor: targetColors[ti] } : {}}
                    >
                      {["r", "w", "x"][pi]}
                    </button>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-[hsl(120,60%,40%)]/20 bg-card/80 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Octal</p>
            <p className="text-4xl font-black font-mono text-[hsl(120,60%,40%)]">{octal}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { navigator.clipboard.writeText(octal); toast.success("Copied!"); }}>
              <Copy className="w-3 h-3 mr-1" />Copy
            </Button>
          </div>
          <div className="p-5 rounded-2xl border border-border/40 bg-card/80 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Symbolic</p>
            <p className="text-3xl font-black font-mono text-primary">{symbolic}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { navigator.clipboard.writeText(symbolic); toast.success("Copied!"); }}>
              <Copy className="w-3 h-3 mr-1" />Copy
            </Button>
          </div>
        </div>

        {/* Command */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
          <h3 className="text-sm font-bold mb-3">Commands</h3>
          <div className="space-y-2">
            {[`chmod ${octal} filename`, `chmod ${octal} -R directory/`].map(cmd => (
              <div key={cmd} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 font-mono text-sm cursor-pointer hover:bg-accent/30 transition-all"
                onClick={() => { navigator.clipboard.writeText(cmd); toast.success("Copied!"); }}>
                <span className="text-[hsl(120,60%,40%)]">$</span>
                <span className="flex-1">{cmd}</span>
                <Copy className="w-3 h-3 text-muted-foreground/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Manual Octal Input */}
        <div className="p-5 rounded-2xl border border-border/40 bg-card/80">
          <h3 className="text-sm font-bold mb-3">Enter Octal Directly</h3>
          <Input maxLength={3} placeholder="e.g. 755" className="font-mono text-center text-xl max-w-[120px]"
            onChange={e => setFromOctal(e.target.value)} />
        </div>
      </div>
    </ToolLayout>
  );
}

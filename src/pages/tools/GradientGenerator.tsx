import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Paintbrush, Copy, RefreshCw, ArrowRight } from "lucide-react";

const presets = [
  { name: "Sunset", from: "#ff512f", to: "#dd2476" },
  { name: "Ocean", from: "#2193b0", to: "#6dd5ed" },
  { name: "Forest", from: "#11998e", to: "#38ef7d" },
  { name: "Purple", from: "#8e2de2", to: "#4a00e0" },
  { name: "Fire", from: "#f12711", to: "#f5af19" },
  { name: "Night", from: "#0f0c29", to: "#302b63" },
  { name: "Peach", from: "#ed6ea0", to: "#ec8c69" },
  { name: "Sky", from: "#56ccf2", to: "#2f80ed" },
  { name: "Gold", from: "#f7971e", to: "#ffd200" },
  { name: "Rose", from: "#ee9ca7", to: "#ffdde1" },
];

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#7c3aed");
  const [color2, setColor2] = useState("#06b6d4");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const css = useMemo(() => {
    if (type === "linear") return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    return `radial-gradient(circle, ${color1}, ${color2})`;
  }, [color1, color2, angle, type]);

  const tailwind = `bg-gradient-to-r from-[${color1}] to-[${color2}]`;

  const randomize = () => {
    setColor1("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
    setColor2("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <ToolLayout title="CSS Gradient Generator" description="Create beautiful CSS gradients with preview and copy code">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Preview */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
          className="h-48 rounded-2xl shadow-lg border border-primary/10 overflow-hidden" style={{ background: css }}>
          <div className="h-full flex items-center justify-center">
            <span className="text-white text-lg font-black drop-shadow-lg px-6 py-2 rounded-xl backdrop-blur-sm bg-white/10">{css.slice(0, 40)}...</span>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="tool-section-card p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Paintbrush className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Customize</h3>
          </div>
          <div className="flex gap-2 mb-2">
            {(["linear", "radial"] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${type === t ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10 hover:bg-primary/20"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-2 border-primary/20" />
              <span className="font-mono text-xs font-bold">{color1}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-1">
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-2 border-primary/20" />
              <span className="font-mono text-xs font-bold">{color2}</span>
            </div>
          </div>
          {type === "linear" && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Angle:</span>
              <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="flex-1 accent-primary" />
              <span className="font-bold text-sm w-10 text-center">{angle}°</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { navigator.clipboard.writeText(`background: ${css};`); toast.success("CSS copied!"); }} className="tool-btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
            <Copy className="w-4 h-4" /> Copy CSS
          </button>
          <button onClick={randomize} className="tool-btn-primary px-5 py-3 flex items-center gap-1.5 text-sm" style={{ background: "linear-gradient(135deg, hsl(270 80% 60%), hsl(270 80% 50%))" }}>
            <RefreshCw className="w-4 h-4" /> Random
          </button>
        </div>

        {/* Code Output */}
        <div className="tool-section-card p-4 space-y-3">
          <h3 className="text-sm font-bold gradient-text">📋 Code</h3>
          <div className="space-y-2">
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] text-muted-foreground font-semibold mb-1">CSS</p>
              <code className="font-mono text-xs break-all">background: {css};</code>
            </div>
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] text-muted-foreground font-semibold mb-1">Tailwind</p>
              <code className="font-mono text-xs break-all">{tailwind}</code>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="tool-section-card p-4">
          <h3 className="text-sm font-bold gradient-text mb-3">🎨 Presets</h3>
          <div className="grid grid-cols-5 gap-2">
            {presets.map(p => (
              <button key={p.name} onClick={() => { setColor1(p.from); setColor2(p.to); }}
                className="h-14 rounded-xl shadow-md hover:scale-105 transition-transform border-2 border-white/20"
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                title={p.name} />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

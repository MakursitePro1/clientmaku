import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Palette, Copy, RefreshCw, Pipette, Sparkles } from "lucide-react";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generatePalette(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h } = rgbToHsl(r, g, b);
  return [0, 30, 60, 120, 180, 210, 270, 330].map(offset => {
    const newH = (h + offset) % 360;
    return `hsl(${newH}, 70%, 55%)`;
  });
}

function randomHex() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

export default function ColorPicker() {
  const [color, setColor] = useState("#7c3aed");
  const [history, setHistory] = useState<string[]>([]);

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = generatePalette(color);

  const copyVal = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success(`Copied: ${val}`);
  };

  const setNewColor = useCallback((c: string) => {
    setColor(c);
    setHistory(prev => [c, ...prev.filter(x => x !== c)].slice(0, 12));
  }, []);

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
  ];

  return (
    <ToolLayout title="Color Picker" description="Pick colors, convert formats, and generate palettes instantly">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Color Display */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tool-result-card overflow-hidden">
          <div className="h-40 rounded-xl relative overflow-hidden" style={{ background: color }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black px-4 py-2 rounded-xl backdrop-blur-md" style={{ color: hsl.l > 50 ? "#000" : "#fff", background: hsl.l > 50 ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Picker Controls */}
        <div className="tool-section-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pipette className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold gradient-text">Pick a Color</h3>
          </div>
          <div className="flex gap-3 items-center">
            <input type="color" value={color} onChange={e => setNewColor(e.target.value)} className="w-14 h-14 rounded-xl cursor-pointer border-2 border-primary/20" />
            <Input value={color} onChange={e => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) setNewColor(e.target.value); }} className="tool-input-colorful rounded-xl flex-1 font-mono font-bold" maxLength={7} />
            <button onClick={() => setNewColor(randomHex())} className="tool-btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm shrink-0">
              <RefreshCw className="w-4 h-4" /> Random
            </button>
          </div>
        </div>

        {/* Color Formats */}
        <div className="grid grid-cols-2 gap-3">
          {formats.map(f => (
            <motion.button key={f.label} whileTap={{ scale: 0.97 }} onClick={() => copyVal(f.value)}
              className="tool-stat-card cursor-pointer hover:shadow-lg transition-shadow group">
              <p className="text-[10px] text-muted-foreground font-bold uppercase">{f.label}</p>
              <p className="font-mono text-sm font-bold mt-1 truncate">{f.value}</p>
              <Copy className="w-3 h-3 mx-auto mt-1 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Harmony Palette */}
        <div className="tool-section-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-bold gradient-text">Color Harmony Palette</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {palette.map((c, i) => (
              <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={() => copyVal(c)}
                className="w-12 h-12 rounded-xl shadow-md border-2 border-white/20 transition-all"
                style={{ background: c }} title={c} />
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="tool-section-card p-4">
            <h3 className="text-sm font-bold gradient-text mb-3">🕐 Recent Colors</h3>
            <div className="flex gap-2 flex-wrap">
              {history.map((c, i) => (
                <motion.button key={i} whileHover={{ scale: 1.15 }}
                  onClick={() => setNewColor(c)}
                  className="w-10 h-10 rounded-lg shadow-md border-2 border-white/20"
                  style={{ background: c }} title={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

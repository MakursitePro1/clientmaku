import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Lock, Unlock, Check } from "lucide-react";

interface Color {
  hex: string;
  locked: boolean;
}

const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

const hexToHSL = (hex: string) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState<Color[]>(
    Array.from({ length: 5 }, () => ({ hex: randomHex(), locked: false }))
  );
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    setColors((prev) => prev.map((c) => (c.locked ? c : { ...c, hex: randomHex() })));
  }, []);

  const toggleLock = (idx: number) => {
    setColors((prev) => prev.map((c, i) => (i === idx ? { ...c, locked: !c.locked } : c)));
  };

  const copyHex = (hex: string, idx: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(colors.map((c) => c.hex).join(", "));
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const textColor = (hex: string) => {
    const { l } = hexToHSL(hex);
    return l > 55 ? "#000000" : "#ffffff";
  };

  return (
    <ToolLayout title="Color Palette Generator" description="Generate beautiful color palettes with one click">
      <div className="space-y-6">
        <div className="flex gap-3 flex-wrap">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">
            <RefreshCw className="w-4 h-4 mr-2" /> Generate Palette
          </Button>
          <Button onClick={copyAll} variant="outline" className="rounded-xl">
            {copiedIdx === -1 ? <><Check className="w-4 h-4 mr-2" />Copied All</> : <><Copy className="w-4 h-4 mr-2" />Copy All</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 min-h-[300px]">
          {colors.map((color, idx) => {
            const tc = textColor(color.hex);
            const hsl = hexToHSL(color.hex);
            return (
              <div
                key={idx}
                className="rounded-2xl flex flex-col items-center justify-end p-5 transition-all hover:scale-[1.02] cursor-pointer relative group"
                style={{ backgroundColor: color.hex, minHeight: "200px" }}
                onClick={() => copyHex(color.hex, idx)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLock(idx); }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                  {color.locked ? <Lock className="w-4 h-4" style={{ color: tc }} /> : <Unlock className="w-4 h-4" style={{ color: tc }} />}
                </button>
                <div className="text-center" style={{ color: tc }}>
                  <div className="font-bold text-lg uppercase">{color.hex}</div>
                  <div className="text-xs opacity-70 mt-1">H:{hsl.h} S:{hsl.s}% L:{hsl.l}%</div>
                  <div className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedIdx === idx ? "Copied!" : "Click to copy"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Press <kbd className="px-2 py-1 rounded bg-accent border border-border text-xs font-mono">Space</kbd> to generate • Click a color to copy • Lock colors to keep them
        </p>
      </div>
    </ToolLayout>
  );
}

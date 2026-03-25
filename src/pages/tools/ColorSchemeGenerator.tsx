import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

type Harmony = "complementary" | "analogous" | "triadic" | "split" | "tetradic";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
  return `#${[f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("")}`;
}

function generateScheme(hex: string, harmony: Harmony): string[] {
  const [h, s, l] = hexToHsl(hex);
  switch (harmony) {
    case "complementary": return [hex, hslToHex((h + 180) % 360, s, l)];
    case "analogous": return [hslToHex((h - 30 + 360) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)];
    case "triadic": return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case "split": return [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    case "tetradic": return [hex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
  }
}

export default function ColorSchemeGenerator() {
  const [baseColor, setBaseColor] = useState("#7c3aed");
  const [harmony, setHarmony] = useState<Harmony>("triadic");

  const scheme = generateScheme(baseColor, harmony);
  const harmonies: Harmony[] = ["complementary", "analogous", "triadic", "split", "tetradic"];

  return (
    <ToolLayout title="Color Scheme Generator" description="Generate harmonious color schemes">
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex gap-3 items-center">
          <Input type="color" value={baseColor} onChange={e => setBaseColor(e.target.value)} className="w-16 h-12 rounded-xl cursor-pointer p-1" />
          <Input value={baseColor} onChange={e => setBaseColor(e.target.value)} className="rounded-xl font-mono" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {harmonies.map(h => (
            <Button key={h} variant={harmony === h ? "default" : "outline"} className="rounded-xl capitalize" onClick={() => setHarmony(h)}>{h}</Button>
          ))}
        </div>
        <div className="flex rounded-2xl overflow-hidden h-40">
          {scheme.map((c, i) => (
            <div key={i} className="flex-1 flex items-end justify-center pb-3 cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: c }} onClick={() => navigator.clipboard.writeText(c)}>
              <span className="text-xs font-mono px-2 py-1 rounded-lg bg-black/40 text-white">{c}</span>
            </div>
          ))}
        </div>
        <Button onClick={() => navigator.clipboard.writeText(scheme.join(", "))} variant="outline" className="rounded-xl"><Copy className="w-4 h-4 mr-2" /> Copy All Colors</Button>
      </div>
    </ToolLayout>
  );
}

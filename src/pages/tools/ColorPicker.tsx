import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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

const presetPalettes = [
  ["#7c3aed", "#a855f7", "#c084fc", "#e9d5ff", "#faf5ff"],
  ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"],
  ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"],
  ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  ["#fef9ef", "#f8e8d4", "#d4a373", "#ccd5ae", "#e9edc9"],
];

export default function ColorPicker() {
  const [color, setColor] = useState("#7c3aed");
  const [savedColors, setSavedColors] = useState<string[]>([]);

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const copyColor = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied!", description: value });
  };

  const saveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color]);
    }
  };

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
  ];

  return (
    <ToolLayout title="Color Picker" description="Pick colors and convert between formats">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="space-y-3">
            <div
              className="w-48 h-48 rounded-2xl border border-border cursor-pointer shadow-lg"
              style={{ backgroundColor: color }}
              onClick={() => document.getElementById("color-input")?.click()}
            />
            <input
              id="color-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-48 h-10 rounded-xl cursor-pointer"
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            {formats.map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-accent/50 rounded-xl px-5 py-3">
                <span className="font-semibold text-sm w-14 shrink-0">{f.label}</span>
                <code className="text-sm font-mono flex-1">{f.value}</code>
                <Button variant="ghost" size="sm" onClick={() => copyColor(f.value)}>Copy</Button>
              </div>
            ))}
            <Button onClick={saveColor} variant="outline" className="rounded-xl w-full">Save Color</Button>
          </div>
        </div>

        {/* Saved colors */}
        {savedColors.length > 0 && (
          <div>
            <label className="text-sm font-semibold mb-3 block">Saved Colors</label>
            <div className="flex flex-wrap gap-2">
              {savedColors.map((c, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-xl border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preset Palettes */}
        <div>
          <label className="text-sm font-semibold mb-3 block">Preset Palettes</label>
          <div className="space-y-3">
            {presetPalettes.map((palette, i) => (
              <div key={i} className="flex gap-2">
                {palette.map((c) => (
                  <button
                    key={c}
                    className="flex-1 h-12 rounded-xl border border-border hover:scale-105 transition-transform"
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    title={c}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

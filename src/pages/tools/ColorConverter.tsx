import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

function hexToRgb(hex: string) {
  const m = hex.replace("#","").match(/.{2}/g);
  return m ? m.map(x => parseInt(x, 16)) : [0,0,0];
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), l = (max+min)/2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max === r) h = ((g-b)/d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b-r)/d + 2) / 6;
    else h = ((r-g)/d + 4) / 6;
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#7c3aed");
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);

  return (
    <ToolLayout title="Color Converter" description="Convert colors between HEX, RGB, and HSL">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="w-full h-32 rounded-2xl border" style={{ backgroundColor: hex }} />
        <Input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
        {[
          { label: "HEX", value: hex.toUpperCase() },
          { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
          { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 bg-accent/50 rounded-xl px-5 py-3">
            <span className="font-semibold text-sm w-12">{item.label}</span>
            <code className="text-sm font-mono text-primary flex-1">{item.value}</code>
            <button onClick={() => navigator.clipboard.writeText(item.value)} className="text-xs text-muted-foreground hover:text-primary">Copy</button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

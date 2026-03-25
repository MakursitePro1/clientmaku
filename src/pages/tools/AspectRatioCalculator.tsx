import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

export default function AspectRatioCalculator() {
  const [w, setW] = useState(1920);
  const [h, setH] = useState(1080);
  const g = gcd(w, h);
  const rw = g ? w / g : 0;
  const rh = g ? h / g : 0;

  const common = [
    { label: "16:9", w: 1920, h: 1080 },
    { label: "4:3", w: 1024, h: 768 },
    { label: "1:1", w: 1080, h: 1080 },
    { label: "21:9", w: 2560, h: 1080 },
    { label: "9:16", w: 1080, h: 1920 },
  ];

  return (
    <ToolLayout title="Aspect Ratio Calculator" description="Calculate and convert aspect ratios">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-semibold mb-1 block">Width</label><Input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="rounded-xl" /></div>
          <div><label className="text-sm font-semibold mb-1 block">Height</label><Input type="number" value={h} onChange={e => setH(Number(e.target.value))} className="rounded-xl" /></div>
        </div>
        <div className="bg-accent/50 rounded-2xl p-6 text-center">
          <div className="text-4xl font-extrabold gradient-text">{rw}:{rh}</div>
          <p className="text-sm text-muted-foreground mt-2">Aspect Ratio</p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {common.map(c => (
            <button key={c.label} onClick={() => { setW(c.w); setH(c.h); }} className="bg-accent/50 rounded-xl p-3 text-center hover:bg-accent transition-colors">
              <div className="text-xs font-semibold">{c.label}</div>
              <div className="text-[10px] text-muted-foreground">{c.w}×{c.h}</div>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ColorMixer() {
  const [c1, setC1] = useState("#ff0000");
  const [c2, setC2] = useState("#0000ff");
  const [ratio, setRatio] = useState(50);

  const hexToRgb = (h: string) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const rgbToHex = (r: number, g: number, b: number) => "#" + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,"0")).join("");

  const r1 = hexToRgb(c1), r2 = hexToRgb(c2);
  const t = ratio / 100;
  const mixed = rgbToHex(r1[0]*(1-t)+r2[0]*t, r1[1]*(1-t)+r2[1]*t, r1[2]*(1-t)+r2[2]*t);

  const steps = Array.from({length: 9}, (_, i) => {
    const s = (i+1)/10;
    return rgbToHex(r1[0]*(1-s)+r2[0]*s, r1[1]*(1-s)+r2[1]*s, r1[2]*(1-s)+r2[2]*s);
  });

  return (
    <ToolLayout title="Color Mixer" description="Mix two colors and generate gradients between them">
      <div className="space-y-5 max-w-md mx-auto">
        <div className="flex gap-4 items-center">
          <div className="flex-1 text-center">
            <Input type="color" value={c1} onChange={e => setC1(e.target.value)} className="w-16 h-16 p-1 mx-auto rounded-xl cursor-pointer" />
            <p className="text-xs font-mono mt-1">{c1}</p>
          </div>
          <span className="text-2xl font-bold text-muted-foreground">+</span>
          <div className="flex-1 text-center">
            <Input type="color" value={c2} onChange={e => setC2(e.target.value)} className="w-16 h-16 p-1 mx-auto rounded-xl cursor-pointer" />
            <p className="text-xs font-mono mt-1">{c2}</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Mix Ratio: {ratio}%</label>
          <input type="range" min={0} max={100} value={ratio} onChange={e => setRatio(Number(e.target.value))} className="w-full" />
        </div>
        <div className="text-center">
          <div className="w-24 h-24 rounded-2xl mx-auto border border-border" style={{ backgroundColor: mixed }} />
          <button onClick={() => { navigator.clipboard.writeText(mixed); toast.success("Copied!"); }} className="text-lg font-mono font-bold mt-2 hover:underline">{mixed}</button>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Gradient Steps</p>
          <div className="flex rounded-xl overflow-hidden border border-border">
            {[c1, ...steps, c2].map((c, i) => (
              <button key={i} onClick={() => { navigator.clipboard.writeText(c); toast.success(`${c} copied!`); }} className="flex-1 h-12 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

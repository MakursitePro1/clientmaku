import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BoxShadowGenerator() {
  const [x, setX] = useState(5);
  const [y, setY] = useState(5);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#00000040");
  const [inset, setInset] = useState(false);

  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  const css = `box-shadow: ${shadow};`;

  const controls = [
    { label: "X Offset", value: x, set: setX, min: -50, max: 50 },
    { label: "Y Offset", value: y, set: setY, min: -50, max: 50 },
    { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
    { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
  ];

  return (
    <ToolLayout title="Box Shadow Generator" description="Create CSS box shadows visually">
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="flex items-center justify-center p-12">
          <div className="w-48 h-48 bg-card rounded-2xl border" style={{ boxShadow: shadow }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {controls.map(c => (
            <div key={c.label}>
              <label className="text-xs font-semibold mb-1 block">{c.label}: {c.value}px</label>
              <input type="range" min={c.min} max={c.max} value={c.value} onChange={e => c.set(Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <Input type="color" value={color.slice(0,7)} onChange={e => setColor(e.target.value + "40")} className="w-16 h-10 rounded-xl p-1 cursor-pointer" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} /> Inset</label>
        </div>
        <div className="bg-accent/50 rounded-xl p-4"><code className="text-sm font-mono">{css}</code></div>
        <Button onClick={() => navigator.clipboard.writeText(css)} className="gradient-bg text-primary-foreground rounded-xl">Copy CSS</Button>
      </div>
    </ToolLayout>
  );
}

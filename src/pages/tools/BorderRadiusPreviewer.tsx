import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function BorderRadiusPreviewer() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);

  const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${radius};`;

  const controls = [
    { label: "Top Left", value: tl, set: setTl },
    { label: "Top Right", value: tr, set: setTr },
    { label: "Bottom Right", value: br, set: setBr },
    { label: "Bottom Left", value: bl, set: setBl },
  ];

  return (
    <ToolLayout title="Border Radius Previewer" description="Visualize and generate CSS border-radius">
      <div className="space-y-6 max-w-xl mx-auto text-center">
        <div className="flex justify-center p-8">
          <div className="w-48 h-48 gradient-bg" style={{ borderRadius: radius }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {controls.map(c => (
            <div key={c.label}>
              <label className="text-xs font-semibold mb-1 block">{c.label}: {c.value}px</label>
              <input type="range" min={0} max={100} value={c.value} onChange={e => c.set(Number(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>
        <div className="bg-accent/50 rounded-xl p-4"><code className="text-sm font-mono">{css}</code></div>
        <Button onClick={() => navigator.clipboard.writeText(css)} className="gradient-bg text-primary-foreground rounded-xl">Copy CSS</Button>
      </div>
    </ToolLayout>
  );
}

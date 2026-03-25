import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GradientGenerator() {
  const [c1, setC1] = useState("#7c3aed");
  const [c2, setC2] = useState("#06b6d4");
  const [angle, setAngle] = useState("135");
  const [type, setType] = useState("linear");

  const gradient = type === "linear" ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`;
  const css = `background: ${gradient};`;

  return (
    <ToolLayout title="CSS Gradient Generator" description="Create beautiful CSS gradients visually">
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="w-full h-48 rounded-2xl border" style={{ background: gradient }} />
        <div className="flex gap-3 flex-wrap">
          <Input type="color" value={c1} onChange={e => setC1(e.target.value)} className="w-16 h-10 rounded-xl cursor-pointer p-1" />
          <Input type="color" value={c2} onChange={e => setC2(e.target.value)} className="w-16 h-10 rounded-xl cursor-pointer p-1" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="linear">Linear</SelectItem><SelectItem value="radial">Radial</SelectItem></SelectContent>
          </Select>
          {type === "linear" && <Input type="number" value={angle} onChange={e => setAngle(e.target.value)} className="w-24 rounded-xl" placeholder="Angle" />}
        </div>
        <div className="bg-accent/50 rounded-xl p-4">
          <code className="text-sm font-mono break-all">{css}</code>
        </div>
        <Button onClick={() => navigator.clipboard.writeText(css)} className="gradient-bg text-primary-foreground rounded-xl">Copy CSS</Button>
      </div>
    </ToolLayout>
  );
}

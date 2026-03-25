import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy } from "lucide-react";

export default function GridGenerator() {
  const [cols, setCols] = useState([3]);
  const [rows, setRows] = useState([3]);
  const [gap, setGap] = useState([16]);
  const [colTemplate, setColTemplate] = useState("1fr 1fr 1fr");
  const [rowTemplate, setRowTemplate] = useState("1fr 1fr 1fr");

  const css = `display: grid;\ngrid-template-columns: ${colTemplate};\ngrid-template-rows: ${rowTemplate};\ngap: ${gap[0]}px;`;

  const updateCols = (v: number[]) => { setCols(v); setColTemplate(Array(v[0]).fill("1fr").join(" ")); };
  const updateRows = (v: number[]) => { setRows(v); setRowTemplate(Array(v[0]).fill("1fr").join(" ")); };

  return (
    <ToolLayout title="CSS Grid Generator" description="Visual CSS grid layout builder">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          <div className="flex items-center gap-3"><span className="text-sm w-20">Cols: {cols[0]}</span><Slider value={cols} onValueChange={updateCols} min={1} max={8} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-20">Rows: {rows[0]}</span><Slider value={rows} onValueChange={updateRows} min={1} max={8} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-20">Gap: {gap[0]}px</span><Slider value={gap} onValueChange={setGap} min={0} max={40} className="flex-1" /></div>
        </div>
        <div className="flex gap-3">
          <Input value={colTemplate} onChange={e => setColTemplate(e.target.value)} placeholder="Column template" className="rounded-xl" />
          <Input value={rowTemplate} onChange={e => setRowTemplate(e.target.value)} placeholder="Row template" className="rounded-xl" />
        </div>
        <div className="border border-border rounded-2xl p-4" style={{ display: "grid", gridTemplateColumns: colTemplate, gridTemplateRows: rowTemplate, gap: gap[0] }}>
          {Array.from({ length: cols[0] * rows[0] }, (_, i) => (
            <div key={i} className="rounded-xl flex items-center justify-center text-sm font-medium h-20" style={{ background: `hsl(${(i * 40) % 360} 70% 85% / 0.3)`, border: "1px dashed hsl(var(--border))" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="bg-accent/30 rounded-xl p-4"><pre className="text-sm font-mono whitespace-pre-wrap">{css}</pre></div>
        <Button onClick={() => navigator.clipboard.writeText(css)} className="gradient-bg text-primary-foreground rounded-xl"><Copy className="w-4 h-4 mr-2" /> Copy CSS</Button>
      </div>
    </ToolLayout>
  );
}

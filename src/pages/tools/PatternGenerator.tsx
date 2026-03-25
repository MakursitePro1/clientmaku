import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const patternTypes = ["dots", "lines", "grid", "diagonal", "circles", "zigzag"];

export default function PatternGenerator() {
  const [pattern, setPattern] = useState("dots");
  const [color1, setColor1] = useState("#7c3aed");
  const [color2, setColor2] = useState("#1a1a2e");
  const [spacing, setSpacing] = useState([20]);
  const [elementSize, setElementSize] = useState([4]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 400; canvas.height = 400;
    ctx.fillStyle = color2; ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = color1; ctx.strokeStyle = color1; ctx.lineWidth = elementSize[0] / 2;
    const s = spacing[0]; const es = elementSize[0];
    for (let x = 0; x < 400; x += s) {
      for (let y = 0; y < 400; y += s) {
        if (pattern === "dots") { ctx.beginPath(); ctx.arc(x, y, es, 0, Math.PI * 2); ctx.fill(); }
        else if (pattern === "lines") { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke(); break; }
        else if (pattern === "grid") { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke(); }
        else if (pattern === "diagonal") { ctx.beginPath(); ctx.moveTo(x - 400, y); ctx.lineTo(x + 400, y + 400); ctx.stroke(); break; }
        else if (pattern === "circles") { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s / 3, 0, Math.PI * 2); ctx.stroke(); }
        else if (pattern === "zigzag") { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s / 2, y + s / 2); ctx.lineTo(x + s, y); ctx.stroke(); break; }
      }
    }
  }, [pattern, color1, color2, spacing, elementSize]);

  const download = () => {
    const a = document.createElement("a"); a.href = canvasRef.current!.toDataURL("image/png"); a.download = `pattern_${pattern}.png`; a.click();
  };

  return (
    <ToolLayout title="Pattern Generator" description="Create seamless background patterns">
      <div className="space-y-6 max-w-lg mx-auto">
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border" />
        <Select value={pattern} onValueChange={setPattern}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{patternTypes.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
        </Select>
        <div className="flex gap-3">
          <div className="flex-1"><label className="text-xs">Pattern Color</label><Input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-full h-10 rounded-xl p-1" /></div>
          <div className="flex-1"><label className="text-xs">Background</label><Input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-10 rounded-xl p-1" /></div>
        </div>
        <div className="flex items-center gap-3"><span className="text-sm w-20">Spacing: {spacing[0]}</span><Slider value={spacing} onValueChange={setSpacing} min={5} max={60} className="flex-1" /></div>
        <div className="flex items-center gap-3"><span className="text-sm w-20">Size: {elementSize[0]}</span><Slider value={elementSize} onValueChange={setElementSize} min={1} max={20} className="flex-1" /></div>
        <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl w-full">Download Pattern</Button>
      </div>
    </ToolLayout>
  );
}

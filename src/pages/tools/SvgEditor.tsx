import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

export default function SvgEditor() {
  const [shape, setShape] = useState("circle");
  const [fill, setFill] = useState("#7c3aed");
  const [stroke, setStroke] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState("2");
  const [size, setSize] = useState("200");

  const s = parseInt(size);
  const svgContent = (() => {
    const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"`;
    switch (shape) {
      case "circle": return `<circle cx="${s/2}" cy="${s/2}" r="${s/2 - 10}" ${common} />`;
      case "rect": return `<rect x="10" y="10" width="${s-20}" height="${s-20}" rx="8" ${common} />`;
      case "triangle": return `<polygon points="${s/2},10 ${s-10},${s-10} 10,${s-10}" ${common} />`;
      case "star": {
        const cx = s / 2, cy = s / 2, r1 = s / 2 - 10, r2 = r1 * 0.4;
        const pts = Array.from({ length: 10 }, (_, i) => {
          const r = i % 2 === 0 ? r1 : r2;
          const a = (Math.PI / 5) * i - Math.PI / 2;
          return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        }).join(" ");
        return `<polygon points="${pts}" ${common} />`;
      }
      case "hexagon": {
        const cx = s / 2, cy = s / 2, r = s / 2 - 10;
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        }).join(" ");
        return `<polygon points="${pts}" ${common} />`;
      }
      default: return "";
    }
  })();

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">\n  ${svgContent}\n</svg>`;

  const download = () => {
    const blob = new Blob([fullSvg], { type: "image/svg+xml" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${shape}.svg`; a.click();
  };

  return (
    <ToolLayout title="SVG Editor" description="Create and edit SVG shapes visually">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center p-8 bg-accent/20 rounded-2xl" dangerouslySetInnerHTML={{ __html: fullSvg }} />
        <div className="flex gap-3 flex-wrap">
          <Select value={shape} onValueChange={setShape}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{["circle", "rect", "triangle", "star", "hexagon"].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="color" value={fill} onChange={e => setFill(e.target.value)} className="w-14 h-10 rounded-xl p-1" title="Fill" />
          <Input type="color" value={stroke} onChange={e => setStroke(e.target.value)} className="w-14 h-10 rounded-xl p-1" title="Stroke" />
          <Input type="number" value={strokeWidth} onChange={e => setStrokeWidth(e.target.value)} className="w-20 rounded-xl" placeholder="Stroke" />
          <Input type="number" value={size} onChange={e => setSize(e.target.value)} className="w-24 rounded-xl" placeholder="Size" />
        </div>
        <div className="bg-accent/30 rounded-xl p-4"><pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">{fullSvg}</pre></div>
        <div className="flex gap-3">
          <Button onClick={() => navigator.clipboard.writeText(fullSvg)} variant="outline" className="rounded-xl">Copy SVG</Button>
          <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl"><Download className="w-4 h-4 mr-2" /> Download SVG</Button>
        </div>
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function IconGenerator() {
  const [char, setChar] = useState("A");
  const [bgColor, setBgColor] = useState("#7c3aed");
  const [fgColor, setFgColor] = useState("#ffffff");
  const [size, setSize] = useState([128]);
  const [borderRadius, setBorderRadius] = useState([20]);
  const [fontSize, setFontSize] = useState([60]);

  const download = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size[0]; canvas.height = size[0];
    const ctx = canvas.getContext("2d")!;
    const r = borderRadius[0] * size[0] / 128;
    ctx.beginPath();
    ctx.roundRect(0, 0, size[0], size[0], r);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${fontSize[0] * size[0] / 128}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(char, size[0] / 2, size[0] / 2 + 2);
    const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = `icon_${char}.png`; a.click();
  };

  return (
    <ToolLayout title="Icon Generator" description="Create custom icons with various styles">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center">
          <div style={{ width: size[0], height: size[0], borderRadius: borderRadius[0], backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: fontSize[0], fontWeight: "bold", color: fgColor }}>
            {char}
          </div>
        </div>
        <Input value={char} onChange={e => setChar(e.target.value.slice(0, 3))} placeholder="Icon letter(s)" className="rounded-xl text-center text-lg" maxLength={3} />
        <div className="flex gap-3">
          <div className="flex-1"><label className="text-xs text-muted-foreground">Background</label><Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer p-1" /></div>
          <div className="flex-1"><label className="text-xs text-muted-foreground">Text Color</label><Input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer p-1" /></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><span className="text-sm w-24">Size: {size[0]}px</span><Slider value={size} onValueChange={setSize} min={32} max={512} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-24">Radius: {borderRadius[0]}px</span><Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-24">Font: {fontSize[0]}px</span><Slider value={fontSize} onValueChange={setFontSize} min={16} max={120} className="flex-1" /></div>
        </div>
        <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl w-full">Download Icon</Button>
      </div>
    </ToolLayout>
  );
}

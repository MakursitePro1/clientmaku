import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BanglaLogoMaker() {
  const [text, setText] = useState("ওয়েবটুলস");
  const [fontSize, setFontSize] = useState("48");
  const [color, setColor] = useState("#7c3aed");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontStyle, setFontStyle] = useState("bold");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 600;
    canvas.height = 300;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 600, 300);
    ctx.fillStyle = color;
    ctx.font = `${fontStyle} ${fontSize}px 'Noto Sans Bengali', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 300, 150);
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "bangla-logo.png";
      link.href = canvas.toDataURL();
      link.click();
    }, 100);
  };

  return (
    <ToolLayout title="Bangla Logo Maker" description="Create logos with Bangla typography">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700;900&display=swap" rel="stylesheet" />
      <div className="space-y-5 max-w-lg mx-auto">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="বাংলা টেক্সট..." className="rounded-xl text-lg" />
        <div className="grid grid-cols-3 gap-3">
          <Input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="Font Size" className="rounded-xl" />
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl h-10 p-1 cursor-pointer" title="Text Color" />
          <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="rounded-xl h-10 p-1 cursor-pointer" title="Background Color" />
        </div>
        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Preview</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border" width={600} height={300} />
      </div>
    </ToolLayout>
  );
}

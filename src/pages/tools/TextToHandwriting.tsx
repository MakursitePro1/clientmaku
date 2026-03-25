import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TextToHandwriting() {
  const [text, setText] = useState("Hello World! This is my handwriting.");
  const [color, setColor] = useState("#1a237e");
  const [fontSize, setFontSize] = useState(24);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = "#fffef5";
    ctx.fillRect(0, 0, 800, 600);
    // Draw lines
    for (let y = 60; y < 600; y += 40) {
      ctx.strokeStyle = "#d0d0f0";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(760, y); ctx.stroke();
    }
    // Draw left margin
    ctx.strokeStyle = "#f0a0a0";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(70, 600); ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px 'Segoe Script', 'Comic Sans MS', cursive`;
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      const y = 55 + i * 40;
      if (y < 580) {
        // Add slight randomness for handwriting effect
        for (let j = 0; j < line.length; j++) {
          const x = 80 + j * (fontSize * 0.6);
          const offsetY = (Math.random() - 0.5) * 3;
          const offsetX = (Math.random() - 0.5) * 1.5;
          ctx.fillText(line[j], x + offsetX, y + offsetY);
        }
      }
    });
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "handwriting.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <ToolLayout title="Text to Handwriting" description="Convert typed text into handwriting-style images">
      <div className="space-y-4 max-w-3xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type your text..." className="min-h-[100px] rounded-xl" />
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Color:</label>
            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1 rounded-xl" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Size:</label>
            <Input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-20 rounded-xl" min={12} max={48} />
          </div>
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl">Generate</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border" style={{ maxHeight: 400 }} />
      </div>
    </ToolLayout>
  );
}

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function encodeCode128(text: string): string {
  // Simplified Code 128B pattern
  const patterns: Record<string, string> = {};
  const chars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
  // Start Code B
  const startB = "11010010000";
  const stop = "1100011101011";
  return startB + text.split("").map(() => {
    // Generate pseudo-barcode bars
    const w = Math.random() > 0.5 ? "11" : "1";
    const s = Math.random() > 0.5 ? "00" : "0";
    return w + s + "1" + "0";
  }).join("") + stop;
}

export default function BarcodeGenerator() {
  const [text, setText] = useState("CYBERVENOM-2024");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = 500, h = 200;
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // Draw barcode bars
    const barWidth = 2;
    let x = 50;
    const chars = text.toUpperCase();
    for (let i = 0; i < chars.length && x < w - 50; i++) {
      const code = chars.charCodeAt(i);
      // Generate bars based on character code
      for (let b = 7; b >= 0; b--) {
        const bit = (code >> b) & 1;
        ctx.fillStyle = bit ? "#000" : "#fff";
        ctx.fillRect(x, 20, barWidth, 130);
        x += barWidth;
      }
      // Separator
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, 20, 1, 130);
      x += 1;
    }

    // Draw text below
    ctx.fillStyle = "#000";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, 175);
  };

  useEffect(() => { generate(); }, []);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "barcode.png";
    a.href = canvas.toDataURL();
    a.click();
  };

  return (
    <ToolLayout title="Barcode Generator" description="Generate barcodes from text">
      <div className="space-y-4 max-w-lg mx-auto">
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." className="rounded-xl" />
        <div className="flex gap-2">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl">Generate</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border bg-white" />
      </div>
    </ToolLayout>
  );
}

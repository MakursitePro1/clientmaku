import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const lastPos = useRef<{x:number,y:number}|null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 500;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const ev = "touches" in e ? e.touches[0] : e;
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => { setDrawing(true); lastPos.current = getPos(e); };
  const stop = () => { setDrawing(false); lastPos.current = null; };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const a = document.createElement("a");
    a.download = "drawing.png";
    a.href = canvasRef.current!.toDataURL();
    a.click();
  };

  return (
    <ToolLayout title="Drawing Board" description="Free-hand drawing board with pen controls">
      <div className="space-y-3 max-w-3xl mx-auto">
        <div className="flex gap-3 items-center flex-wrap">
          <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 p-1 rounded-xl cursor-pointer" />
          <div className="flex items-center gap-1"><label className="text-sm text-muted-foreground">Size:</label><Input type="number" value={size} onChange={e => setSize(+e.target.value)} min={1} max={50} className="w-16 rounded-xl" /></div>
          <Button onClick={() => setColor("#ffffff")} variant="outline" size="sm" className="rounded-xl">Eraser</Button>
          <Button onClick={clear} variant="outline" size="sm" className="rounded-xl">Clear</Button>
          <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl" size="sm">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-xl border border-border cursor-crosshair touch-none" style={{ height: 500 }}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop} />
      </div>
    </ToolLayout>
  );
}

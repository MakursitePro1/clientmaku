import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Copy, BarChart3, Settings2 } from "lucide-react";

// Code128B encoding tables
const CODE128B_START = 104;
const CODE128_STOP = 106;
const CODE128B_PATTERNS = [
  "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100","10001100100","11001001000",
  "11001000100","11000100100","10110011100","10011011100","10011001110","10111001100","10011101100","10011100110","11001110010","11001011100",
  "11001001110","11011100100","11001110100","11001110010","11101101110","11101001100","11100101100","11100100110","11101100100","11100110100",
  "11100110010","11011011000","11011000110","11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010",
  "11010001000","11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110","11101110110",
  "11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110","11100010110","11101101000","11101100010",
  "11100011010","11101111010","11001000010","11110001010","10100110000","10100001100","10010110000","10010000110","10000101100","10000100110",
  "10110010000","10110000100","10011010000","10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100",
  "10001111010","10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100","11110010010",
  "11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000","10111100010","11110101000","11110100010",
  "10111011110","10111101110","11101011110","11110101110","11010000100","11010010000","11010011100","1100011101011"
];

function encodeCode128B(text: string): number[] {
  const codes: number[] = [CODE128B_START];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code >= 0 && code < 95) codes.push(code);
  }
  // Checksum
  let checksum = codes[0];
  for (let i = 1; i < codes.length; i++) checksum += codes[i] * i;
  codes.push(checksum % 103);
  codes.push(CODE128_STOP);
  return codes;
}

function drawBarcode(canvas: HTMLCanvasElement, text: string, barColor: string, bgColor: string, showText: boolean, barWidth: number, height: number) {
  const ctx = canvas.getContext("2d")!;
  const codes = encodeCode128B(text);
  const pattern = codes.map(c => CODE128B_PATTERNS[c] || "").join("");
  
  const totalBars = pattern.length;
  const padding = 20;
  const textHeight = showText ? 30 : 0;
  const w = totalBars * barWidth + padding * 2;
  const h = height + textHeight + padding * 2;
  
  canvas.width = w;
  canvas.height = h;
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);
  
  // Bars
  let x = padding;
  for (const bit of pattern) {
    ctx.fillStyle = bit === "1" ? barColor : bgColor;
    ctx.fillRect(x, padding, barWidth, height);
    x += barWidth;
  }
  
  // Text
  if (showText) {
    ctx.fillStyle = barColor;
    ctx.font = `${Math.max(12, barWidth * 6)}px 'Courier New', monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, h - padding / 2);
  }
}

type BarcodeFormat = "code128" | "ean13" | "upc";

export default function BarcodeGenerator() {
  const [text, setText] = useState("CYBERVENOM-2024");
  const [format, setFormat] = useState<BarcodeFormat>("code128");
  const [barColor, setBarColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showText, setShowText] = useState(true);
  const [barWidth, setBarWidth] = useState(2);
  const [height, setHeight] = useState(120);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    if (!canvasRef.current || !text.trim()) return;
    drawBarcode(canvasRef.current, text, barColor, bgColor, showText, barWidth, height);
    if (!history.includes(text)) {
      setHistory(prev => [text, ...prev].slice(0, 10));
    }
    toast.success("Barcode generated!");
  };

  useEffect(() => { generate(); }, []);

  const download = (fmt: "png" | "svg") => {
    if (!canvasRef.current) return;
    if (fmt === "png") {
      const a = document.createElement("a");
      a.download = `barcode-${text}.png`;
      a.href = canvasRef.current.toDataURL("image/png");
      a.click();
    } else {
      // SVG export
      const codes = encodeCode128B(text);
      const pattern = codes.map(c => CODE128B_PATTERNS[c] || "").join("");
      const padding = 20;
      const w = pattern.length * barWidth + padding * 2;
      const h = height + (showText ? 30 : 0) + padding * 2;
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`;
      svg += `<rect width="${w}" height="${h}" fill="${bgColor}"/>`;
      let x = padding;
      for (const bit of pattern) {
        if (bit === "1") svg += `<rect x="${x}" y="${padding}" width="${barWidth}" height="${height}" fill="${barColor}"/>`;
        x += barWidth;
      }
      if (showText) svg += `<text x="${w/2}" y="${h - padding/2}" text-anchor="middle" font-family="monospace" font-size="${Math.max(12, barWidth*6)}" fill="${barColor}">${text}</text>`;
      svg += `</svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const a = document.createElement("a");
      a.download = `barcode-${text}.svg`;
      a.href = URL.createObjectURL(blob);
      a.click();
    }
    toast.success(`${fmt.toUpperCase()} downloaded!`);
  };

  const copyBase64 = () => {
    if (!canvasRef.current) return;
    navigator.clipboard.writeText(canvasRef.current.toDataURL());
    toast.success("Base64 image copied!");
  };

  return (
    <ToolLayout title="Barcode Generator" description="Generate professional Code128 barcodes with customization">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter text for barcode..." className="rounded-xl font-mono text-lg flex-1 tool-input-colorful" />
            <button onClick={generate} className="tool-btn-primary px-5 py-2.5 flex items-center gap-1.5 text-sm shrink-0">
              <RefreshCw className="w-4 h-4" /> Generate
            </Button>
          </div>
        </div>

        {/* Customization */}
        <motion.div
          initial={false}
          className="rounded-xl border border-border/30 bg-card overflow-hidden"
        >
          <div className="p-3 bg-accent/30 border-b border-border/30 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold">Customization</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Bar Color</label>
              <Input type="color" value={barColor} onChange={e => setBarColor(e.target.value)} className="w-full h-10 rounded-lg p-1 cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Background</label>
              <Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-lg p-1 cursor-pointer" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Bar Width</label>
              <Select value={String(barWidth)} onValueChange={v => setBarWidth(Number(v))}>
                <SelectTrigger className="rounded-lg h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(n => <SelectItem key={n} value={String(n)}>{n}px</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-semibold uppercase block mb-1">Height</label>
              <Select value={String(height)} onValueChange={v => setHeight(Number(v))}>
                <SelectTrigger className="rounded-lg h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[80, 100, 120, 150, 200].map(n => <SelectItem key={n} value={String(n)}>{n}px</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="px-4 pb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={showText} onChange={e => setShowText(e.target.checked)} className="rounded" />
              Show text below barcode
            </label>
          </div>
        </motion.div>

        {/* Preview */}
        <div className="rounded-2xl border border-border/50 p-6 text-center overflow-x-auto" style={{ backgroundColor: bgColor }}>
          <canvas ref={canvasRef} className="mx-auto max-w-full" />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => download("png")} className="gradient-bg text-primary-foreground rounded-xl gap-1.5">
            <Download className="w-4 h-4" /> Download PNG
          </Button>
          <Button onClick={() => download("svg")} variant="outline" className="rounded-xl gap-1.5">
            <Download className="w-4 h-4" /> Download SVG
          </Button>
          <Button onClick={copyBase64} variant="outline" className="rounded-xl gap-1.5">
            <Copy className="w-4 h-4" /> Copy Base64
          </Button>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border/30 bg-card p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold">About Code 128</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Code 128 is a high-density linear barcode that encodes all 128 ASCII characters. It's widely used in shipping, packaging, and inventory management.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { label: "Characters", val: text.length },
              { label: "Bar Modules", val: encodeCode128B(text).length * 11 },
              { label: "Format", val: "Code 128B" },
            ].map(s => (
              <div key={s.label} className="p-2 bg-accent/20 rounded-lg text-center">
                <p className="text-xs font-bold text-primary">{s.val}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-xl border border-border/30 bg-card overflow-hidden">
            <div className="p-3 bg-accent/30 border-b border-border/30">
              <span className="text-xs font-bold">📋 Recent Barcodes</span>
            </div>
            <div className="divide-y divide-border/20">
              {history.map((h, i) => (
                <button key={i} onClick={() => { setText(h); setTimeout(generate, 50); }}
                  className="w-full text-left px-3 py-2 text-xs font-mono hover:bg-accent/10 transition-colors">{h}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

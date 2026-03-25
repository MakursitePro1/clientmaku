import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState([10]);
  const [opacity, setOpacity] = useState([0.25]);
  const [borderOpacity, setBorderOpacity] = useState([0.2]);
  const [bgColor, setBgColor] = useState("#7c3aed");
  const [cardBg, setCardBg] = useState("#ffffff");

  const css = `background: ${cardBg}${Math.round(opacity[0] * 255).toString(16).padStart(2, "0")};
backdrop-filter: blur(${blur[0]}px);
-webkit-backdrop-filter: blur(${blur[0]}px);
border: 1px solid rgba(255, 255, 255, ${borderOpacity[0].toFixed(2)});
border-radius: 16px;`;

  return (
    <ToolLayout title="Glassmorphism Generator" description="Create frosted glass CSS effects">
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden h-80 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}88, #06b6d4)` }}>
          <div className="absolute top-8 left-8 w-32 h-32 rounded-full" style={{ background: bgColor }} />
          <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-cyan-400" />
          <div className="relative z-10 w-72 p-6 text-center" style={{ background: `${cardBg}${Math.round(opacity[0] * 255).toString(16).padStart(2, "0")}`, backdropFilter: `blur(${blur[0]}px)`, border: `1px solid rgba(255,255,255,${borderOpacity[0]})`, borderRadius: 16 }}>
            <h3 className="text-lg font-bold mb-2">Glassmorphism</h3>
            <p className="text-sm opacity-80">This card uses frosted glass effect with customizable properties.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><span className="text-sm w-28">Blur: {blur[0]}px</span><Slider value={blur} onValueChange={setBlur} min={0} max={30} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-28">Opacity: {opacity[0].toFixed(2)}</span><Slider value={opacity} onValueChange={setOpacity} min={0.05} max={0.8} step={0.05} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-28">Border: {borderOpacity[0].toFixed(2)}</span><Slider value={borderOpacity} onValueChange={setBorderOpacity} min={0} max={1} step={0.05} className="flex-1" /></div>
        </div>
        <div className="flex gap-3">
          <Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-14 h-10 rounded-xl p-1" title="Background" />
          <Input type="color" value={cardBg} onChange={e => setCardBg(e.target.value)} className="w-14 h-10 rounded-xl p-1" title="Card color" />
        </div>
        <div className="bg-accent/30 rounded-xl p-4"><pre className="text-sm font-mono whitespace-pre-wrap">{css}</pre></div>
        <Button onClick={() => navigator.clipboard.writeText(css)} className="gradient-bg text-primary-foreground rounded-xl"><Copy className="w-4 h-4 mr-2" /> Copy CSS</Button>
      </div>
    </ToolLayout>
  );
}

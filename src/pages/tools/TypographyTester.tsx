import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const fonts = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Raleway", "Oswald", 
  "Playfair Display", "Merriweather", "Nunito", "Source Sans 3", "PT Serif", "Fira Code",
  "Space Grotesk", "DM Sans", "Outfit", "Sora", "Lexend", "Geist"
];

export default function TypographyTester() {
  const [font, setFont] = useState("Inter");
  const [size, setSize] = useState([32]);
  const [weight, setWeight] = useState("400");
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [sampleText, setSampleText] = useState("The quick brown fox jumps over the lazy dog. 0123456789");
  const [color, setColor] = useState("#e2e8f0");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [font]);

  return (
    <ToolLayout title="Typography Tester" description="Preview and compare Google Fonts in real-time">
      <div className="space-y-6">
        <div className="flex gap-3 flex-wrap">
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{fonts.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={weight} onValueChange={setWeight}>
            <SelectTrigger className="w-32 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{["300", "400", "500", "600", "700", "800", "900"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-14 h-10 rounded-xl cursor-pointer p-1" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><span className="text-sm w-20">Size: {size[0]}px</span><Slider value={size} onValueChange={setSize} min={8} max={120} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-20">Spacing: {letterSpacing[0]}px</span><Slider value={letterSpacing} onValueChange={setLetterSpacing} min={-5} max={20} step={0.5} className="flex-1" /></div>
          <div className="flex items-center gap-3"><span className="text-sm w-20">Height: {lineHeight[0]}</span><Slider value={lineHeight} onValueChange={setLineHeight} min={0.8} max={3} step={0.1} className="flex-1" /></div>
        </div>
        <div className="border border-border rounded-2xl p-8 min-h-[200px]" style={{ fontFamily: `"${font}", sans-serif`, fontSize: `${size[0]}px`, fontWeight: weight, letterSpacing: `${letterSpacing[0]}px`, lineHeight: lineHeight[0], color }}>
          {sampleText}
        </div>
        <Textarea value={sampleText} onChange={e => setSampleText(e.target.value)} className="rounded-xl" rows={3} placeholder="Custom text..." />
        <div className="bg-accent/30 rounded-xl p-4"><code className="text-sm font-mono">font-family: "{font}"; font-size: {size[0]}px; font-weight: {weight}; letter-spacing: {letterSpacing[0]}px; line-height: {lineHeight[0]};</code></div>
      </div>
    </ToolLayout>
  );
}

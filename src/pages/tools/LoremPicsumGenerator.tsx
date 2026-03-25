import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoremPicsumGenerator() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [seed, setSeed] = useState("");

  const url = `https://picsum.photos/${seed ? `seed/${seed}/` : ""}${width}/${height}${grayscale ? "?grayscale" : ""}${blur ? `${grayscale ? "&" : "?"}blur=${blur}` : ""}`;

  const copy = () => { navigator.clipboard.writeText(url); toast.success("URL copied!"); };

  return (
    <ToolLayout title="Placeholder Image Generator" description="Generate placeholder images for your designs">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="text-sm text-muted-foreground">Width</label><Input type="number" value={width} onChange={e => setWidth(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Height</label><Input type="number" value={height} onChange={e => setHeight(+e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Blur (0-10)</label><Input type="number" value={blur} onChange={e => setBlur(+e.target.value)} min={0} max={10} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Seed (optional)</label><Input value={seed} onChange={e => setSeed(e.target.value)} className="rounded-xl" placeholder="any-text" /></div>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={grayscale} onChange={e => setGrayscale(e.target.checked)} /> Grayscale</label>
          <Button onClick={copy} variant="outline" className="rounded-xl">Copy URL</Button>
          <Button onClick={() => setSeed(Math.random().toString(36).slice(2, 8))} className="gradient-bg text-primary-foreground rounded-xl">Randomize</Button>
        </div>
        <div className="p-3 bg-accent/30 rounded-xl font-mono text-xs break-all border border-border">{url}</div>
        <img src={url} alt="Placeholder" className="w-full rounded-xl border border-border" style={{ maxHeight: 400, objectFit: "contain" }} />
      </div>
    </ToolLayout>
  );
}

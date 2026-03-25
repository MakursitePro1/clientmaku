import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download } from "lucide-react";

const devices = {
  iphone: { name: "iPhone", width: 375, height: 812, radius: 40, bezel: 12, notch: true },
  android: { name: "Android Phone", width: 360, height: 780, radius: 20, bezel: 8, notch: false },
  ipad: { name: "iPad", width: 768, height: 1024, radius: 20, bezel: 16, notch: false },
  laptop: { name: "Laptop", width: 1280, height: 800, radius: 8, bezel: 20, notch: false },
};

export default function MockupGenerator() {
  const [device, setDevice] = useState<keyof typeof devices>("iphone");
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const d = devices[device];
  const scale = Math.min(400 / d.width, 600 / d.height);

  return (
    <ToolLayout title="Device Mockup Generator" description="Place designs in phone and laptop mockups">
      <div className="space-y-6">
        <div className="flex gap-3 flex-wrap">
          <Select value={device} onValueChange={(v) => setDevice(v as keyof typeof devices)}>
            <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(devices).map(([k, v]) => <SelectItem key={k} value={k}>{v.name}</SelectItem>)}</SelectContent>
          </Select>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <Button variant="outline" className="rounded-xl" onClick={() => inputRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Upload Screenshot</Button>
        </div>
        <div className="flex justify-center p-8 bg-accent/20 rounded-2xl">
          <div style={{ width: d.width * scale + d.bezel * 2, height: d.height * scale + d.bezel * 2 + (device === "laptop" ? 20 : 0), borderRadius: d.radius * scale, border: `${d.bezel}px solid #222`, backgroundColor: "#111", position: "relative", overflow: "hidden" }}>
            {imageUrl ? (
              <img src={imageUrl} alt="mockup" style={{ width: "100%", height: device === "laptop" ? `calc(100% - 20px)` : "100%", objectFit: "cover", borderRadius: (d.radius - 4) * scale }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Upload a screenshot</div>
            )}
            {device === "laptop" && <div style={{ position: "absolute", bottom: 0, left: -d.bezel, right: -d.bezel, height: 20, background: "#333", borderRadius: "0 0 4px 4px" }} />}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

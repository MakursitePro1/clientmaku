import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";

export default function ScreenResolutionChecker() {
  const [info, setInfo] = useState({ width: 0, height: 0, availW: 0, availH: 0, dpr: 1, colorDepth: 0, orientation: "" });

  useEffect(() => {
    const update = () => setInfo({
      width: window.screen.width,
      height: window.screen.height,
      availW: window.screen.availWidth,
      availH: window.screen.availHeight,
      dpr: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation?.type || "unknown"
    });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const items = [
    { label: "Screen Resolution", value: `${info.width} × ${info.height}` },
    { label: "Available Area", value: `${info.availW} × ${info.availH}` },
    { label: "Viewport Size", value: `${window.innerWidth} × ${window.innerHeight}` },
    { label: "Device Pixel Ratio", value: `${info.dpr}x` },
    { label: "Color Depth", value: `${info.colorDepth}-bit` },
    { label: "Orientation", value: info.orientation },
  ];

  return (
    <ToolLayout title="Screen Resolution Checker" description="Check your screen resolution and display info">
      <div className="max-w-md mx-auto space-y-3">
        {items.map(i => (
          <div key={i.label} className="flex justify-between items-center p-4 rounded-xl bg-accent/30 border border-border">
            <span className="text-muted-foreground text-sm">{i.label}</span>
            <span className="font-bold text-lg">{i.value}</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

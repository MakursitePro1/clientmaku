import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function BrowserFingerprint() {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.textBaseline = "alphabetic";
    ctx.font = "14px Arial";
    ctx.fillText("fingerprint", 2, 15);
    const canvasHash = canvas.toDataURL().slice(-20);

    const data: Record<string, string> = {
      "User Agent": navigator.userAgent.slice(0, 80) + "...",
      "Platform": navigator.platform,
      "Language": navigator.language,
      "Languages": navigator.languages?.join(", ") || "N/A",
      "Screen Resolution": `${screen.width}x${screen.height}`,
      "Color Depth": `${screen.colorDepth}-bit`,
      "Device Pixel Ratio": `${window.devicePixelRatio}`,
      "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "Timezone Offset": `UTC${-new Date().getTimezoneOffset() / 60 >= 0 ? "+" : ""}${-new Date().getTimezoneOffset() / 60}`,
      "Touch Support": "ontouchstart" in window ? "Yes" : "No",
      "Cookies Enabled": navigator.cookieEnabled ? "Yes" : "No",
      "Do Not Track": (navigator as any).doNotTrack || "Not set",
      "Hardware Concurrency": `${navigator.hardwareConcurrency || "N/A"} cores`,
      "Device Memory": `${(navigator as any).deviceMemory || "N/A"} GB`,
      "WebGL Renderer": getWebGLRenderer(),
      "Canvas Hash": canvasHash,
    };
    setInfo(data);
  }, []);

  function getWebGLRenderer() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (!gl) return "N/A";
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "Hidden";
    } catch { return "N/A"; }
  }

  return (
    <ToolLayout title="Browser Fingerprint Viewer" description="See what information your browser reveals about you">
      <div className="space-y-3 max-w-lg mx-auto">
        <p className="text-sm text-muted-foreground text-center mb-4">Your browser reveals the following information that can be used to identify you:</p>
        {Object.entries(info).map(([k, v]) => (
          <div key={k} className="flex justify-between items-start gap-4 p-3 rounded-xl bg-accent/30 border border-border">
            <span className="text-sm text-muted-foreground shrink-0">{k}</span>
            <span className="text-sm font-mono text-right break-all">{v}</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";

export default function QrCodeScanner() {
  const [result, setResult] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setImage(reader.result as string);
      // Use QR server API to decode
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const decoded = data?.[0]?.symbol?.[0]?.data;
        setResult(decoded || "Could not decode QR code from this image.");
      } catch {
        setResult("Error decoding QR code. Please try another image.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout title="QR Code Scanner" description="Scan and decode QR codes from images">
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image ? <img src={image} alt="QR" className="max-h-48 mx-auto rounded-xl" /> : <p className="text-muted-foreground">Click to upload a QR code image</p>}
        </div>
        {result && (
          <div className="bg-accent/50 rounded-2xl p-6">
            <div className="text-sm font-semibold mb-2">Decoded Result:</div>
            <p className="font-mono text-sm break-all">{result}</p>
            {result.startsWith("http") && (
              <a href={result} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline mt-2 inline-block">Open Link</a>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

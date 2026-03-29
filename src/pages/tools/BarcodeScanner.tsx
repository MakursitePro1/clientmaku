import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, Upload, Copy } from "lucide-react";

export default function BarcodeScanner() {
  const [result, setResult] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      
      // Use BarcodeDetector API if available, otherwise simulate
      if ('BarcodeDetector' in window) {
        const img = new Image();
        img.onload = async () => {
          try {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'itf', 'codabar'] });
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0) {
              setResult(barcodes[0].rawValue);
              toast.success("Barcode detected!");
            } else {
              setResult("No barcode found in this image");
              toast.error("No barcode detected");
            }
          } catch {
            setResult("Detection failed - try a clearer image");
          }
        };
        img.src = dataUrl;
      } else {
        setResult("BarcodeDetector API not supported in this browser. Try Chrome 83+.");
        toast.error("Browser doesn't support barcode detection");
      }
    };
    reader.readAsDataURL(file);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied!");
  };

  return (
    <ToolLayout title="Barcode Scanner" description="Scan barcodes from uploaded images">
      <div className="space-y-6 max-w-md mx-auto">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" className="max-h-48 mx-auto rounded-lg" />
          ) : (
            <div className="space-y-3">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload a barcode image</p>
            </div>
          )}
        </div>

        {result && (
          <div className="p-4 bg-accent/30 rounded-xl border border-border/50 space-y-2">
            <p className="text-xs text-muted-foreground">Result:</p>
            <p className="font-mono text-sm font-semibold break-all">{result}</p>
            <Button size="sm" variant="outline" onClick={copy} className="rounded-lg gap-2">
              <Copy className="w-3 h-3" /> Copy
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

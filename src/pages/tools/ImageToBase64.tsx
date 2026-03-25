import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const copy = () => {
    navigator.clipboard.writeText(base64);
    toast({ title: "Copied!", description: "Base64 string copied to clipboard" });
  };

  return (
    <ToolLayout title="Image to Base64 Converter" description="Convert images to Base64 encoded strings">
      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/30 transition-colors" onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {preview ? <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl" /> : <p className="text-muted-foreground">Click or drag to upload an image</p>}
        </div>
        {base64 && (
          <>
            <div className="flex justify-end">
              <Button onClick={copy} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Copy Base64</Button>
            </div>
            <textarea readOnly value={base64} className="w-full h-40 bg-accent/50 rounded-2xl p-4 text-xs font-mono resize-none border border-border" />
          </>
        )}
      </div>
    </ToolLayout>
  );
}

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QrCodeMaker() {
  const [text, setText] = useState("https://webtools.com");
  const [size, setSize] = useState("200");
  const [color, setColor] = useState("#7c3aed");

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&color=${color.replace("#", "")}`;

  const download = () => {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrUrl;
    link.click();
  };

  return (
    <ToolLayout title="QR Code Maker" description="Create QR codes for any text or URL">
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL..." className="rounded-xl" />
        <div className="flex gap-3">
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["150", "200", "300", "400", "500"].map((s) => <SelectItem key={s} value={s}>{s}x{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 rounded-xl p-1 cursor-pointer" />
        </div>
        {text && (
          <div className="bg-accent/50 rounded-2xl p-8 inline-block">
            <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl" />
          </div>
        )}
        <div>
          <Button onClick={download} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Download QR Code</Button>
        </div>
      </div>
    </ToolLayout>
  );
}

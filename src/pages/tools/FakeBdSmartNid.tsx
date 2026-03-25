import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FakeBdSmartNid() {
  const [nameEn, setNameEn] = useState("Abdul Karim");
  const [nameBn, setNameBn] = useState("আব্দুল করিম");
  const [dob, setDob] = useState("01 Jan 1990");
  const [nidNo, setNidNo] = useState("1234567890");
  const [pin, setPin] = useState("19901234567890123");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 500;
    canvas.height = 320;
    // Card bg
    const grad = ctx.createLinearGradient(0, 0, 500, 320);
    grad.addColorStop(0, "#e8f5e9");
    grad.addColorStop(1, "#c8e6c9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 320);
    ctx.strokeStyle = "#1b5e20";
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 494, 314);
    // Header
    ctx.fillStyle = "#1b5e20";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("গণপ্রজাতন্ত্রী বাংলাদেশ সরকার", 250, 25);
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("PEOPLE'S REPUBLIC OF BANGLADESH", 250, 42);
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("জাতীয় পরিচয়পত্র / NATIONAL ID CARD", 250, 62);
    // Photo placeholder
    ctx.fillStyle = "#ddd";
    ctx.fillRect(30, 80, 110, 130);
    ctx.fillStyle = "#999";
    ctx.font = "11px sans-serif";
    ctx.fillText("Photo", 85, 150);
    // Details
    ctx.textAlign = "left";
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText(`নাম: ${nameBn}`, 160, 100);
    ctx.fillText(`Name: ${nameEn}`, 160, 120);
    ctx.fillText(`Date of Birth: ${dob}`, 160, 145);
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#1b5e20";
    ctx.fillText(`NID No: ${nidNo}`, 160, 175);
    ctx.font = "11px monospace";
    ctx.fillText(`PIN: ${pin}`, 160, 198);
    // Warning
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ FAKE CARD — FOR EDUCATIONAL PURPOSES ONLY", 250, 290);
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "fake-bd-smart-nid.png";
      link.href = canvasRef.current?.toDataURL() || "";
      link.click();
    }, 100);
  };

  return (
    <ToolLayout title="Fake BD Smart NID Card Maker" description="Generate fake smart NID cards (for educational purposes only)">
      <div className="space-y-5 max-w-lg mx-auto">
        <p className="text-sm text-destructive font-semibold">⚠️ This is for educational/entertainment purposes only.</p>
        <Input value={nameBn} onChange={(e) => setNameBn(e.target.value)} placeholder="Name (Bangla)" className="rounded-xl" />
        <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Name (English)" className="rounded-xl" />
        <Input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" className="rounded-xl" />
        <Input value={nidNo} onChange={(e) => setNidNo(e.target.value)} placeholder="NID Number" className="rounded-xl" />
        <Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" className="rounded-xl" />
        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Preview</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border" />
      </div>
    </ToolLayout>
  );
}

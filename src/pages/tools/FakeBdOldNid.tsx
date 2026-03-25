import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FakeBdOldNid() {
  const [name, setName] = useState("মোঃ আব্দুল করিম");
  const [father, setFather] = useState("মোঃ আলী আহমেদ");
  const [mother, setMother] = useState("মোসাঃ ফাতেমা বেগম");
  const [dob, setDob] = useState("01 Jan 1990");
  const [nidNo, setNidNo] = useState("1234567890123");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 500;
    canvas.height = 320;
    // Background
    ctx.fillStyle = "#f0f4e8";
    ctx.fillRect(0, 0, 500, 320);
    // Border
    ctx.strokeStyle = "#2d5a2d";
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, 490, 310);
    // Header
    ctx.fillStyle = "#2d5a2d";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("গণপ্রজাতন্ত্রী বাংলাদেশ সরকার", 250, 35);
    ctx.font = "12px sans-serif";
    ctx.fillText("জাতীয় পরিচয়পত্র", 250, 55);
    // Photo placeholder
    ctx.fillStyle = "#ddd";
    ctx.fillRect(30, 80, 100, 120);
    ctx.fillStyle = "#999";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Photo", 80, 145);
    // Details
    ctx.textAlign = "left";
    ctx.fillStyle = "#333";
    ctx.font = "13px sans-serif";
    ctx.fillText(`নাম: ${name}`, 150, 100);
    ctx.fillText(`পিতা: ${father}`, 150, 130);
    ctx.fillText(`মাতা: ${mother}`, 150, 160);
    ctx.fillText(`জন্ম তারিখ: ${dob}`, 150, 190);
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#2d5a2d";
    ctx.fillText(`ID No: ${nidNo}`, 150, 230);
    // Footer
    ctx.fillStyle = "#666";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ This is a FAKE card for educational purposes only", 250, 290);
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "fake-bd-old-nid.png";
      link.href = canvasRef.current?.toDataURL() || "";
      link.click();
    }, 100);
  };

  return (
    <ToolLayout title="Fake BD Old NID Card Maker" description="Generate fake old format BD NID cards (for educational purposes only)">
      <div className="space-y-5 max-w-lg mx-auto">
        <p className="text-sm text-destructive font-semibold">⚠️ This is for educational/entertainment purposes only. Do not use for illegal activities.</p>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl" />
        <Input value={father} onChange={(e) => setFather(e.target.value)} placeholder="Father's Name" className="rounded-xl" />
        <Input value={mother} onChange={(e) => setMother(e.target.value)} placeholder="Mother's Name" className="rounded-xl" />
        <Input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" className="rounded-xl" />
        <Input value={nidNo} onChange={(e) => setNidNo(e.target.value)} placeholder="NID Number" className="rounded-xl" />
        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Preview</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border" />
      </div>
    </ToolLayout>
  );
}

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FakePakCnic() {
  const [name, setName] = useState("Muhammad Ali");
  const [father, setFather] = useState("Muhammad Khan");
  const [cnic, setCnic] = useState("12345-6789012-3");
  const [dob, setDob] = useState("01.01.1990");
  const [doi, setDoi] = useState("15.06.2020");
  const [doe, setDoe] = useState("14.06.2030");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 500;
    canvas.height = 320;
    const grad = ctx.createLinearGradient(0, 0, 500, 320);
    grad.addColorStop(0, "#e8f0e8");
    grad.addColorStop(1, "#d0e0d0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 320);
    ctx.strokeStyle = "#006600";
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 492, 312);
    // Header
    ctx.fillStyle = "#006600";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ISLAMIC REPUBLIC OF PAKISTAN", 250, 30);
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("COMPUTERIZED NATIONAL IDENTITY CARD", 250, 50);
    // Photo
    ctx.fillStyle = "#ddd";
    ctx.fillRect(30, 70, 100, 120);
    ctx.fillStyle = "#999";
    ctx.font = "11px sans-serif";
    ctx.fillText("Photo", 80, 135);
    // Details
    ctx.textAlign = "left";
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Name: ${name}`, 150, 90);
    ctx.fillText(`Father Name: ${father}`, 150, 115);
    ctx.fillText(`Date of Birth: ${dob}`, 150, 140);
    ctx.fillText(`Date of Issue: ${doi}`, 150, 165);
    ctx.fillText(`Date of Expiry: ${doe}`, 150, 190);
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#006600";
    ctx.fillText(`CNIC: ${cnic}`, 150, 225);
    // Warning
    ctx.fillStyle = "#cc0000";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ FAKE CARD — FOR EDUCATIONAL PURPOSES ONLY", 250, 295);
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "fake-pak-cnic.png";
      link.href = canvasRef.current?.toDataURL() || "";
      link.click();
    }, 100);
  };

  return (
    <ToolLayout title="Fake Pakistani CNIC Card Maker" description="Generate fake CNIC cards (for educational purposes only)">
      <div className="space-y-5 max-w-lg mx-auto">
        <p className="text-sm text-destructive font-semibold">⚠️ This is for educational/entertainment purposes only.</p>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-xl" />
        <Input value={father} onChange={(e) => setFather(e.target.value)} placeholder="Father's Name" className="rounded-xl" />
        <Input value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="CNIC Number" className="rounded-xl" />
        <Input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" className="rounded-xl" />
        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Preview</Button>
          <Button onClick={download} variant="outline" className="rounded-xl">Download</Button>
        </div>
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border" />
      </div>
    </ToolLayout>
  );
}

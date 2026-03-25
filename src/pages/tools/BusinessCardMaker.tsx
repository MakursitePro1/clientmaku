import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BusinessCardMaker() {
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Software Engineer");
  const [company, setCompany] = useState("Acme Inc.");
  const [email, setEmail] = useState("john@acme.com");
  const [phone, setPhone] = useState("+880 1XXX-XXXXXX");
  const [website, setWebsite] = useState("www.acme.com");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 700; canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    // Background
    const grad = ctx.createLinearGradient(0, 0, 700, 400);
    grad.addColorStop(0, "#1a1a2e"); grad.addColorStop(1, "#16213e");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 700, 400);
    // Accent line
    ctx.fillStyle = "#e94560"; ctx.fillRect(0, 0, 8, 400);
    // Name
    ctx.fillStyle = "#fff"; ctx.font = "bold 32px system-ui"; ctx.fillText(name, 40, 100);
    // Title
    ctx.fillStyle = "#e94560"; ctx.font = "16px system-ui"; ctx.fillText(title, 40, 135);
    // Company
    ctx.fillStyle = "#aaa"; ctx.font = "14px system-ui"; ctx.fillText(company, 40, 165);
    // Divider
    ctx.strokeStyle = "#333"; ctx.beginPath(); ctx.moveTo(40, 200); ctx.lineTo(660, 200); ctx.stroke();
    // Contact
    ctx.fillStyle = "#ccc"; ctx.font = "14px system-ui";
    ctx.fillText(`📧 ${email}`, 40, 240);
    ctx.fillText(`📱 ${phone}`, 40, 270);
    ctx.fillText(`🌐 ${website}`, 40, 300);
  };

  const download = () => {
    draw();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a"); a.download = "business-card.png"; a.href = canvas.toDataURL(); a.click();
      toast.success("Downloaded!");
    }, 100);
  };

  // Auto-draw on mount & changes
  useState(() => { setTimeout(draw, 100); });

  return (
    <ToolLayout title="Business Card Maker" description="Create professional business cards instantly">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[
            { label: "Full Name", val: name, set: setName },
            { label: "Job Title", val: title, set: setTitle },
            { label: "Company", val: company, set: setCompany },
            { label: "Email", val: email, set: setEmail },
            { label: "Phone", val: phone, set: setPhone },
            { label: "Website", val: website, set: setWebsite },
          ].map(f => (
            <div key={f.label}>
              <label className="text-sm text-muted-foreground">{f.label}</label>
              <Input value={f.val} onChange={e => { f.set(e.target.value); setTimeout(draw, 50); }} className="rounded-xl" />
            </div>
          ))}
          <Button onClick={download} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Download Card</Button>
        </div>
        <div className="flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full rounded-2xl shadow-2xl" />
        </div>
      </div>
    </ToolLayout>
  );
}

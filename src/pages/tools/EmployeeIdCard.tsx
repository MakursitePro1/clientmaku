import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EmployeeIdCard() {
  const [name, setName] = useState("John Doe");
  const [designation, setDesignation] = useState("Software Engineer");
  const [dept, setDept] = useState("Engineering");
  const [empId, setEmpId] = useState("EMP-2024-001");
  const [company, setCompany] = useState("Acme Corporation");
  const [phone, setPhone] = useState("+880 1XXX-XXXXXX");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 400; canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    // BG
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 600);
    // Header
    const hg = ctx.createLinearGradient(0, 0, 400, 0);
    hg.addColorStop(0, "#2563eb"); hg.addColorStop(1, "#7c3aed");
    ctx.fillStyle = hg; ctx.fillRect(0, 0, 400, 120);
    ctx.fillStyle = "#fff"; ctx.font = "bold 20px system-ui"; ctx.textAlign = "center";
    ctx.fillText(company, 200, 50);
    ctx.font = "12px system-ui"; ctx.fillText("EMPLOYEE IDENTIFICATION CARD", 200, 75);
    // Photo placeholder
    ctx.fillStyle = "#e5e7eb"; ctx.beginPath(); ctx.arc(200, 190, 55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#9ca3af"; ctx.font = "24px system-ui"; ctx.fillText("📷", 200, 198);
    // Info
    ctx.textAlign = "center"; ctx.fillStyle = "#111";
    ctx.font = "bold 22px system-ui"; ctx.fillText(name, 200, 290);
    ctx.fillStyle = "#2563eb"; ctx.font = "14px system-ui"; ctx.fillText(designation, 200, 315);
    ctx.fillStyle = "#666"; ctx.font = "13px system-ui"; ctx.fillText(`Department: ${dept}`, 200, 350);
    // ID box
    ctx.fillStyle = "#f3f4f6"; ctx.fillRect(80, 375, 240, 45); ctx.strokeStyle = "#d1d5db"; ctx.strokeRect(80, 375, 240, 45);
    ctx.fillStyle = "#111"; ctx.font = "bold 18px system-ui"; ctx.fillText(empId, 200, 405);
    // Phone
    ctx.fillStyle = "#666"; ctx.font = "13px system-ui"; ctx.fillText(`📱 ${phone}`, 200, 455);
    // Footer
    ctx.fillStyle = hg; ctx.fillRect(0, 550, 400, 50);
    ctx.fillStyle = "#fff"; ctx.font = "10px system-ui"; ctx.fillText("This card is property of the company. If found, please return.", 200, 575);
  };

  const download = () => {
    draw();
    setTimeout(() => {
      const a = document.createElement("a"); a.download = "employee-id.png"; a.href = canvasRef.current!.toDataURL(); a.click();
      toast.success("Downloaded!");
    }, 100);
  };

  useState(() => { setTimeout(draw, 100); });

  return (
    <ToolLayout title="Employee ID Card Maker" description="Create professional employee ID cards">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[
            { l: "Company", v: company, s: setCompany },
            { l: "Full Name", v: name, s: setName },
            { l: "Designation", v: designation, s: setDesignation },
            { l: "Department", v: dept, s: setDept },
            { l: "Employee ID", v: empId, s: setEmpId },
            { l: "Phone", v: phone, s: setPhone },
          ].map(f => (
            <div key={f.l}><label className="text-sm text-muted-foreground">{f.l}</label>
              <Input value={f.v} onChange={e => { f.s(e.target.value); setTimeout(draw, 50); }} className="rounded-xl" /></div>
          ))}
          <Button onClick={download} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Download ID Card</Button>
        </div>
        <div className="flex items-center justify-center"><canvas ref={canvasRef} className="max-w-full rounded-2xl shadow-2xl" /></div>
      </div>
    </ToolLayout>
  );
}

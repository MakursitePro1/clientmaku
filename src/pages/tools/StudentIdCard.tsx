import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, Eye, Upload, Palette, User, GraduationCap, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const themes = [
  { id: "purple", name: "Royal Purple", primary: "#7c3aed", secondary: "#4c1d95", accent: "#a855f7", dark: "#2e1065", light: "#ede9fe", text: "#1e1b4b" },
  { id: "blue", name: "Ocean Blue", primary: "#2563eb", secondary: "#1e3a8a", accent: "#60a5fa", dark: "#172554", light: "#dbeafe", text: "#172554" },
  { id: "green", name: "Emerald", primary: "#059669", secondary: "#064e3b", accent: "#34d399", dark: "#022c22", light: "#d1fae5", text: "#064e3b" },
  { id: "red", name: "Crimson", primary: "#dc2626", secondary: "#7f1d1d", accent: "#f87171", dark: "#450a0a", light: "#fee2e2", text: "#7f1d1d" },
  { id: "teal", name: "Teal Modern", primary: "#0d9488", secondary: "#134e4a", accent: "#2dd4bf", dark: "#042f2e", light: "#ccfbf1", text: "#134e4a" },
  { id: "navy", name: "Navy Classic", primary: "#1e3a5f", secondary: "#0c1e3a", accent: "#5b8db8", dark: "#0a1628", light: "#e0eaf5", text: "#0c1e3a" },
  { id: "gold", name: "Gold Premium", primary: "#b45309", secondary: "#78350f", accent: "#f59e0b", dark: "#451a03", light: "#fef3c7", text: "#78350f" },
  { id: "dark", name: "Dark Elegance", primary: "#6366f1", secondary: "#1e1b4b", accent: "#818cf8", dark: "#0f0e24", light: "#e0e7ff", text: "#1e1b4b" },
];

export default function StudentIdCard() {
  const [name, setName] = useState("Francois Mercer");
  const [studentId, setStudentId] = useState("123-456-7890");
  const [department, setDepartment] = useState("Sociology");
  const [institution, setInstitution] = useState("Liceria University");
  const [session, setSession] = useState("2025");
  const [blood, setBlood] = useState("A+");
  const [phone, setPhone] = useState("+880 1234-567890");
  const [email, setEmail] = useState("john@university.edu");
  const [dob, setDob] = useState("2000-01-22");
  const [fatherName, setFatherName] = useState("Robert Mercer");
  const [motherName, setMotherName] = useState("Jane Mercer");
  const [address, setAddress] = useState("123 Anywhere St., Any City");
  const [emergencyContact, setEmergencyContact] = useState("+880 9876-543210");
  const [theme, setTheme] = useState("purple");
  const [photo, setPhoto] = useState<string>("");
  const [showBack, setShowBack] = useState(true);
  const [validUntil, setValidUntil] = useState("2027-08-22");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, data: string, color = "#000") => {
    const clean = data.replace(/[^A-Za-z0-9]/g, "");
    if (!clean) return;
    const bits: number[] = [1,1,0,1,0,0,1,1,0];
    for (let i = 0; i < clean.length; i++) {
      const c = clean.charCodeAt(i);
      for (let b = 7; b >= 0; b--) bits.push((c >> b) & 1);
      bits.push(0, 1);
    }
    bits.push(1,1,0,0,1,1,0,1);
    const barW = w / bits.length;
    ctx.fillStyle = color;
    bits.forEach((bit, i) => {
      if (bit) ctx.fillRect(x + i * barW, y, barW + 0.5, h);
    });
  };

  const drawQR = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const m = 21, cs = size / m;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, size, size);
    const seed = (studentId + name).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const finder = (fx: number, fy: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(fx, fy, cs * 7, cs * 7);
      ctx.fillStyle = "#fff";
      ctx.fillRect(fx + cs, fy + cs, cs * 5, cs * 5);
      ctx.fillStyle = "#000";
      ctx.fillRect(fx + cs * 2, fy + cs * 2, cs * 3, cs * 3);
    };
    finder(x, y); finder(x + (m - 7) * cs, y); finder(x, y + (m - 7) * cs);
    for (let i = 8; i < m - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(x + i * cs, y + 6 * cs, cs, cs);
        ctx.fillRect(x + 6 * cs, y + i * cs, cs, cs);
      }
    }
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < m; c++) {
        if (r < 9 && c < 9) continue;
        if (r < 9 && c > m - 9) continue;
        if (r > m - 9 && c < 9) continue;
        if (r === 6 || c === 6) continue;
        const h2 = ((r * 37 + c * 19 + seed) * 2654435761) >>> 0;
        if (h2 % 3 === 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + c * cs, y + r * cs, cs, cs);
        }
      }
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 900, CH = 560;
    const totalH = showBack ? CH * 2 + 50 : CH;
    canvas.width = W * 2;
    canvas.height = totalH * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, totalH);
    const t = themes.find(th => th.id === theme) || themes[0];

    // ===== DRAW FRONT =====
    const drawFront = (oY: number) => {
      // White card base with shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(10, oY + 10, W - 20, CH - 20, 16);
      ctx.fill();
      ctx.restore();

      // ===== Decorative wave shapes (top-right) =====
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(10, oY + 10, W - 20, CH - 20, 16);
      ctx.clip();

      // Large wave 1
      const wGrad1 = ctx.createLinearGradient(W * 0.5, oY, W, oY + CH * 0.7);
      wGrad1.addColorStop(0, t.primary + "dd");
      wGrad1.addColorStop(1, t.secondary + "ee");
      ctx.fillStyle = wGrad1;
      ctx.beginPath();
      ctx.moveTo(W * 0.55, oY + 10);
      ctx.lineTo(W - 10, oY + 10);
      ctx.lineTo(W - 10, oY + CH * 0.75);
      ctx.quadraticCurveTo(W * 0.75, oY + CH * 0.65, W * 0.55, oY + CH * 0.55);
      ctx.quadraticCurveTo(W * 0.45, oY + CH * 0.48, W * 0.5, oY + CH * 0.2);
      ctx.quadraticCurveTo(W * 0.52, oY + 10, W * 0.55, oY + 10);
      ctx.fill();

      // Wave 2 (overlay darker)
      const wGrad2 = ctx.createLinearGradient(W * 0.6, oY, W, oY + CH);
      wGrad2.addColorStop(0, t.secondary + "99");
      wGrad2.addColorStop(1, t.primary + "cc");
      ctx.fillStyle = wGrad2;
      ctx.beginPath();
      ctx.moveTo(W * 0.65, oY + 10);
      ctx.lineTo(W - 10, oY + 10);
      ctx.lineTo(W - 10, oY + CH * 0.5);
      ctx.quadraticCurveTo(W * 0.8, oY + CH * 0.55, W * 0.65, oY + CH * 0.35);
      ctx.quadraticCurveTo(W * 0.58, oY + CH * 0.2, W * 0.65, oY + 10);
      ctx.fill();

      // Bottom wave
      const wGrad3 = ctx.createLinearGradient(W * 0.4, oY + CH, W, oY + CH * 0.5);
      wGrad3.addColorStop(0, t.accent + "55");
      wGrad3.addColorStop(1, t.primary + "88");
      ctx.fillStyle = wGrad3;
      ctx.beginPath();
      ctx.moveTo(W * 0.5, oY + CH - 10);
      ctx.lineTo(W - 10, oY + CH - 10);
      ctx.lineTo(W - 10, oY + CH * 0.6);
      ctx.quadraticCurveTo(W * 0.78, oY + CH * 0.75, W * 0.6, oY + CH * 0.8);
      ctx.quadraticCurveTo(W * 0.45, oY + CH * 0.85, W * 0.5, oY + CH - 10);
      ctx.fill();

      ctx.restore();

      // ===== Institution Name (top-left) =====
      ctx.fillStyle = t.text;
      ctx.font = "bold 20px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.fillText(institution, 45, oY + 55);

      // ===== "Student ID Card" title =====
      ctx.fillStyle = t.primary;
      ctx.font = "bold 36px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.fillText("Student ID Card", 45, oY + 105);

      // ===== Detail Fields (left side) =====
      const fields = [
        { label: "Name", value: name },
        { label: "ID Number", value: studentId },
        { label: "Academic Year", value: session },
        { label: "Major", value: department },
        { label: "Birthday", value: formatDate(dob) },
        { label: "Address", value: address },
      ];

      let dy = oY + 145;
      const lineH = 42;
      ctx.textAlign = "left";

      fields.forEach(f => {
        // Label (bold)
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
        const labelText = f.label;
        ctx.fillText(labelText, 45, dy);

        // Colon
        ctx.fillStyle = "#333";
        ctx.font = "16px 'Segoe UI', Arial, sans-serif";
        ctx.fillText(":", 185, dy);

        // Value
        ctx.fillStyle = "#444";
        ctx.font = "16px 'Segoe UI', Arial, sans-serif";
        let val = f.value;
        const maxW = 280;
        while (ctx.measureText(val).width > maxW && val.length > 5) {
          val = val.slice(0, -1) + "…";
        }
        ctx.fillText(val, 200, dy);

        dy += lineH;
      });

      // ===== Valid Until Badge =====
      const vuY = dy + 15;
      // Badge background
      ctx.fillStyle = t.primary;
      ctx.beginPath();
      ctx.roundRect(45, vuY - 5, 130, 34, 8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Valid Until", 110, vuY + 17);

      // Date value
      ctx.fillStyle = t.text;
      ctx.font = "bold 16px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(": " + formatDate(validUntil), 190, vuY + 17);

      // ===== Circular Photo (right side) =====
      const photoR = 115;
      const photoCX = W - 190;
      const photoCY = oY + CH * 0.48;

      // Outer ring
      ctx.strokeStyle = t.primary;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 8, 0, Math.PI * 2);
      ctx.stroke();

      // Inner white ring
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Photo circle background
      ctx.fillStyle = "#f3f4f6";
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
      ctx.fill();

      if (photo) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
          ctx.clip();
          const aspect = img.width / img.height;
          let dx2 = photoCX - photoR, dy2 = photoCY - photoR, dw = photoR * 2, dh = photoR * 2;
          if (aspect > 1) { dw = dh * aspect; dx2 = photoCX - dw / 2; }
          else { dh = dw / aspect; dy2 = photoCY - dh / 2; }
          ctx.drawImage(img, dx2, dy2, dw, dh);
          ctx.restore();

          if (showBack) drawBack(CH + 50);
          setGenerated(true);
        };
        img.src = photo;
      } else {
        // Placeholder
        ctx.fillStyle = "#d1d5db";
        ctx.font = "72px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👤", photoCX, photoCY + 20);
        ctx.fillStyle = "#9ca3af";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText("Upload Photo", photoCX, photoCY + 55);
      }
    };

    // ===== DRAW BACK =====
    const drawBack = (oY: number) => {
      // White card base
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(10, oY + 10, W - 20, CH - 20, 16);
      ctx.fill();
      ctx.restore();

      // Clip for wave decorations
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(10, oY + 10, W - 20, CH - 20, 16);
      ctx.clip();

      // Top header band
      const hH = 65;
      const hGrad = ctx.createLinearGradient(10, oY + 10, W - 10, oY + 10);
      hGrad.addColorStop(0, t.primary);
      hGrad.addColorStop(0.5, t.secondary);
      hGrad.addColorStop(1, t.primary);
      ctx.fillStyle = hGrad;
      ctx.fillRect(10, oY + 10, W - 20, hH);

      ctx.restore();

      // Institution name on header
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(institution.toUpperCase(), W / 2, oY + 40);
      ctx.font = "11px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#ffffffbb";
      ctx.fillText("STUDENT IDENTITY CARD — BACK", W / 2, oY + 58);

      // ===== Two-column details =====
      const cY = oY + 95;
      const colL = 45, colR = W / 2 + 30, colW = W / 2 - 75;
      const rH = 40;

      const leftData = [
        { label: "Father's Name", value: fatherName },
        { label: "Mother's Name", value: motherName },
        { label: "Date of Birth", value: formatDate(dob) },
        { label: "Blood Group", value: blood },
        { label: "Emergency Contact", value: emergencyContact },
      ];
      const rightData = [
        { label: "Permanent Address", value: address },
        { label: "Student ID", value: studentId },
        { label: "Session", value: session },
        { label: "Department", value: department },
        { label: "Valid Until", value: formatDate(validUntil) },
      ];

      const drawCol = (fields: { label: string; value: string }[], sx: number, sy: number, cw: number) => {
        let y = sy;
        fields.forEach((f, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = t.primary + "08";
            ctx.beginPath();
            ctx.roundRect(sx - 8, y - 6, cw + 16, rH, 4);
            ctx.fill();
          }
          ctx.fillStyle = t.primary;
          ctx.font = "bold 9px 'Segoe UI', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), sx, y + 10);
          ctx.fillStyle = "#333";
          ctx.font = "13px 'Segoe UI', sans-serif";
          let val = f.value;
          while (ctx.measureText(val).width > cw - 10 && val.length > 5) val = val.slice(0, -1) + "…";
          ctx.fillText(val, sx, y + 26);
          if (i < fields.length - 1) {
            ctx.strokeStyle = "#e8e8e8";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(sx, y + rH - 4);
            ctx.lineTo(sx + cw, y + rH - 4);
            ctx.stroke();
          }
          y += rH;
        });
      };

      drawCol(leftData, colL, cY, colW);
      drawCol(rightData, colR, cY, colW);

      // Vertical divider
      ctx.strokeStyle = t.primary + "20";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(W / 2 + 10, cY - 5);
      ctx.lineTo(W / 2 + 10, cY + rH * 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Terms & Conditions
      const tY = cY + rH * 5 + 15;
      ctx.fillStyle = "#fafafa";
      ctx.strokeStyle = "#e5e5e5";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.roundRect(35, tY, W - 70, 72, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(35, tY, W - 70, 72, 8);
      ctx.stroke();

      ctx.fillStyle = t.primary;
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TERMS & CONDITIONS", 50, tY + 14);
      ctx.fillStyle = "#666";
      ctx.font = "8px 'Segoe UI', sans-serif";
      ["1. This card must be carried at all times within campus.",
       "2. Loss must be reported immediately to administration.",
       "3. Non-transferable; property of the institution.",
       "4. Misuse may result in disciplinary action.",
      ].forEach((line, i) => ctx.fillText(line, 50, tY + 28 + i * 12));

      // Signature & Seal
      const sigY = tY + 82;
      ctx.strokeStyle = t.primary + "40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(120, sigY + 18, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = t.primary + "12";
      ctx.fill();
      ctx.fillStyle = t.primary + "88";
      ctx.font = "bold 7px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SEAL", 120, sigY + 20);

      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(W - 240, sigY + 28);
      ctx.lineTo(W - 50, sigY + 28);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#777";
      ctx.font = "8px 'Segoe UI', sans-serif";
      ctx.fillText("Authorized Signature", W - 145, sigY + 42);

      // Footer
      const fY = oY + CH - 55;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(10, oY + 10, W - 20, CH - 20, 16);
      ctx.clip();
      const fGrad = ctx.createLinearGradient(10, fY, W, fY);
      fGrad.addColorStop(0, t.primary);
      fGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = fGrad;
      ctx.fillRect(10, fY, W - 20, 50);
      ctx.restore();

      drawBarcode(ctx, W / 2 - 130, fY + 5, 260, 20, studentId, "#fff");
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 8px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(studentId, W / 2, fY + 33);
    };

    // Draw
    drawFront(0);
    if (!photo && showBack) drawBack(CH + 50);
    if (!photo) setGenerated(true);
  }, [name, studentId, department, institution, session, blood, phone, email, dob, fatherName, motherName, address, emergencyContact, theme, photo, showBack, validUntil]);

  const downloadCard = () => {
    generate();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = `student-id-${studentId}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast.success("Student ID Card downloaded!");
    }, 500);
  };

  const resetAll = () => {
    setName("Francois Mercer"); setStudentId("123-456-7890"); setDepartment("Sociology");
    setInstitution("Liceria University"); setSession("2025"); setBlood("A+");
    setPhone("+880 1234-567890"); setEmail("john@university.edu"); setDob("2000-01-22");
    setFatherName("Robert Mercer"); setMotherName("Jane Mercer"); setAddress("123 Anywhere St., Any City");
    setEmergencyContact("+880 9876-543210"); setTheme("purple"); setPhoto(""); setShowBack(true);
    setGenerated(false);
    toast.info("Form reset!");
  };

  return (
    <ToolLayout title="Student ID Card Maker" description="Create professional student ID cards with photo, themes, front/back, barcode & QR">
      <div className="space-y-6 max-w-3xl mx-auto">

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="personal" className="gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> Personal</TabsTrigger>
            <TabsTrigger value="academic" className="gap-1.5 text-xs"><GraduationCap className="w-3.5 h-3.5" /> Academic</TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs"><Palette className="w-3.5 h-3.5" /> Design</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Date of Birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Father's Name</Label><Input value={fatherName} onChange={e => setFatherName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Mother's Name</Label><Input value={motherName} onChange={e => setMotherName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Blood Group</Label><Input value={blood} onChange={e => setBlood(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Emergency Contact</Label><Input value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="rounded-xl" /></div>
              <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs text-muted-foreground">Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs text-muted-foreground">Institution Name</Label><Input value={institution} onChange={e => setInstitution(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Student ID</Label><Input value={studentId} onChange={e => setStudentId(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Department / Major</Label><Input value={department} onChange={e => setDepartment(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Academic Year / Session</Label><Input value={session} onChange={e => setSession(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Valid Until</Label><Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Color Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{themes.map(t2 => <SelectItem key={t2.id} value={t2.id}>{t2.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <Button variant="outline" className="rounded-xl gap-1.5 w-full" onClick={() => photoRef.current?.click()}>
                  <Upload className="w-4 h-4" /> {photo ? "Change Photo" : "Upload Photo"}
                </Button>
                {photo && <img src={photo} alt="" className="w-12 h-14 rounded-lg object-cover border mx-auto" />}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {themes.map(t2 => (
                <button key={t2.id} onClick={() => setTheme(t2.id)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${theme === t2.id ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: `linear-gradient(135deg, ${t2.primary}, ${t2.accent})` }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showBack} onCheckedChange={setShowBack} />
              <Label className="text-xs">Show Back Side</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: GraduationCap, value: department.length > 18 ? department.slice(0, 18) + "…" : department, label: "Department", color: "from-blue-500/20 to-indigo-500/10", iconColor: "text-blue-500", border: "border-blue-500/20" },
            { icon: User, value: studentId, label: "Student ID", color: "from-primary/20 to-primary/5", iconColor: "text-primary", border: "border-primary/20" },
            { icon: Palette, value: themes.find(t2 => t2.id === theme)?.name || theme, label: "Theme", color: "from-purple-500/20 to-fuchsia-500/10", iconColor: "text-purple-500", border: "border-purple-500/20" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} backdrop-blur-sm p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`w-9 h-9 mx-auto mb-2 rounded-xl bg-background/80 flex items-center justify-center shadow-sm ${stat.iconColor}`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-sm font-bold truncate">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="tool-btn-primary px-6 py-3 flex items-center gap-2 text-sm font-bold">
            <Eye className="w-4 h-4" /> Preview Card
          </button>
          <button onClick={downloadCard} className="tool-btn-primary px-6 py-3 flex items-center gap-2 text-sm font-bold" style={{ background: "linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%))" }}>
            <Download className="w-4 h-4" /> Download PNG
          </button>
          <Button onClick={resetAll} variant="ghost" className="rounded-xl gap-1.5 text-muted-foreground hover:text-destructive">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="tool-result-card relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full rounded-2xl" style={{ maxWidth: "100%" }} />
          {!generated && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2 py-20">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-10 h-10 text-primary/30" />
              </motion.div>
              <p className="text-sm font-semibold">Click "Preview Card" to generate</p>
            </div>
          )}
        </motion.div>
      </div>
    </ToolLayout>
  );
}

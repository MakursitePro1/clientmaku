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
  { id: "blue", name: "Royal Blue", primary: "#1a237e", secondary: "#283593", accent: "#3f51b5", text: "#ffffff" },
  { id: "green", name: "Emerald", primary: "#1b5e20", secondary: "#2e7d32", accent: "#43a047", text: "#ffffff" },
  { id: "red", name: "Crimson", primary: "#b71c1c", secondary: "#c62828", accent: "#e53935", text: "#ffffff" },
  { id: "purple", name: "Royal Purple", primary: "#4a148c", secondary: "#6a1b9a", accent: "#8e24aa", text: "#ffffff" },
  { id: "dark", name: "Dark Mode", primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460", text: "#e0e0e0" },
  { id: "gold", name: "Gold Premium", primary: "#5d4037", secondary: "#795548", accent: "#d4a574", text: "#fff8e1" },
  { id: "teal", name: "Teal Modern", primary: "#004d40", secondary: "#00695c", accent: "#26a69a", text: "#ffffff" },
  { id: "navy", name: "Navy Classic", primary: "#0d1b2a", secondary: "#1b2838", accent: "#415a77", text: "#e0e1dd" },
];

const layouts = [
  { id: "classic", name: "Classic Vertical" },
  { id: "modern", name: "Modern Horizontal" },
  { id: "minimal", name: "Minimal Clean" },
];

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export default function StudentIdCard() {
  const [name, setName] = useState("John Doe");
  const [studentId, setStudentId] = useState("STU-2024-001");
  const [department, setDepartment] = useState("Computer Science");
  const [institution, setInstitution] = useState("University of Technology");
  const [session, setSession] = useState("2023-2024");
  const [blood, setBlood] = useState("A+");
  const [phone, setPhone] = useState("+880 1234-567890");
  const [email, setEmail] = useState("john@university.edu");
  const [dob, setDob] = useState("2000-01-15");
  const [fatherName, setFatherName] = useState("Robert Doe");
  const [motherName, setMotherName] = useState("Jane Doe");
  const [address, setAddress] = useState("123 University Road, Dhaka");
  const [emergencyContact, setEmergencyContact] = useState("+880 9876-543210");
  const [theme, setTheme] = useState("blue");
  const [layout, setLayout] = useState("classic");
  const [photo, setPhoto] = useState<string>("");
  const [showBack, setShowBack] = useState(false);
  const [showBarcode, setShowBarcode] = useState(true);
  const [showQr, setShowQr] = useState(true);
  const [validUntil, setValidUntil] = useState("2025-12-31");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, text: string) => {
    const bars = text.split("").map(c => c.charCodeAt(0));
    const barW = w / (bars.length * 11);
    bars.forEach((b, i) => {
      const pattern = b.toString(2).padStart(8, "0");
      pattern.split("").forEach((bit, j) => {
        if (bit === "1") {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + (i * 11 + j) * barW, y, barW, h);
        }
      });
    });
    ctx.fillStyle = "#333";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, x + w / 2, y + h + 10);
  };

  const drawQrPlaceholder = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, size, size);
    const cellSize = size / 21;
    const pattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    ];
    pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize, cellSize);
        }
      });
    });
    // Fill remaining area with random-ish pattern
    for (let r = 7; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        if ((r + c) % 3 === 0 || (r * c) % 5 === 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 650, h = showBack ? 820 : 420;
    canvas.width = w;
    canvas.height = h;
    const t = themes.find(th => th.id === theme) || themes[0];

    ctx.clearRect(0, 0, w, h);

    // === FRONT SIDE ===
    const cardH = 400;

    // Card shadow
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, cardH);
    grad.addColorStop(0, t.primary);
    grad.addColorStop(0.5, t.secondary);
    grad.addColorStop(1, t.primary);
    ctx.fillStyle = grad;
    drawRoundRect(ctx, 0, 0, w, cardH, 16);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Inner card
    ctx.fillStyle = "#ffffff";
    drawRoundRect(ctx, 6, 6, w - 12, cardH - 12, 12);
    ctx.fill();

    // Decorative top pattern
    ctx.save();
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * 80, Math.random() * 30 + 5, 0, Math.PI * 2);
      ctx.fillStyle = t.primary;
      ctx.fill();
    }
    ctx.restore();

    // Header bar
    const hGrad = ctx.createLinearGradient(6, 6, w - 6, 70);
    hGrad.addColorStop(0, t.primary);
    hGrad.addColorStop(1, t.accent);
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.roundRect(6, 6, w - 12, 62, [12, 12, 0, 0]);
    ctx.fill();

    // Institution name
    ctx.fillStyle = t.text;
    ctx.font = "bold 17px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(institution.toUpperCase(), w / 2, 32);

    // Tagline
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Excellence in Education & Research", w / 2, 52);

    // Sub-header
    ctx.fillStyle = t.accent;
    ctx.fillRect(6, 68, w - 12, 26);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'Segoe UI', sans-serif";
    ctx.fillText("— STUDENT IDENTITY CARD —", w / 2, 85);

    // Photo area
    const px = 30, py = 108, pw = 120, ph = 150;
    // Photo border with gradient
    const photoGrad = ctx.createLinearGradient(px - 3, py - 3, px + pw + 3, py + ph + 3);
    photoGrad.addColorStop(0, t.primary);
    photoGrad.addColorStop(1, t.accent);
    ctx.fillStyle = photoGrad;
    drawRoundRect(ctx, px - 3, py - 3, pw + 6, ph + 6, 8);
    ctx.fill();

    ctx.fillStyle = "#f5f5f5";
    drawRoundRect(ctx, px, py, pw, ph, 6);
    ctx.fill();

    const drawAfterPhoto = () => {
      if (!ctx) return;

      // Name plate under photo
      ctx.fillStyle = t.primary;
      drawRoundRect(ctx, px - 3, py + ph + 8, pw + 6, 24, 4);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ID: " + studentId, px + pw / 2, py + ph + 24);

      // Details section
      ctx.textAlign = "left";
      const sx = 170, gap = 26;
      let y = 112;
      const fields = [
        { label: "Full Name", value: name },
        { label: "Student ID", value: studentId },
        { label: "Department", value: department },
        { label: "Session", value: session },
        { label: "Blood Group", value: blood },
        { label: "Date of Birth", value: dob },
        { label: "Father's Name", value: fatherName },
        { label: "Phone", value: phone },
        { label: "Email", value: email },
      ];

      fields.forEach(f => {
        ctx.fillStyle = t.accent;
        ctx.font = "bold 8px 'Segoe UI', sans-serif";
        ctx.fillText(f.label.toUpperCase(), sx, y);
        ctx.fillStyle = "#222";
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText(f.value, sx, y + 13);
        // Subtle underline
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, y + 17);
        ctx.lineTo(w - 30, y + 17);
        ctx.stroke();
        y += gap;
      });

      // QR Code
      if (showQr) {
        drawQrPlaceholder(ctx, w - 95, 108, 65);
        ctx.fillStyle = "#999";
        ctx.font = "7px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan to Verify", w - 62, 182);
      }

      // Valid until badge
      ctx.fillStyle = t.accent + "20";
      drawRoundRect(ctx, w - 110, 190, 85, 22, 4);
      ctx.fill();
      ctx.fillStyle = t.accent;
      ctx.font = "bold 8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Valid: ${validUntil}`, w - 67, 205);

      // Footer
      const fGrad = ctx.createLinearGradient(6, cardH - 48, w - 6, cardH - 6);
      fGrad.addColorStop(0, t.primary);
      fGrad.addColorStop(1, t.accent);
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.roundRect(6, cardH - 48, w - 12, 42, [0, 0, 12, 12]);
      ctx.fill();

      // Barcode in footer
      if (showBarcode) {
        drawBarcode(ctx, 20, cardH - 42, 140, 20, studentId.replace(/[^A-Z0-9]/gi, ""));
      }

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("This card is the property of " + institution + ". If found, please return.", w / 2 + 40, cardH - 28);
      ctx.fillText("Generated by Cyber Venom Tools", w / 2 + 40, cardH - 16);

      // === BACK SIDE ===
      if (showBack) {
        const by = cardH + 20;

        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;

        const bGrad = ctx.createLinearGradient(0, by, w, by + cardH);
        bGrad.addColorStop(0, t.secondary);
        bGrad.addColorStop(1, t.primary);
        ctx.fillStyle = bGrad;
        drawRoundRect(ctx, 0, by, w, cardH, 16);
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        drawRoundRect(ctx, 6, by + 6, w - 12, cardH - 12, 12);
        ctx.fill();

        // Back header
        ctx.fillStyle = t.primary;
        ctx.beginPath();
        ctx.roundRect(6, by + 6, w - 12, 40, [12, 12, 0, 0]);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BACK SIDE — ADDITIONAL INFORMATION", w / 2, by + 32);

        // Back details
        ctx.textAlign = "left";
        let bY = by + 70;
        const backFields = [
          { label: "Father's Name", value: fatherName },
          { label: "Mother's Name", value: motherName },
          { label: "Permanent Address", value: address },
          { label: "Emergency Contact", value: emergencyContact },
          { label: "Blood Group", value: blood },
          { label: "Valid Until", value: validUntil },
        ];

        backFields.forEach(f => {
          ctx.fillStyle = t.accent;
          ctx.font = "bold 9px sans-serif";
          ctx.fillText(f.label.toUpperCase(), 30, bY);
          ctx.fillStyle = "#222";
          ctx.font = "13px 'Segoe UI', sans-serif";
          ctx.fillText(f.value, 30, bY + 16);
          ctx.strokeStyle = "#eee";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(30, bY + 22);
          ctx.lineTo(w - 30, bY + 22);
          ctx.stroke();
          bY += 35;
        });

        // Terms & conditions
        ctx.fillStyle = "#f5f5f5";
        drawRoundRect(ctx, 20, bY + 10, w - 40, 80, 8);
        ctx.fill();
        ctx.fillStyle = "#666";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText("TERMS & CONDITIONS:", 35, bY + 30);
        ctx.font = "8px sans-serif";
        const terms = [
          "1. This card must be carried at all times within campus premises.",
          "2. Loss of card must be reported immediately to the administration.",
          "3. This card is non-transferable and remains property of the institution.",
          "4. Misuse of this card will result in disciplinary action.",
        ];
        terms.forEach((term, i) => {
          ctx.fillText(term, 35, bY + 45 + i * 13);
        });

        // Large barcode on back
        if (showBarcode) {
          drawBarcode(ctx, w / 2 - 100, by + cardH - 60, 200, 30, studentId.replace(/[^A-Z0-9]/gi, ""));
        }
      }
    };

    if (photo) {
      const img = new Image();
      img.onload = () => {
        // Crop to fit
        const aspect = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        const targetAspect = pw / ph;
        if (aspect > targetAspect) {
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetAspect;
          sy = (img.height - sh) / 2;
        }
        ctx.save();
        drawRoundRect(ctx, px, py, pw, ph, 6);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
        ctx.restore();
        drawAfterPhoto();
      };
      img.src = photo;
    } else {
      ctx.fillStyle = "#ddd";
      ctx.font = "40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👤", px + pw / 2, py + ph / 2 + 10);
      ctx.fillStyle = "#bbb";
      ctx.font = "10px sans-serif";
      ctx.fillText("Upload Photo", px + pw / 2, py + ph / 2 + 35);
      drawAfterPhoto();
    }
  }, [name, studentId, department, institution, session, blood, phone, email, dob, fatherName, motherName, address, emergencyContact, theme, photo, showBack, showBarcode, showQr, validUntil, layout]);

  const downloadCard = () => {
    generate();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = `student-id-${studentId}.png`;
      a.href = canvasRef.current?.toDataURL("image/png") || "";
      a.click();
      toast.success("Student ID Card downloaded!");
    }, 300);
  };

  const resetAll = () => {
    setName("John Doe"); setStudentId("STU-2024-001"); setDepartment("Computer Science");
    setInstitution("University of Technology"); setSession("2023-2024"); setBlood("A+");
    setPhone("+880 1234-567890"); setEmail("john@university.edu"); setDob("2000-01-15");
    setFatherName("Robert Doe"); setMotherName("Jane Doe"); setAddress("123 University Road, Dhaka");
    setEmergencyContact("+880 9876-543210"); setTheme("blue"); setPhoto(""); setShowBack(false);
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
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Session</Label><Input value={session} onChange={e => setSession(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Valid Until</Label><Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Color Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
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
            {/* Theme preview */}
            <div className="flex gap-2 flex-wrap">
              {themes.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${theme === t.id ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Switch checked={showBack} onCheckedChange={setShowBack} /><Label className="text-xs">Show Back Side</Label></div>
              <div className="flex items-center gap-2"><Switch checked={showBarcode} onCheckedChange={setShowBarcode} /><Label className="text-xs">Barcode</Label></div>
              <div className="flex items-center gap-2"><Switch checked={showQr} onCheckedChange={setShowQr} /><Label className="text-xs">QR Code</Label></div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-1.5">
            <Eye className="w-4 h-4" /> Preview Card
          </Button>
          <Button onClick={downloadCard} variant="outline" className="rounded-xl gap-1.5">
            <Download className="w-4 h-4" /> Download PNG
          </Button>
          <Button onClick={resetAll} variant="ghost" className="rounded-xl gap-1.5 text-muted-foreground">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <canvas ref={canvasRef} className="w-full rounded-2xl border border-border shadow-lg bg-accent/10" />
          {!canvasRef.current?.width && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2 py-20">
              <Sparkles className="w-8 h-8 opacity-30" />
              <p className="text-sm">Click "Preview Card" to generate</p>
            </div>
          )}
        </motion.div>
      </div>
    </ToolLayout>
  );
}

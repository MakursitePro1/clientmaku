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
  { id: "blue", name: "Royal Blue", primary: "#0d47a1", secondary: "#1565c0", accent: "#1976d2", headerBg: "#0d47a1", text: "#ffffff", cardBg: "#ffffff" },
  { id: "green", name: "Emerald", primary: "#1b5e20", secondary: "#2e7d32", accent: "#388e3c", headerBg: "#1b5e20", text: "#ffffff", cardBg: "#ffffff" },
  { id: "red", name: "Crimson", primary: "#b71c1c", secondary: "#c62828", accent: "#d32f2f", headerBg: "#b71c1c", text: "#ffffff", cardBg: "#ffffff" },
  { id: "purple", name: "Royal Purple", primary: "#4a148c", secondary: "#6a1b9a", accent: "#7b1fa2", headerBg: "#4a148c", text: "#ffffff", cardBg: "#ffffff" },
  { id: "dark", name: "Dark Mode", primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460", headerBg: "#1a1a2e", text: "#e0e0e0", cardBg: "#f8f9fa" },
  { id: "gold", name: "Gold Premium", primary: "#5d4037", secondary: "#6d4c41", accent: "#8d6e63", headerBg: "#5d4037", text: "#fff8e1", cardBg: "#ffffff" },
  { id: "teal", name: "Teal Modern", primary: "#004d40", secondary: "#00695c", accent: "#00897b", headerBg: "#004d40", text: "#ffffff", cardBg: "#ffffff" },
  { id: "navy", name: "Navy Classic", primary: "#0d1b2a", secondary: "#1b2838", accent: "#415a77", headerBg: "#0d1b2a", text: "#e0e1dd", cardBg: "#ffffff" },
];

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

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
  const [photo, setPhoto] = useState<string>("");
  const [showBack, setShowBack] = useState(false);
  const [validUntil, setValidUntil] = useState("2025-12-31");
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

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, data: string) => {
    const cleanData = data.replace(/[^A-Za-z0-9]/g, "");
    const totalBars = cleanData.length * 11 + 20;
    const barW = w / totalBars;
    
    // Start guard
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, barW * 2, h);
    ctx.fillRect(x + barW * 3, y, barW, h);
    
    let offset = barW * 5;
    for (let i = 0; i < cleanData.length; i++) {
      const charCode = cleanData.charCodeAt(i);
      const binary = charCode.toString(2).padStart(8, "0");
      for (let j = 0; j < 8; j++) {
        if (binary[j] === "1") {
          ctx.fillStyle = "#000000";
          ctx.fillRect(x + offset, y, barW, h);
        }
        offset += barW;
      }
      offset += barW * 3;
    }
    
    // End guard
    ctx.fillRect(x + w - barW * 4, y, barW, h);
    ctx.fillRect(x + w - barW * 2, y, barW * 2, h);

    ctx.fillStyle = "#333333";
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(cleanData, x + w / 2, y + h + 12);
  };

  const drawQrCode = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, size, size);
    
    const modules = 25;
    const cellSize = size / modules;
    
    // Generate a deterministic QR-like pattern from studentId
    const seed = studentId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    
    // Draw finder patterns (3 corners)
    const drawFinder = (fx: number, fy: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(fx, fy, cellSize * 7, cellSize * 7);
      ctx.fillStyle = "#fff";
      ctx.fillRect(fx + cellSize, fy + cellSize, cellSize * 5, cellSize * 5);
      ctx.fillStyle = "#000";
      ctx.fillRect(fx + cellSize * 2, fy + cellSize * 2, cellSize * 3, cellSize * 3);
    };
    
    drawFinder(x, y);
    drawFinder(x + (modules - 7) * cellSize, y);
    drawFinder(x, y + (modules - 7) * cellSize);
    
    // Timing patterns
    for (let i = 8; i < modules - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(x + i * cellSize, y + 6 * cellSize, cellSize, cellSize);
        ctx.fillRect(x + 6 * cellSize, y + i * cellSize, cellSize, cellSize);
      }
    }
    
    // Data area with pseudo-random pattern
    for (let r = 9; r < modules - 1; r++) {
      for (let c = 9; c < modules - 1; c++) {
        const hash = ((r * 31 + c * 17 + seed) * 2654435761) >>> 0;
        if (hash % 3 !== 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize, cellSize);
        }
      }
    }
    // Fill some data in bottom-right quadrant
    for (let r = 9; r < modules - 8; r++) {
      for (let c = 0; c < 8; c++) {
        const hash = ((r * 13 + c * 7 + seed * 3) * 2654435761) >>> 0;
        if (hash % 4 !== 0) {
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

    const CARD_W = 680;
    const CARD_H = 430;
    const w = CARD_W;
    const h = showBack ? CARD_H * 2 + 30 : CARD_H;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);
    const t = themes.find(th => th.id === theme) || themes[0];

    ctx.clearRect(0, 0, w, h);

    // ============ FRONT SIDE ============
    // Card shadow
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    ctx.shadowOffsetX = 2;
    ctx.fillStyle = t.cardBg;
    drawRoundRect(ctx, 0, 0, w, CARD_H, 14);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = 0;

    // Card border
    ctx.strokeStyle = t.primary + "40";
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, 0, 0, w, CARD_H, 14);
    ctx.stroke();

    // Top header band
    const headerH = 75;
    const hGrad = ctx.createLinearGradient(0, 0, w, 0);
    hGrad.addColorStop(0, t.primary);
    hGrad.addColorStop(0.5, t.secondary);
    hGrad.addColorStop(1, t.primary);
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.roundRect(1, 1, w - 2, headerH, [14, 14, 0, 0]);
    ctx.fill();

    // Subtle pattern on header
    ctx.save();
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < w; i += 20) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 30, headerH);
      ctx.stroke();
    }
    ctx.restore();

    // Institution name
    ctx.fillStyle = t.text;
    ctx.font = "bold 19px 'Georgia', 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.fillText(institution.toUpperCase(), w / 2, 30);

    // Subtitle
    ctx.font = "12px 'Segoe UI', Arial, sans-serif";
    ctx.fillStyle = t.text + "cc";
    ctx.fillText("Excellence in Education & Research", w / 2, 48);

    // Student Identity Card label
    ctx.fillStyle = t.text;
    ctx.font = "bold 11px 'Segoe UI', sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("━━  STUDENT IDENTITY CARD  ━━", w / 2, 67);

    // Thin accent line
    ctx.fillStyle = t.accent + "80";
    ctx.fillRect(1, headerH, w - 2, 3);

    // ---- Content Area ----
    const contentY = headerH + 14;

    // Photo area
    const px = 28, py = contentY, pw = 125, ph = 155;
    
    // Photo frame with gradient border
    const framePad = 3;
    const frameGrad = ctx.createLinearGradient(px - framePad, py - framePad, px + pw + framePad, py + ph + framePad);
    frameGrad.addColorStop(0, t.primary);
    frameGrad.addColorStop(0.5, t.accent);
    frameGrad.addColorStop(1, t.primary);
    ctx.fillStyle = frameGrad;
    drawRoundRect(ctx, px - framePad, py - framePad, pw + framePad * 2, ph + framePad * 2, 8);
    ctx.fill();

    ctx.fillStyle = "#f0f0f0";
    drawRoundRect(ctx, px, py, pw, ph, 6);
    ctx.fill();

    const drawContent = () => {
      if (!ctx) return;

      // Name badge below photo
      const badgeY = py + ph + 10;
      ctx.fillStyle = t.primary;
      drawRoundRect(ctx, px - framePad, badgeY, pw + framePad * 2, 26, 5);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(studentId, px + pw / 2, badgeY + 17);

      // Blood group badge
      const bloodBadgeY = badgeY + 32;
      ctx.fillStyle = "#dc2626";
      drawRoundRect(ctx, px + pw / 2 - 30, bloodBadgeY, 60, 22, 11);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'Segoe UI', sans-serif";
      ctx.fillText("🩸 " + blood, px + pw / 2, bloodBadgeY + 15);

      // --- Right side details ---
      ctx.textAlign = "left";
      const detailX = 175;
      const detailW = w - detailX - 20;
      let dy = contentY + 2;
      const lineH = 28;

      const fields = [
        { label: "FULL NAME", value: name },
        { label: "FATHER'S NAME", value: fatherName },
        { label: "DEPARTMENT", value: department },
        { label: "SESSION", value: session },
        { label: "DATE OF BIRTH", value: dob },
        { label: "PHONE", value: phone },
        { label: "EMAIL", value: email },
        { label: "VALID UNTIL", value: validUntil },
      ];

      fields.forEach((f, i) => {
        // Label
        ctx.fillStyle = t.primary;
        ctx.font = "bold 7.5px 'Segoe UI', sans-serif";
        ctx.fillText(f.label, detailX, dy + 9);

        // Value
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "600 12px 'Segoe UI', Arial, sans-serif";
        
        // Truncate if too long
        let displayVal = f.value;
        while (ctx.measureText(displayVal).width > detailW - 10 && displayVal.length > 5) {
          displayVal = displayVal.slice(0, -1);
        }
        ctx.fillText(displayVal, detailX, dy + 22);

        // Separator line
        if (i < fields.length - 1) {
          ctx.strokeStyle = "#e8e8e8";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(detailX, dy + lineH - 1);
          ctx.lineTo(detailX + detailW, dy + lineH - 1);
          ctx.stroke();
        }

        dy += lineH;
      });

      // QR code in bottom-right
      const qrSize = 70;
      const qrX = w - qrSize - 22;
      const qrY = CARD_H - qrSize - 55;
      
      // QR frame
      ctx.fillStyle = "#f8f8f8";
      drawRoundRect(ctx, qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 6);
      ctx.fill();
      ctx.strokeStyle = t.primary + "30";
      ctx.lineWidth = 1;
      drawRoundRect(ctx, qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 6);
      ctx.stroke();
      
      drawQrCode(ctx, qrX, qrY, qrSize);
      ctx.fillStyle = "#888";
      ctx.font = "7px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to Verify", qrX + qrSize / 2, qrY + qrSize + 12);

      // Bottom bar
      const footerH = 38;
      const footerY = CARD_H - footerH;
      const fGrad = ctx.createLinearGradient(0, footerY, w, footerY);
      fGrad.addColorStop(0, t.primary);
      fGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.roundRect(1, footerY, w - 2, footerH - 1, [0, 0, 14, 14]);
      ctx.fill();

      // Barcode in footer
      drawBarcode(ctx, 15, footerY + 5, 160, 18, studentId);

      // Footer text
      ctx.fillStyle = t.text + "cc";
      ctx.font = "7px 'Segoe UI', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("This card is property of " + institution, w - 15, footerY + 14);
      ctx.fillText("If found, please return to the administration office", w - 15, footerY + 26);

      // ============ BACK SIDE ============
      if (showBack) {
        const BY = CARD_H + 30;

        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = t.cardBg;
        drawRoundRect(ctx, 0, BY, w, CARD_H, 14);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = t.primary + "40";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, 0, BY, w, CARD_H, 14);
        ctx.stroke();

        // Back header
        const bHeaderH = 50;
        ctx.fillStyle = t.primary;
        ctx.beginPath();
        ctx.roundRect(1, BY + 1, w - 2, bHeaderH, [14, 14, 0, 0]);
        ctx.fill();

        ctx.fillStyle = t.text;
        ctx.font = "bold 15px 'Georgia', serif";
        ctx.textAlign = "center";
        ctx.fillText(institution.toUpperCase(), w / 2, BY + 22);
        ctx.font = "10px 'Segoe UI', sans-serif";
        ctx.fillStyle = t.text + "cc";
        ctx.fillText("ADDITIONAL INFORMATION", w / 2, BY + 40);

        ctx.fillStyle = t.accent + "80";
        ctx.fillRect(1, BY + bHeaderH, w - 2, 2);

        // Back content - two columns
        const bContentY = BY + bHeaderH + 18;
        const colW = (w - 60) / 2;
        
        const leftFields = [
          { label: "FATHER'S NAME", value: fatherName },
          { label: "MOTHER'S NAME", value: motherName },
          { label: "BLOOD GROUP", value: blood },
          { label: "EMERGENCY CONTACT", value: emergencyContact },
        ];

        const rightFields = [
          { label: "PERMANENT ADDRESS", value: address },
          { label: "STUDENT ID", value: studentId },
          { label: "VALID UNTIL", value: validUntil },
          { label: "SESSION", value: session },
        ];

        ctx.textAlign = "left";
        let lY = bContentY;
        leftFields.forEach((f, i) => {
          ctx.fillStyle = t.primary;
          ctx.font = "bold 7.5px 'Segoe UI', sans-serif";
          ctx.fillText(f.label, 25, lY);
          ctx.fillStyle = "#222";
          ctx.font = "12px 'Segoe UI', sans-serif";
          ctx.fillText(f.value, 25, lY + 15);
          if (i < leftFields.length - 1) {
            ctx.strokeStyle = "#e8e8e8";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(25, lY + 22);
            ctx.lineTo(25 + colW, lY + 22);
            ctx.stroke();
          }
          lY += 32;
        });

        let rY = bContentY;
        rightFields.forEach((f, i) => {
          ctx.fillStyle = t.primary;
          ctx.font = "bold 7.5px 'Segoe UI', sans-serif";
          ctx.fillText(f.label, w / 2 + 10, rY);
          ctx.fillStyle = "#222";
          ctx.font = "12px 'Segoe UI', sans-serif";
          let val = f.value;
          while (ctx.measureText(val).width > colW - 10 && val.length > 5) {
            val = val.slice(0, -1);
          }
          ctx.fillText(val, w / 2 + 10, rY + 15);
          if (i < rightFields.length - 1) {
            ctx.strokeStyle = "#e8e8e8";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(w / 2 + 10, rY + 22);
            ctx.lineTo(w - 25, rY + 22);
            ctx.stroke();
          }
          rY += 32;
        });

        // Divider line between columns
        ctx.strokeStyle = t.primary + "20";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w / 2, bContentY - 8);
        ctx.lineTo(w / 2, bContentY + 120);
        ctx.stroke();

        // Terms & Conditions box
        const termsY = bContentY + 140;
        ctx.fillStyle = "#f5f5f5";
        drawRoundRect(ctx, 20, termsY, w - 40, 80, 8);
        ctx.fill();
        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 0.5;
        drawRoundRect(ctx, 20, termsY, w - 40, 80, 8);
        ctx.stroke();

        ctx.fillStyle = t.primary;
        ctx.font = "bold 9px 'Segoe UI', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("TERMS & CONDITIONS", 35, termsY + 16);
        
        ctx.fillStyle = "#555";
        ctx.font = "8px 'Segoe UI', sans-serif";
        const terms = [
          "1. This card must be carried at all times within campus premises.",
          "2. Loss of card must be reported immediately to the administration.",
          "3. This card is non-transferable and remains property of the institution.",
          "4. Misuse of this card will result in disciplinary action.",
        ];
        terms.forEach((term, i) => {
          ctx.fillText(term, 35, termsY + 32 + i * 13);
        });

        // Signature area
        const sigY = termsY + 90;
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(w - 200, sigY + 20);
        ctx.lineTo(w - 30, sigY + 20);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#666";
        ctx.font = "8px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Authorized Signature & Seal", w - 115, sigY + 34);

        // Bottom barcode on back
        const bFooterY = BY + CARD_H - 40;
        ctx.fillStyle = t.primary;
        ctx.beginPath();
        ctx.roundRect(1, bFooterY, w - 2, 39, [0, 0, 14, 14]);
        ctx.fill();
        drawBarcode(ctx, w / 2 - 110, bFooterY + 5, 220, 18, studentId);
      }
    };

    // Draw photo
    if (photo) {
      const img = new Image();
      img.onload = () => {
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
        drawContent();
      };
      img.src = photo;
    } else {
      // Default placeholder
      ctx.fillStyle = "#e0e0e0";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👤", px + pw / 2, py + ph / 2 + 8);
      ctx.fillStyle = "#bbb";
      ctx.font = "9px 'Segoe UI', sans-serif";
      ctx.fillText("Upload Photo", px + pw / 2, py + ph / 2 + 32);
      drawContent();
    }

    setGenerated(true);
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
    }, 400);
  };

  const resetAll = () => {
    setName("John Doe"); setStudentId("STU-2024-001"); setDepartment("Computer Science");
    setInstitution("University of Technology"); setSession("2023-2024"); setBlood("A+");
    setPhone("+880 1234-567890"); setEmail("john@university.edu"); setDob("2000-01-15");
    setFatherName("Robert Doe"); setMotherName("Jane Doe"); setAddress("123 University Road, Dhaka");
    setEmergencyContact("+880 9876-543210"); setTheme("blue"); setPhoto(""); setShowBack(false);
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
            <div className="flex items-center gap-2">
              <Switch checked={showBack} onCheckedChange={setShowBack} />
              <Label className="text-xs">Show Back Side</Label>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <GraduationCap className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="stat-value text-sm">{department}</div>
            <div className="stat-label">Department</div>
          </div>
          <div className="tool-stat-card">
            <User className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-sm">{studentId}</div>
            <div className="stat-label">Student ID</div>
          </div>
          <div className="tool-stat-card">
            <Palette className="w-5 h-5 mx-auto text-purple-500 mb-1" />
            <div className="stat-value text-sm capitalize">{theme}</div>
            <div className="stat-label">Theme</div>
          </div>
        </div>

        {/* Actions */}
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

        {/* Canvas */}
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

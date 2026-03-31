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
  { id: "blue", name: "Royal Blue", primary: "#0d47a1", secondary: "#1565c0", accent: "#42a5f5", gold: "#c9a84c", text: "#ffffff" },
  { id: "green", name: "Emerald", primary: "#1b5e20", secondary: "#2e7d32", accent: "#66bb6a", gold: "#c9a84c", text: "#ffffff" },
  { id: "red", name: "Crimson", primary: "#7f1d1d", secondary: "#991b1b", accent: "#ef5350", gold: "#c9a84c", text: "#ffffff" },
  { id: "purple", name: "Royal Purple", primary: "#4a148c", secondary: "#6a1b9a", accent: "#ab47bc", gold: "#c9a84c", text: "#ffffff" },
  { id: "dark", name: "Dark Elegance", primary: "#1a1a2e", secondary: "#16213e", accent: "#5c6bc0", gold: "#d4a84b", text: "#e0e0e0" },
  { id: "gold", name: "Gold Premium", primary: "#3e2723", secondary: "#4e342e", accent: "#8d6e63", gold: "#d4a84b", text: "#fff8e1" },
  { id: "teal", name: "Teal Modern", primary: "#004d40", secondary: "#00695c", accent: "#26a69a", gold: "#c9a84c", text: "#ffffff" },
  { id: "navy", name: "Navy Classic", primary: "#0a1628", secondary: "#1a2744", accent: "#5c7caa", gold: "#c9a84c", text: "#e8eaed" },
];

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number | number[]) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export default function StudentIdCard() {
  const [name, setName] = useState("John Doe");
  const [studentId, setStudentId] = useState("STU-2024-001");
  const [department, setDepartment] = useState("Computer Science & Engineering");
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
  const [showBack, setShowBack] = useState(true);
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

  // ========== Barcode (Code128-like) ==========
  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, data: string, color = "#000") => {
    const clean = data.replace(/[^A-Za-z0-9]/g, "");
    if (!clean) return;
    // Generate a dense barcode pattern
    const bits: number[] = [1,1,0,1,0,0,1,1,0]; // start
    for (let i = 0; i < clean.length; i++) {
      const c = clean.charCodeAt(i);
      for (let b = 7; b >= 0; b--) bits.push((c >> b) & 1);
      bits.push(0, 1); // separator
    }
    bits.push(1,1,0,0,1,1,0,1); // stop
    const barW = w / bits.length;
    ctx.fillStyle = color;
    bits.forEach((bit, i) => {
      if (bit) ctx.fillRect(x + i * barW, y, barW + 0.5, h);
    });
  };

  // ========== QR Code ==========
  const drawQR = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const m = 21, cs = size / m;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, size, size);
    const seed = (studentId + name).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    // Finder patterns
    const finder = (fx: number, fy: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(fx, fy, cs * 7, cs * 7);
      ctx.fillStyle = "#fff";
      ctx.fillRect(fx + cs, fy + cs, cs * 5, cs * 5);
      ctx.fillStyle = "#000";
      ctx.fillRect(fx + cs * 2, fy + cs * 2, cs * 3, cs * 3);
    };
    finder(x, y);
    finder(x + (m - 7) * cs, y);
    finder(x, y + (m - 7) * cs);
    // Timing
    for (let i = 8; i < m - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(x + i * cs, y + 6 * cs, cs, cs);
        ctx.fillRect(x + 6 * cs, y + i * cs, cs, cs);
      }
    }
    // Alignment pattern
    const ac = 16;
    ctx.fillStyle = "#000";
    ctx.fillRect(x + (ac - 2) * cs, y + (ac - 2) * cs, cs * 5, cs * 5);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + (ac - 1) * cs, y + (ac - 1) * cs, cs * 3, cs * 3);
    ctx.fillStyle = "#000";
    ctx.fillRect(x + ac * cs, y + ac * cs, cs, cs);
    // Data fill
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < m; c++) {
        // Skip finder and timing areas
        if (r < 9 && c < 9) continue;
        if (r < 9 && c > m - 9) continue;
        if (r > m - 9 && c < 9) continue;
        if (r === 6 || c === 6) continue;
        if (r >= ac - 2 && r <= ac + 2 && c >= ac - 2 && c <= ac + 2) continue;
        const h = ((r * 37 + c * 19 + seed) * 2654435761) >>> 0;
        if (h % 3 === 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x + c * cs, y + r * cs, cs, cs);
        }
      }
    }
  };

  // ========== Main Generate ==========
  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 860, CH = 540;
    const totalH = showBack ? CH * 2 + 40 : CH;
    canvas.width = W * 2;
    canvas.height = totalH * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, totalH);
    const t = themes.find(th => th.id === theme) || themes[0];

    const drawCard = (oY: number, isFront: boolean) => {
      // ===== Card base =====
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#ffffff";
      rr(ctx, 10, oY + 10, W - 20, CH - 20, 12);
      ctx.fill();
      ctx.restore();

      // Outer border
      ctx.strokeStyle = t.primary;
      ctx.lineWidth = 2.5;
      rr(ctx, 10, oY + 10, W - 20, CH - 20, 12);
      ctx.stroke();

      // Inner border (double line effect)
      ctx.strokeStyle = t.primary + "40";
      ctx.lineWidth = 0.8;
      rr(ctx, 15, oY + 15, W - 30, CH - 30, 10);
      ctx.stroke();

      if (isFront) {
        drawFront(ctx, oY, t);
      } else {
        drawBack(ctx, oY, t);
      }
    };

    const drawFront = (ctx: CanvasRenderingContext2D, oY: number, t: typeof themes[0]) => {
      // ===== Header Band =====
      const hY = oY + 15, hH = 80;
      const hGrad = ctx.createLinearGradient(15, hY, W - 15, hY);
      hGrad.addColorStop(0, t.primary);
      hGrad.addColorStop(0.3, t.secondary);
      hGrad.addColorStop(0.7, t.secondary);
      hGrad.addColorStop(1, t.primary);
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.roundRect(15, hY, W - 30, hH, [10, 10, 0, 0]);
      ctx.fill();

      // Gold accent line under header
      ctx.fillStyle = t.gold;
      ctx.fillRect(15, hY + hH, W - 30, 3);

      // Institution name
      ctx.fillStyle = t.text;
      ctx.font = "bold 22px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText(institution.toUpperCase(), W / 2, hY + 32);

      // Subtitle
      ctx.font = "italic 11px Georgia, serif";
      ctx.fillStyle = t.text + "bb";
      ctx.fillText("Excellence in Education • Research • Innovation", W / 2, hY + 50);

      // "STUDENT IDENTITY CARD" badge
      const badgeW = 240, badgeH = 22;
      const badgeX = W / 2 - badgeW / 2, badgeY2 = hY + hH + 3;
      ctx.fillStyle = t.gold;
      rr(ctx, badgeX, badgeY2, badgeW, badgeH, [0, 0, 6, 6]);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px 'Segoe UI', Arial, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("STUDENT IDENTITY CARD", W / 2, badgeY2 + 15);

      // ===== Content Area =====
      const contentTop = hY + hH + 35;

      // --- Photo ---
      const px = 40, py = contentTop, pw = 145, ph = 180;

      // Photo outer frame (gold)
      ctx.fillStyle = t.gold;
      rr(ctx, px - 4, py - 4, pw + 8, ph + 8, 6);
      ctx.fill();
      // Photo inner frame (primary)
      ctx.fillStyle = t.primary;
      rr(ctx, px - 2, py - 2, pw + 4, ph + 4, 5);
      ctx.fill();

      // Photo area fill
      ctx.fillStyle = "#f0f0f0";
      rr(ctx, px, py, pw, ph, 4);
      ctx.fill();

      const drawAfterPhoto = () => {
        // --- Student ID under photo ---
        const idBadgeY = py + ph + 12;
        ctx.fillStyle = t.primary;
        rr(ctx, px - 4, idBadgeY, pw + 8, 28, 6);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText(studentId, px + pw / 2, idBadgeY + 19);

        // --- Blood group badge ---
        const bBY = idBadgeY + 36;
        ctx.fillStyle = "#b91c1c";
        rr(ctx, px + pw / 2 - 32, bBY, 64, 24, 12);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px 'Segoe UI', sans-serif";
        ctx.fillText("Blood: " + blood, px + pw / 2, bBY + 16);

        // ===== Right Side Details =====
        const dx = 210, dw = W - dx - 35;
        let dy = contentTop;
        const rowH = 34;

        const fields = [
          { label: "Full Name", value: name, bold: true },
          { label: "Father's Name", value: fatherName },
          { label: "Department", value: department },
          { label: "Session", value: session },
          { label: "Date of Birth", value: dob },
          { label: "Phone", value: phone },
          { label: "Email", value: email },
          { label: "Valid Until", value: validUntil },
        ];

        fields.forEach((f, i) => {
          // Alternating row bg
          if (i % 2 === 0) {
            ctx.fillStyle = t.primary + "08";
            rr(ctx, dx - 8, dy - 4, dw + 16, rowH, 4);
            ctx.fill();
          }

          // Label
          ctx.fillStyle = t.primary;
          ctx.font = "bold 8px 'Segoe UI', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), dx, dy + 10);

          // Colon dots
          const labelW = ctx.measureText(f.label.toUpperCase()).width;
          ctx.fillStyle = "#ccc";
          const dotX = dx + labelW + 6;
          const maxDots = Math.floor((140 - labelW) / 6);
          for (let d = 0; d < Math.max(maxDots, 2); d++) {
            ctx.fillRect(dotX + d * 6, dy + 8, 2, 2);
          }

          // Value
          ctx.fillStyle = f.bold ? "#111" : "#333";
          ctx.font = f.bold ? "bold 14px 'Segoe UI', sans-serif" : "13px 'Segoe UI', sans-serif";
          let val = f.value;
          while (ctx.measureText(val).width > dw - 150 && val.length > 5) {
            val = val.slice(0, -1) + "…";
          }
          ctx.fillText(val, dx + 150, dy + 10);

          // Separator
          if (i < fields.length - 1) {
            ctx.strokeStyle = "#e5e5e5";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dx, dy + rowH - 2);
            ctx.lineTo(dx + dw, dy + rowH - 2);
            ctx.stroke();
          }

          dy += rowH;
        });

        // ===== QR Code =====
        const qrSize = 75;
        const qrX = W - qrSize - 40;
        const qrY = oY + CH - 20 - qrSize - 55;

        // QR frame
        ctx.fillStyle = "#f8f8f8";
        ctx.strokeStyle = t.primary + "30";
        ctx.lineWidth = 1;
        rr(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 6);
        ctx.fill();
        rr(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 6);
        ctx.stroke();

        drawQR(ctx, qrX, qrY, qrSize);
        ctx.fillStyle = "#888";
        ctx.font = "7px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan to Verify", qrX + qrSize / 2, qrY + qrSize + 11);

        // ===== Footer Band =====
        const fH = 40;
        const fY = oY + CH - 20 - fH;
        const fGrad = ctx.createLinearGradient(15, fY, W - 15, fY);
        fGrad.addColorStop(0, t.primary);
        fGrad.addColorStop(1, t.secondary);
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.roundRect(15, fY, W - 30, fH + 5, [0, 0, 10, 10]);
        ctx.fill();

        // Gold line above footer
        ctx.fillStyle = t.gold;
        ctx.fillRect(15, fY - 2, W - 30, 2);

        // Barcode in footer (white bars)
        drawBarcode(ctx, 30, fY + 8, 180, 20, studentId, "#fff");
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "bold 7px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText(studentId, 120, fY + 35);

        // Footer text
        ctx.fillStyle = t.text + "bb";
        ctx.font = "7.5px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("This card is the property of " + institution, W - 30, fY + 16);
        ctx.fillText("If found, please return to the administration office.", W - 30, fY + 28);
      };

      // ===== Draw Photo =====
      if (photo) {
        const img = new Image();
        img.onload = () => {
          const aspect = img.width / img.height;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          const tA = pw / ph;
          if (aspect > tA) { sw = img.height * tA; sx = (img.width - sw) / 2; }
          else { sh = img.width / tA; sy = (img.height - sh) / 2; }
          ctx.save();
          rr(ctx, px, py, pw, ph, 4);
          ctx.clip();
          ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
          ctx.restore();
          drawAfterPhoto();
          if (showBack) drawCard(CH + 40, false);
          setGenerated(true);
        };
        img.src = photo;
      } else {
        ctx.fillStyle = "#d4d4d4";
        ctx.font = "56px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👤", px + pw / 2, py + ph / 2 + 12);
        ctx.fillStyle = "#aaa";
        ctx.font = "10px 'Segoe UI', sans-serif";
        ctx.fillText("Upload Photo", px + pw / 2, py + ph / 2 + 38);
        drawAfterPhoto();
      }
    };

    const drawBack = (ctx: CanvasRenderingContext2D, oY: number, t: typeof themes[0]) => {
      // ===== Back Header =====
      const hY = oY + 15, hH = 55;
      ctx.fillStyle = t.primary;
      ctx.beginPath();
      ctx.roundRect(15, hY, W - 30, hH, [10, 10, 0, 0]);
      ctx.fill();

      ctx.fillStyle = t.gold;
      ctx.fillRect(15, hY + hH, W - 30, 2);

      ctx.fillStyle = t.text;
      ctx.font = "bold 16px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(institution.toUpperCase(), W / 2, hY + 25);
      ctx.font = "10px 'Segoe UI', sans-serif";
      ctx.fillStyle = t.text + "bb";
      ctx.fillText("STUDENT IDENTITY CARD — BACK", W / 2, hY + 43);

      // ===== Two-Column Details =====
      const cY = hY + hH + 22;
      const colL = 35, colR = W / 2 + 20;
      const colW2 = W / 2 - 55;
      const rH = 38;

      const leftData = [
        { label: "Father's Name", value: fatherName },
        { label: "Mother's Name", value: motherName },
        { label: "Date of Birth", value: dob },
        { label: "Blood Group", value: blood },
        { label: "Emergency Contact", value: emergencyContact },
      ];
      const rightData = [
        { label: "Permanent Address", value: address },
        { label: "Student ID", value: studentId },
        { label: "Session", value: session },
        { label: "Department", value: department },
        { label: "Valid Until", value: validUntil },
      ];

      const drawCol = (fields: { label: string; value: string }[], startX: number, startY: number, colWidth: number) => {
        let y = startY;
        fields.forEach((f, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = t.primary + "08";
            rr(ctx, startX - 5, y - 5, colWidth + 10, rH, 4);
            ctx.fill();
          }
          ctx.fillStyle = t.primary;
          ctx.font = "bold 8px 'Segoe UI', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), startX, y + 9);
          ctx.fillStyle = "#333";
          ctx.font = "12px 'Segoe UI', sans-serif";
          let val = f.value;
          while (ctx.measureText(val).width > colWidth - 10 && val.length > 5) {
            val = val.slice(0, -1) + "…";
          }
          ctx.fillText(val, startX, y + 24);
          if (i < fields.length - 1) {
            ctx.strokeStyle = "#e8e8e8";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(startX, y + rH - 3);
            ctx.lineTo(startX + colWidth, y + rH - 3);
            ctx.stroke();
          }
          y += rH;
        });
      };

      drawCol(leftData, colL, cY, colW2);
      drawCol(rightData, colR, cY, colW2);

      // Vertical divider
      ctx.strokeStyle = t.primary + "25";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(W / 2 + 5, cY - 5);
      ctx.lineTo(W / 2 + 5, cY + rH * 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // ===== Terms & Conditions =====
      const tY = cY + rH * 5 + 15;
      ctx.fillStyle = "#fafafa";
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 0.8;
      rr(ctx, 30, tY, W - 60, 75, 8);
      ctx.fill();
      rr(ctx, 30, tY, W - 60, 75, 8);
      ctx.stroke();

      ctx.fillStyle = t.primary;
      ctx.font = "bold 9px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TERMS & CONDITIONS", 45, tY + 15);

      ctx.fillStyle = "#555";
      ctx.font = "8px 'Segoe UI', sans-serif";
      [
        "1. This card must be carried at all times within campus premises.",
        "2. Loss of card must be reported immediately to the administration office.",
        "3. This card is non-transferable and remains property of the institution.",
        "4. Misuse of this card may result in disciplinary action.",
      ].forEach((line, i) => {
        ctx.fillText(line, 45, tY + 30 + i * 12);
      });

      // ===== Signature & Seal Area =====
      const sigY = tY + 85;

      // Left: Principal seal placeholder
      ctx.strokeStyle = t.primary + "40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(120, sigY + 20, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = t.primary + "15";
      ctx.fill();
      ctx.fillStyle = t.primary + "80";
      ctx.font = "bold 7px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SEAL", 120, sigY + 22);

      // Right: Authorized signature
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(W - 230, sigY + 30);
      ctx.lineTo(W - 40, sigY + 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#666";
      ctx.font = "8px 'Segoe UI', sans-serif";
      ctx.fillText("Authorized Signature", W - 135, sigY + 45);

      // ===== Footer =====
      const fY = oY + CH - 20 - 35;
      ctx.fillStyle = t.primary;
      ctx.beginPath();
      ctx.roundRect(15, fY, W - 30, 35 + 5, [0, 0, 10, 10]);
      ctx.fill();
      ctx.fillStyle = t.gold;
      ctx.fillRect(15, fY - 2, W - 30, 2);

      // Barcode
      drawBarcode(ctx, W / 2 - 120, fY + 5, 240, 18, studentId, "#fff");
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "bold 7px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(studentId, W / 2, fY + 30);
    };

    // Draw front card
    drawCard(0, true);

    // Draw back card (if no photo, draw immediately; with photo, it's drawn in img.onload)
    if (!photo && showBack) {
      drawCard(CH + 40, false);
    }

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
    setName("John Doe"); setStudentId("STU-2024-001"); setDepartment("Computer Science & Engineering");
    setInstitution("University of Technology"); setSession("2023-2024"); setBlood("A+");
    setPhone("+880 1234-567890"); setEmail("john@university.edu"); setDob("2000-01-15");
    setFatherName("Robert Doe"); setMotherName("Jane Doe"); setAddress("123 University Road, Dhaka");
    setEmergencyContact("+880 9876-543210"); setTheme("blue"); setPhoto(""); setShowBack(true);
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

        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <GraduationCap className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="stat-value text-sm">{department.length > 20 ? department.slice(0, 20) + "…" : department}</div>
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

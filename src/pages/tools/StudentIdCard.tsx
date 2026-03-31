import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, Eye, Upload, Palette, User, GraduationCap, RotateCcw, Sparkles, FileImage, FileText } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { motion } from "framer-motion";

const themes = [
  { id: "purple", name: "Royal Purple", primary: "#7c3aed", secondary: "#4c1d95", accent: "#c084fc", dark: "#2e1065", light: "#f5f3ff", text: "#1e1b4b", headerBg: "#ede9fe" },
  { id: "blue", name: "Ocean Blue", primary: "#2563eb", secondary: "#1e3a8a", accent: "#93c5fd", dark: "#172554", light: "#eff6ff", text: "#172554", headerBg: "#dbeafe" },
  { id: "green", name: "Emerald", primary: "#059669", secondary: "#064e3b", accent: "#6ee7b7", dark: "#022c22", light: "#ecfdf5", text: "#064e3b", headerBg: "#d1fae5" },
  { id: "red", name: "Crimson", primary: "#dc2626", secondary: "#7f1d1d", accent: "#fca5a5", dark: "#450a0a", light: "#fef2f2", text: "#7f1d1d", headerBg: "#fee2e2" },
  { id: "teal", name: "Teal Modern", primary: "#0d9488", secondary: "#134e4a", accent: "#5eead4", dark: "#042f2e", light: "#f0fdfa", text: "#134e4a", headerBg: "#ccfbf1" },
  { id: "navy", name: "Navy Classic", primary: "#1e3a5f", secondary: "#0c1e3a", accent: "#7db8e0", dark: "#0a1628", light: "#f0f5fa", text: "#0c1e3a", headerBg: "#dce8f5" },
  { id: "gold", name: "Gold Premium", primary: "#b45309", secondary: "#78350f", accent: "#fbbf24", dark: "#451a03", light: "#fffbeb", text: "#78350f", headerBg: "#fef3c7" },
  { id: "dark", name: "Dark Elegance", primary: "#6366f1", secondary: "#312e81", accent: "#a5b4fc", dark: "#1e1b4b", light: "#eef2ff", text: "#1e1b4b", headerBg: "#e0e7ff" },
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

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 950, CH = 570;
    const totalH = showBack ? CH * 2 + 60 : CH;
    canvas.width = W * 2;
    canvas.height = totalH * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, totalH);
    const t = themes.find(th => th.id === theme) || themes[0];

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const drawRightSideContent = (oY: number, panelW: number) => {
      const rX = panelW + 40;
      const rW = W - panelW - 70;

      // Subtle top-right decorative circle
      ctx.fillStyle = hexToRgba(t.primary, 0.04);
      ctx.beginPath();
      ctx.arc(W - 40, oY + 40, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexToRgba(t.accent, 0.03);
      ctx.beginPath();
      ctx.arc(W - 70, oY + 70, 50, 0, Math.PI * 2);
      ctx.fill();

      // Institution name
      ctx.fillStyle = hexToRgba(t.primary, 0.55);
      ctx.font = "600 12px 'Trebuchet MS', 'Lucida Sans', sans-serif";
      ctx.textAlign = "left";
      ctx.letterSpacing = "2px";
      ctx.fillText(institution.toUpperCase(), rX, oY + 40);
      ctx.letterSpacing = "0px";

      // Gradient line
      const lineGrad = ctx.createLinearGradient(rX, 0, rX + 200, 0);
      lineGrad.addColorStop(0, t.primary);
      lineGrad.addColorStop(0.6, t.accent);
      lineGrad.addColorStop(1, hexToRgba(t.primary, 0));
      ctx.fillStyle = lineGrad;
      ctx.fillRect(rX, oY + 48, 220, 2);

      // Title
      ctx.fillStyle = t.text;
      ctx.font = "bold 32px Georgia, 'Palatino Linotype', 'Book Antiqua', serif";
      ctx.fillText("Student ID Card", rX, oY + 80);

      // Small colored dot after title
      ctx.fillStyle = t.primary;
      ctx.beginPath();
      ctx.arc(rX + ctx.measureText("Student ID Card").width + 8, oY + 74, 4, 0, Math.PI * 2);
      ctx.fill();

      // Detail rows with elegant styling
      const fields = [
        { label: "Full Name", value: name, icon: "●" },
        { label: "Date of Birth", value: formatDate(dob), icon: "●" },
        { label: "Father's Name", value: fatherName, icon: "●" },
        { label: "Mother's Name", value: motherName, icon: "●" },
        { label: "Blood Group", value: blood, icon: "●" },
        { label: "Phone", value: phone, icon: "●" },
        { label: "Email", value: email, icon: "●" },
        { label: "Address", value: address, icon: "●" },
      ];

      let dy = oY + 106;
      const rowH = 38;

      fields.forEach((f, i) => {
        // Alternating subtle bg
        if (i % 2 === 0) {
          ctx.fillStyle = hexToRgba(t.primary, 0.025);
          rr(rX - 8, dy - 10, rW + 16, rowH, 8);
          ctx.fill();
        }

        // Left color accent bar
        ctx.fillStyle = i % 2 === 0 ? t.primary : t.accent;
        rr(rX - 8, dy - 4, 2.5, 22, 2);
        ctx.fill();

        // Label
        ctx.fillStyle = hexToRgba(t.primary, 0.6);
        ctx.font = "600 11px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(f.label.toUpperCase(), rX + 4, dy + 5);

        // Value
        ctx.fillStyle = "#1a1a1a";
        ctx.font = "500 15px Georgia, 'Palatino Linotype', serif";
        let val = f.value;
        const maxW = rW - 20;
        while (ctx.measureText(val).width > maxW && val.length > 5) val = val.slice(0, -1) + "…";
        ctx.fillText(val, rX + 4, dy + 21);

        dy += rowH;
      });

      // Valid Until elegant badge
      const vuY = dy + 8;
      // Badge bg with gradient
      const vuGrad = ctx.createLinearGradient(rX, vuY, rX + 130, vuY);
      vuGrad.addColorStop(0, t.primary);
      vuGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = vuGrad;
      rr(rX, vuY, 130, 28, 14);
      ctx.fill();
      // Inner highlight
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      rr(rX + 1, vuY + 1, 128, 12, 6);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VALID UNTIL", rX + 65, vuY + 18);

      ctx.fillStyle = t.text;
      ctx.font = "bold 14px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText(formatDate(validUntil), rX + 142, vuY + 19);

      // Session badge (bottom-right)
      ctx.fillStyle = hexToRgba(t.primary, 0.06);
      rr(W - 128, oY + CH - 74, 96, 44, 12);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(t.primary, 0.1);
      ctx.lineWidth = 1;
      rr(W - 128, oY + CH - 74, 96, 44, 12);
      ctx.stroke();
      ctx.fillStyle = hexToRgba(t.primary, 0.4);
      ctx.font = "600 9px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SESSION", W - 80, oY + CH - 54);
      ctx.fillStyle = t.primary;
      ctx.font = "bold 18px Georgia, serif";
      ctx.fillText(session, W - 80, oY + CH - 36);
    };

    // ===== FRONT CARD =====
    const drawFront = (oY: number) => {
      // Shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "#fff";
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.fill();
      ctx.restore();

      // Border
      ctx.strokeStyle = hexToRgba(t.primary, 0.08);
      ctx.lineWidth = 1;
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.stroke();

      // Clip
      ctx.save();
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.clip();

      // ===== LEFT PANEL (Gradient) =====
      const panelW = 290;

      // Main gradient
      const pGrad = ctx.createLinearGradient(14, oY + 14, 14, oY + CH - 14);
      pGrad.addColorStop(0, t.primary);
      pGrad.addColorStop(0.35, t.secondary);
      pGrad.addColorStop(0.7, t.dark);
      pGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = pGrad;
      ctx.fillRect(14, oY + 14, panelW, CH - 28);

      // Overlay radial glow top
      const rGrad = ctx.createRadialGradient(14 + panelW / 2, oY + 80, 10, 14 + panelW / 2, oY + 80, 180);
      rGrad.addColorStop(0, hexToRgba(t.accent, 0.15));
      rGrad.addColorStop(1, "transparent");
      ctx.fillStyle = rGrad;
      ctx.fillRect(14, oY + 14, panelW, CH - 28);

      // Elegant geometric pattern — subtle circles
      ctx.globalAlpha = 0.035;
      ctx.fillStyle = "#fff";
      for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 6; col++) {
          ctx.beginPath();
          ctx.arc(30 + col * 50, oY + 40 + row * 48, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Curved decorative line
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14, oY + CH * 0.6);
      ctx.quadraticCurveTo(14 + panelW * 0.6, oY + CH * 0.5, 14 + panelW, oY + CH * 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(14, oY + CH * 0.65);
      ctx.quadraticCurveTo(14 + panelW * 0.4, oY + CH * 0.55, 14 + panelW, oY + CH * 0.75);
      ctx.stroke();

      // Premium hologram plate
      const holoX = W - 180;
      const holoY = oY + 98;
      const holoGrad = ctx.createLinearGradient(holoX, holoY, holoX + 120, holoY + 60);
      holoGrad.addColorStop(0, hexToRgba(t.primary, 0.16));
      holoGrad.addColorStop(0.5, hexToRgba(t.accent, 0.2));
      holoGrad.addColorStop(1, hexToRgba(t.secondary, 0.12));
      ctx.fillStyle = holoGrad;
      rr(holoX, holoY, 120, 60, 12);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(t.primary, 0.22);
      ctx.lineWidth = 1;
      rr(holoX, holoY, 120, 60, 12);
      ctx.stroke();
      ctx.strokeStyle = hexToRgba(t.primary, 0.25);
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(holoX + 30, holoY + 30, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(holoX + 30, holoY + 30, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(holoX + 54, holoY + 22);
      ctx.lineTo(holoX + 98, holoY + 22);
      ctx.moveTo(holoX + 54, holoY + 31);
      ctx.lineTo(holoX + 104, holoY + 31);
      ctx.moveTo(holoX + 54, holoY + 40);
      ctx.lineTo(holoX + 90, holoY + 40);
      ctx.stroke();

      // Lower-right wave graphics
      const waveGrad = ctx.createLinearGradient(W - 320, oY + CH - 150, W, oY + CH);
      waveGrad.addColorStop(0, hexToRgba(t.primary, 0.08));
      waveGrad.addColorStop(1, hexToRgba(t.accent, 0.04));
      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.moveTo(W - 330, oY + CH - 110);
      ctx.quadraticCurveTo(W - 220, oY + CH - 165, W - 80, oY + CH - 120);
      ctx.quadraticCurveTo(W - 36, oY + CH - 103, W - 22, oY + CH - 72);
      ctx.lineTo(W - 22, oY + CH - 25);
      ctx.lineTo(W - 330, oY + CH - 25);
      ctx.closePath();
      ctx.fill();

      // ===== PHOTO =====
      const photoR = 68;
      const photoCX = 14 + panelW / 2;
      const photoCY = oY + 135;

      // Double ring
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 4, 0, Math.PI * 2);
      ctx.stroke();

      // Photo bg
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
      ctx.fill();

      const drawLeftPanelText = () => {
        // Name
        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Georgia, 'Palatino Linotype', serif";
        ctx.textAlign = "center";
        const nameD = name.length > 22 ? name.slice(0, 22) + "…" : name;
        ctx.fillText(nameD, photoCX, photoCY + photoR + 35);

        // Thin line under name
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(photoCX - 60, photoCY + photoR + 42);
        ctx.lineTo(photoCX + 60, photoCY + photoR + 42);
        ctx.stroke();

        // Department pill
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        const deptText = department.length > 24 ? department.slice(0, 24) + "…" : department;
        ctx.font = "600 11px 'Trebuchet MS', sans-serif";
        const deptW = Math.min(ctx.measureText(deptText).width + 28, panelW - 40);
        rr(photoCX - deptW / 2, photoCY + photoR + 50, deptW, 24, 12);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(deptText, photoCX, photoCY + photoR + 66);

        // ID box at bottom
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        rr(14 + 35, oY + CH - 95, panelW - 70, 48, 12);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        rr(14 + 35, oY + CH - 95, panelW - 70, 24, 8);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "600 9px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("STUDENT ID NUMBER", photoCX, oY + CH - 78);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.fillText(studentId, photoCX, oY + CH - 57);
      };

      if (photo) {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
          ctx.clip();
          const aspect = img.width / img.height;
          let dx = photoCX - photoR, dy2 = photoCY - photoR, dw = photoR * 2, dh = photoR * 2;
          if (aspect > 1) { dw = dh * aspect; dx = photoCX - dw / 2; }
          else { dh = dw / aspect; dy2 = photoCY - dh / 2; }
          ctx.drawImage(img, dx, dy2, dw, dh);
          ctx.restore();
          drawLeftPanelText();
          drawRightSideContent(oY, 14 + panelW);
          ctx.restore(); // end card clip
          if (showBack) drawBack(CH + 60);
          setGenerated(true);
        };
        img.src = photo;
      } else {
        // Placeholder icon
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "54px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👤", photoCX, photoCY + 14);
        drawLeftPanelText();
        drawRightSideContent(oY, 14 + panelW);
        ctx.restore();
        if (showBack) drawBack(CH + 60);
        setGenerated(true);
      }
    };

    // ===== BACK CARD =====
    const drawBack = (oY: number) => {
      // Shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = "#fff";
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = hexToRgba(t.primary, 0.08);
      ctx.lineWidth = 1;
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.stroke();

      ctx.save();
      rr(14, oY + 14, W - 28, CH - 28, 20);
      ctx.clip();

      // Top header band with gradient
      const hH = 62;
      const hGrad = ctx.createLinearGradient(14, oY + 14, W - 14, oY + 14);
      hGrad.addColorStop(0, t.primary);
      hGrad.addColorStop(0.35, t.secondary);
      hGrad.addColorStop(0.7, t.dark);
      hGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = hGrad;
      ctx.fillRect(14, oY + 14, W - 28, hH);

      // Dot pattern on header
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(30 + i * 24, oY + 14 + hH / 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Institution on header
      ctx.fillStyle = "#fff";
      ctx.font = "bold 19px Georgia, 'Palatino Linotype', serif";
      ctx.textAlign = "center";
      ctx.fillText(institution.toUpperCase(), W / 2, oY + 44);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "500 9px 'Trebuchet MS', sans-serif";
      ctx.fillText("STUDENT IDENTITY CARD  •  REVERSE SIDE", W / 2, oY + 60);

      // Watermark ribbon graphics
      const wmGrad = ctx.createLinearGradient(40, oY + 120, W - 40, oY + CH - 80);
      wmGrad.addColorStop(0, hexToRgba(t.primary, 0.035));
      wmGrad.addColorStop(0.5, hexToRgba(t.accent, 0.05));
      wmGrad.addColorStop(1, hexToRgba(t.secondary, 0.03));
      ctx.fillStyle = wmGrad;
      ctx.beginPath();
      ctx.moveTo(20, oY + 170);
      ctx.quadraticCurveTo(W * 0.45, oY + 130, W - 20, oY + 190);
      ctx.lineTo(W - 20, oY + 235);
      ctx.quadraticCurveTo(W * 0.45, oY + 175, 20, oY + 225);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = hexToRgba(t.primary, 0.06);
      ctx.save();
      ctx.translate(W - 110, oY + 110);
      ctx.rotate(-Math.PI / 9);
      ctx.font = "bold 24px Georgia, serif";
      ctx.fillText("ID", 0, 0);
      ctx.restore();

      // Subtle bg decoration
      ctx.fillStyle = hexToRgba(t.primary, 0.02);
      ctx.beginPath();
      ctx.arc(W - 60, oY + CH - 80, 120, 0, Math.PI * 2);
      ctx.fill();

      // Two-column details
      const cY = oY + 96;
      const colL = 45, colR = W / 2 + 30;
      const colW = W / 2 - 75;
      const rowH = 42;

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
        { label: "Session / Year", value: session },
        { label: "Department", value: department },
        { label: "Valid Until", value: formatDate(validUntil) },
      ];

      const drawCol = (fields: { label: string; value: string }[], sx: number, sy: number, cw: number) => {
        let y = sy;
        fields.forEach((f, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = hexToRgba(t.primary, 0.025);
            rr(sx - 10, y - 4, cw + 20, rowH - 2, 8);
            ctx.fill();
          }

          // Color accent bar
          const barGrad = ctx.createLinearGradient(sx - 10, y, sx - 10, y + 22);
          barGrad.addColorStop(0, t.primary);
          barGrad.addColorStop(1, t.accent);
          ctx.fillStyle = barGrad;
          rr(sx - 10, y, 2.5, 22, 1.5);
          ctx.fill();

          ctx.fillStyle = hexToRgba(t.primary, 0.55);
          ctx.font = "600 9.5px 'Trebuchet MS', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), sx, y + 11);
          ctx.fillStyle = "#222";
          ctx.font = "500 14px Georgia, 'Palatino Linotype', serif";
          let val = f.value;
          while (ctx.measureText(val).width > cw - 10 && val.length > 5) val = val.slice(0, -1) + "…";
          ctx.fillText(val, sx, y + 28);
          y += rowH;
        });
      };

      drawCol(leftData, colL, cY, colW);
      drawCol(rightData, colR, cY, colW);

      // Elegant vertical divider
      const divGrad = ctx.createLinearGradient(0, cY, 0, cY + rowH * 5);
      divGrad.addColorStop(0, hexToRgba(t.primary, 0));
      divGrad.addColorStop(0.3, hexToRgba(t.primary, 0.15));
      divGrad.addColorStop(0.7, hexToRgba(t.primary, 0.15));
      divGrad.addColorStop(1, hexToRgba(t.primary, 0));
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2 + 8, cY);
      ctx.lineTo(W / 2 + 8, cY + rowH * 5);
      ctx.stroke();

      // Small diamond on divider center
      ctx.fillStyle = t.primary;
      const diaY = cY + rowH * 2.5;
      ctx.save();
      ctx.translate(W / 2 + 8, diaY);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();

      // Terms box
      const tY = cY + rowH * 5 + 12;
      ctx.fillStyle = hexToRgba(t.primary, 0.02);
      rr(40, tY, W - 80, 62, 10);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(t.primary, 0.08);
      ctx.lineWidth = 0.8;
      rr(40, tY, W - 80, 62, 10);
      ctx.stroke();

      ctx.fillStyle = t.primary;
      ctx.font = "bold 9px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TERMS & CONDITIONS", 55, tY + 13);
      ctx.fillStyle = "#888";
      ctx.font = "400 8.2px Georgia, serif";
      [
        "1. This card must be carried at all times within campus premises.",
        "2. Loss of this card must be reported immediately to administration.",
        "3. This card is non-transferable and remains property of the institution.",
        "4. Any misuse may lead to disciplinary action.",
      ].forEach((line, i) => ctx.fillText(line, 55, tY + 25 + i * 10));

      // Seal & Signature
      const sigY = tY + 68;

      // Seal circle
      ctx.strokeStyle = hexToRgba(t.primary, 0.2);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(115, sigY + 14, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = hexToRgba(t.primary, 0.1);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(115, sigY + 14, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = hexToRgba(t.primary, 0.3);
      ctx.font = "bold 7px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SEAL", 115, sigY + 16);

      // QR code
      drawQR(ctx, 175, sigY - 4, 38);

      // Signature line
      ctx.strokeStyle = hexToRgba(t.primary, 0.2);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(W - 240, sigY + 22);
      ctx.lineTo(W - 50, sigY + 22);
      ctx.stroke();
      ctx.fillStyle = "#999";
      ctx.font = "500 8.5px Georgia, serif";
      ctx.fillText("Authorized Signature", W - 145, sigY + 34);

      // Bottom gradient bar with barcode
      const fY = oY + CH - 52;
      const fGrad = ctx.createLinearGradient(14, fY, W - 14, fY);
      fGrad.addColorStop(0, t.primary);
      fGrad.addColorStop(0.35, t.secondary);
      fGrad.addColorStop(0.7, t.dark);
      fGrad.addColorStop(1, t.secondary);
      ctx.fillStyle = fGrad;
      ctx.fillRect(14, fY, W - 28, 38);

      drawBarcode(ctx, W / 2 - 110, fY + 4, 220, 16, studentId, "#fff");
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "bold 8px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(studentId + "  •  " + institution.toUpperCase(), W / 2, fY + 30);

      ctx.restore();
    };

    drawFront(0);
  }, [name, studentId, department, institution, session, blood, phone, email, dob, fatherName, motherName, address, emergencyContact, theme, photo, showBack, validUntil]);

  const getCardCanvas = (side: "front" | "back" | "both"): HTMLCanvasElement | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const W = 950, CH = 570;
    const scale = 2;

    if (side === "both") return canvas;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = W * scale;
    tempCanvas.height = CH * scale;
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return null;

    const srcY = side === "front" ? 0 : (CH + 60) * scale;
    tCtx.drawImage(canvas, 0, srcY, W * scale, CH * scale, 0, 0, W * scale, CH * scale);
    return tempCanvas;
  };

  const downloadAs = (side: "front" | "back" | "both", format: "png" | "jpg" | "pdf") => {
    generate();
    setTimeout(async () => {
      const src = getCardCanvas(side);
      if (!src) return;

      const filename = `student-id-${side}-${studentId}`;

      if (format === "png") {
        const a = document.createElement("a");
        a.download = `${filename}.png`;
        a.href = src.toDataURL("image/png");
        a.click();
      } else if (format === "jpg") {
        const a = document.createElement("a");
        a.download = `${filename}.jpg`;
        a.href = src.toDataURL("image/jpeg", 0.95);
        a.click();
      } else if (format === "pdf") {
        const imgData = src.toDataURL("image/png");
        const imgBytes = await fetch(imgData).then(r => r.arrayBuffer());
        const pdfDoc = await PDFDocument.create();
        const pngImage = await pdfDoc.embedPng(imgBytes);
        const { width, height } = pngImage.scale(0.5);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pngImage, { x: 0, y: 0, width, height });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const a = document.createElement("a");
        a.download = `${filename}.pdf`;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(a.href);
      }

      toast.success(`${side === "both" ? "Full card" : side === "front" ? "Front side" : "Back side"} downloaded as ${format.toUpperCase()}!`);
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
          <Button onClick={resetAll} variant="ghost" className="rounded-xl gap-1.5 text-muted-foreground hover:text-destructive">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {generated && (
          <div className="tool-section-card p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><Download className="w-4 h-4 text-primary" /> Download Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Front Side */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Front Side</p>
                <div className="flex flex-col gap-1.5">
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("front", "png")}><FileImage className="w-3.5 h-3.5 text-blue-500" /> PNG</Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("front", "jpg")}><FileImage className="w-3.5 h-3.5 text-orange-500" /> JPG</Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("front", "pdf")}><FileText className="w-3.5 h-3.5 text-red-500" /> PDF</Button>
                </div>
              </div>
              {/* Back Side */}
              {showBack && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Back Side</p>
                  <div className="flex flex-col gap-1.5">
                    <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("back", "png")}><FileImage className="w-3.5 h-3.5 text-blue-500" /> PNG</Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("back", "jpg")}><FileImage className="w-3.5 h-3.5 text-orange-500" /> JPG</Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("back", "pdf")}><FileText className="w-3.5 h-3.5 text-red-500" /> PDF</Button>
                  </div>
                </div>
              )}
              {/* Full Card */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Card</p>
                <div className="flex flex-col gap-1.5">
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("both", "png")}><FileImage className="w-3.5 h-3.5 text-blue-500" /> PNG</Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("both", "jpg")}><FileImage className="w-3.5 h-3.5 text-orange-500" /> JPG</Button>
                  <Button variant="outline" size="sm" className="justify-start gap-2 rounded-xl text-xs" onClick={() => downloadAs("both", "pdf")}><FileText className="w-3.5 h-3.5 text-red-500" /> PDF</Button>
                </div>
              </div>
            </div>
          </div>
        )}

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

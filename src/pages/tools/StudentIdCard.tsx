import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Download, Eye, Upload, Palette, User, GraduationCap, RotateCcw, Sparkles, FileImage, FileText, Image } from "lucide-react";
import { jsPDF } from "jspdf";
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

    const W = 920, CH = 560;
    const totalH = showBack ? CH * 2 + 50 : CH;
    canvas.width = W * 2;
    canvas.height = totalH * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, totalH);
    const t = themes.find(th => th.id === theme) || themes[0];

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    // ===== FRONT CARD =====
    const drawFront = (oY: number) => {
      // Card shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#fff";
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.strokeStyle = hexToRgba(t.primary, 0.12);
      ctx.lineWidth = 1;
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.stroke();

      // Clip
      ctx.save();
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.clip();

      // ===== LEFT COLORED PANEL =====
      const panelW = 310;
      const pGrad = ctx.createLinearGradient(12, oY, 12, oY + CH);
      pGrad.addColorStop(0, t.primary);
      pGrad.addColorStop(0.5, t.secondary);
      pGrad.addColorStop(1, t.dark);
      ctx.fillStyle = pGrad;
      ctx.fillRect(12, oY + 12, panelW, CH - 24);

      // Subtle pattern on panel
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(12 + Math.random() * panelW, oY + 12 + Math.random() * (CH - 24), 20 + Math.random() * 40, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Diagonal lines decoration
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let i = -CH; i < panelW + CH; i += 30) {
        ctx.beginPath();
        ctx.moveTo(12 + i, oY + 12);
        ctx.lineTo(12 + i - CH, oY + CH - 12);
        ctx.stroke();
      }

      // ===== PHOTO on Left Panel =====
      const photoR = 72;
      const photoCX = 12 + panelW / 2;
      const photoCY = oY + 130;

      // Photo outer glow
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // White ring
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Photo circle
      ctx.fillStyle = hexToRgba(t.accent, 0.3);
      ctx.beginPath();
      ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
      ctx.fill();

      const drawPhotoContent = () => {
        if (photo) {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(photoCX, photoCY, photoR, 0, Math.PI * 2);
            ctx.clip();
            const aspect = img.width / img.height;
            let dx = photoCX - photoR, dy = photoCY - photoR, dw = photoR * 2, dh = photoR * 2;
            if (aspect > 1) { dw = dh * aspect; dx = photoCX - dw / 2; }
            else { dh = dw / aspect; dy = photoCY - dh / 2; }
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
            finishFrontAfterPhoto();
          };
          img.src = photo;
          return false;
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.font = "52px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("👤", photoCX, photoCY + 16);
          return true;
        }
      };

      const finishFrontAfterPhoto = () => {
        // Name on panel
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
        ctx.textAlign = "center";
        const nameDisplay = name.length > 20 ? name.slice(0, 20) + "…" : name;
        ctx.fillText(nameDisplay, photoCX, photoCY + photoR + 38);

        // Department chip
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        const deptText = department.length > 22 ? department.slice(0, 22) + "…" : department;
        const deptW = Math.min(ctx.measureText(deptText).width + 30, panelW - 40);
        roundRect(photoCX - deptW / 2, photoCY + photoR + 48, deptW, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "600 11px 'Trebuchet MS', 'Lucida Sans', Arial, sans-serif";
        ctx.fillText(deptText, photoCX, photoCY + photoR + 65);

        // ID Badge on panel bottom
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        roundRect(12 + 30, oY + CH - 100, panelW - 60, 50, 10);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        roundRect(12 + 30, oY + CH - 100, panelW - 60, 50, 10);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "600 9px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("STUDENT ID", photoCX, oY + CH - 80);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Courier New', 'Lucida Console', monospace";
        ctx.fillText(studentId, photoCX, oY + CH - 60);

        // ===== RIGHT SIDE (Details) =====
        const rX = 12 + panelW + 35;
        const rW = W - panelW - 85;

        // Institution header
        ctx.fillStyle = t.text;
        ctx.font = "bold 11px 'Trebuchet MS', 'Lucida Sans', Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(institution.toUpperCase(), rX, oY + 42);

        // Accent line under institution
        const iGrad = ctx.createLinearGradient(rX, oY + 48, rX + 180, oY + 48);
        iGrad.addColorStop(0, t.primary);
        iGrad.addColorStop(1, hexToRgba(t.primary, 0));
        ctx.fillStyle = iGrad;
        ctx.fillRect(rX, oY + 48, 180, 2.5);

        // "STUDENT ID CARD" title
        ctx.fillStyle = t.primary;
        ctx.font = "bold 26px 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
        ctx.fillText("Student ID Card", rX, oY + 82);

        // Detail rows
        const fields = [
          { label: "Full Name", value: name },
          { label: "Date of Birth", value: formatDate(dob) },
          { label: "Father's Name", value: fatherName },
          { label: "Mother's Name", value: motherName },
          { label: "Blood Group", value: blood },
          { label: "Phone", value: phone },
          { label: "Email", value: email },
          { label: "Address", value: address },
        ];

        let dy = oY + 115;
        const rowH = 36;

        fields.forEach((f, i) => {
          // Alternating row background
          if (i % 2 === 0) {
            ctx.fillStyle = hexToRgba(t.primary, 0.03);
            roundRect(rX - 10, dy - 12, rW + 20, rowH, 6);
            ctx.fill();
          }

          // Label
          ctx.fillStyle = hexToRgba(t.primary, 0.7);
          ctx.font = "600 10px 'Trebuchet MS', 'Lucida Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), rX, dy + 3);

          // Value
          ctx.fillStyle = "#1a1a1a";
          ctx.font = "500 14px 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
          let val = f.value;
          const maxW = rW - 10;
          while (ctx.measureText(val).width > maxW && val.length > 5) val = val.slice(0, -1) + "…";
          ctx.fillText(val, rX, dy + 19);

          dy += rowH;
        });

        // Valid Until badge
        const vuY = dy + 10;
        ctx.fillStyle = t.primary;
        roundRect(rX, vuY, 110, 30, 8);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("VALID UNTIL", rX + 55, vuY + 19);

        ctx.fillStyle = t.text;
        ctx.font = "bold 14px 'Palatino Linotype', Georgia, serif";
        ctx.textAlign = "left";
        ctx.fillText(formatDate(validUntil), rX + 120, vuY + 20);

        // Session / Year (bottom-right corner)
        ctx.fillStyle = hexToRgba(t.primary, 0.06);
        roundRect(W - 130, oY + CH - 72, 95, 42, 10);
        ctx.fill();
        ctx.fillStyle = hexToRgba(t.primary, 0.45);
        ctx.font = "600 8px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SESSION", W - 82, oY + CH - 52);
        ctx.fillStyle = t.primary;
        ctx.font = "bold 16px 'Palatino Linotype', serif";
        ctx.fillText(session, W - 82, oY + CH - 35);

        ctx.restore(); // End clip

        if (showBack) drawBack(CH + 50);
        setGenerated(true);
      };

      const noPhoto = drawPhotoContent();
      if (noPhoto) {
        // Name on panel
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
        ctx.textAlign = "center";
        const nameDisplay = name.length > 20 ? name.slice(0, 20) + "…" : name;
        ctx.fillText(nameDisplay, photoCX, photoCY + photoR + 38);

        ctx.fillStyle = "rgba(255,255,255,0.18)";
        const deptText = department.length > 22 ? department.slice(0, 22) + "…" : department;
        const deptW = Math.min(ctx.measureText(deptText).width + 30, panelW - 40);
        roundRect(photoCX - deptW / 2, photoCY + photoR + 48, deptW, 26, 13);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "600 11px 'Trebuchet MS', 'Lucida Sans', Arial, sans-serif";
        ctx.fillText(deptText, photoCX, photoCY + photoR + 65);

        // ID badge
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        roundRect(12 + 30, oY + CH - 100, panelW - 60, 50, 10);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        roundRect(12 + 30, oY + CH - 100, panelW - 60, 50, 10);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "600 9px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("STUDENT ID", photoCX, oY + CH - 80);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px 'Courier New', 'Lucida Console', monospace";
        ctx.fillText(studentId, photoCX, oY + CH - 60);

        // Right side details
        const rX = 12 + panelW + 35;
        const rW = W - panelW - 85;

        ctx.fillStyle = t.text;
        ctx.font = "bold 11px 'Trebuchet MS', 'Lucida Sans', Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(institution.toUpperCase(), rX, oY + 42);

        const iGrad = ctx.createLinearGradient(rX, oY + 48, rX + 180, oY + 48);
        iGrad.addColorStop(0, t.primary);
        iGrad.addColorStop(1, hexToRgba(t.primary, 0));
        ctx.fillStyle = iGrad;
        ctx.fillRect(rX, oY + 48, 180, 2.5);

        ctx.fillStyle = t.primary;
        ctx.font = "bold 26px 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
        ctx.fillText("Student ID Card", rX, oY + 82);

        const fields = [
          { label: "Full Name", value: name },
          { label: "Date of Birth", value: formatDate(dob) },
          { label: "Father's Name", value: fatherName },
          { label: "Mother's Name", value: motherName },
          { label: "Blood Group", value: blood },
          { label: "Phone", value: phone },
          { label: "Email", value: email },
          { label: "Address", value: address },
        ];

        let dy = oY + 115;
        const rowH = 36;

        fields.forEach((f, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = hexToRgba(t.primary, 0.03);
            roundRect(rX - 10, dy - 12, rW + 20, rowH, 6);
            ctx.fill();
          }
          ctx.fillStyle = hexToRgba(t.primary, 0.7);
          ctx.font = "600 10px 'Trebuchet MS', 'Lucida Sans', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), rX, dy + 3);
          ctx.fillStyle = "#1a1a1a";
          ctx.font = "500 14px 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
          let val = f.value;
          const maxW = rW - 10;
          while (ctx.measureText(val).width > maxW && val.length > 5) val = val.slice(0, -1) + "…";
          ctx.fillText(val, rX, dy + 19);
          dy += rowH;
        });

        const vuY = dy + 10;
        ctx.fillStyle = t.primary;
        roundRect(rX, vuY, 110, 30, 8);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("VALID UNTIL", rX + 55, vuY + 19);
        ctx.fillStyle = t.text;
        ctx.font = "bold 14px 'Palatino Linotype', Georgia, serif";
        ctx.textAlign = "left";
        ctx.fillText(formatDate(validUntil), rX + 120, vuY + 20);

        ctx.fillStyle = hexToRgba(t.primary, 0.06);
        roundRect(W - 130, oY + CH - 72, 95, 42, 10);
        ctx.fill();
        ctx.fillStyle = hexToRgba(t.primary, 0.45);
        ctx.font = "600 8px 'Trebuchet MS', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SESSION", W - 82, oY + CH - 52);
        ctx.fillStyle = t.primary;
        ctx.font = "bold 16px 'Palatino Linotype', serif";
        ctx.fillText(session, W - 82, oY + CH - 35);

        ctx.restore();

        if (showBack) drawBack(CH + 50);
        setGenerated(true);
      }
    };

    // ===== BACK CARD =====
    const drawBack = (oY: number) => {
      // Card shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.18)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "#fff";
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = hexToRgba(t.primary, 0.12);
      ctx.lineWidth = 1;
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.stroke();

      ctx.save();
      roundRect(12, oY + 12, W - 24, CH - 24, 18);
      ctx.clip();

      // Top colored header
      const hH = 58;
      const hGrad = ctx.createLinearGradient(12, oY + 12, W - 12, oY + 12);
      hGrad.addColorStop(0, t.primary);
      hGrad.addColorStop(0.4, t.secondary);
      hGrad.addColorStop(1, t.dark);
      ctx.fillStyle = hGrad;
      ctx.fillRect(12, oY + 12, W - 24, hH);

      // Header pattern
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = -100; i < W + 100; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, oY + 12);
        ctx.lineTo(i - hH, oY + 12 + hH);
        ctx.stroke();
      }

      // Institution on header
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(institution.toUpperCase(), W / 2, oY + 42);
      ctx.font = "500 9px 'Trebuchet MS', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText("STUDENT IDENTITY CARD — REVERSE", W / 2, oY + 56);

      // Two column details
      const cY = oY + 90;
      const colL = 45, colR = W / 2 + 25;
      const colW = W / 2 - 70;
      const rH = 44;

      const leftData = [
        { label: "Father's Name", value: fatherName },
        { label: "Mother's Name", value: motherName },
        { label: "Date of Birth", value: formatDate(dob) },
        { label: "Blood Group", value: blood },
        { label: "Emergency", value: emergencyContact },
      ];
      const rightData = [
        { label: "Address", value: address },
        { label: "Student ID", value: studentId },
        { label: "Session", value: session },
        { label: "Department", value: department },
        { label: "Valid Until", value: formatDate(validUntil) },
      ];

      const drawCol = (fields: { label: string; value: string }[], sx: number, sy: number, cw: number) => {
        let y = sy;
        fields.forEach((f, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = hexToRgba(t.primary, 0.03);
            roundRect(sx - 10, y - 5, cw + 20, rH - 2, 6);
            ctx.fill();
          }
          // Colored left accent
          ctx.fillStyle = t.primary;
          roundRect(sx - 10, y - 2, 3, 20, 1.5);
          ctx.fill();

          ctx.fillStyle = hexToRgba(t.primary, 0.65);
          ctx.font = "600 9px 'Trebuchet MS', sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(f.label.toUpperCase(), sx, y + 10);
          ctx.fillStyle = "#222";
          ctx.font = "500 13px 'Palatino Linotype', Georgia, serif";
          let val = f.value;
          while (ctx.measureText(val).width > cw - 10 && val.length > 5) val = val.slice(0, -1) + "…";
          ctx.fillText(val, sx, y + 28);
          y += rH;
        });
      };

      drawCol(leftData, colL, cY, colW);
      drawCol(rightData, colR, cY, colW);

      // Vertical divider
      ctx.strokeStyle = hexToRgba(t.primary, 0.12);
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(W / 2 + 5, cY - 5);
      ctx.lineTo(W / 2 + 5, cY + rH * 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Terms box
      const tY = cY + rH * 5 + 10;
      ctx.fillStyle = hexToRgba(t.primary, 0.02);
      ctx.strokeStyle = hexToRgba(t.primary, 0.1);
      ctx.lineWidth = 1;
      roundRect(35, tY, W - 70, 65, 10);
      ctx.fill();
      roundRect(35, tY, W - 70, 65, 10);
      ctx.stroke();

      ctx.fillStyle = t.primary;
      ctx.font = "bold 8px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("TERMS & CONDITIONS", 50, tY + 13);
      ctx.fillStyle = "#777";
      ctx.font = "400 8px 'Palatino Linotype', Georgia, serif";
      ["1. This card must be carried at all times within campus premises.",
       "2. Loss of card must be reported immediately to administration.",
       "3. This card is non-transferable and remains property of the institution.",
       "4. Any misuse may lead to disciplinary action.",
      ].forEach((line, i) => ctx.fillText(line, 50, tY + 26 + i * 11));

      // Signature & Seal area
      const sigY = tY + 72;

      // Seal
      ctx.strokeStyle = hexToRgba(t.primary, 0.25);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(110, sigY + 16, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = hexToRgba(t.primary, 0.04);
      ctx.fill();
      ctx.fillStyle = hexToRgba(t.primary, 0.35);
      ctx.font = "bold 7px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SEAL", 110, sigY + 18);

      // Signature line
      ctx.strokeStyle = "#bbb";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(W - 250, sigY + 25);
      ctx.lineTo(W - 50, sigY + 25);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#888";
      ctx.font = "500 8px 'Palatino Linotype', serif";
      ctx.fillText("Authorized Signature", W - 150, sigY + 38);

      // Bottom bar with barcode
      const fY = oY + CH - 52;
      const fGrad = ctx.createLinearGradient(12, fY, W - 12, fY);
      fGrad.addColorStop(0, t.primary);
      fGrad.addColorStop(0.5, t.secondary);
      fGrad.addColorStop(1, t.dark);
      ctx.fillStyle = fGrad;
      ctx.fillRect(12, fY, W - 24, 40);

      drawBarcode(ctx, W / 2 - 120, fY + 5, 240, 18, studentId, "#fff");
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "bold 8px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(studentId + " | " + institution.toUpperCase(), W / 2, fY + 32);

      ctx.restore();
    };

    drawFront(0);
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

import React, { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function FakeBdSmartNid() {
  const [nameBn, setNameBn] = useState("মোঃ রহুল আমিন");
  const [nameEn, setNameEn] = useState("MD. RUHUL AMIN");
  const [fatherBn, setFatherBn] = useState("আককাচ আলী");
  const [motherBn, setMotherBn] = useState("মোছাঃ রাহিমা খাতুন");
  const [dob, setDob] = useState("21 Jan 1985");
  const [nidNo, setNidNo] = useState("326 848 3744");
  const [pin, setPin] = useState("19851234567890123");
  const [bloodGroup, setBloodGroup] = useState("AB+");
  const [birthPlace, setBirthPlace] = useState("JHENAIDAH");
  const [issueDate, setIssueDate] = useState("30 Nov 2015");
  const [addressBn, setAddressBn] = useState("বাসা/হোল্ডিং: ৩৬, গ্রাম/রাস্তা: রোড নং-২, ধানমন্ডি আবাসিক এলাকা, ডাকঘর: জিগাতলা - ১২০৯, ধানমন্ডি, ঢাকা দক্ষিণ সিটি কর্পোরেশন, ঢাকা");
  const [photo, setPhoto] = useState<string | null>(null);

  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);

  const W = 860;
  const H = 540;

  const loadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const drawFront = useCallback(() => {
    const canvas = frontCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W;
    canvas.height = H;

    // Background - green gradient like real card
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#c5dfc5");
    grad.addColorStop(0.3, "#d8ead8");
    grad.addColorStop(0.7, "#e8f2e8");
    grad.addColorStop(1, "#d0e4d0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle pattern overlay
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < W; i += 8) {
      for (let j = 0; j < H; j += 8) {
        if ((i + j) % 16 === 0) {
          ctx.fillStyle = "#006600";
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Border
    ctx.strokeStyle = "#2e7d32";
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // Inner subtle border
    ctx.strokeStyle = "rgba(46,125,50,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, W - 16, H - 16);

    // Red-green header bar
    const headerGrad = ctx.createLinearGradient(0, 15, W, 15);
    headerGrad.addColorStop(0, "#1b5e20");
    headerGrad.addColorStop(1, "#2e7d32");
    ctx.fillStyle = headerGrad;
    ctx.fillRect(12, 12, W - 24, 55);

    // Header text - Bangla
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Noto Sans Bengali', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("গণপ্রজাতন্ত্রী বাংলাদেশ সরকার", W / 2, 36);

    // Header text - English
    ctx.fillStyle = "#ffeb3b";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText("Government of the People's Republic of Bangladesh", W / 2, 53);

    // Sub header
    ctx.fillStyle = "#1b5e20";
    ctx.font = "bold 16px 'Noto Sans Bengali', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("জাতীয় পরিচয়পত্র /", W / 2 - 60, 86);
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.fillText("National ID Card", W / 2 + 80, 86);

    // Photo area with border
    const photoX = 30;
    const photoY = 105;
    const photoW = 170;
    const photoH = 210;

    // Photo border
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(photoX - 2, photoY - 2, photoW + 4, photoH + 4);

    if (photo) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, photoX, photoY, photoW, photoH);
      };
      img.src = photo;
    } else {
      // Placeholder
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.fillStyle = "#999";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Photo", photoX + photoW / 2, photoY + photoH / 2);
    }

    // Large faded pink/red circle in center (like real card watermark)
    ctx.globalAlpha = 0.06;
    ctx.beginPath();
    ctx.arc(W / 2 + 40, H / 2 + 20, 140, 0, Math.PI * 2);
    ctx.fillStyle = "#e53935";
    ctx.fill();
    ctx.globalAlpha = 1;

    // Details section
    const detailX = 220;
    let y = 118;
    const lineH = 32;

    // নাম label
    ctx.textAlign = "left";
    ctx.fillStyle = "#555";
    ctx.font = "11px 'Noto Sans Bengali', sans-serif";
    ctx.fillText("নাম", detailX, y);
    y += 4;

    // Name Bangla
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 20px 'Noto Sans Bengali', sans-serif";
    y += 20;
    ctx.fillText(nameBn, detailX, y);

    // Name label English
    y += 16;
    ctx.fillStyle = "#555";
    ctx.font = "11px sans-serif";
    ctx.fillText("Name", detailX, y);

    // Name English
    y += 18;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.fillText(nameEn, detailX, y);

    // পিতা label
    y += 22;
    ctx.fillStyle = "#555";
    ctx.font = "11px 'Noto Sans Bengali', sans-serif";
    ctx.fillText("পিতা", detailX, y);

    // Father name
    y += 20;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 18px 'Noto Sans Bengali', sans-serif";
    ctx.fillText(fatherBn, detailX, y);

    // মাতা label
    y += 22;
    ctx.fillStyle = "#555";
    ctx.font = "11px 'Noto Sans Bengali', sans-serif";
    ctx.fillText("মাতা", detailX, y);

    // Mother name
    y += 20;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 18px 'Noto Sans Bengali', sans-serif";
    ctx.fillText(motherBn, detailX, y);

    // Date of Birth
    y += 28;
    ctx.fillStyle = "#555";
    ctx.font = "12px sans-serif";
    ctx.fillText("Date of Birth", detailX, y);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.fillText(dob, detailX + 120, y);

    // NID No
    y += 36;
    ctx.fillStyle = "#555";
    ctx.font = "13px sans-serif";
    ctx.fillText("NID No.", detailX, y);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 26px 'Courier New', monospace";
    ctx.fillText(nidNo, detailX + 90, y + 2);

    // Chip area (gold chip like smart card)
    const chipX = 660;
    const chipY = 140;
    const chipW = 65;
    const chipH = 50;
    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, "#f0d060");
    chipGrad.addColorStop(0.5, "#e8c840");
    chipGrad.addColorStop(1, "#d4b030");
    ctx.fillStyle = chipGrad;
    roundRect(ctx, chipX, chipY, chipW, chipH, 5);
    ctx.fill();

    // Chip lines
    ctx.strokeStyle = "#c0a020";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chipX + 10, chipY + chipH / 2);
    ctx.lineTo(chipX + chipW - 10, chipY + chipH / 2);
    ctx.moveTo(chipX + chipW / 2, chipY + 8);
    ctx.lineTo(chipX + chipW / 2, chipY + chipH - 8);
    ctx.moveTo(chipX + 10, chipY + 15);
    ctx.lineTo(chipX + chipW - 10, chipY + 15);
    ctx.moveTo(chipX + 10, chipY + chipH - 15);
    ctx.lineTo(chipX + chipW - 10, chipY + chipH - 15);
    ctx.stroke();

    // Shapla (lotus) watermark top right - simplified
    ctx.globalAlpha = 0.08;
    drawShapla(ctx, W - 80, 100, 50);
    ctx.globalAlpha = 1;

    // BD flag emblem placeholder (small circle top-left in header)
    ctx.beginPath();
    ctx.arc(45, 38, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#006a4e";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(45, 38, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#f42a41";
    ctx.fill();

    // Signature area
    ctx.fillStyle = "#888";
    ctx.font = "italic 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Signature", 40, H - 55);
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(30, H - 45);
    ctx.lineTo(180, H - 45);
    ctx.stroke();

    // PIN area at bottom
    ctx.fillStyle = "#444";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("PIN:", 30, H - 20);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillText(pin, 70, H - 20);

    // Warning
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ FAKE CARD — FOR EDUCATIONAL PURPOSES ONLY ⚠️", W / 2, H - 8);
  }, [nameBn, nameEn, fatherBn, motherBn, dob, nidNo, pin, photo]);

  const drawBack = useCallback(() => {
    const canvas = backCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = W;
    canvas.height = H;

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#d0e4d0");
    grad.addColorStop(0.5, "#e0ede0");
    grad.addColorStop(1, "#c8dcc8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Pattern
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < W; i += 8) {
      for (let j = 0; j < H; j += 8) {
        if ((i + j) % 16 === 0) {
          ctx.fillStyle = "#006600";
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Border
    ctx.strokeStyle = "#2e7d32";
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // Barcode area at top
    const barcodeY = 25;
    const barcodeH = 50;
    ctx.fillStyle = "#f5f5f0";
    ctx.fillRect(30, barcodeY, W - 60, barcodeH);
    // Simulated barcode lines
    ctx.fillStyle = "#1a1a1a";
    for (let i = 40; i < W - 40; i += 3) {
      const w = Math.random() > 0.5 ? 2 : 1;
      if (Math.random() > 0.3) {
        ctx.fillRect(i, barcodeY + 5, w, barcodeH - 10);
      }
    }

    // Address section
    const addrY = 100;
    // Pink/red background bar
    ctx.fillStyle = "rgba(229, 115, 115, 0.15)";
    ctx.fillRect(20, addrY, W - 40, 90);

    ctx.fillStyle = "#555";
    ctx.font = "12px 'Noto Sans Bengali', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ঠিকানা:", 35, addrY + 20);

    // Wrap address text
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "14px 'Noto Sans Bengali', sans-serif";
    wrapText(ctx, addressBn, 35, addrY + 42, W - 80, 20);

    // Blood Group & Birth Place
    const infoY = addrY + 110;
    ctx.fillStyle = "#333";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Blood Group:", 35, infoY);
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(bloodGroup, 145, infoY);

    ctx.fillStyle = "#333";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Place of Birth:", 250, infoY);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(birthPlace, 380, infoY);

    // Issue Date
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("Issue Date:", 580, infoY);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(issueDate, 680, infoY);

    // Shapla (lotus) watermark
    ctx.globalAlpha = 0.12;
    drawShapla(ctx, W - 130, infoY - 40, 55);
    ctx.globalAlpha = 1;

    // Small photo on back (top right area)
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.strokeRect(W - 110, addrY - 5, 75, 90);
    ctx.fillStyle = "#e8e8e8";
    ctx.fillRect(W - 109, addrY - 4, 73, 88);
    if (photo) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, W - 109, addrY - 4, 73, 88);
      };
      img.src = photo;
    } else {
      ctx.fillStyle = "#aaa";
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Photo", W - 72, addrY + 42);
    }

    // MRZ (Machine Readable Zone) at bottom
    const mrzY = H - 120;
    ctx.fillStyle = "#f5f5f0";
    ctx.fillRect(20, mrzY, W - 40, 95);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.textAlign = "left";
    // letterSpacing not universally supported, skip it

    const nidClean = nidNo.replace(/\s/g, "");
    const nameClean = nameEn.replace(/\./g, "").replace(/\s+/g, "<");
    const nameParts = nameClean.split("<").filter(Boolean);
    const surname = nameParts[nameParts.length - 1] || "UNKNOWN";
    const givenNames = nameParts.slice(0, -1).join("<") || "UNKNOWN";

    const mrzLine1 = `I<BGD${nidClean}${"<".repeat(Math.max(0, 30 - 5 - nidClean.length))}`;
    const dobClean = formatMrzDate(dob);
    const mrzLine2 = `${dobClean}M${"0".repeat(6)}BGD${"<".repeat(14)}`;
    const mrzLine3 = `${surname}<<${givenNames}${"<".repeat(Math.max(0, 30 - surname.length - givenNames.length - 2))}`;

    ctx.fillText(mrzLine1.substring(0, 36), 35, mrzY + 25);
    ctx.fillText(mrzLine2.substring(0, 36), 35, mrzY + 50);
    ctx.fillText(mrzLine3.substring(0, 36), 35, mrzY + 75);

    // Warning
    ctx.fillStyle = "#d32f2f";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠️ FAKE CARD — FOR EDUCATIONAL PURPOSES ONLY ⚠️", W / 2, H - 8);
  }, [addressBn, bloodGroup, birthPlace, issueDate, nidNo, nameEn, dob, photo]);

  const generateBoth = () => {
    drawFront();
    drawBack();
    // Re-draw after images load
    if (photo) {
      setTimeout(() => { drawFront(); drawBack(); }, 200);
    }
  };

  const downloadFront = () => {
    drawFront();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = "bd-smart-nid-front.png";
      a.href = frontCanvasRef.current?.toDataURL() || "";
      a.click();
    }, 300);
  };

  const downloadBack = () => {
    drawBack();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = "bd-smart-nid-back.png";
      a.href = backCanvasRef.current?.toDataURL() || "";
      a.click();
    }, 300);
  };

  return (
    <ToolLayout title="Fake BD Smart NID Card Maker" description="Generate realistic-looking fake Bangladesh Smart NID cards (front & back) for educational purposes only.">
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-sm text-destructive font-semibold text-center">⚠️ This tool is for educational/entertainment purposes only. Do NOT use for illegal activities.</p>

        <Card className="border-border/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Card Information</h3>
            
            {/* Photo upload */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Photo (Passport Size)</Label>
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && loadPhoto(e.target.files[0])} className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">নাম (বাংলা)</Label>
                <Input value={nameBn} onChange={e => setNameBn(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Name (English)</Label>
                <Input value={nameEn} onChange={e => setNameEn(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">পিতার নাম (বাংলা)</Label>
                <Input value={fatherBn} onChange={e => setFatherBn(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">মাতার নাম (বাংলা)</Label>
                <Input value={motherBn} onChange={e => setMotherBn(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                <Input value={dob} onChange={e => setDob(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">NID Number</Label>
                <Input value={nidNo} onChange={e => setNidNo(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">PIN</Label>
                <Input value={pin} onChange={e => setPin(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Place of Birth</Label>
                <Input value={birthPlace} onChange={e => setBirthPlace(e.target.value)} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Issue Date</Label>
                <Input value={issueDate} onChange={e => setIssueDate(e.target.value)} className="rounded-xl mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">ঠিকানা (বাংলা)</Label>
              <textarea value={addressBn} onChange={e => setAddressBn(e.target.value)} rows={2} className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-1 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={generateBoth} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Generate Card</Button>
              <Button onClick={downloadFront} variant="outline" className="rounded-xl">Download Front</Button>
              <Button onClick={downloadBack} variant="outline" className="rounded-xl">Download Back</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="front" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-xl">
            <TabsTrigger value="front" className="rounded-xl">Front Side</TabsTrigger>
            <TabsTrigger value="back" className="rounded-xl">Back Side</TabsTrigger>
          </TabsList>
          <TabsContent value="front" className="mt-4">
            <canvas ref={frontCanvasRef} className="w-full rounded-2xl border border-border shadow-lg" />
          </TabsContent>
          <TabsContent value="back" className="mt-4">
            <canvas ref={backCanvasRef} className="w-full rounded-2xl border border-border shadow-lg" />
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}

// Helper: rounded rectangle
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: draw simplified Shapla (national flower)
function drawShapla(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.fillStyle = "#7b1fa2";
  const petals = 8;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      cx + Math.cos(angle) * size * 0.4,
      cy + Math.sin(angle) * size * 0.4,
      size * 0.35, size * 0.18,
      angle, 0, Math.PI * 2
    );
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

// Helper: wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/[\s,]+/);
  let line = "";
  let ly = y;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, ly);
      line = word;
      ly += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, ly);
}

// Helper: format DOB to MRZ date
function formatMrzDate(dob: string): string {
  try {
    const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
    const parts = dob.split(" ");
    if (parts.length === 3) {
      const yy = parts[2].slice(-2);
      const mm = months[parts[1]] || "01";
      const dd = parts[0].padStart(2, "0");
      return `${yy}${mm}${dd}`;
    }
  } catch {}
  return "850121";
}

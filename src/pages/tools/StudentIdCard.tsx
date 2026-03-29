import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Eye, Upload } from "lucide-react";

const themes = [
  { id: "blue", name: "Royal Blue", primary: "#1a237e", secondary: "#283593", accent: "#3f51b5" },
  { id: "green", name: "Emerald", primary: "#1b5e20", secondary: "#2e7d32", accent: "#43a047" },
  { id: "red", name: "Crimson", primary: "#b71c1c", secondary: "#c62828", accent: "#e53935" },
  { id: "purple", name: "Royal Purple", primary: "#4a148c", secondary: "#6a1b9a", accent: "#8e24aa" },
  { id: "dark", name: "Dark Mode", primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460" },
];

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
  const [theme, setTheme] = useState("blue");
  const [photo, setPhoto] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const w = 600, h = 380;
    canvas.width = w;
    canvas.height = h;
    const t = themes.find(th => th.id === theme) || themes[0];

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, t.primary);
    grad.addColorStop(1, t.secondary);
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, w, h, 16);
    ctx.fill();

    // Inner white card
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(8, 8, w - 16, h - 16, 12);
    ctx.fill();

    // Header
    const hGrad = ctx.createLinearGradient(8, 8, w - 8, 65);
    hGrad.addColorStop(0, t.primary);
    hGrad.addColorStop(1, t.accent);
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, 55, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(institution.toUpperCase(), w / 2, 42);

    // Sub header
    ctx.fillStyle = t.accent;
    ctx.fillRect(8, 63, w - 16, 22);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("STUDENT IDENTITY CARD", w / 2, 78);

    // Photo area
    const px = 35, py = 100, pw = 110, ph = 135;
    ctx.fillStyle = "#f0f0f0";
    ctx.strokeStyle = t.primary;
    ctx.lineWidth = 2;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeRect(px, py, pw, ph);

    if (photo) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, px, py, pw, ph);
        ctx.strokeRect(px, py, pw, ph);
      };
      img.src = photo;
    } else {
      ctx.fillStyle = "#ccc";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Photo", px + pw / 2, py + ph / 2 + 4);
    }

    // Details
    ctx.textAlign = "left";
    const sx = 165, gap = 27;
    let y = 110;
    const fields = [
      { label: "Name", value: name },
      { label: "Student ID", value: studentId },
      { label: "Department", value: department },
      { label: "Session", value: session },
      { label: "Blood Group", value: blood },
      { label: "Date of Birth", value: dob },
      { label: "Phone", value: phone },
      { label: "Email", value: email },
    ];

    fields.forEach(f => {
      ctx.fillStyle = "#666";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText(f.label.toUpperCase(), sx, y);
      ctx.fillStyle = "#111";
      ctx.font = "13px 'Segoe UI', sans-serif";
      ctx.fillText(f.value, sx, y + 14);
      y += gap;
    });

    // QR placeholder
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(w - 100, 100, 70, 70);
    ctx.strokeStyle = "#ddd";
    ctx.strokeRect(w - 100, 100, 70, 70);
    ctx.fillStyle = "#999";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("QR Code", w - 65, 140);

    // Footer
    const fGrad = ctx.createLinearGradient(8, h - 50, w - 8, h - 8);
    fGrad.addColorStop(0, t.primary);
    fGrad.addColorStop(1, t.accent);
    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.roundRect(8, h - 50, w - 16, 42, [0, 0, 12, 12]);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("This card is the property of the institution. If found, please return to the address above.", w / 2, h - 28);
    ctx.fillText("Generated by Cyber Venom Tools", w / 2, h - 16);
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = `student-id-${studentId}.png`;
      a.href = canvasRef.current?.toDataURL("image/png") || "";
      a.click();
      toast.success("Downloaded!");
    }, 200);
  };

  return (
    <ToolLayout title="Student ID Card Maker" description="Create professional student ID cards with photo upload and multiple themes">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Input value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Institution Name" className="rounded-xl" />
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Student Name" className="rounded-xl" />
            <Input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Student ID" className="rounded-xl" />
            <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" className="rounded-xl" />
          </div>
          <div className="space-y-3">
            <Input value={session} onChange={e => setSession(e.target.value)} placeholder="Session" className="rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={blood} onChange={e => setBlood(e.target.value)} placeholder="Blood" className="rounded-xl" />
              <Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="rounded-xl" />
            </div>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="rounded-xl" />
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="rounded-xl" />
          </div>
        </div>

        {/* Theme + Photo */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="rounded-xl w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {themes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => photoRef.current?.click()}>
            <Upload className="w-4 h-4" /> {photo ? "Change Photo" : "Upload Photo"}
          </Button>
          {photo && <img src={photo} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />}
        </div>

        <div className="flex gap-3">
          <Button onClick={generate} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-1.5">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button onClick={download} variant="outline" className="rounded-xl gap-1.5">
            <Download className="w-4 h-4" /> Download
          </Button>
        </div>
        
        <canvas ref={canvasRef} className="w-full rounded-2xl border border-border shadow-lg" />
      </div>
    </ToolLayout>
  );
}

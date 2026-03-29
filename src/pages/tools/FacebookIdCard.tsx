import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Eye, Upload } from "lucide-react";

export default function FacebookIdCard() {
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Web Developer | Tech Enthusiast");
  const [friends, setFriends] = useState("1,234");
  const [followers, setFollowers] = useState("567");
  const [location, setLocation] = useState("New York, USA");
  const [workplace, setWorkplace] = useState("Tech Company Inc.");
  const [joined, setJoined] = useState("January 2015");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const handleProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 600, h = 400;
    canvas.width = w;
    canvas.height = h;

    // Card background
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(0, 0, w, h, 16);
    ctx.fill();

    // Cover photo area
    if (coverPhoto) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, w, 150); drawRest(); };
      img.src = coverPhoto;
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, 150);
      grad.addColorStop(0, "#1877f2");
      grad.addColorStop(1, "#42a5f5");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, w, 150, [16, 16, 0, 0]);
      ctx.fill();
    }

    drawRest();

    function drawRest() {
      if (!ctx) return;
      // Facebook header
      ctx.fillStyle = "rgba(24, 119, 242, 0.9)";
      ctx.fillRect(0, 0, w, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("facebook", 15, 28);
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("ID Card", w - 15, 26);

      // Profile photo circle
      const cx = 80, cy = 155, r = 45;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      
      if (profilePhoto) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
          ctx.restore();
          drawInfo();
        };
        img.src = profilePhoto;
      } else {
        ctx.fillStyle = "#e4e6eb";
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        ctx.fillStyle = "#999";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Photo", cx, cy + 4);
        ctx.restore();
        drawInfo();
      }

      function drawInfo() {
        if (!ctx) return;
        ctx.textAlign = "left";
        
        // Name & username
        ctx.fillStyle = "#050505";
        ctx.font = "bold 22px 'Segoe UI', sans-serif";
        ctx.fillText(name, 140, 165);
        ctx.fillStyle = "#65676b";
        ctx.font = "13px sans-serif";
        ctx.fillText(`@${username}`, 140, 185);

        // Bio
        ctx.fillStyle = "#333";
        ctx.font = "12px sans-serif";
        ctx.fillText(bio, 140, 208);

        // Stats row
        const statsY = 235;
        ctx.fillStyle = "#f0f2f5";
        ctx.fillRect(15, statsY - 5, w - 30, 35);
        
        const stats = [
          { label: "Friends", val: friends },
          { label: "Followers", val: followers },
          { label: "Joined", val: joined },
        ];
        const sWidth = (w - 30) / stats.length;
        stats.forEach((s, i) => {
          const sx = 15 + sWidth * i + sWidth / 2;
          ctx.fillStyle = "#1877f2";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(s.val, sx, statsY + 10);
          ctx.fillStyle = "#65676b";
          ctx.font = "10px sans-serif";
          ctx.fillText(s.label, sx, statsY + 23);
        });

        // Details
        const detailY = 285;
        ctx.textAlign = "left";
        const details = [
          { icon: "📍", label: "Location", val: location },
          { icon: "💼", label: "Works at", val: workplace },
        ];
        details.forEach((d, i) => {
          const dy = detailY + i * 28;
          ctx.font = "13px sans-serif";
          ctx.fillText(d.icon, 25, dy);
          ctx.fillStyle = "#65676b";
          ctx.font = "11px sans-serif";
          ctx.fillText(d.label + ":", 45, dy - 2);
          ctx.fillStyle = "#050505";
          ctx.font = "12px sans-serif";
          ctx.fillText(d.val, 45, dy + 13);
        });

        // Verification badge area
        ctx.fillStyle = "#1877f2";
        ctx.beginPath();
        ctx.arc(140 + ctx.measureText(name).width + 15, 157, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", 140 + ctx.measureText(name).width + 15, 161);

        // Footer
        ctx.fillStyle = "#f0f2f5";
        ctx.beginPath();
        ctx.roundRect(0, h - 45, w, 45, [0, 0, 16, 16]);
        ctx.fill();
        ctx.fillStyle = "#65676b";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Facebook ID Card — Generated by Cyber Venom Tools", w / 2, h - 24);
        ctx.fillText("This is a novelty card for entertainment purposes only", w / 2, h - 12);
      }
    }
  };

  const download = () => {
    generate();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = `facebook-id-${username}.png`;
      a.href = canvasRef.current?.toDataURL("image/png") || "";
      a.click();
      toast.success("Downloaded!");
    }, 300);
  };

  return (
    <ToolLayout title="Facebook ID Card Maker" description="Create stunning Facebook-style ID cards with photo upload">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="rounded-xl" />
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="rounded-xl" />
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" className="rounded-xl resize-none" rows={2} />
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="rounded-xl" />
          </div>
          <div className="space-y-3">
            <Input value={workplace} onChange={e => setWorkplace(e.target.value)} placeholder="Workplace" className="rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={friends} onChange={e => setFriends(e.target.value)} placeholder="Friends" className="rounded-xl" />
              <Input value={followers} onChange={e => setFollowers(e.target.value)} placeholder="Followers" className="rounded-xl" />
            </div>
            <Input value={joined} onChange={e => setJoined(e.target.value)} placeholder="Joined Date" className="rounded-xl" />
          </div>
        </div>

        {/* Photo uploads */}
        <div className="flex flex-wrap gap-3">
          <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhoto} />
          <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => profileRef.current?.click()}>
            <Upload className="w-4 h-4" /> {profilePhoto ? "Change Profile" : "Profile Photo"}
          </Button>
          <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => coverRef.current?.click()}>
            <Upload className="w-4 h-4" /> {coverPhoto ? "Change Cover" : "Cover Photo"}
          </Button>
          {profilePhoto && <img src={profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />}
          {coverPhoto && <img src={coverPhoto} alt="Cover" className="w-16 h-10 rounded-lg object-cover border" />}
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

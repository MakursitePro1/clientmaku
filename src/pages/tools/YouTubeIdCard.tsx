import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Eye, Upload, User, Settings, Video, ThumbsUp, RotateCcw, Sparkles, FileImage, FileText, Play } from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const cardStyles = [
  { id: "classic", name: "Classic Red", bg: "#0f0f0f", card: "#1a1a1a", accent: "#ff0000", accent2: "#cc0000", text: "#ffffff", sub: "#aaaaaa", border: "#333" },
  { id: "dark", name: "Pure Dark", bg: "#000000", card: "#111111", accent: "#ff4444", accent2: "#bb2222", text: "#e8e8e8", sub: "#888888", border: "#222" },
  { id: "light", name: "Light Mode", bg: "#ffffff", card: "#f9f9f9", accent: "#ff0000", accent2: "#cc0000", text: "#0f0f0f", sub: "#606060", border: "#e5e5e5" },
  { id: "gradient", name: "Neon Gradient", bg: "#0a0a1a", card: "#12122a", accent: "#ff3366", accent2: "#6633ff", text: "#ffffff", sub: "#9999cc", border: "#2a2a4a" },
  { id: "premium", name: "Gold Premium", bg: "#1a1510", card: "#242018", accent: "#d4a574", accent2: "#a67c50", text: "#fff8e1", sub: "#bba882", border: "#3a3025" },
];

const categories = ["Entertainment", "Gaming", "Education", "Music", "Tech", "Vlog", "News", "Sports", "Comedy", "Science", "Fashion", "Travel", "Food", "Fitness"];

export default function YouTubeIdCard() {
  const [channelName, setChannelName] = useState("My Channel");
  const [handle, setHandle] = useState("@mychannel");
  const [subscribers, setSubscribers] = useState("1,250,000");
  const [videoCount, setVideoCount] = useState("520");
  const [viewCount, setViewCount] = useState("85,000,000");
  const [likes, setLikes] = useState("2,400,000");
  const [joinDate, setJoinDate] = useState("Jan 2018");
  const [description, setDescription] = useState("Creating awesome content for you!");
  const [country, setCountry] = useState("Bangladesh");
  const [category, setCategory] = useState("Entertainment");
  const [verified, setVerified] = useState(true);
  const [cardStyle, setCardStyle] = useState("classic");
  const [avatarPhoto, setAvatarPhoto] = useState("");
  const [bannerPhoto, setBannerPhoto] = useState("");
  const [generated, setGenerated] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBannerPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 920, H = 560;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);
    const s = cardStyles.find(st => st.id === cardStyle) || cardStyles[0];
    const isLight = cardStyle === "light";

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    ctx.clearRect(0, 0, W, H);

    const drawCard = () => {
      // Card shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = s.bg;
      rr(0, 0, W, H, 18);
      ctx.fill();
      ctx.restore();

      // Card border
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 1.5;
      rr(0, 0, W, H, 18);
      ctx.stroke();

      // Clip card
      ctx.save();
      rr(0, 0, W, H, 18);
      ctx.clip();

      // ===== BANNER AREA (180px) =====
      const bannerH = 180;
      if (!bannerPhoto) {
        const bGrad = ctx.createLinearGradient(0, 0, W, bannerH);
        bGrad.addColorStop(0, s.accent);
        bGrad.addColorStop(0.5, s.accent2);
        bGrad.addColorStop(1, s.accent);
        ctx.fillStyle = bGrad;
        ctx.fillRect(0, 0, W, bannerH);

        // Decorative geometric pattern
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.arc(80 + i * 75, 50 + (i % 3) * 40, 15 + (i % 4) * 10, 0, Math.PI * 2);
          ctx.fill();
        }
        // Wave
        ctx.beginPath();
        ctx.moveTo(0, bannerH);
        for (let x = 0; x <= W; x += 5) {
          ctx.lineTo(x, bannerH - 15 + Math.sin(x * 0.02) * 12);
        }
        ctx.lineTo(W, bannerH + 20);
        ctx.lineTo(0, bannerH + 20);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // Play button icon center
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        const cx = W / 2, cy = bannerH / 2;
        ctx.moveTo(cx - 18, cy - 22);
        ctx.lineTo(cx + 22, cy);
        ctx.lineTo(cx - 18, cy + 22);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Banner bottom fade
      const fadeGrad = ctx.createLinearGradient(0, bannerH - 60, 0, bannerH);
      fadeGrad.addColorStop(0, "rgba(0,0,0,0)");
      fadeGrad.addColorStop(1, s.bg);
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, bannerH - 60, W, 60);

      // ===== PROFILE PHOTO =====
      const ppSize = 100;
      const ppX = 35;
      const ppY = bannerH - ppSize / 2;

      // White ring
      ctx.fillStyle = s.bg;
      ctx.beginPath();
      ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2 + 5, 0, Math.PI * 2);
      ctx.fill();

      // Accent ring
      ctx.strokeStyle = s.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2 + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Avatar placeholder
      ctx.save();
      ctx.beginPath();
      ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2);
      ctx.clip();
      if (!avatarPhoto) {
        ctx.fillStyle = isLight ? "#e5e5e5" : "#333";
        ctx.fillRect(ppX, ppY, ppSize, ppSize);
        ctx.fillStyle = isLight ? "#aaa" : "#666";
        ctx.font = "44px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("👤", ppX + ppSize / 2, ppY + ppSize / 2);
      }
      ctx.restore();

      // ===== CHANNEL NAME + VERIFIED =====
      const nameX = ppX + ppSize + 20;
      const nameY = bannerH + 16;

      ctx.fillStyle = s.text;
      ctx.font = "bold 26px 'Segoe UI', Helvetica, Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(channelName, nameX, nameY);

      // Verified badge
      if (verified) {
        const nameW = ctx.measureText(channelName).width;
        const bx = nameX + nameW + 12;
        const by = nameY - 8;
        ctx.fillStyle = isLight ? "#606060" : "#aaa";
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.bg;
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", bx, by + 4);
      }

      // Handle
      ctx.textAlign = "left";
      ctx.fillStyle = s.sub;
      ctx.font = "14px 'Segoe UI', sans-serif";
      ctx.fillText(handle, nameX, nameY + 22);

      // Subscriber count text
      ctx.fillStyle = s.sub;
      ctx.font = "13px 'Segoe UI', sans-serif";
      ctx.fillText(`${subscribers} subscribers • ${videoCount} videos`, nameX, nameY + 42);

      // ===== ACTION BUTTONS =====
      const btnY = bannerH + 68;

      // Subscribe button
      ctx.fillStyle = s.accent;
      rr(nameX, btnY, 120, 34, 18);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Subscribe", nameX + 60, btnY + 22);

      // Join button
      ctx.fillStyle = isLight ? "#e5e5e5" : s.card;
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 1;
      rr(nameX + 130, btnY, 80, 34, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = s.text;
      ctx.font = "bold 12px 'Segoe UI', sans-serif";
      ctx.fillText("Join", nameX + 170, btnY + 22);

      // Bell icon area
      ctx.fillStyle = isLight ? "#e5e5e5" : s.card;
      ctx.beginPath();
      ctx.arc(nameX + 240, btnY + 17, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = s.text;
      ctx.font = "14px sans-serif";
      ctx.fillText("🔔", nameX + 240, btnY + 22);

      // ===== DIVIDER =====
      const divY = btnY + 50;
      ctx.fillStyle = s.border;
      ctx.fillRect(25, divY, W - 50, 1);

      // ===== TABS =====
      const tabY = divY + 6;
      const tabNames = ["Home", "Videos", "Shorts", "Playlists", "Community", "About"];
      const tabW = (W - 50) / tabNames.length;
      tabNames.forEach((tab, i) => {
        const tx = 25 + tabW * i + tabW / 2;
        ctx.fillStyle = i === 0 ? s.text : s.sub;
        ctx.font = i === 0 ? "bold 12px 'Segoe UI', sans-serif" : "12px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(tab, tx, tabY + 16);
        if (i === 0) {
          ctx.fillStyle = s.accent;
          ctx.fillRect(25 + tabW * i + 10, tabY + 22, tabW - 20, 3);
        }
      });

      ctx.fillStyle = s.border;
      ctx.fillRect(25, tabY + 27, W - 50, 1);

      // ===== STATS ROW =====
      const statsY = tabY + 40;
      ctx.fillStyle = isLight ? "#f2f2f2" : s.card;
      rr(25, statsY, W - 50, 55, 12);
      ctx.fill();
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 0.5;
      rr(25, statsY, W - 50, 55, 12);
      ctx.stroke();

      const stats = [
        { label: "Subscribers", val: subscribers, color: s.accent },
        { label: "Videos", val: videoCount, color: "#3b82f6" },
        { label: "Views", val: viewCount, color: "#22c55e" },
        { label: "Likes", val: likes, color: "#f59e0b" },
      ];
      const sW = (W - 50) / stats.length;
      stats.forEach((st, i) => {
        const sx = 25 + sW * i + sW / 2;
        ctx.fillStyle = st.color;
        ctx.font = "bold 16px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(st.val, sx, statsY + 23);
        ctx.fillStyle = s.sub;
        ctx.font = "10px 'Segoe UI', sans-serif";
        ctx.fillText(st.label.toUpperCase(), sx, statsY + 40);
        if (i < stats.length - 1) {
          ctx.fillStyle = s.border;
          ctx.fillRect(25 + sW * (i + 1), statsY + 10, 1, 35);
        }
      });

      // ===== ABOUT SECTION =====
      const aboutY = statsY + 70;
      ctx.fillStyle = s.text;
      ctx.font = "bold 15px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("About", 35, aboutY);

      const details = [
        { icon: "📝", label: "Description", val: description.length > 50 ? description.slice(0, 50) + "…" : description },
        { icon: "📅", label: "Joined", val: joinDate },
        { icon: "📍", label: "Country", val: country },
        { icon: "🏷️", label: "Category", val: category },
      ];

      details.forEach((d, i) => {
        const dy = aboutY + 22 + i * 24;
        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(d.icon, 38, dy);
        ctx.fillStyle = s.sub;
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.fillText(d.label, 60, dy - 1);
        ctx.fillStyle = s.text;
        ctx.font = "bold 12px 'Segoe UI', sans-serif";
        const labelW = ctx.measureText(d.label + "  ").width;
        ctx.fillText(d.val, 60 + labelW, dy - 1);
      });

      // ===== RIGHT SIDE - YouTube play button graphic =====
      const rightX = W - 200;
      const rightY = aboutY - 10;

      // Play button circle
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = s.accent;
      ctx.beginPath();
      ctx.arc(rightX + 60, rightY + 45, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(rightX + 60, rightY + 45, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Play triangle
      ctx.fillStyle = s.accent;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(rightX + 48, rightY + 28);
      ctx.lineTo(rightX + 80, rightY + 45);
      ctx.lineTo(rightX + 48, rightY + 62);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // YouTube text
      ctx.fillStyle = s.sub;
      ctx.globalAlpha = 0.3;
      ctx.font = "bold 10px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("YOUTUBE", rightX + 60, rightY + 85);
      ctx.globalAlpha = 1;

      ctx.restore(); // end card clip
      setGenerated(true);
    };

    // Load images then draw
    let avatarLoaded = !avatarPhoto;
    let bannerLoaded = !bannerPhoto;

    const tryFinish = () => {
      if (avatarLoaded && bannerLoaded) {
        drawCard();

        if (avatarPhoto) {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(35 + 50, (180 - 50) + 50, 50, 0, Math.PI * 2);
            ctx.clip();
            const a = img.width / img.height;
            let dw = 100, dh = 100, dx = 35, dy = 180 - 50;
            if (a > 1) { dw = 100 * a; dx = 35 + 50 - dw / 2; }
            else { dh = 100 / a; dy = (180 - 50) + 50 - dh / 2; }
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
          };
          img.src = avatarPhoto;
        }
      }
    };

    if (bannerPhoto) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        rr(0, 0, W, 180, 18);
        ctx.clip();
        const a = img.width / img.height;
        let dw = W, dh = 180;
        if (a > W / 180) { dh = 180; dw = 180 * a; }
        else { dw = W; dh = W / a; }
        ctx.drawImage(img, (W - dw) / 2, (180 - dh) / 2, dw, dh);
        ctx.restore();
        bannerLoaded = true;
        tryFinish();
      };
      img.src = bannerPhoto;
    }

    if (avatarPhoto) {
      avatarLoaded = true;
    }

    if (!bannerPhoto) {
      tryFinish();
    }
  }, [channelName, handle, subscribers, videoCount, viewCount, likes, joinDate, description, country, category, verified, cardStyle, avatarPhoto, bannerPhoto]);

  const downloadAs = (format: "png" | "jpg" | "pdf") => {
    generate();
    setTimeout(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const filename = `youtube-card-${channelName.replace(/\s+/g, "-").toLowerCase()}`;

      if (format === "png") {
        const a = document.createElement("a");
        a.download = `${filename}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      } else if (format === "jpg") {
        const a = document.createElement("a");
        a.download = `${filename}.jpg`;
        a.href = canvas.toDataURL("image/jpeg", 0.95);
        a.click();
      } else if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");
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
      toast.success(`Card downloaded as ${format.toUpperCase()}!`);
    }, 500);
  };

  const resetAll = () => {
    setChannelName("My Channel"); setHandle("@mychannel"); setSubscribers("1,250,000");
    setVideoCount("520"); setViewCount("85,000,000"); setLikes("2,400,000");
    setJoinDate("Jan 2018"); setDescription("Creating awesome content for you!");
    setCountry("Bangladesh"); setCategory("Entertainment"); setVerified(true);
    setAvatarPhoto(""); setBannerPhoto(""); setCardStyle("classic"); setGenerated(false);
    toast.info("Form reset!");
  };

  return (
    <ToolLayout title="YouTube ID Card Maker" description="Create stunning YouTube channel ID cards with full customization, themes & multi-format export">
      <div className="space-y-6 max-w-3xl mx-auto">

        <Tabs defaultValue="channel" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="channel" className="gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> Channel</TabsTrigger>
            <TabsTrigger value="stats" className="gap-1.5 text-xs"><ThumbsUp className="w-3.5 h-3.5" /> Stats</TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs"><Settings className="w-3.5 h-3.5" /> Design</TabsTrigger>
          </TabsList>

          <TabsContent value="channel" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Channel Name</Label><Input value={channelName} onChange={e => setChannelName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Handle</Label><Input value={handle} onChange={e => setHandle(e.target.value)} className="rounded-xl" /></div>
              <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs text-muted-foreground">Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl resize-none" rows={2} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Country</Label><Input value={country} onChange={e => setCountry(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Joined</Label><Input value={joinDate} onChange={e => setJoinDate(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Subscribers</Label><Input value={subscribers} onChange={e => setSubscribers(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Videos</Label><Input value={videoCount} onChange={e => setVideoCount(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Total Views</Label><Input value={viewCount} onChange={e => setViewCount(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Total Likes</Label><Input value={likes} onChange={e => setLikes(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Card Style</Label>
              <Select value={cardStyle} onValueChange={setCardStyle}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{cardStyles.map(st => <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {cardStyles.map(st => (
                <button key={st.id} onClick={() => setCardStyle(st.id)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${cardStyle === st.id ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: `linear-gradient(135deg, ${st.accent}, ${st.accent2})` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBanner} />
              <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => avatarRef.current?.click()}>
                <Upload className="w-4 h-4" /> {avatarPhoto ? "Change Avatar" : "Avatar Photo"}
              </Button>
              <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => bannerRef.current?.click()}>
                <Upload className="w-4 h-4" /> {bannerPhoto ? "Change Banner" : "Banner Photo"}
              </Button>
              {avatarPhoto && <img src={avatarPhoto} alt="" className="w-10 h-10 rounded-full object-cover border" />}
              {bannerPhoto && <img src={bannerPhoto} alt="" className="w-16 h-10 rounded-lg object-cover border" />}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={verified} onCheckedChange={setVerified} />
              <Label className="text-xs">Verified Badge</Label>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Play, value: videoCount, label: "Videos", color: "text-red-500", border: "border-red-500/20", bg: "from-red-500/20 to-red-500/5" },
            { icon: ThumbsUp, value: likes, label: "Likes", color: "text-blue-500", border: "border-blue-500/20", bg: "from-blue-500/20 to-blue-500/5" },
            { icon: Eye, value: viewCount, label: "Views", color: "text-green-500", border: "border-green-500/20", bg: "from-green-500/20 to-green-500/5" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.bg} backdrop-blur-sm p-4 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-default`}>
              <div className={`w-9 h-9 mx-auto mb-2 rounded-xl bg-background/80 flex items-center justify-center shadow-sm ${stat.color}`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className="text-sm font-bold truncate">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="tool-btn-primary px-6 py-3 flex items-center gap-2 text-sm font-bold">
            <Eye className="w-4 h-4" /> Preview Card
          </button>
          <Button onClick={resetAll} variant="ghost" className="rounded-xl gap-1.5 text-muted-foreground hover:text-destructive">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Download Options */}
        {generated && (
          <div className="tool-section-card p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2"><Download className="w-4 h-4 text-primary" /> Download Options</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs" onClick={() => downloadAs("png")}><FileImage className="w-3.5 h-3.5 text-blue-500" /> PNG</Button>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs" onClick={() => downloadAs("jpg")}><FileImage className="w-3.5 h-3.5 text-orange-500" /> JPG</Button>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs" onClick={() => downloadAs("pdf")}><FileText className="w-3.5 h-3.5 text-red-500" /> PDF</Button>
            </div>
          </div>
        )}

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

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
import { Download, Eye, Upload, User, Settings, Heart, MessageCircle, RotateCcw, Sparkles, FileImage, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const cardStyles = [
  { id: "classic", name: "Classic Blue", headerBg: "#1877f2", headerBg2: "#42a5f5", textColor: "#fff" },
  { id: "dark", name: "Dark Mode", headerBg: "#242526", headerBg2: "#3a3b3c", textColor: "#e4e6eb" },
  { id: "gradient", name: "Gradient Purple", headerBg: "#833ab4", headerBg2: "#fd1d1d", textColor: "#fff" },
  { id: "green", name: "Green Nature", headerBg: "#1b5e20", headerBg2: "#43a047", textColor: "#fff" },
  { id: "gold", name: "Gold Premium", headerBg: "#5d4037", headerBg2: "#d4a574", textColor: "#fff8e1" },
];

export default function FacebookIdCard() {
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Web Developer | Tech Enthusiast | Coffee Lover ☕");
  const [friends, setFriends] = useState("1,234");
  const [followers, setFollowers] = useState("5,678");
  const [following, setFollowing] = useState("234");
  const [locationVal, setLocationVal] = useState("New York, USA");
  const [workplace, setWorkplace] = useState("Tech Company Inc.");
  const [education, setEducation] = useState("MIT - Computer Science");
  const [joined, setJoined] = useState("January 2015");
  const [relationship, setRelationship] = useState("Single");
  const [website, setWebsite] = useState("johndoe.com");
  const [likes, setLikes] = useState("12,345");
  const [posts, setPosts] = useState("456");
  const [verified, setVerified] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [cardStyle, setCardStyle] = useState("classic");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [generated, setGenerated] = useState(false);
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

  const generate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 900, H = 580;
    canvas.width = W * 2;
    canvas.height = H * 2;
    ctx.scale(2, 2);
    const style = cardStyles.find(s => s.id === cardStyle) || cardStyles[0];
    const isDark = cardStyle === "dark";
    const bgColor = isDark ? "#18191a" : "#ffffff";
    const cardBg = isDark ? "#242526" : "#f0f2f5";
    const textPrimary = isDark ? "#e4e6eb" : "#050505";
    const textSecondary = isDark ? "#b0b3b8" : "#65676b";
    const dividerColor = isDark ? "#3a3b3c" : "#e4e6eb";
    const fbBlue = "#1877f2";

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    // Clear
    ctx.clearRect(0, 0, W, H);

    const drawCard = () => {
      // ===== CARD BACKGROUND =====
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = bgColor;
      rr(0, 0, W, H, 16);
      ctx.fill();
      ctx.restore();

      // Border
      ctx.strokeStyle = isDark ? "#3a3b3c" : "#dddfe2";
      ctx.lineWidth = 1;
      rr(0, 0, W, H, 16);
      ctx.stroke();

      // Clip card
      ctx.save();
      rr(0, 0, W, H, 16);
      ctx.clip();

      // ===== COVER PHOTO AREA (200px) =====
      const coverH = 200;
      if (!coverPhoto) {
        const cGrad = ctx.createLinearGradient(0, 0, W, coverH);
        cGrad.addColorStop(0, style.headerBg);
        cGrad.addColorStop(1, style.headerBg2);
        ctx.fillStyle = cGrad;
        ctx.fillRect(0, 0, W, coverH);

        // Subtle pattern
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(150 + i * 130, 60 + (i % 2) * 50, 30 + i * 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // ===== PROFILE PHOTO =====
      const ppSize = 120;
      const ppX = 30;
      const ppY = coverH - ppSize / 2;

      // White border ring
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2 + 5, 0, Math.PI * 2);
      ctx.fill();

      // Profile bg
      ctx.save();
      ctx.beginPath();
      ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2);
      ctx.clip();

      if (!profilePhoto) {
        ctx.fillStyle = isDark ? "#3a3b3c" : "#e4e6eb";
        ctx.fillRect(ppX, ppY, ppSize, ppSize);
        ctx.fillStyle = isDark ? "#b0b3b8" : "#bec3c9";
        ctx.font = "56px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👤", ppX + ppSize / 2, ppY + ppSize / 2 + 18);
      }
      ctx.restore();

      // Online indicator
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(ppX + ppSize - 10, ppY + ppSize - 5, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#31a24c";
      ctx.beginPath();
      ctx.arc(ppX + ppSize - 10, ppY + ppSize - 5, 7, 0, Math.PI * 2);
      ctx.fill();

      // ===== NAME + VERIFIED =====
      const nameX = ppX + ppSize + 20;
      const nameY = coverH + 20;

      ctx.fillStyle = textPrimary;
      ctx.font = "bold 26px 'Segoe UI', Helvetica, Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(name, nameX, nameY);

      if (verified) {
        const nameW = ctx.measureText(name).width;
        ctx.fillStyle = fbBlue;
        ctx.beginPath();
        ctx.arc(nameX + nameW + 16, nameY - 6, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", nameX + nameW + 16, nameY - 2);
      }

      // Username
      ctx.textAlign = "left";
      ctx.fillStyle = textSecondary;
      ctx.font = "15px 'Segoe UI', sans-serif";
      ctx.fillText(`@${username}`, nameX, nameY + 22);

      // Bio
      ctx.fillStyle = isDark ? "#d0d3d8" : "#333";
      ctx.font = "14px 'Segoe UI', sans-serif";
      const bioText = bio.length > 60 ? bio.slice(0, 60) + "…" : bio;
      ctx.fillText(bioText, nameX, nameY + 44);

      // ===== ACTION BUTTONS ROW (Facebook style) =====
      const btnY = coverH + 78;

      // Add Friend button
      ctx.fillStyle = fbBlue;
      rr(ppX, btnY, 140, 36, 8);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("➕  Add Friend", ppX + 70, btnY + 23);

      // Message button
      ctx.fillStyle = isDark ? "#3a3b3c" : "#e4e6eb";
      rr(ppX + 150, btnY, 130, 36, 8);
      ctx.fill();
      ctx.fillStyle = textPrimary;
      ctx.font = "bold 13px 'Segoe UI', sans-serif";
      ctx.fillText("💬  Message", ppX + 215, btnY + 23);

      // Follow button
      ctx.fillStyle = isDark ? "#3a3b3c" : "#e4e6eb";
      rr(ppX + 290, btnY, 120, 36, 8);
      ctx.fill();
      ctx.fillStyle = textPrimary;
      ctx.font = "bold 13px 'Segoe UI', sans-serif";
      ctx.fillText("👤  Follow", ppX + 350, btnY + 23);

      // ===== DIVIDER =====
      const divY = btnY + 50;
      ctx.fillStyle = dividerColor;
      ctx.fillRect(20, divY, W - 40, 1);

      // ===== NAV TABS (Facebook style) =====
      const tabY = divY + 6;
      const tabs = ["Posts", "About", "Friends", "Photos", "Videos"];
      const tabW = (W - 40) / tabs.length;
      tabs.forEach((tab, i) => {
        const tx = 20 + tabW * i + tabW / 2;
        ctx.fillStyle = i === 1 ? fbBlue : textSecondary;
        ctx.font = i === 1 ? "bold 13px 'Segoe UI', sans-serif" : "13px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(tab, tx, tabY + 18);
        if (i === 1) {
          ctx.fillStyle = fbBlue;
          ctx.fillRect(20 + tabW * i + 10, tabY + 24, tabW - 20, 3);
        }
      });

      // Divider under tabs
      ctx.fillStyle = dividerColor;
      ctx.fillRect(20, tabY + 28, W - 40, 1);

      // ===== STATS ROW =====
      const statsY = tabY + 42;
      ctx.fillStyle = cardBg;
      rr(20, statsY, W - 40, 52, 10);
      ctx.fill();

      const stats = [
        { label: "Friends", val: friends },
        { label: "Followers", val: followers },
        { label: "Following", val: following },
        { label: "Posts", val: posts },
        { label: "Likes", val: likes },
      ];
      const sW = (W - 40) / stats.length;
      stats.forEach((s, i) => {
        const sx = 20 + sW * i + sW / 2;
        ctx.fillStyle = fbBlue;
        ctx.font = "bold 16px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.val, sx, statsY + 22);
        ctx.fillStyle = textSecondary;
        ctx.font = "11px 'Segoe UI', sans-serif";
        ctx.fillText(s.label, sx, statsY + 40);
        // Vertical divider
        if (i < stats.length - 1) {
          ctx.fillStyle = dividerColor;
          ctx.fillRect(20 + sW * (i + 1), statsY + 10, 1, 32);
        }
      });

      // ===== ABOUT / DETAILS SECTION =====
      const detailY = statsY + 68;

      // Section header
      ctx.fillStyle = textPrimary;
      ctx.font = "bold 16px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("About", 30, detailY);

      const details = [
        { icon: "📍", label: "Lives in", val: locationVal },
        { icon: "💼", label: "Works at", val: workplace },
        { icon: "🎓", label: "Studied at", val: education },
        { icon: "❤️", label: "Relationship", val: relationship },
        { icon: "🌐", label: "Website", val: website },
        { icon: "📅", label: "Joined Facebook", val: joined },
      ];

      details.forEach((d, i) => {
        const dy = detailY + 22 + i * 28;
        ctx.font = "16px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(d.icon, 32, dy);
        ctx.fillStyle = textSecondary;
        ctx.font = "13px 'Segoe UI', sans-serif";
        ctx.fillText(d.label, 56, dy - 1);
        ctx.fillStyle = textPrimary;
        ctx.font = "bold 13px 'Segoe UI', sans-serif";
        const labelW = ctx.measureText(d.label + " ").width;
        ctx.fillText(d.val, 56 + labelW + 4, dy - 1);
      });

      // ===== REACTIONS BAR =====
      if (showReactions) {
        const ry = H - 50;
        ctx.fillStyle = cardBg;
        rr(20, ry, W - 40, 36, 8);
        ctx.fill();

        const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
        reactions.forEach((r, i) => {
          ctx.font = "18px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(r, 35 + i * 38, ry + 25);
        });
        ctx.fillStyle = textSecondary;
        ctx.font = "12px 'Segoe UI', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${likes} reactions`, W - 35, ry + 24);
      }

      ctx.restore(); // end card clip
      setGenerated(true);
    };

    // Load images then draw
    let profileImgLoaded = !profilePhoto;
    let coverImgLoaded = !coverPhoto;

    const tryFinish = () => {
      if (profileImgLoaded && coverImgLoaded) {
        drawCard();

        // Draw cover photo on top if exists
        if (coverPhoto) {
          // already drawn before drawCard
        }

        // Draw profile photo on top
        if (profilePhoto) {
          const img2 = new Image();
          img2.onload = () => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(30 + 60, 200 - 60 + 60, 60, 0, Math.PI * 2);
            ctx.clip();
            const a = img2.width / img2.height;
            let dw = 120, dh = 120, dx = 30, dy2 = 140;
            if (a > 1) { dw = 120 * a; dx = 30 + 60 - dw / 2; }
            else { dh = 120 / a; dy2 = 140 + 60 - dh / 2; }
            ctx.drawImage(img2, dx, dy2, dw, dh);
            ctx.restore();
          };
          img2.src = profilePhoto;
        }
      }
    };

    if (coverPhoto) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        rr(0, 0, W, 200, 16);
        ctx.clip();
        const a = img.width / img.height;
        let dw = W, dh = 200;
        if (a > W / 200) { dh = 200; dw = 200 * a; }
        else { dw = W; dh = W / a; }
        ctx.drawImage(img, (W - dw) / 2, (200 - dh) / 2, dw, dh);
        ctx.restore();
        coverImgLoaded = true;
        tryFinish();
      };
      img.src = coverPhoto;
    }

    if (profilePhoto) {
      // Just mark as loaded, actual drawing happens in tryFinish
      profileImgLoaded = true;
    }

    if (!coverPhoto) {
      tryFinish();
    }
  }, [name, username, bio, friends, followers, following, locationVal, workplace, education, joined, relationship, website, likes, posts, verified, showReactions, cardStyle, profilePhoto, coverPhoto]);

  // ===== DOWNLOAD FUNCTIONS =====
  const downloadAs = (format: "png" | "jpg" | "pdf") => {
    generate();
    setTimeout(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const filename = `facebook-id-${username}`;

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
    setName("John Doe"); setUsername("johndoe"); setBio("Web Developer | Tech Enthusiast | Coffee Lover ☕");
    setFriends("1,234"); setFollowers("5,678"); setFollowing("234"); setLocationVal("New York, USA");
    setWorkplace("Tech Company Inc."); setEducation("MIT - Computer Science"); setJoined("January 2015");
    setRelationship("Single"); setWebsite("johndoe.com"); setLikes("12,345"); setPosts("456");
    setVerified(true); setProfilePhoto(""); setCoverPhoto(""); setCardStyle("classic");
    setGenerated(false);
    toast.info("Form reset!");
  };

  return (
    <ToolLayout title="Facebook ID Card Maker" description="Create stunning Facebook-style ID cards with full customization, themes & reactions">
      <div className="space-y-6 max-w-3xl mx-auto">

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="profile" className="gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> Profile</TabsTrigger>
            <TabsTrigger value="details" className="gap-1.5 text-xs"><Heart className="w-3.5 h-3.5" /> Details</TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs"><Settings className="w-3.5 h-3.5" /> Design</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} className="rounded-xl" /></div>
              <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs text-muted-foreground">Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-xl resize-none" rows={2} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Location</Label><Input value={locationVal} onChange={e => setLocationVal(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Workplace</Label><Input value={workplace} onChange={e => setWorkplace(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Education</Label><Input value={education} onChange={e => setEducation(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Joined</Label><Input value={joined} onChange={e => setJoined(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Friends</Label><Input value={friends} onChange={e => setFriends(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Followers</Label><Input value={followers} onChange={e => setFollowers(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Following</Label><Input value={following} onChange={e => setFollowing(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Posts</Label><Input value={posts} onChange={e => setPosts(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Total Likes</Label><Input value={likes} onChange={e => setLikes(e.target.value)} className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Relationship</Label>
                <Select value={relationship} onValueChange={setRelationship}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Single", "In a Relationship", "Engaged", "Married", "Complicated", "Not Specified"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-3 space-y-1.5"><Label className="text-xs text-muted-foreground">Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} className="rounded-xl" /></div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Card Style</Label>
              <Select value={cardStyle} onValueChange={setCardStyle}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{cardStyles.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {cardStyles.map(s => (
                <button key={s.id} onClick={() => setCardStyle(s.id)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${cardStyle === s.id ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"}`}
                  style={{ background: `linear-gradient(135deg, ${s.headerBg}, ${s.headerBg2})` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhoto} />
              <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => profileRef.current?.click()}>
                <Upload className="w-4 h-4" /> {profilePhoto ? "Change Profile" : "Profile Photo"}
              </Button>
              <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => coverRef.current?.click()}>
                <Upload className="w-4 h-4" /> {coverPhoto ? "Change Cover" : "Cover Photo"}
              </Button>
              {profilePhoto && <img src={profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border" />}
              {coverPhoto && <img src={coverPhoto} alt="" className="w-16 h-10 rounded-lg object-cover border" />}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Switch checked={verified} onCheckedChange={setVerified} /><Label className="text-xs">Verified Badge</Label></div>
              <div className="flex items-center gap-2"><Switch checked={showReactions} onCheckedChange={setShowReactions} /><Label className="text-xs">Reactions Bar</Label></div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: MessageCircle, value: posts, label: "Posts", color: "text-blue-500", border: "border-blue-500/20", bg: "from-blue-500/20 to-blue-500/5" },
            { icon: Heart, value: likes, label: "Likes", color: "text-pink-500", border: "border-pink-500/20", bg: "from-pink-500/20 to-pink-500/5" },
            { icon: User, value: friends, label: "Friends", color: "text-primary", border: "border-primary/20", bg: "from-primary/20 to-primary/5" },
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

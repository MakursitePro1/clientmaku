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
import { Download, Eye, Upload, User, Settings, Heart, MessageCircle, Share2, ThumbsUp, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const cardStyles = [
  { id: "classic", name: "Classic Blue", headerBg: "#1877f2", headerBg2: "#42a5f5", textColor: "#fff" },
  { id: "dark", name: "Dark Mode", headerBg: "#242526", headerBg2: "#3a3b3c", textColor: "#e4e6eb" },
  { id: "gradient", name: "Gradient Purple", headerBg: "#833ab4", headerBg2: "#fd1d1d", textColor: "#fff" },
  { id: "green", name: "Green Nature", headerBg: "#1b5e20", headerBg2: "#43a047", textColor: "#fff" },
  { id: "gold", name: "Gold Premium", headerBg: "#5d4037", headerBg2: "#d4a574", textColor: "#fff8e1" },
];

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number | number[]) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

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
    const w = 650, h = 520;
    canvas.width = w;
    canvas.height = h;
    const style = cardStyles.find(s => s.id === cardStyle) || cardStyles[0];
    const isDark = cardStyle === "dark";

    // Card shadow
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;

    // Main card bg
    ctx.fillStyle = isDark ? "#18191a" : "#ffffff";
    drawRoundRect(ctx, 0, 0, w, h, 16);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const drawAll = () => {
      if (!ctx) return;

      // Cover area (if no image)
      if (!coverPhoto) {
        const cGrad = ctx.createLinearGradient(0, 0, w, 170);
        cGrad.addColorStop(0, style.headerBg);
        cGrad.addColorStop(1, style.headerBg2);
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.roundRect(0, 0, w, 170, [16, 16, 0, 0]);
        ctx.fill();
        // Cover pattern
        ctx.save();
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * 170, Math.random() * 50 + 10, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
        ctx.restore();
      }

      // Facebook logo bar
      ctx.fillStyle = "rgba(24, 119, 242, 0.95)";
      ctx.fillRect(0, 0, w, 42);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px 'Segoe UI', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("facebook", 16, 30);
      // ID card badge
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      drawRoundRect(ctx, w - 90, 8, 75, 26, 13);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ID CARD", w - 52, 26);

      // Profile photo - white ring
      const cx = 85, cy = 175, r = 52;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#242526" : "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = style.headerBg;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Profile photo circle clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      if (profilePhoto) {
        // drawn externally
      } else {
        ctx.fillStyle = isDark ? "#3a3b3c" : "#e4e6eb";
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        ctx.fillStyle = isDark ? "#b0b3b8" : "#999";
        ctx.font = "36px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("👤", cx, cy + 12);
      }
      ctx.restore();

      // Active dot
      ctx.beginPath();
      ctx.arc(cx + r - 5, cy + r - 8, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#242526" : "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + r - 5, cy + r - 8, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#31a24c";
      ctx.fill();

      // Name + verification
      ctx.textAlign = "left";
      ctx.fillStyle = isDark ? "#e4e6eb" : "#050505";
      ctx.font = "bold 24px 'Segoe UI', sans-serif";
      const nameX = 155;
      ctx.fillText(name, nameX, 180);

      if (verified) {
        const nameW = ctx.measureText(name).width;
        ctx.fillStyle = "#1877f2";
        ctx.beginPath();
        ctx.arc(nameX + nameW + 14, 174, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", nameX + nameW + 14, 178);
      }

      ctx.textAlign = "left";
      ctx.fillStyle = isDark ? "#b0b3b8" : "#65676b";
      ctx.font = "13px sans-serif";
      ctx.fillText(`@${username}`, nameX, 200);

      // Bio
      ctx.fillStyle = isDark ? "#e4e6eb" : "#333";
      ctx.font = "12px sans-serif";
      const bioLines = bio.length > 50 ? [bio.slice(0, 50), bio.slice(50, 100)] : [bio];
      bioLines.forEach((line, i) => ctx.fillText(line, nameX, 220 + i * 16));

      // Stats row
      const statsY = 250;
      ctx.fillStyle = isDark ? "#242526" : "#f0f2f5";
      drawRoundRect(ctx, 15, statsY, w - 30, 42, 8);
      ctx.fill();

      const stats = [
        { label: "Friends", val: friends },
        { label: "Followers", val: followers },
        { label: "Following", val: following },
        { label: "Posts", val: posts },
        { label: "Likes", val: likes },
      ];
      const sWidth = (w - 30) / stats.length;
      stats.forEach((s, i) => {
        const sx = 15 + sWidth * i + sWidth / 2;
        ctx.fillStyle = "#1877f2";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.val, sx, statsY + 18);
        ctx.fillStyle = isDark ? "#b0b3b8" : "#65676b";
        ctx.font = "9px sans-serif";
        ctx.fillText(s.label, sx, statsY + 32);
      });

      // Details section
      const detailY = 310;
      ctx.textAlign = "left";
      const details = [
        { icon: "📍", label: "Lives in", val: locationVal },
        { icon: "💼", label: "Works at", val: workplace },
        { icon: "🎓", label: "Studied at", val: education },
        { icon: "❤️", label: "Relationship", val: relationship },
        { icon: "🌐", label: "Website", val: website },
        { icon: "📅", label: "Joined", val: joined },
      ];
      details.forEach((d, i) => {
        const dy = detailY + i * 26;
        ctx.font = "14px sans-serif";
        ctx.fillText(d.icon, 25, dy);
        ctx.fillStyle = isDark ? "#b0b3b8" : "#65676b";
        ctx.font = "10px sans-serif";
        ctx.fillText(d.label, 48, dy - 3);
        ctx.fillStyle = isDark ? "#e4e6eb" : "#050505";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(d.val, 48 + ctx.measureText(d.label).width + 8, dy - 3);
      });

      // Reactions row
      if (showReactions) {
        const ry = 475;
        ctx.fillStyle = isDark ? "#242526" : "#f0f2f5";
        drawRoundRect(ctx, 15, ry - 8, w - 30, 30, 6);
        ctx.fill();
        const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
        reactions.forEach((r, i) => {
          ctx.font = "16px sans-serif";
          ctx.fillText(r, 30 + i * 35, ry + 12);
        });
        ctx.fillStyle = isDark ? "#b0b3b8" : "#65676b";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${likes} reactions`, w - 25, ry + 12);
      }

      // Footer
      ctx.fillStyle = isDark ? "#242526" : "#f0f2f5";
      ctx.beginPath();
      ctx.roundRect(0, h - 38, w, 38, [0, 0, 16, 16]);
      ctx.fill();
      ctx.fillStyle = isDark ? "#b0b3b8" : "#65676b";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Facebook ID Card — Generated by Cyber Venom Tools — For Entertainment Purposes Only", w / 2, h - 18);
    };

    // Load images then draw
    let profileImgLoaded = !profilePhoto;
    let coverImgLoaded = !coverPhoto;

    const tryDraw = () => {
      if (profileImgLoaded && coverImgLoaded) drawAll();
    };

    if (coverPhoto) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, w, 170, [16, 16, 0, 0]);
        ctx.clip();
        const aspect = img.width / img.height;
        let dw = w, dh = 170;
        if (aspect > w / 170) { dh = 170; dw = 170 * aspect; }
        else { dw = w; dh = w / aspect; }
        ctx.drawImage(img, (w - dw) / 2, (170 - dh) / 2, dw, dh);
        ctx.restore();
        coverImgLoaded = true;
        tryDraw();
      };
      img.src = coverPhoto;
    }

    if (profilePhoto) {
      const img = new Image();
      img.onload = () => {
        profileImgLoaded = true;
        tryDraw();
        // Draw profile after all
        const cx2 = 85, cy2 = 175, r2 = 52;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx2 - r2, cy2 - r2, r2 * 2, r2 * 2);
        ctx.restore();
      };
      img.src = profilePhoto;
    }

    if (!profilePhoto && !coverPhoto) drawAll();
  }, [name, username, bio, friends, followers, following, locationVal, workplace, education, joined, relationship, website, likes, posts, verified, showReactions, cardStyle, profilePhoto, coverPhoto]);

  const downloadCard = () => {
    generate();
    setTimeout(() => {
      const a = document.createElement("a");
      a.download = `facebook-id-${username}.png`;
      a.href = canvasRef.current?.toDataURL("image/png") || "";
      a.click();
      toast.success("Facebook ID Card downloaded!");
    }, 400);
  };

  const resetAll = () => {
    setName("John Doe"); setUsername("johndoe"); setBio("Web Developer | Tech Enthusiast | Coffee Lover ☕");
    setFriends("1,234"); setFollowers("5,678"); setFollowing("234"); setLocationVal("New York, USA");
    setWorkplace("Tech Company Inc."); setEducation("MIT - Computer Science"); setJoined("January 2015");
    setRelationship("Single"); setWebsite("johndoe.com"); setLikes("12,345"); setPosts("456");
    setVerified(true); setProfilePhoto(""); setCoverPhoto(""); setCardStyle("classic");
    toast.info("Form reset!");
  };

  return (
    <ToolLayout title="Facebook ID Card Maker" description="Create stunning Facebook-style ID cards with full customization, themes & reactions">
      <div className="space-y-6 max-w-3xl mx-auto">

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-primary/5 border border-primary/20">
            <TabsTrigger value="profile" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"><User className="w-3.5 h-3.5" /> Profile</TabsTrigger>
            <TabsTrigger value="details" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"><Heart className="w-3.5 h-3.5" /> Details</TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"><Settings className="w-3.5 h-3.5" /> Design</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <div className="tool-section-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold gradient-text">Profile Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="sm:col-span-2 space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="tool-input-colorful rounded-xl resize-none" rows={2} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Location</Label><Input value={locationVal} onChange={e => setLocationVal(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Workplace</Label><Input value={workplace} onChange={e => setWorkplace(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Education</Label><Input value={education} onChange={e => setEducation(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Joined</Label><Input value={joined} onChange={e => setJoined(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="tool-section-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-pink-500" />
                <h3 className="text-sm font-bold gradient-text">Social Details</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Friends</Label><Input value={friends} onChange={e => setFriends(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Followers</Label><Input value={followers} onChange={e => setFollowers(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Following</Label><Input value={following} onChange={e => setFollowing(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Posts</Label><Input value={posts} onChange={e => setPosts(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Total Likes</Label><Input value={likes} onChange={e => setLikes(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Relationship</Label>
                  <Select value={relationship} onValueChange={setRelationship}>
                    <SelectTrigger className="tool-input-colorful rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Single", "In a Relationship", "Engaged", "Married", "Complicated", "Not Specified"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 sm:col-span-3 space-y-1.5"><Label className="text-xs text-muted-foreground font-semibold">Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} className="tool-input-colorful rounded-xl" /></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-4">
            <div className="tool-section-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-bold gradient-text">Design & Style</h3>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-semibold">Card Style</Label>
                <Select value={cardStyle} onValueChange={setCardStyle}>
                  <SelectTrigger className="tool-input-colorful rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{cardStyles.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 flex-wrap">
                {cardStyles.map(s => (
                  <button key={s.id} onClick={() => setCardStyle(s.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${cardStyle === s.id ? "ring-2 ring-primary scale-110 shadow-primary/30" : "opacity-70 hover:opacity-100 hover:scale-105"}`}
                    style={{ background: `linear-gradient(135deg, ${s.headerBg}, ${s.headerBg2})` }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhoto} />
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhoto} />
                <button className="tool-btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm" onClick={() => profileRef.current?.click()}>
                  <Upload className="w-4 h-4" /> {profilePhoto ? "Change Profile" : "Profile Photo"}
                </button>
                <button className="tool-btn-primary px-4 py-2.5 flex items-center gap-1.5 text-sm" onClick={() => coverRef.current?.click()}>
                  <Upload className="w-4 h-4" /> {coverPhoto ? "Change Cover" : "Cover Photo"}
                </button>
                {profilePhoto && <img src={profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30 shadow-md" />}
                {coverPhoto && <img src={coverPhoto} alt="" className="w-16 h-10 rounded-lg object-cover border-2 border-primary/30 shadow-md" />}
              </div>
              <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2"><Switch checked={verified} onCheckedChange={setVerified} /><Label className="text-xs font-semibold">Verified Badge ✓</Label></div>
                <div className="flex items-center gap-2"><Switch checked={showReactions} onCheckedChange={setShowReactions} /><Label className="text-xs font-semibold">Reactions Bar 😍</Label></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="tool-stat-card">
            <MessageCircle className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <div className="stat-value text-lg">{posts}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="tool-stat-card">
            <Heart className="w-5 h-5 mx-auto text-pink-500 mb-1" />
            <div className="stat-value text-lg">{likes}</div>
            <div className="stat-label">Likes</div>
          </div>
          <div className="tool-stat-card">
            <User className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="stat-value text-lg">{friends}</div>
            <div className="stat-label">Friends</div>
          </div>
        </div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="tool-result-card relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full rounded-2xl" />
          {!canvasRef.current?.width && (
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

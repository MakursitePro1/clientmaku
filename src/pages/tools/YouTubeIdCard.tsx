import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Youtube, Download, User, Eye, ThumbsUp, Video, Calendar, Copy, Sparkles, Camera } from "lucide-react";

export default function YouTubeIdCard() {
  const [form, setForm] = useState({
    channelName: "",
    subscriberCount: "",
    videoCount: "",
    viewCount: "",
    joinDate: "",
    description: "",
    country: "",
    category: "Entertainment",
    verified: true,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setAvatarPreview(r.result as string); r.readAsDataURL(file); }
  };

  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setBannerPreview(r.result as string); r.readAsDataURL(file); }
  };

  const update = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const formatNumber = (n: string) => {
    const num = parseInt(n);
    if (isNaN(num)) return n;
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas" as any).catch(() => ({ default: null }));
      if (!html2canvas) {
        // Fallback: copy as text
        const text = `YouTube Channel Card\n${form.channelName}\nSubscribers: ${form.subscriberCount}\nVideos: ${form.videoCount}\nViews: ${form.viewCount}`;
        navigator.clipboard.writeText(text);
        toast.success("Card data copied (install html2canvas for image export)");
        return;
      }
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
      const a = document.createElement("a");
      a.download = `youtube-card-${form.channelName || "channel"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast.success("Card downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  const categories = ["Entertainment", "Gaming", "Education", "Music", "Tech", "Vlog", "News", "Sports", "Comedy", "Science"];

  return (
    <ToolLayout title="YouTube ID Card Maker" description="Create stunning YouTube channel ID cards">
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="tool-section-card p-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 mb-3">
            <Youtube className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold text-red-400">YouTube Channel Card</span>
          </div>
          <h2 className="text-2xl font-black gradient-text">Create Your YouTube ID Card</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="tool-section-card p-4 space-y-3">
              <h3 className="text-sm font-bold gradient-text flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Channel Info</h3>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Channel Name *</label>
                <input value={form.channelName} onChange={e => update("channelName", e.target.value)}
                  className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="My Awesome Channel" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Subscribers</label>
                  <input value={form.subscriberCount} onChange={e => update("subscriberCount", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="1000000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Videos</label>
                  <input value={form.videoCount} onChange={e => update("videoCount", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Total Views</label>
                  <input value={form.viewCount} onChange={e => update("viewCount", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="50000000" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Join Date</label>
                  <input type="date" value={form.joinDate} onChange={e => update("joinDate", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Country</label>
                  <input value={form.country} onChange={e => update("country", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1" placeholder="Bangladesh" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select value={form.category} onChange={e => update("category", e.target.value)}
                    className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={e => update("description", e.target.value)}
                  className="tool-input-colorful w-full rounded-xl px-3 py-2.5 text-sm mt-1 min-h-[60px] resize-y" placeholder="Channel description..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.verified} onChange={e => update("verified", e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-xs font-semibold">Verified Badge ✓</span>
              </label>
            </div>

            <div className="tool-section-card p-4 space-y-3">
              <h3 className="text-sm font-bold gradient-text flex items-center gap-1.5"><Camera className="w-4 h-4" /> Images</h3>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleAvatar} className="tool-input-colorful w-full rounded-xl px-3 py-2 text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Banner Image</label>
                <input type="file" accept="image/*" onChange={handleBanner} className="tool-input-colorful w-full rounded-xl px-3 py-2 text-xs mt-1" />
              </div>
            </div>

            <button onClick={downloadCard} className="tool-btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold">
              <Download className="w-4 h-4" /> Download Card
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold gradient-text text-center">Preview</h3>
            <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/20" style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" }}>
              {/* Banner */}
              <div className="h-28 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 relative overflow-hidden">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
              </div>

              {/* Content */}
              <div className="px-5 pb-5 -mt-8 relative">
                {/* Avatar */}
                <div className="flex items-end gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full border-3 border-red-500 overflow-hidden bg-gradient-to-br from-red-500 to-pink-500 shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
                    )}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold text-lg leading-tight">{form.channelName || "Channel Name"}</span>
                      {form.verified && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">@{(form.channelName || "channel").toLowerCase().replace(/\s+/g, "")}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                    <ThumbsUp className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">{formatNumber(form.subscriberCount) || "0"}</div>
                    <div className="text-gray-500 text-[9px] uppercase font-semibold">Subscribers</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                    <Video className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">{formatNumber(form.videoCount) || "0"}</div>
                    <div className="text-gray-500 text-[9px] uppercase font-semibold">Videos</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-green-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">{formatNumber(form.viewCount) || "0"}</div>
                    <div className="text-gray-500 text-[9px] uppercase font-semibold">Views</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  {form.description && <p className="text-gray-300 text-[11px] line-clamp-2">{form.description}</p>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {form.joinDate && (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-[10px]">
                        <Calendar className="w-3 h-3" /> Joined {new Date(form.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    )}
                    {form.country && <span className="text-gray-400 text-[10px]">📍 {form.country}</span>}
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">{form.category}</span>
                  </div>
                </div>

                {/* YouTube branding */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span className="text-gray-500 text-[10px] font-bold">YouTube Channel Card</span>
                  </div>
                  <span className="text-gray-600 text-[9px]">Generated by Makursite</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Category", value: form.category, color: "text-red-400" },
                { label: "Status", value: form.verified ? "Verified ✓" : "Unverified", color: "text-green-400" },
              ].map(s => (
                <div key={s.label} className="tool-stat-card p-3 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">{s.label}</div>
                  <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

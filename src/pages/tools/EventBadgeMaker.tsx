import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EventBadgeMaker() {
  const [eventName, setEventName] = useState("Tech Summit 2025");
  const [attendeeName, setAttendeeName] = useState("John Doe");
  const [role, setRole] = useState("Speaker");
  const [org, setOrg] = useState("Acme Inc.");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const roleColors: Record<string, string> = {
    Speaker: "#e94560", Attendee: "#2563eb", VIP: "#f59e0b", Organizer: "#10b981", Volunteer: "#8b5cf6",
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 400; canvas.height = 550;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 400, 550);
    // Top color band
    const color = roleColors[role] || "#2563eb";
    ctx.fillStyle = color; ctx.fillRect(0, 0, 400, 12);
    // Event name
    ctx.textAlign = "center"; ctx.fillStyle = "#111";
    ctx.font = "bold 22px system-ui"; ctx.fillText(eventName, 200, 60);
    // Icon
    ctx.font = "60px system-ui"; ctx.fillText("🎫", 200, 150);
    // Name
    ctx.fillStyle = "#111"; ctx.font = "bold 28px system-ui"; ctx.fillText(attendeeName, 200, 230);
    // Org
    ctx.fillStyle = "#666"; ctx.font = "16px system-ui"; ctx.fillText(org, 200, 265);
    // Role badge
    ctx.fillStyle = color;
    const tw = ctx.measureText(role).width + 40;
    ctx.beginPath();
    ctx.roundRect(200 - tw / 2, 295, tw, 40, 20);
    ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 16px system-ui"; ctx.fillText(role, 200, 322);
    // QR placeholder
    ctx.fillStyle = "#f3f4f6"; ctx.fillRect(150, 370, 100, 100);
    ctx.fillStyle = "#999"; ctx.font = "12px system-ui"; ctx.fillText("QR Code", 200, 425);
    // Footer
    ctx.fillStyle = "#999"; ctx.font = "10px system-ui"; ctx.fillText("Scan badge for attendee info", 200, 510);
  };

  const download = () => {
    draw();
    setTimeout(() => {
      const a = document.createElement("a"); a.download = "event-badge.png"; a.href = canvasRef.current!.toDataURL(); a.click();
      toast.success("Downloaded!");
    }, 100);
  };

  useState(() => { setTimeout(draw, 100); });

  return (
    <ToolLayout title="Event Badge Maker" description="Create professional event badges and name tags">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          <div><label className="text-sm text-muted-foreground">Event Name</label><Input value={eventName} onChange={e => { setEventName(e.target.value); setTimeout(draw, 50); }} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Attendee Name</label><Input value={attendeeName} onChange={e => { setAttendeeName(e.target.value); setTimeout(draw, 50); }} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Organization</label><Input value={org} onChange={e => { setOrg(e.target.value); setTimeout(draw, 50); }} className="rounded-xl" /></div>
          <div>
            <label className="text-sm text-muted-foreground">Role</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.keys(roleColors).map(r => (
                <button key={r} onClick={() => { setRole(r); setTimeout(draw, 50); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${role === r ? "text-white" : "bg-accent/30"}`}
                  style={role === r ? { backgroundColor: roleColors[r], borderColor: roleColors[r] } : {}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={download} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Download Badge</Button>
        </div>
        <div className="flex items-center justify-center"><canvas ref={canvasRef} className="max-w-full rounded-2xl shadow-2xl" /></div>
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const link = `https://wa.me/${phone.replace(/[^0-9]/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  const copy = () => { navigator.clipboard.writeText(link); toast.success("Link copied!"); };

  return (
    <ToolLayout title="WhatsApp Link Generator" description="Create direct WhatsApp chat links">
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="text-sm font-medium mb-1 block">Phone Number (with country code)</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 8801712345678" className="rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Pre-filled Message (optional)</label>
          <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Hello! I'm interested in..." className="rounded-xl" />
        </div>
        {phone && (
          <div className="p-4 bg-accent/30 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-2">Generated Link:</p>
            <p className="text-sm font-mono break-all">{link}</p>
            <div className="flex gap-2 mt-3">
              <Button onClick={copy} size="sm" className="rounded-xl">Copy Link</Button>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="rounded-xl">Open in WhatsApp</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

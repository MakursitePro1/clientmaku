import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function MailtoLinkGenerator() {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const buildLink = () => {
    if (!to) return "";
    const params: string[] = [];
    if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
    if (bcc) params.push(`bcc=${encodeURIComponent(bcc)}`);
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${encodeURIComponent(to)}${params.length ? "?" + params.join("&") : ""}`;
  };

  const link = buildLink();
  const htmlCode = link ? `<a href="${link}">Send Email</a>` : "";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <ToolLayout title="Mailto Link Generator" description="Generate mailto links with subject, body & CC">
      <div className="max-w-2xl mx-auto space-y-5">
        <div><Label>To Email *</Label><Input value={to} onChange={e => setTo(e.target.value)} placeholder="user@example.com" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>CC</Label><Input value={cc} onChange={e => setCc(e.target.value)} placeholder="cc@example.com" /></div>
          <div><Label>BCC</Label><Input value={bcc} onChange={e => setBcc(e.target.value)} placeholder="bcc@example.com" /></div>
        </div>
        <div><Label>Subject</Label><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Hello there!" /></div>
        <div><Label>Body</Label><Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Email body text..." rows={4} /></div>

        {link && (
          <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
            <div>
              <Label className="text-muted-foreground text-xs">Mailto Link</Label>
              <p className="text-sm font-mono break-all bg-accent/50 p-3 rounded-lg mt-1">{link}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(link, "Mailto link")}>Copy Link</Button>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">HTML Code</Label>
              <p className="text-sm font-mono break-all bg-accent/50 p-3 rounded-lg mt-1">{htmlCode}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(htmlCode, "HTML code")}>Copy HTML</Button>
            </div>
            <Button className="w-full" asChild><a href={link}>Test Mailto Link</a></Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

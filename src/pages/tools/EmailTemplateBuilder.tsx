import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const templates = [
  { id: "welcome", label: "Welcome Email" },
  { id: "newsletter", label: "Newsletter" },
  { id: "promo", label: "Promotional" },
  { id: "reset", label: "Password Reset" },
];

export default function EmailTemplateBuilder() {
  const [template, setTemplate] = useState("welcome");
  const [brandName, setBrandName] = useState("My Brand");
  const [heading, setHeading] = useState("Welcome!");
  const [body, setBody] = useState("Thank you for joining us. We're excited to have you on board.");
  const [btnText, setBtnText] = useState("Get Started");
  const [btnUrl, setBtnUrl] = useState("https://example.com");
  const [color, setColor] = useState("#6d28d9");
  const [footer, setFooter] = useState("© 2026 My Brand. All rights reserved.");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
<tr><td style="background:${color};padding:32px 40px;text-align:center;"><div style="font-size:22px;font-weight:bold;color:#fff;">${brandName}</div></td></tr>
<tr><td style="padding:40px;">
<h1 style="margin:0 0 16px;font-size:24px;color:#111;">${heading}</h1>
<p style="font-size:15px;line-height:1.7;color:#555;margin:0 0 28px;">${body}</p>
${btnText ? `<a href="${btnUrl}" style="display:inline-block;background:${color};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">${btnText}</a>` : ""}
</td></tr>
<tr><td style="padding:24px 40px;border-top:1px solid #eee;text-align:center;font-size:12px;color:#999;">${footer}</td></tr>
</table></td></tr></table></body></html>`;

  const copy = () => { navigator.clipboard.writeText(html); toast.success("Template HTML copied!"); };
  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "email-template.html"; a.click();
    toast.success("Template downloaded!");
  };

  return (
    <ToolLayout title="Email Template Builder" description="Build responsive HTML email templates">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div><Label>Template Type</Label>
            <div className="flex flex-wrap gap-2 mt-1">{templates.map(t => (
              <Button key={t.id} variant={template === t.id ? "default" : "outline"} size="sm" onClick={() => setTemplate(t.id)}>{t.label}</Button>
            ))}</div>
          </div>
          <div><Label>Brand Name</Label><Input value={brandName} onChange={e => setBrandName(e.target.value)} /></div>
          <div><Label>Heading</Label><Input value={heading} onChange={e => setHeading(e.target.value)} /></div>
          <div><Label>Body Text</Label><Textarea value={body} onChange={e => setBody(e.target.value)} rows={4} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Button Text</Label><Input value={btnText} onChange={e => setBtnText(e.target.value)} /></div>
            <div><Label>Button URL</Label><Input value={btnUrl} onChange={e => setBtnUrl(e.target.value)} /></div>
          </div>
          <div><Label>Footer</Label><Input value={footer} onChange={e => setFooter(e.target.value)} /></div>
          <div><Label>Brand Color</Label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
          <div className="flex gap-3">
            <Button onClick={copy} className="flex-1">Copy HTML</Button>
            <Button onClick={download} variant="outline" className="flex-1">Download</Button>
          </div>
        </div>
        <div>
          <Label>Live Preview</Label>
          <iframe srcDoc={html} className="w-full h-[600px] rounded-xl border border-border mt-2" title="preview" sandbox="" />
        </div>
      </div>
    </ToolLayout>
  );
}

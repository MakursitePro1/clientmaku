import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EmailSignatureGenerator() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [color, setColor] = useState("#6d28d9");

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:#333;">
  <tr>
    <td style="border-right:3px solid ${color};padding-right:16px;margin-right:16px;">
      <div style="font-size:18px;font-weight:bold;color:${color};">${name || "Your Name"}</div>
      <div style="font-size:13px;color:#666;margin-top:2px;">${title || "Job Title"}</div>
      ${company ? `<div style="font-size:13px;font-weight:600;margin-top:2px;">${company}</div>` : ""}
    </td>
    <td style="padding-left:16px;">
      ${email ? `<div style="font-size:12px;margin-top:4px;">✉ <a href="mailto:${email}" style="color:${color};text-decoration:none;">${email}</a></div>` : ""}
      ${phone ? `<div style="font-size:12px;margin-top:4px;">📞 ${phone}</div>` : ""}
      ${website ? `<div style="font-size:12px;margin-top:4px;">🌐 <a href="${website}" style="color:${color};text-decoration:none;">${website}</a></div>` : ""}
    </td>
  </tr>
</table>`.trim();

  const copyHtml = () => {
    navigator.clipboard.writeText(signatureHtml);
    toast.success("HTML signature copied!");
  };

  return (
    <ToolLayout title="Email Signature Generator" description="Create professional HTML email signatures">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" /></div>
          <div><Label>Job Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Software Engineer" /></div>
          <div><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." /></div>
          <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" /></div>
          <div><Label>Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" /></div>
          <div><Label>Accent Color</Label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
        </div>
        <div className="space-y-4">
          <Label>Preview</Label>
          <div className="bg-white rounded-xl p-6 border border-border" dangerouslySetInnerHTML={{ __html: signatureHtml }} />
          <Button onClick={copyHtml} className="w-full">Copy HTML Signature</Button>
        </div>
      </div>
    </ToolLayout>
  );
}

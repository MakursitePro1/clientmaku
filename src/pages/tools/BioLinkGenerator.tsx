import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LinkItem { label: string; url: string; }

export default function BioLinkGenerator() {
  const [name, setName] = useState("My Name");
  const [bio, setBio] = useState("Creator | Developer | Designer");
  const [links, setLinks] = useState<LinkItem[]>([
    { label: "Portfolio", url: "https://example.com" },
    { label: "GitHub", url: "https://github.com" },
  ]);

  const addLink = () => setLinks([...links, { label: "", url: "" }]);
  const updateLink = (i: number, field: keyof LinkItem, val: string) => {
    const n = [...links]; n[i] = { ...n[i], [field]: val }; setLinks(n);
  };
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  const generateHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{max-width:420px;width:100%;text-align:center}h1{color:#fff;font-size:24px;margin-bottom:8px}p{color:rgba(255,255,255,.8);margin-bottom:24px}a{display:block;background:rgba(255,255,255,.15);backdrop-filter:blur(10px);color:#fff;text-decoration:none;padding:14px;border-radius:12px;margin-bottom:12px;font-weight:600;transition:transform .2s,background .2s}a:hover{transform:scale(1.02);background:rgba(255,255,255,.25)}</style></head><body><div class="container"><h1>${name}</h1><p>${bio}</p>${links.filter(l => l.label && l.url).map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join("")}</div></body></html>`;
    return html;
  };

  const copyHTML = () => { navigator.clipboard.writeText(generateHTML()); toast.success("HTML copied!"); };
  const download = () => {
    const blob = new Blob([generateHTML()], { type: "text/html" });
    const a = document.createElement("a"); a.download = "bio-link.html"; a.href = URL.createObjectURL(blob); a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout title="Bio Link Page Generator" description="Create a link-in-bio page like Linktree">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div><label className="text-sm text-muted-foreground">Name</label><Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
          <div><label className="text-sm text-muted-foreground">Bio</label><Input value={bio} onChange={e => setBio(e.target.value)} className="rounded-xl" /></div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-semibold">Links</label>
            {links.map((l, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Label" value={l.label} onChange={e => updateLink(i, "label", e.target.value)} className="rounded-xl flex-1" />
                <Input placeholder="URL" value={l.url} onChange={e => updateLink(i, "url", e.target.value)} className="rounded-xl flex-1" />
                <Button variant="ghost" size="sm" onClick={() => removeLink(i)} className="text-destructive">✕</Button>
              </div>
            ))}
            <Button variant="outline" onClick={addLink} className="w-full rounded-xl">+ Add Link</Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyHTML} variant="outline" className="flex-1 rounded-xl">Copy HTML</Button>
            <Button onClick={download} className="flex-1 gradient-bg text-primary-foreground rounded-xl">Download</Button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-1">{name}</h2>
          <p className="text-sm opacity-80 mb-6">{bio}</p>
          <div className="space-y-3">
            {links.filter(l => l.label).map((l, i) => (
              <div key={i} className="bg-white/15 backdrop-blur rounded-xl py-3 font-semibold text-sm">{l.label}</div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

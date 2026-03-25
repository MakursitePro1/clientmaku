import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PrivacyPolicyGenerator() {
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const policy = `Privacy Policy for ${site || "[Website Name]"}

Last updated: ${new Date().toLocaleDateString()}

${company || "[Company Name]"} ("we", "our", or "us") operates ${site || "[Website Name]"}. This page informs you of our policies regarding the collection, use, and disclosure of personal data.

Information Collection
We collect several types of information for various purposes to provide and improve our service to you:
• Personal Data: Name, email address, phone number
• Usage Data: IP address, browser type, pages visited, time spent
• Cookies and Tracking: We use cookies to track activity and hold certain information

Use of Data
We use the collected data for:
• To provide and maintain our service
• To notify you about changes
• To provide customer support
• To monitor usage and improve our service
• To detect and prevent technical issues

Data Security
The security of your data is important to us. We strive to use commercially acceptable means to protect your personal data.

Contact Us
If you have any questions about this Privacy Policy, please contact us:
• Email: ${email || "[email@example.com]"}
• Website: ${site || "[Website URL]"}`;

  const copy = () => { navigator.clipboard.writeText(policy); toast.success("Copied!"); };

  return (
    <ToolLayout title="Privacy Policy Generator" description="Generate a privacy policy for your website">
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input value={site} onChange={e => setSite(e.target.value)} placeholder="Website name/URL" className="rounded-xl" />
          <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name" className="rounded-xl" />
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Contact email" className="rounded-xl" />
        </div>
        <pre className="bg-accent/30 p-5 rounded-xl text-sm whitespace-pre-wrap border border-border max-h-96 overflow-auto">{policy}</pre>
        <Button onClick={copy} className="gradient-bg text-primary-foreground rounded-xl w-full">Copy Privacy Policy</Button>
      </div>
    </ToolLayout>
  );
}

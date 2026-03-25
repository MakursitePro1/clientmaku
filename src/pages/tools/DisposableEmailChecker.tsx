import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const disposableDomains = new Set([
  "mailinator.com","guerrillamail.com","tempmail.com","throwaway.email","yopmail.com",
  "sharklasers.com","guerrillamailblock.com","grr.la","guerrillamail.info","guerrillamail.biz",
  "guerrillamail.de","guerrillamail.net","guerrillamail.org","tempail.com","temp-mail.org",
  "fakeinbox.com","dispostable.com","maildrop.cc","mailnesia.com","mailcatch.com",
  "trashmail.com","trashmail.me","trashmail.net","10minutemail.com","minutemail.com",
  "emailondeck.com","getnada.com","mohmal.com","crazymailing.com","mailnull.com",
  "spamgourmet.com","mytemp.email","tempr.email","disposableemailaddresses.emailmiser.com",
  "harakirimail.com","mailforspam.com","safetymail.info","filzmail.com","trashymail.com",
  "temporary-mail.net","bugmenot.com","mailexpire.com","tempinbox.com","discard.email",
  "tmpmail.net","tmpmail.org","boun.cr","tmail.ws","mt2015.com","emailigo.de",
  "33mail.com","maildrop.cc","inboxkitten.com","temp-mail.io","emailfake.com",
  "generator.email","burnermail.io","mailsac.com","mailtemp.net",
]);

export default function DisposableEmailChecker() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<null | { isDisposable: boolean; domain: string }>(null);

  const check = () => {
    const domain = email.trim().split("@")[1]?.toLowerCase();
    if (!domain) return;
    setResult({ isDisposable: disposableDomains.has(domain), domain });
  };

  return (
    <ToolLayout title="Disposable Email Checker" description="Check if an email uses a disposable domain">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <Label>Enter Email Address</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" onKeyDown={e => e.key === "Enter" && check()} />
        </div>
        <Button onClick={check} className="w-full" disabled={!email.includes("@")}>Check Email</Button>

        {result && (
          <div className={`p-8 rounded-xl text-center border ${result.isDisposable ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"}`}>
            <div className="text-5xl mb-4">{result.isDisposable ? "⚠️" : "✅"}</div>
            <h3 className={`text-xl font-bold ${result.isDisposable ? "text-red-500" : "text-green-500"}`}>
              {result.isDisposable ? "Disposable Email Detected" : "Legitimate Email Domain"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Domain: <span className="font-mono font-bold">{result.domain}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {result.isDisposable
                ? "This email uses a temporary/disposable email service. It may not be reliable for account registration."
                : "This domain is not in our disposable email database. It appears to be a legitimate email provider."}
            </p>
          </div>
        )}

        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>What are disposable emails?</strong> Disposable (or temporary) email services provide short-lived email addresses. They are often used to bypass registrations, avoid spam, or maintain anonymity. Our database checks against {disposableDomains.size}+ known disposable email domains.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}

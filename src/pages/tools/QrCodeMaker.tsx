import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRCodeSVG } from "qrcode.react";
import { Download, Wifi, User, Link, MessageSquare } from "lucide-react";

type QRMode = "url" | "wifi" | "vcard" | "text" | "sms";

export default function QrCodeMaker() {
  const [mode, setMode] = useState<QRMode>("url");
  const [size, setSize] = useState("250");
  const [fgColor, setFgColor] = useState("#7c3aed");
  const [bgColor, setBgColor] = useState("#ffffff");

  // URL/Text
  const [text, setText] = useState("https://cybervenom.com");

  // WiFi
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard
  const [vcName, setVcName] = useState("");
  const [vcPhone, setVcPhone] = useState("");
  const [vcEmail, setVcEmail] = useState("");
  const [vcOrg, setVcOrg] = useState("");
  const [vcTitle, setVcTitle] = useState("");
  const [vcUrl, setVcUrl] = useState("");

  // SMS
  const [smsPhone, setSmsPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");

  const getQRData = (): string => {
    switch (mode) {
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcOrg}\nTITLE:${vcTitle}\nURL:${vcUrl}\nEND:VCARD`;
      case "sms":
        return `SMSTO:${smsPhone}:${smsBody}`;
      default:
        return text;
    }
  };

  const qrData = getQRData();
  const sizeNum = parseInt(size);

  const download = (format: "png" | "svg") => {
    const svgEl = document.querySelector("#qr-code-svg svg") as SVGSVGElement;
    if (!svgEl) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "qrcode.svg";
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = sizeNum * 2;
      canvas.height = sizeNum * 2;
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgEl);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, sizeNum * 2, sizeNum * 2);
        const a = document.createElement("a");
        a.download = "qrcode.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const modeIcons: Record<QRMode, React.ReactNode> = {
    url: <Link className="w-4 h-4" />,
    wifi: <Wifi className="w-4 h-4" />,
    vcard: <User className="w-4 h-4" />,
    text: <MessageSquare className="w-4 h-4" />,
    sms: <MessageSquare className="w-4 h-4" />,
  };

  return (
    <ToolLayout title="QR Code Maker" description="Create QR codes for URLs, WiFi, vCards, SMS and more">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Tabs value={mode} onValueChange={(v) => setMode(v as QRMode)}>
          <TabsList className="grid grid-cols-5 w-full rounded-2xl p-1.5 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5 border border-primary/10 h-auto">
            {(["url", "text", "wifi", "vcard", "sms"] as QRMode[]).map((m) => (
              <TabsTrigger key={m} value={m} className="rounded-xl gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 font-bold">
                {modeIcons[m]} {m === "url" ? "URL" : m === "wifi" ? "WiFi" : m === "vcard" ? "vCard" : m === "sms" ? "SMS" : "Text"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="url" className="space-y-3 mt-4">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL..." className="rounded-xl" />
          </TabsContent>

          <TabsContent value="text" className="space-y-3 mt-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </TabsContent>

          <TabsContent value="wifi" className="space-y-3 mt-4">
            <Input value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)} placeholder="Network Name (SSID)" className="rounded-xl" />
            <Input value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" type="password" className="rounded-xl" />
            <div className="flex gap-3 items-center">
              <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                <SelectTrigger className="rounded-xl w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="rounded" />
                Hidden Network
              </label>
            </div>
          </TabsContent>

          <TabsContent value="vcard" className="space-y-3 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input value={vcName} onChange={(e) => setVcName(e.target.value)} placeholder="Full Name" className="rounded-xl" />
              <Input value={vcPhone} onChange={(e) => setVcPhone(e.target.value)} placeholder="Phone" className="rounded-xl" />
              <Input value={vcEmail} onChange={(e) => setVcEmail(e.target.value)} placeholder="Email" className="rounded-xl" />
              <Input value={vcOrg} onChange={(e) => setVcOrg(e.target.value)} placeholder="Organization" className="rounded-xl" />
              <Input value={vcTitle} onChange={(e) => setVcTitle(e.target.value)} placeholder="Job Title" className="rounded-xl" />
              <Input value={vcUrl} onChange={(e) => setVcUrl(e.target.value)} placeholder="Website URL" className="rounded-xl" />
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-3 mt-4">
            <Input value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} placeholder="Phone Number" className="rounded-xl" />
            <Input value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="Message (optional)" className="rounded-xl" />
          </TabsContent>
        </Tabs>

        {/* Customization */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="rounded-xl w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["150", "200", "250", "300", "400", "500"].map((s) => (
                <SelectItem key={s} value={s}>{s}x{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">FG</label>
            <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl p-1 cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">BG</label>
            <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl p-1 cursor-pointer" />
          </div>
        </div>

        {/* QR Preview */}
        {qrData && (
          <div className="flex flex-col items-center gap-4">
            <div id="qr-code-svg" className="rounded-2xl p-6 inline-block border border-border/50" style={{ backgroundColor: bgColor }}>
              <QRCodeSVG value={qrData} size={sizeNum} fgColor={fgColor} bgColor={bgColor} level="H" includeMargin />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => download("png")} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2">
                <Download className="w-4 h-4" /> PNG
              </Button>
              <Button onClick={() => download("svg")} variant="outline" className="rounded-xl font-semibold gap-2">
                <Download className="w-4 h-4" /> SVG
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

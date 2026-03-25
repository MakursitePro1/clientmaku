import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WebsiteScreenshot() {
  const [url, setUrl] = useState("https://google.com");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState("");

  const take = async () => {
    setLoading(true);
    // Using a public screenshot API
    const apiUrl = `https://image.thum.io/get/width/1280/crop/720/https://${url.replace(/^https?:\/\//, "")}`;
    setScreenshot(apiUrl);
    setLoading(false);
  };

  return (
    <ToolLayout title="Website Screenshot Taker" description="Take screenshots of any website">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex gap-3">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter website URL..." className="rounded-xl" />
          <Button onClick={take} disabled={loading} className="gradient-bg text-primary-foreground rounded-xl font-semibold shrink-0">
            {loading ? "Capturing..." : "Take Screenshot"}
          </Button>
        </div>
        {screenshot && (
          <div className="space-y-3">
            <img src={screenshot} alt="Screenshot" className="w-full rounded-2xl border border-border" />
            <a href={screenshot} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-xl">Open Full Size</Button>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

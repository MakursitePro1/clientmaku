import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function extractVideoId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function YouTubeThumbnail() {
  const [url, setUrl] = useState("");
  const videoId = extractVideoId(url);
  const qualities = [
    { label: "Max Resolution", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { label: "High Quality", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { label: "Medium Quality", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
    { label: "Standard", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
  ];

  return (
    <ToolLayout title="YouTube Thumbnail Downloader" description="Download thumbnails from any YouTube video">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste YouTube video URL..." className="rounded-xl" />
        {videoId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {qualities.map(q => (
              <div key={q.label} className="bg-accent/50 rounded-xl p-3 text-center space-y-2">
                <img src={q.url} alt={q.label} className="rounded-lg w-full" />
                <p className="text-sm font-semibold">{q.label}</p>
                <a href={q.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="gradient-bg text-primary-foreground rounded-lg text-xs">Download</Button>
                </a>
              </div>
            ))}
          </div>
        ) : url && <p className="text-destructive text-sm">Invalid YouTube URL</p>}
      </div>
    </ToolLayout>
  );
}

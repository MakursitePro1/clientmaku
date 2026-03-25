import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Clock, Copy, ArrowLeftRight, RefreshCw } from "lucide-react";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateString, setDateString] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ts = parseInt(timestamp);
    if (!isNaN(ts)) {
      const ms = timestamp.length > 10 ? ts : ts * 1000;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) {
        setDateString(d.toISOString());
      }
    }
  }, [timestamp]);

  const convertDateToTimestamp = () => {
    if (!dateInput) return;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      toast({ title: "Invalid date", variant: "destructive" });
      return;
    }
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  };

  const setNow = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const now = new Date(currentTime);
  const ts = parseInt(timestamp);
  const ms = timestamp.length > 10 ? ts : ts * 1000;
  const parsed = !isNaN(ts) ? new Date(ms) : null;

  const formats = parsed && !isNaN(parsed.getTime()) ? [
    { label: "ISO 8601", value: parsed.toISOString() },
    { label: "UTC", value: parsed.toUTCString() },
    { label: "Local", value: parsed.toLocaleString() },
    { label: "Date Only", value: parsed.toLocaleDateString() },
    { label: "Time Only", value: parsed.toLocaleTimeString() },
    { label: "Unix (seconds)", value: Math.floor(parsed.getTime() / 1000).toString() },
    { label: "Unix (milliseconds)", value: parsed.getTime().toString() },
    { label: "Relative", value: getRelativeTime(parsed) },
  ] : [];

  return (
    <ToolLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates">
      <div className="space-y-6">
        {/* Current time display */}
        <div className="bg-card rounded-xl border border-border/50 p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Current Time</p>
          <p className="text-2xl font-bold font-mono gradient-text">{Math.floor(currentTime / 1000)}</p>
          <p className="text-sm text-muted-foreground mt-1">{now.toLocaleString()}</p>
        </div>

        {/* Timestamp input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Unix Timestamp
            </label>
            <div className="flex gap-2">
              <Input
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="rounded-xl bg-card border-border/50 font-mono"
                placeholder="e.g. 1700000000"
              />
              <Button variant="outline" size="icon" onClick={setNow} className="rounded-xl shrink-0" title="Set to now">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" /> Date to Timestamp
            </label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="rounded-xl bg-card border-border/50"
              />
              <Button variant="outline" onClick={convertDateToTimestamp} className="rounded-xl shrink-0">
                Convert
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {formats.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Converted Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((f) => (
                <div key={f.label} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-primary font-bold">{f.label}</p>
                    <p className="text-sm font-mono text-muted-foreground truncate">{f.value}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => copy(f.value)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? "ago" : "from now";

  if (abs < 60000) return `${Math.floor(abs / 1000)} seconds ${suffix}`;
  if (abs < 3600000) return `${Math.floor(abs / 60000)} minutes ${suffix}`;
  if (abs < 86400000) return `${Math.floor(abs / 3600000)} hours ${suffix}`;
  if (abs < 2592000000) return `${Math.floor(abs / 86400000)} days ${suffix}`;
  if (abs < 31536000000) return `${Math.floor(abs / 2592000000)} months ${suffix}`;
  return `${Math.floor(abs / 31536000000)} years ${suffix}`;
}

export default TimestampConverter;

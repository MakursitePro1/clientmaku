import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Volume2, Pause, Copy } from "lucide-react";

const TextToSpeech = () => {
  const [text, setText] = useState("Hello! This is a text to speech demo. Type anything and click speak to hear it.");
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceIdx, setVoiceIdx] = useState(0);

  const voices = typeof window !== "undefined" ? window.speechSynthesis?.getVoices() || [] : [];

  const speak = () => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voices[voiceIdx]) utterance.voice = voices[voiceIdx];
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return (
    <ToolLayout title="Text to Speech" description="Convert text to speech with customizable voice options">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Textarea value={text} onChange={e => setText(e.target.value)} className="min-h-[200px] rounded-xl bg-card border-border/50 resize-none" placeholder="Enter text to speak..." />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Voice</label>
            <select value={voiceIdx} onChange={e => setVoiceIdx(parseInt(e.target.value))}
              className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm">
              {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
              {voices.length === 0 && <option>Default</option>}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Speed: {rate}x</label>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Pitch: {pitch}</label>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="flex gap-3">
          {speaking ? (
            <Button onClick={stop} className="bg-destructive text-destructive-foreground rounded-xl font-semibold gap-2"><Pause className="w-4 h-4" /> Stop</Button>
          ) : (
            <Button onClick={speak} className="gradient-bg text-primary-foreground rounded-xl font-semibold gap-2"><Volume2 className="w-4 h-4" /> Speak</Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">{text.length} characters • ~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 150)} min speaking time</p>
      </div>
    </ToolLayout>
  );
};

export default TextToSpeech;

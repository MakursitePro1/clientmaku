import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Analysis {
  score: number;
  tips: string[];
  charCount: number;
  wordCount: number;
  hasEmoji: boolean;
  hasNumber: boolean;
  isQuestion: boolean;
  hasUrgency: boolean;
  previewText: string;
}

const spamWords = ["free", "buy now", "limited time", "act now", "click here", "winner", "congratulations", "urgent", "100%", "guarantee", "no cost", "cash", "!!!", "$$"];
const powerWords = ["exclusive", "proven", "secret", "discover", "unlock", "instantly", "new", "breaking", "important", "alert", "update", "introducing", "finally", "announcement"];

export default function EmailSubjectTester() {
  const [subject, setSubject] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const analyze = () => {
    const s = subject.trim();
    if (!s) return;
    let score = 50;
    const tips: string[] = [];
    const charCount = s.length;
    const wordCount = s.split(/\s+/).length;
    const hasEmoji = /\p{Extended_Pictographic}/u.test(s);
    const hasNumber = /\d/.test(s);
    const isQuestion = s.endsWith("?");
    const hasUrgency = /urgent|limited|last chance|hurry|deadline|expires/i.test(s);
    const lower = s.toLowerCase();

    // Length check
    if (charCount >= 30 && charCount <= 60) { score += 15; } else if (charCount < 20) { score -= 10; tips.push("Subject is too short — aim for 30-60 characters"); } else if (charCount > 80) { score -= 15; tips.push("Subject is too long — may get truncated on mobile"); }

    // Word count
    if (wordCount >= 4 && wordCount <= 9) score += 10; else tips.push("Aim for 4-9 words for best engagement");

    // Emoji
    if (hasEmoji) { score += 5; } else { tips.push("Consider adding an emoji for higher open rates"); }

    // Number
    if (hasNumber) { score += 5; } else { tips.push("Numbers in subject lines can boost open rates"); }

    // Question
    if (isQuestion) score += 5;

    // All caps check
    if (s === s.toUpperCase() && s.length > 3) { score -= 20; tips.push("Avoid ALL CAPS — it triggers spam filters"); }

    // Spam words
    const foundSpam = spamWords.filter(w => lower.includes(w));
    if (foundSpam.length) { score -= foundSpam.length * 5; tips.push(`Spam trigger words detected: ${foundSpam.join(", ")}`); }

    // Power words
    const foundPower = powerWords.filter(w => lower.includes(w));
    if (foundPower.length) { score += foundPower.length * 3; }

    // Personalization hint
    if (!lower.includes("you") && !lower.includes("your")) { tips.push("Try using 'you' or 'your' for personalization"); }

    if (tips.length === 0) tips.push("Great subject line! No issues found.");

    setAnalysis({
      score: Math.max(0, Math.min(100, score)),
      tips, charCount, wordCount, hasEmoji, hasNumber, isQuestion, hasUrgency,
      previewText: s.length > 40 ? s.substring(0, 40) + "..." : s,
    });
  };

  const getScoreColor = (score: number) => score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500";
  const getScoreLabel = (score: number) => score >= 70 ? "Great" : score >= 40 ? "Average" : "Needs Work";

  return (
    <ToolLayout title="Subject Line Tester" description="Analyze email subject lines for effectiveness">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label>Enter Subject Line</Label>
          <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Your amazing email subject line..." className="text-lg" />
        </div>
        <Button onClick={analyze} className="w-full" disabled={!subject.trim()}>Analyze Subject Line</Button>

        {analysis && (
          <div className="space-y-6">
            {/* Score */}
            <div className="text-center p-8 rounded-xl bg-card border border-border">
              <div className={`text-6xl font-extrabold ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
              <div className={`text-lg font-semibold mt-1 ${getScoreColor(analysis.score)}`}>{getScoreLabel(analysis.score)}</div>
              <p className="text-sm text-muted-foreground mt-2">out of 100</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Characters", value: analysis.charCount },
                { label: "Words", value: analysis.wordCount },
                { label: "Has Emoji", value: analysis.hasEmoji ? "✅" : "❌" },
                { label: "Has Number", value: analysis.hasNumber ? "✅" : "❌" },
              ].map((s, i) => (
                <div key={i} className="text-center p-3 rounded-lg bg-accent/50">
                  <div className="font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mobile Preview */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <Label className="text-xs text-muted-foreground">📱 Mobile Preview</Label>
              <div className="mt-2 p-3 bg-accent/30 rounded-lg">
                <p className="font-semibold text-sm">{analysis.previewText}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <Label>💡 Suggestions</Label>
              {analysis.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 text-sm">
                  <span>•</span><span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

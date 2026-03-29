import { useState, useEffect, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Timer, Zap, Target, Trophy, Keyboard, BarChart3, Share2 } from "lucide-react";

const textsByDifficulty: Record<string, string[]> = {
  easy: [
    "The cat sat on the mat. The dog ran in the park. It was a good day for a walk.",
    "I like to read books. My favorite color is blue. The sun is shining today.",
    "She went to the store. He played in the garden. They had a great time together.",
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do in a logical way.",
    "Technology is best when it brings people together. Innovation distinguishes between a leader and a follower in every field.",
    "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  ],
  hard: [
    "Asynchronous JavaScript uses promises and callbacks to handle operations that take an indeterminate amount of time, such as fetching data from an API endpoint.",
    "The implementation of efficient algorithms requires a deep understanding of data structures, time complexity analysis, and space-memory trade-offs in computer science.",
    "Quantum computing leverages superposition and entanglement to process exponentially more information than classical binary computers, revolutionizing cryptography.",
  ],
};

const durations = [15, 30, 60, 120, 300];

export default function TypingTest() {
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(60);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [errorChars, setErrorChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [bestWpm, setBestWpm] = useState(() => {
    try { return Number(localStorage.getItem("typing_best_wpm") || 0); } catch { return 0; }
  });
  const [allTimeTests, setAllTimeTests] = useState(() => {
    try { return Number(localStorage.getItem("typing_total_tests") || 0); } catch { return 0; }
  });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const wpmRef = useRef<ReturnType<typeof setInterval>>();

  const pickText = useCallback(() => {
    const texts = textsByDifficulty[difficulty] || textsByDifficulty.medium;
    let combined = "";
    while (combined.length < 600) {
      combined += (combined ? " " : "") + texts[Math.floor(Math.random() * texts.length)];
    }
    setText(combined);
  }, [difficulty]);

  useEffect(() => { pickText(); }, [pickText]);

  const finishTest = useCallback(() => {
    setFinished(true);
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    const elapsed = (Date.now() - startTime) / 60000;
    const words = correctChars / 5;
    const raw = input.length / 5;
    const w = Math.round(words / elapsed);
    const rw = Math.round(raw / elapsed);
    setWpm(w);
    setRawWpm(rw);
    if (w > bestWpm) {
      setBestWpm(w);
      try { localStorage.setItem("typing_best_wpm", String(w)); } catch {}
    }
    const newTotal = allTimeTests + 1;
    setAllTimeTests(newTotal);
    try { localStorage.setItem("typing_total_tests", String(newTotal)); } catch {}
  }, [startTime, correctChars, input.length, bestWpm, allTimeTests]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const left = Math.max(0, duration - elapsed);
        setTimeLeft(left);
        if (left <= 0) finishTest();
      }, 200);
      wpmRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 60000;
        if (elapsed > 0.05) {
          const w = Math.round((correctChars / 5) / elapsed);
          setWpmHistory(prev => [...prev, w].slice(-60));
        }
      }, 1000);
      return () => { clearInterval(timerRef.current); clearInterval(wpmRef.current); };
    }
  }, [started, finished, startTime, duration, finishTest, correctChars]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (finished) return;
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
      setTimeLeft(duration);
      setWpmHistory([]);
    }
    setInput(val);
    let correct = 0, errors = 0;
    for (let i = 0; i < val.length; i++) {
      if (i < text.length && val[i] === text[i]) correct++;
      else errors++;
    }
    setCorrectChars(correct);
    setErrorChars(errors);
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);
    if (val.length >= text.length) finishTest();
  };

  const reset = () => {
    setInput(""); setStarted(false); setFinished(false);
    setWpm(0); setRawWpm(0); setAccuracy(100); setTimeLeft(duration);
    setCorrectChars(0); setErrorChars(0); setWpmHistory([]);
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    pickText();
    inputRef.current?.focus();
  };

  const progress = Math.min(Math.round((input.length / text.length) * 100), 100);
  const liveWpm = started && !finished && input.length > 0
    ? Math.round((correctChars / 5) / ((Date.now() - startTime) / 60000))
    : 0;

  const getGrade = (w: number) => {
    if (w >= 100) return { grade: "S+", label: "Legendary!", emoji: "🏆", color: "text-yellow-400" };
    if (w >= 80) return { grade: "A+", label: "Excellent!", emoji: "🌟", color: "text-green-400" };
    if (w >= 60) return { grade: "A", label: "Great!", emoji: "✨", color: "text-green-500" };
    if (w >= 40) return { grade: "B", label: "Good!", emoji: "👍", color: "text-blue-500" };
    if (w >= 25) return { grade: "C", label: "Average", emoji: "📝", color: "text-yellow-500" };
    return { grade: "D", label: "Keep practicing", emoji: "💪", color: "text-orange-500" };
  };

  return (
    <ToolLayout title="Typing Test" description="Test your typing speed and accuracy with live WPM tracking and analytics">
      <div className="space-y-5 max-w-3xl mx-auto">
        {/* Settings */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={difficulty} onValueChange={v => { setDifficulty(v); reset(); }}>
            <SelectTrigger className="rounded-xl w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">😊 Easy</SelectItem>
              <SelectItem value="medium">📝 Medium</SelectItem>
              <SelectItem value="hard">🔥 Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1.5">
            {durations.map(d => (
              <button key={d} onClick={() => { setDuration(d); setTimeLeft(d); if (started) reset(); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${duration === d ? "gradient-bg text-white shadow-lg shadow-primary/25" : "bg-card border border-border/30 text-muted-foreground hover:border-primary/30 hover:text-primary"}`}>
                {d < 60 ? `${d}s` : `${d/60}m`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
            {bestWpm > 0 && (
              <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> Best: {bestWpm}</span>
            )}
            <span className="flex items-center gap-1"><Keyboard className="w-3.5 h-3.5" /> Tests: {allTimeTests}</span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Timer, label: "Time", val: started ? `${timeLeft}s` : `${duration}s`, highlight: timeLeft <= 10 && started },
            { icon: Zap, label: "WPM", val: finished ? wpm : (started ? liveWpm : "—") },
            { icon: Target, label: "Accuracy", val: `${accuracy}%` },
            { icon: BarChart3, label: "Progress", val: `${progress}%` },
          ].map(s => (
            <motion.div
              key={s.label}
              animate={s.highlight ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, repeat: s.highlight ? Infinity : 0 }}
              className={`rounded-2xl p-4 text-center border ${s.highlight ? "border-destructive/50 bg-destructive/5" : "border-border/30 bg-accent/50"}`}
            >
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.highlight ? "text-destructive" : "text-primary"}`} />
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
              <div className="text-xl font-extrabold">{s.val}</div>
            </motion.div>
          ))}
        </div>

        {/* Text Display */}
        <div className="bg-accent/30 rounded-2xl p-6 font-mono text-base leading-loose select-none border border-border/30 max-h-48 overflow-y-auto"
          onClick={() => inputRef.current?.focus()}>
          {text.split("").map((char, i) => {
            let cls = "text-muted-foreground/40";
            if (i < input.length) {
              cls = input[i] === char ? "text-green-500" : "text-red-500 bg-red-500/10 rounded-sm";
            }
            if (i === input.length) cls = "text-foreground underline decoration-primary decoration-2 animate-pulse";
            return <span key={i} className={cls}>{char}</span>;
          })}
        </div>

        {/* Input */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          disabled={finished}
          placeholder={started ? "" : "Click here and start typing..."}
          className="w-full rounded-xl border border-border bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={3}
          autoFocus
        />

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Results */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 overflow-hidden"
            >
              {(() => {
                const grade = getGrade(wpm);
                return (
                  <div className="p-6 bg-primary/5 border-b border-border/30 text-center">
                    <span className="text-5xl">{grade.emoji}</span>
                    <h3 className="text-4xl font-black text-primary mt-2">{wpm} WPM</h3>
                    <p className={`text-lg font-bold mt-1 ${grade.color}`}>{grade.grade} — {grade.label}</p>
                  </div>
                );
              })()}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/30">
                {[
                  { label: "Raw WPM", val: rawWpm },
                  { label: "Accuracy", val: `${accuracy}%` },
                  { label: "Correct", val: correctChars },
                  { label: "Errors", val: errorChars },
                ].map(s => (
                  <div key={s.label} className="p-3 text-center">
                    <div className="text-lg font-bold">{s.val}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* WPM Chart */}
              {wpmHistory.length > 3 && (
                <div className="p-4 border-t border-border/30">
                  <p className="text-xs font-bold mb-2">WPM Over Time</p>
                  <div className="h-16 flex items-end gap-[2px]">
                    {wpmHistory.map((w, i) => {
                      const max = Math.max(...wpmHistory, 1);
                      const h = (w / max) * 100;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-primary/60 rounded-t-sm min-w-[3px]"
                          style={{ height: `${h}%` }}
                          title={`${w} WPM`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button onClick={reset} variant="outline" className="rounded-xl gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Heart, Star, Cake, Zap, Share2, RotateCcw } from "lucide-react";

const zodiacSigns = [
  { sign: "Capricorn", symbol: "♑", el: "Earth", start: [1,1], end: [1,19] },
  { sign: "Aquarius", symbol: "♒", el: "Air", start: [1,20], end: [2,18] },
  { sign: "Pisces", symbol: "♓", el: "Water", start: [2,19], end: [3,20] },
  { sign: "Aries", symbol: "♈", el: "Fire", start: [3,21], end: [4,19] },
  { sign: "Taurus", symbol: "♉", el: "Earth", start: [4,20], end: [5,20] },
  { sign: "Gemini", symbol: "♊", el: "Air", start: [5,21], end: [6,20] },
  { sign: "Cancer", symbol: "♋", el: "Water", start: [6,21], end: [7,22] },
  { sign: "Leo", symbol: "♌", el: "Fire", start: [7,23], end: [8,22] },
  { sign: "Virgo", symbol: "♍", el: "Earth", start: [8,23], end: [9,22] },
  { sign: "Libra", symbol: "♎", el: "Air", start: [9,23], end: [10,22] },
  { sign: "Scorpio", symbol: "♏", el: "Water", start: [10,23], end: [11,21] },
  { sign: "Sagittarius", symbol: "♐", el: "Fire", start: [11,22], end: [12,21] },
  { sign: "Capricorn", symbol: "♑", el: "Earth", start: [12,22], end: [12,31] },
];

function getZodiac(month: number, day: number) {
  for (const z of zodiacSigns) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
  }
  return zodiacSigns[0];
}

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const chineseAnimals = ["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat"];
const chineseEmojis: Record<string, string> = { Monkey: "🐵", Rooster: "🐔", Dog: "🐕", Pig: "🐷", Rat: "🐀", Ox: "🐂", Tiger: "🐅", Rabbit: "🐇", Dragon: "🐉", Snake: "🐍", Horse: "🐴", Goat: "🐐" };

const generations: [number, number, string, string][] = [
  [1997, 2012, "Gen Z", "Digital natives"],
  [1981, 1996, "Millennial", "Tech-savvy generation"],
  [1965, 1980, "Gen X", "Independent & resourceful"],
  [1946, 1964, "Baby Boomer", "Post-war generation"],
  [2013, 2030, "Gen Alpha", "Most tech-immersed"],
];

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!dob) return;
    const birth = new Date(dob);
    const target = new Date(targetDate || new Date().toISOString().split("T")[0]);
    
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / 3600000);
    const totalMinutes = Math.floor(diffMs / 60000);
    const totalSeconds = Math.floor(diffMs / 1000);

    const nextBd = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBd <= target) nextBd.setFullYear(nextBd.getFullYear() + 1);
    const nextBirthday = Math.floor((nextBd.getTime() - target.getTime()) / 86400000);
    const isBirthdayToday = birth.getMonth() === target.getMonth() && birth.getDate() === target.getDate();

    const dayOfBirth = dayNames[birth.getDay()];
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chinese = chineseAnimals[birth.getFullYear() % 12];
    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const leapYears = Array.from({ length: years + 1 }, (_, i) => birth.getFullYear() + i).filter(isLeapYear).length;
    const bornInLeapYear = isLeapYear(birth.getFullYear());
    const heartbeats = Math.round(totalMinutes * 72);
    const breaths = Math.round(totalMinutes * 16);
    const sleepDays = Math.round(totalDays / 3);
    const totalMonths = years * 12 + months;
    const season = birth.getMonth() < 3 || birth.getMonth() === 11 ? "Winter ❄️" : birth.getMonth() < 6 ? "Spring 🌸" : birth.getMonth() < 9 ? "Summer ☀️" : "Autumn 🍂";
    const gen = generations.find(g => birth.getFullYear() >= g[0] && birth.getFullYear() <= g[1]);
    const planet = ["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"][birth.getMonth() % 8];
    const lifePercentage = Math.min(100, Math.round((years / 80) * 100));

    setResult({ years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, nextBirthday, isBirthdayToday, dayOfBirth, zodiac, chinese, leapYears, bornInLeapYear, heartbeats, breaths, sleepDays, totalMonths, season, gen, planet, lifePercentage });
  };

  const reset = () => { setDob(""); setTargetDate(new Date().toISOString().split("T")[0]); setResult(null); };

  return (
    <ToolLayout title="Age Calculator" description="Calculate your exact age with 25+ detailed life statistics and insights">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" />Date of Birth</label>
            <Input type="date" value={dob} onChange={e => setDob(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />Calculate To</label>
            <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={calculate} className="flex-1 gradient-bg text-primary-foreground rounded-xl font-semibold gap-1.5" size="lg">
            <Zap className="w-4 h-4" /> Calculate Age
          </Button>
          {result && (
            <Button onClick={reset} variant="outline" className="rounded-xl gap-1.5">
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Main Age */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: result.years, label: "Years", color: "text-primary" },
                  { val: result.months, label: "Months", color: "text-purple-500" },
                  { val: result.days, label: "Days", color: "text-blue-500" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-accent/50 rounded-2xl p-5 text-center border border-border/30"
                  >
                    <div className={`text-4xl font-extrabold ${s.color}`}>{s.val}</div>
                    <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Life Progress */}
              <div className="rounded-2xl border border-border/30 bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold">Life Progress (avg 80 years)</span>
                  <span className="text-xs font-bold text-primary">{result.lifePercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.lifePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  />
                </div>
              </div>

              {/* Birthday */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`rounded-2xl p-5 text-center border ${result.isBirthdayToday ? "bg-primary/10 border-primary/30" : "bg-primary/5 border-primary/20"}`}
              >
                <Cake className="w-6 h-6 mx-auto text-primary mb-2" />
                {result.isBirthdayToday ? (
                  <div className="text-lg font-bold">🎉 Happy Birthday! 🎂</div>
                ) : (
                  <div className="text-lg font-bold">🎂 Next birthday in <span className="text-primary">{result.nextBirthday}</span> days</div>
                )}
                <p className="text-sm text-muted-foreground mt-1">Born on <strong>{result.dayOfBirth}</strong> • {result.season}</p>
              </motion.div>

              {/* Zodiac & Chinese */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-accent/50 rounded-2xl p-4 text-center border border-border/30">
                  <div className="text-3xl">{result.zodiac.symbol}</div>
                  <div className="text-sm font-bold mt-1">{result.zodiac.sign}</div>
                  <div className="text-[10px] text-muted-foreground">{result.zodiac.el} Sign</div>
                </div>
                <div className="bg-accent/50 rounded-2xl p-4 text-center border border-border/30">
                  <div className="text-3xl">{chineseEmojis[result.chinese]}</div>
                  <div className="text-sm font-bold mt-1">{result.chinese}</div>
                  <div className="text-[10px] text-muted-foreground">Chinese Zodiac</div>
                </div>
                {result.gen && (
                  <div className="bg-accent/50 rounded-2xl p-4 text-center border border-border/30 col-span-2 sm:col-span-1">
                    <div className="text-3xl">🏷️</div>
                    <div className="text-sm font-bold mt-1">{result.gen[2]}</div>
                    <div className="text-[10px] text-muted-foreground">{result.gen[3]}</div>
                  </div>
                )}
              </div>

              {/* Detailed Stats */}
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="p-3 bg-accent/30 border-b border-border/30">
                  <h3 className="text-sm font-bold">📊 Age in Different Units</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-border/30">
                  {[
                    { label: "Total Months", val: result.totalMonths.toLocaleString() },
                    { label: "Total Weeks", val: result.totalWeeks.toLocaleString() },
                    { label: "Total Days", val: result.totalDays.toLocaleString() },
                    { label: "Total Hours", val: result.totalHours.toLocaleString() },
                    { label: "Total Minutes", val: result.totalMinutes.toLocaleString() },
                    { label: "Total Seconds", val: result.totalSeconds.toLocaleString() },
                  ].map(s => (
                    <div key={s.label} className="p-3 text-center">
                      <div className="text-lg font-bold text-primary">{s.val}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Life Stats */}
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="p-3 bg-accent/30 border-b border-border/30">
                  <h3 className="text-sm font-bold flex items-center gap-1.5"><Heart className="w-4 h-4 text-red-500" />Fun Life Statistics</h3>
                </div>
                <div className="divide-y divide-border/30">
                  {[
                    { icon: "💓", label: "Heartbeats", val: `~${(result.heartbeats / 1e9).toFixed(2)} billion` },
                    { icon: "🫁", label: "Breaths Taken", val: `~${(result.breaths / 1e6).toFixed(1)} million` },
                    { icon: "😴", label: "Time Sleeping", val: `~${result.sleepDays.toLocaleString()} days` },
                    { icon: "🌙", label: "Full Moons Seen", val: `~${Math.floor(result.totalDays / 29.5)}` },
                    { icon: "📅", label: "Leap Years Lived", val: `${result.leapYears} ${result.bornInLeapYear ? "(born in one!)" : ""}` },
                    { icon: "🍕", label: "Meals Eaten", val: `~${(result.totalDays * 3).toLocaleString()}` },
                    { icon: "🚶", label: "Steps Walked", val: `~${(result.totalDays * 7500).toLocaleString()}` },
                    { icon: "🌍", label: "Earth Orbits", val: `${result.years} complete` },
                    { icon: "🪐", label: "Ruling Planet", val: result.planet },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between px-4 py-3 hover:bg-accent/10 transition-colors">
                      <span className="text-sm flex items-center gap-2"><span>{s.icon}</span>{s.label}</span>
                      <span className="font-bold text-sm">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}

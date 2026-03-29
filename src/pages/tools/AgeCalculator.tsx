import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Heart, Star, Cake } from "lucide-react";

const zodiacSigns = [
  { sign: "Capricorn", symbol: "♑", start: [1,1], end: [1,19] },
  { sign: "Aquarius", symbol: "♒", start: [1,20], end: [2,18] },
  { sign: "Pisces", symbol: "♓", start: [2,19], end: [3,20] },
  { sign: "Aries", symbol: "♈", start: [3,21], end: [4,19] },
  { sign: "Taurus", symbol: "♉", start: [4,20], end: [5,20] },
  { sign: "Gemini", symbol: "♊", start: [5,21], end: [6,20] },
  { sign: "Cancer", symbol: "♋", start: [6,21], end: [7,22] },
  { sign: "Leo", symbol: "♌", start: [7,23], end: [8,22] },
  { sign: "Virgo", symbol: "♍", start: [8,23], end: [9,22] },
  { sign: "Libra", symbol: "♎", start: [9,23], end: [10,22] },
  { sign: "Scorpio", symbol: "♏", start: [10,23], end: [11,21] },
  { sign: "Sagittarius", symbol: "♐", start: [11,22], end: [12,21] },
  { sign: "Capricorn", symbol: "♑", start: [12,22], end: [12,31] },
];

function getZodiac(month: number, day: number) {
  for (const z of zodiacSigns) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
  }
  return zodiacSigns[0];
}

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getChineseZodiac(year: number) {
  const animals = ["Monkey","Rooster","Dog","Pig","Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat"];
  return animals[year % 12];
}

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

    const dayOfBirth = dayNames[birth.getDay()];
    const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
    const chinese = getChineseZodiac(birth.getFullYear());
    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const leapYears = Array.from({ length: years + 1 }, (_, i) => birth.getFullYear() + i).filter(isLeapYear).length;
    const heartbeats = Math.round(totalMinutes * 72);
    const breaths = Math.round(totalMinutes * 16);
    const sleepDays = Math.round(totalDays / 3);
    const totalMonths = years * 12 + months;

    setResult({ years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, nextBirthday, dayOfBirth, zodiac, chinese, leapYears, heartbeats, breaths, sleepDays, totalMonths });
  };

  return (
    <ToolLayout title="Age Calculator" description="Calculate your exact age with detailed life statistics">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" />Date of Birth</label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />Calculate To (optional)</label>
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="rounded-xl" />
          </div>
        </div>
        <Button onClick={calculate} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold" size="lg">Calculate Age</Button>
        
        {result && (
          <div className="space-y-4">
            {/* Main Age */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: result.years, label: "Years" },
                { val: result.months, label: "Months" },
                { val: result.days, label: "Days" },
              ].map(s => (
                <div key={s.label} className="bg-accent/50 rounded-2xl p-5 text-center">
                  <div className="text-3xl font-extrabold text-primary">{s.val}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Birthday Info */}
            <div className="bg-primary/5 rounded-2xl p-5 text-center border border-primary/20">
              <Cake className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="text-lg font-bold">🎂 Next birthday in <span className="text-primary">{result.nextBirthday}</span> days</div>
              <p className="text-sm text-muted-foreground mt-1">You were born on a <strong>{result.dayOfBirth}</strong></p>
            </div>

            {/* Zodiac */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-accent/50 rounded-2xl p-4 text-center">
                <Star className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="text-2xl">{result.zodiac.symbol}</div>
                <div className="text-sm font-bold">{result.zodiac.sign}</div>
                <div className="text-xs text-muted-foreground">Western Zodiac</div>
              </div>
              <div className="bg-accent/50 rounded-2xl p-4 text-center">
                <span className="text-2xl">🐉</span>
                <div className="text-sm font-bold mt-1">{result.chinese}</div>
                <div className="text-xs text-muted-foreground">Chinese Zodiac</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-3 bg-accent/30 border-b border-border/30">
                <h3 className="text-sm font-bold">📊 Age in Different Units</h3>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-border/30">
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
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Life Stats */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-3 bg-accent/30 border-b border-border/30">
                <h3 className="text-sm font-bold flex items-center gap-1.5"><Heart className="w-4 h-4 text-red-500" />Fun Life Statistics</h3>
              </div>
              <div className="space-y-0 divide-y divide-border/30">
                {[
                  { icon: "💓", label: "Heartbeats", val: `~${(result.heartbeats / 1e9).toFixed(2)} billion` },
                  { icon: "🫁", label: "Breaths Taken", val: `~${(result.breaths / 1e6).toFixed(1)} million` },
                  { icon: "😴", label: "Time Sleeping", val: `~${result.sleepDays.toLocaleString()} days` },
                  { icon: "🌙", label: "Full Moons Seen", val: `~${Math.floor(result.totalDays / 29.5)}` },
                  { icon: "📅", label: "Leap Years Lived", val: result.leapYears },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm flex items-center gap-2"><span>{s.icon}</span>{s.label}</span>
                    <span className="font-bold text-sm">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

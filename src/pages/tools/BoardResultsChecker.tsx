import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const boards = ["Dhaka", "Rajshahi", "Chittagong", "Comilla", "Jessore", "Barisal", "Sylhet", "Dinajpur", "Mymensingh", "Madrasah", "Technical"];
const exams = ["SSC", "HSC", "JSC", "PSC"];

export default function BoardResultsChecker() {
  const [board, setBoard] = useState("");
  const [exam, setExam] = useState("");
  const [roll, setRoll] = useState("");
  const [year, setYear] = useState("2024");
  const [result, setResult] = useState<null | string>(null);

  const check = () => {
    if (!board || !exam || !roll) return;
    // Simulated result
    const gpa = (Math.random() * 2 + 3).toFixed(2);
    setResult(`${exam} Result ${year} — Board: ${board}\nRoll: ${roll}\nGPA: ${gpa}\nStatus: Passed ✅`);
  };

  return (
    <ToolLayout title="Board Results Checker" description="Check your board exam results quickly">
      <div className="space-y-5 max-w-lg mx-auto">
        <Select onValueChange={setExam}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select Exam" /></SelectTrigger>
          <SelectContent>{exams.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
        </Select>
        <Select onValueChange={setBoard}>
          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select Board" /></SelectTrigger>
          <SelectContent>{boards.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Roll Number" value={roll} onChange={(e) => setRoll(e.target.value)} className="rounded-xl" />
        <Input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="rounded-xl" />
        <Button onClick={check} className="w-full gradient-bg text-primary-foreground rounded-xl font-semibold">Check Result</Button>
        {result && <pre className="bg-accent/50 rounded-2xl p-6 text-sm whitespace-pre-wrap">{result}</pre>}
      </div>
    </ToolLayout>
  );
}

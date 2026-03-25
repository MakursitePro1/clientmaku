import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const gradePoints: Record<string, number> = { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0 };

interface Course { name: string; grade: string; credits: number; }

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([{ name: "Course 1", grade: "A", credits: 3 }]);

  const addCourse = () => setCourses([...courses, { name: `Course ${courses.length + 1}`, grade: "A", credits: 3 }]);
  const update = (i: number, field: keyof Course, val: string | number) => {
    const c = [...courses]; (c[i] as any)[field] = val; setCourses(c);
  };
  const remove = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const gpa = totalCredits ? courses.reduce((s, c) => s + (gradePoints[c.grade] || 0) * c.credits, 0) / totalCredits : 0;

  return (
    <ToolLayout title="GPA Calculator" description="Calculate your Grade Point Average">
      <div className="space-y-4 max-w-2xl mx-auto">
        {courses.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input value={c.name} onChange={e => update(i, "name", e.target.value)} className="rounded-xl flex-1" />
            <Select value={c.grade} onValueChange={v => update(i, "grade", v)}>
              <SelectTrigger className="w-20 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(gradePoints).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" value={c.credits} onChange={e => update(i, "credits", Number(e.target.value))} className="w-20 rounded-xl" />
            <Button variant="ghost" size="sm" onClick={() => remove(i)} className="text-destructive">×</Button>
          </div>
        ))}
        <Button onClick={addCourse} variant="outline" className="rounded-xl">+ Add Course</Button>
        <div className="bg-accent/50 rounded-2xl p-6 text-center">
          <div className="text-4xl font-extrabold gradient-text">{gpa.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground mt-1">GPA ({totalCredits} credits)</p>
        </div>
      </div>
    </ToolLayout>
  );
}

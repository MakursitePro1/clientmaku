import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const firstNamesMale = ["James","John","Robert","Michael","David","William","Richard","Joseph","Thomas","Christopher","Daniel","Matthew","Anthony","Mark","Steven","Andrew","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob","Nicholas","Gary","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Raymond","Patrick","Alexander","Frank","Jack","Dennis","Jerry","Tyler","Nathan","Harry","Douglas"];
const firstNamesFemale = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Emily","Donna","Michelle","Dorothy","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function RandomNameGenerator() {
  const [gender, setGender] = useState("any");
  const [count, setCount] = useState(5);
  const [names, setNames] = useState<string[]>([]);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const g = gender === "any" ? (Math.random() > 0.5 ? "male" : "female") : gender;
      const first = g === "male" ? rand(firstNamesMale) : rand(firstNamesFemale);
      result.push(`${first} ${rand(lastNames)}`);
    }
    setNames(result);
    toast.success(`${count} names generated!`);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(names.join("\n"));
    toast.success("Copied all names!");
  };

  return (
    <ToolLayout title="Random Name Generator" description="Generate realistic random names instantly">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Gender</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
            <SelectTrigger className="rounded-xl w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,5,10,20,50].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground">
          <RefreshCw className="w-4 h-4" /> Generate Names
        </Button>
        {names.length > 0 && (
          <div className="space-y-2">
            <div className="p-4 bg-card rounded-xl border border-border/50 space-y-1 max-h-80 overflow-y-auto">
              {names.map((n, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-accent/30 transition-colors">
                  <span className="text-sm font-medium">{n}</span>
                  <button onClick={() => { navigator.clipboard.writeText(n); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Button onClick={copyAll} variant="outline" className="rounded-xl gap-2 w-full">
              <Copy className="w-4 h-4" /> Copy All
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

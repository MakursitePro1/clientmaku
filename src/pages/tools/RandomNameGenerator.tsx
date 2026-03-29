import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const firstNamesMale = ["James","John","Robert","Michael","David","William","Richard","Joseph","Thomas","Christopher","Daniel","Matthew","Anthony","Mark","Steven","Andrew","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob","Nicholas","Gary","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin","Samuel","Raymond","Patrick","Alexander","Frank","Jack","Dennis","Jerry","Tyler","Nathan","Harry","Douglas","Oliver","Ethan","Liam","Noah","Lucas","Mason","Logan","Henry","Leo","Owen"];
const firstNamesFemale = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Emily","Donna","Michelle","Dorothy","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Olivia","Sophia","Ava","Isabella","Mia","Charlotte","Amelia","Harper"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];
const middleNames = ["Alexander","James","Marie","Grace","Michael","Elizabeth","Anne","Rose","Lee","Jean","Lynn","Mae","Louise","May","Jane","Scott","Paul","Ray","Thomas","Marie"];

const emailDomains = ["gmail.com","yahoo.com","outlook.com","hotmail.com","protonmail.com","icloud.com"];
const usernameSuffixes = ["_official","123","_real","99","_x","007","_pro","2024","_dev","_tech"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

interface GeneratedName {
  first: string;
  middle: string;
  last: string;
  full: string;
  gender: string;
  email: string;
  username: string;
  phone: string;
  age: number;
}

export default function RandomNameGenerator() {
  const [gender, setGender] = useState("any");
  const [count, setCount] = useState(5);
  const [includeMiddle, setIncludeMiddle] = useState(true);
  const [includeExtras, setIncludeExtras] = useState(true);
  const [names, setNames] = useState<GeneratedName[]>([]);

  const generate = () => {
    const result: GeneratedName[] = [];
    for (let i = 0; i < count; i++) {
      const g = gender === "any" ? (Math.random() > 0.5 ? "male" : "female") : gender;
      const first = g === "male" ? rand(firstNamesMale) : rand(firstNamesFemale);
      const middle = rand(middleNames);
      const last = rand(lastNames);
      const full = includeMiddle ? `${first} ${middle} ${last}` : `${first} ${last}`;
      const email = `${first.toLowerCase()}.${last.toLowerCase()}${randNum(1,99)}@${rand(emailDomains)}`;
      const username = `${first.toLowerCase()}${rand(usernameSuffixes)}`;
      const phone = `+1 ${randNum(200,999)}-${randNum(100,999)}-${randNum(1000,9999)}`;
      const age = randNum(18, 65);
      result.push({ first, middle, last, full, gender: g, email, username, phone, age });
    }
    setNames(result);
    toast.success(`${count} names generated!`);
  };

  const copyAll = () => {
    const text = names.map(n => {
      let line = n.full;
      if (includeExtras) line += ` | ${n.email} | ${n.username} | ${n.phone} | Age: ${n.age}`;
      return line;
    }).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied all!");
  };

  const downloadCsv = () => {
    const header = "Full Name,First,Middle,Last,Gender,Email,Username,Phone,Age";
    const rows = names.map(n => `"${n.full}","${n.first}","${n.middle}","${n.last}","${n.gender}","${n.email}","${n.username}","${n.phone}",${n.age}`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "random-names.csv";
    a.click();
    toast.success("CSV downloaded!");
  };

  return (
    <ToolLayout title="Random Name Generator" description="Generate realistic random identities with emails, usernames, and more">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="rounded-xl w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Gender</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
            <SelectTrigger className="rounded-xl w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,5,10,20,50,100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={includeMiddle} onCheckedChange={c => setIncludeMiddle(!!c)} />
            Middle Name
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={includeExtras} onCheckedChange={c => setIncludeExtras(!!c)} />
            Extra Details
          </label>
        </div>

        <Button onClick={generate} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground" size="lg">
          <RefreshCw className="w-4 h-4" /> Generate Names
        </Button>

        {names.length > 0 && (
          <div className="space-y-3">
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="max-h-96 overflow-y-auto divide-y divide-border/20">
                {names.map((n, i) => (
                  <div key={i} className="p-3 hover:bg-accent/10 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${n.gender === "male" ? "bg-blue-500/10 text-blue-600" : "bg-pink-500/10 text-pink-600"}`}>
                          {n.gender === "male" ? "♂" : "♀"}
                        </span>
                        {n.full}
                        <span className="text-xs text-muted-foreground">Age {n.age}</span>
                      </span>
                      <button onClick={() => { navigator.clipboard.writeText(n.full); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {includeExtras && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>📧 {n.email}</span>
                        <span>👤 @{n.username}</span>
                        <span>📱 {n.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyAll} variant="outline" className="rounded-xl gap-1.5 flex-1">
                <Copy className="w-4 h-4" /> Copy All
              </Button>
              <Button onClick={downloadCsv} variant="outline" className="rounded-xl gap-1.5 flex-1">
                <Download className="w-4 h-4" /> Download CSV
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Download, Users, User, Mail, Phone, Hash, Sparkles } from "lucide-react";
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

  const maleCount = names.filter(n => n.gender === "male").length;
  const femaleCount = names.filter(n => n.gender === "female").length;
  const avgAge = names.length > 0 ? Math.round(names.reduce((a, n) => a + n.age, 0) / names.length) : 0;

  return (
    <ToolLayout title="Random Name Generator" description="Generate realistic random identities with emails, usernames, and more">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Settings Card */}
        <div className="tool-section-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold">Generation Settings</h3>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="rounded-xl w-36 tool-input-colorful"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">🎲 Any Gender</SelectItem>
                <SelectItem value="male">♂️ Male</SelectItem>
                <SelectItem value="female">♀️ Female</SelectItem>
              </SelectContent>
            </Select>
            <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
              <SelectTrigger className="rounded-xl w-24 tool-input-colorful"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,5,10,20,50,100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
              <Checkbox checked={includeMiddle} onCheckedChange={c => setIncludeMiddle(!!c)} />
              <span className="font-medium text-xs">Middle Name</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
              <Checkbox checked={includeExtras} onCheckedChange={c => setIncludeExtras(!!c)} />
              <span className="font-medium text-xs">Extra Details</span>
            </label>
          </div>
        </div>

        <button onClick={generate} className="tool-btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
          <Sparkles className="w-5 h-5" /> Generate Names
        </button>

        <AnimatePresence>
          {names.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="tool-stat-card">
                  <Hash className="w-4 h-4 mx-auto text-primary mb-1" />
                  <div className="stat-value text-lg">{names.length}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="tool-stat-card">
                  <div className="text-blue-500 font-bold text-lg mx-auto mb-1">♂</div>
                  <div className="stat-value text-lg">{maleCount}</div>
                  <div className="stat-label">Male</div>
                </div>
                <div className="tool-stat-card">
                  <div className="text-pink-500 font-bold text-lg mx-auto mb-1">♀</div>
                  <div className="stat-value text-lg">{femaleCount}</div>
                  <div className="stat-label">Female</div>
                </div>
                <div className="tool-stat-card">
                  <User className="w-4 h-4 mx-auto text-green-500 mb-1" />
                  <div className="stat-value text-lg">{avgAge}</div>
                  <div className="stat-label">Avg Age</div>
                </div>
              </div>

              {/* Names List */}
              <div className="tool-section-card overflow-hidden">
                <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold gradient-text">Generated Identities</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto divide-y divide-border/20">
                  {names.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-3.5 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${n.gender === "male" ? "bg-blue-500/15 text-blue-600" : "bg-pink-500/15 text-pink-600"}`}>
                            {n.gender === "male" ? "♂" : "♀"}
                          </span>
                          {n.full}
                          <span className="tool-badge text-[10px]">Age {n.age}</span>
                        </span>
                        <button onClick={() => { navigator.clipboard.writeText(n.full); toast.success("Copied!"); }}
                          className="text-muted-foreground hover:text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {includeExtras && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-primary/50" /> {n.email}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary/50" /> @{n.username}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-primary/50" /> {n.phone}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={copyAll} variant="outline" className="rounded-xl gap-1.5 flex-1 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                  <Copy className="w-4 h-4" /> Copy All
                </Button>
                <Button onClick={downloadCsv} variant="outline" className="rounded-xl gap-1.5 flex-1 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                  <Download className="w-4 h-4" /> Download CSV
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}

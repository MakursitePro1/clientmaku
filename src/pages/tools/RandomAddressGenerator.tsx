import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const streets = ["Main St","Oak Ave","Elm St","Maple Dr","Pine Rd","Cedar Ln","Birch Blvd","Walnut Way","Cherry Ct","Willow Pl","Park Ave","Highland Dr","Lake Rd","River St","Forest Ln","Hill Rd","Valley Dr","Spring St","Sunset Blvd","Ocean Ave"];
const cities = ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","Austin","Jacksonville","San Jose","Fort Worth","Columbus","Charlotte","Indianapolis","Denver","Seattle","Portland","Nashville"];
const states = ["NY","CA","IL","TX","AZ","PA","TX","CA","TX","TX","FL","CA","TX","OH","NC","IN","CO","WA","OR","TN"];
const countries: { name: string; format: (a: any) => string }[] = [
  { name: "United States", format: (a) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nUnited States` },
  { name: "United Kingdom", format: (a) => `${a.num} ${a.street}\n${a.city}\n${a.zip}\nUnited Kingdom` },
  { name: "Bangladesh", format: (a) => `${a.num} ${a.street}\n${a.city} ${a.zip}\nBangladesh` },
];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

interface Address { full: string; }

export default function RandomAddressGenerator() {
  const [country, setCountry] = useState("United States");
  const [count, setCount] = useState(3);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const generate = () => {
    const fmt = countries.find(c => c.name === country) || countries[0];
    const result: Address[] = [];
    for (let i = 0; i < count; i++) {
      const ci = randNum(0, cities.length - 1);
      const a = {
        num: randNum(1, 9999),
        street: rand(streets),
        city: cities[ci],
        state: states[ci] || "NY",
        zip: String(randNum(10000, 99999)),
      };
      result.push({ full: fmt.format(a) });
    }
    setAddresses(result);
    toast.success(`${count} addresses generated!`);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(addresses.map(a => a.full).join("\n\n"));
    toast.success("Copied all!");
  };

  return (
    <ToolLayout title="Random Address Generator" description="Generate realistic random addresses">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex gap-3">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
            <SelectTrigger className="rounded-xl w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,3,5,10].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generate} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground">
          <RefreshCw className="w-4 h-4" /> Generate Addresses
        </Button>
        {addresses.length > 0 && (
          <div className="space-y-3">
            {addresses.map((a, i) => (
              <div key={i} className="p-3 bg-card rounded-xl border border-border/50 flex justify-between items-start gap-2">
                <pre className="text-sm font-mono whitespace-pre-wrap flex-1">{a.full}</pre>
                <button onClick={() => { navigator.clipboard.writeText(a.full); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground mt-1">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button onClick={copyAll} variant="outline" className="rounded-xl gap-2 w-full">
              <Copy className="w-4 h-4" /> Copy All
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

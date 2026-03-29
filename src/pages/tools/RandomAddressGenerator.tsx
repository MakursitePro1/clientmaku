import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw, Download, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const countriesData = {
  "United States": {
    streets: ["Main St","Oak Ave","Elm St","Maple Dr","Pine Rd","Cedar Ln","Broadway","5th Avenue","Park Ave","Washington Blvd","Sunset Dr","Lake View Rd","Highland Ave","Forest Ln","Valley Dr"],
    cities: [
      { city: "New York", state: "NY" },{ city: "Los Angeles", state: "CA" },{ city: "Chicago", state: "IL" },
      { city: "Houston", state: "TX" },{ city: "Miami", state: "FL" },{ city: "Seattle", state: "WA" },
      { city: "San Francisco", state: "CA" },{ city: "Denver", state: "CO" },{ city: "Portland", state: "OR" },
      { city: "Austin", state: "TX" },{ city: "Boston", state: "MA" },{ city: "Nashville", state: "TN" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nUnited States`,
    zip: () => String(randNum(10000, 99999)),
  },
  "United Kingdom": {
    streets: ["High Street","Church Lane","Mill Road","Station Road","Park Avenue","King Street","Queen Street","Victoria Road","London Road","Bridge Street"],
    cities: [
      { city: "London", state: "" },{ city: "Manchester", state: "" },{ city: "Birmingham", state: "" },
      { city: "Edinburgh", state: "" },{ city: "Liverpool", state: "" },{ city: "Bristol", state: "" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}\n${a.zip}\nUnited Kingdom`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}`,
  },
  "Canada": {
    streets: ["Maple Street","Bay Street","Yonge Street","King Street","Queen Street","Bloor Street","Granville Street","Jasper Avenue","Portage Avenue"],
    cities: [
      { city: "Toronto", state: "ON" },{ city: "Vancouver", state: "BC" },{ city: "Montreal", state: "QC" },
      { city: "Calgary", state: "AB" },{ city: "Ottawa", state: "ON" },{ city: "Edmonton", state: "AB" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nCanada`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}`,
  },
  "Australia": {
    streets: ["George Street","King Street","Collins Street","Pitt Street","Elizabeth Street","Flinders Street","Queen Street"],
    cities: [
      { city: "Sydney", state: "NSW" },{ city: "Melbourne", state: "VIC" },{ city: "Brisbane", state: "QLD" },
      { city: "Perth", state: "WA" },{ city: "Adelaide", state: "SA" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nAustralia`,
    zip: () => String(randNum(2000, 6999)),
  },
  "Bangladesh": {
    streets: ["Dhanmondi Rd","Gulshan Ave","Mirpur Rd","Banani Road","Uttara Sector","Mohammadpur Rd","Old Dhaka Lane","Chittagong Rd"],
    cities: [
      { city: "Dhaka", state: "" },{ city: "Chittagong", state: "" },{ city: "Sylhet", state: "" },
      { city: "Rajshahi", state: "" },{ city: "Khulna", state: "" },{ city: "Comilla", state: "" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city} ${a.zip}\nBangladesh`,
    zip: () => String(randNum(1000, 9999)),
  },
  "India": {
    streets: ["MG Road","Brigade Road","Park Street","Connaught Place","Marine Drive","Juhu Road","Linking Road","Anna Salai","Mount Road"],
    cities: [
      { city: "Mumbai", state: "MH" },{ city: "Delhi", state: "DL" },{ city: "Bangalore", state: "KA" },
      { city: "Chennai", state: "TN" },{ city: "Kolkata", state: "WB" },{ city: "Hyderabad", state: "TS" },
    ],
    format: (a: any) => `${a.num}, ${a.street}\n${a.city}, ${a.state} ${a.zip}\nIndia`,
    zip: () => String(randNum(100000, 999999)),
  },
};

type CountryKey = keyof typeof countriesData;

interface Address {
  full: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  num: number;
}

export default function RandomAddressGenerator() {
  const [country, setCountry] = useState<CountryKey>("United States");
  const [count, setCount] = useState(3);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const generate = () => {
    const data = countriesData[country];
    const result: Address[] = [];
    for (let i = 0; i < count; i++) {
      const cityData = rand(data.cities);
      const street = rand(data.streets);
      const num = randNum(1, 9999);
      const zip = data.zip();
      const a = { num, street, city: cityData.city, state: cityData.state, zip };
      result.push({ full: data.format(a), street, city: cityData.city, state: cityData.state, zip, country, num });
    }
    setAddresses(result);
    toast.success(`${count} addresses generated!`);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(addresses.map(a => a.full).join("\n\n"));
    toast.success("Copied all!");
  };

  const downloadCsv = () => {
    const header = "Number,Street,City,State,ZIP,Country";
    const rows = addresses.map(a => `${a.num},"${a.street}","${a.city}","${a.state}","${a.zip}","${a.country}"`);
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "random-addresses.csv";
    link.click();
    toast.success("CSV downloaded!");
  };

  return (
    <ToolLayout title="Random Address Generator" description="Generate realistic addresses for 6 countries with CSV export">
      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-3">
          <Select value={country} onValueChange={v => setCountry(v as CountryKey)}>
            <SelectTrigger className="rounded-xl flex-1 min-w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(countriesData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
            <SelectTrigger className="rounded-xl w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[1,3,5,10,20].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={generate} className="w-full rounded-xl gap-2 gradient-bg text-primary-foreground" size="lg">
          <MapPin className="w-4 h-4" /> Generate Addresses
        </Button>

        {addresses.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((a, i) => (
                <div key={i} className="p-4 bg-card rounded-xl border border-border/50 flex justify-between items-start gap-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <pre className="text-sm font-mono whitespace-pre-wrap flex-1">{a.full}</pre>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(a.full); toast.success("Copied!"); }} className="text-muted-foreground hover:text-foreground mt-1 shrink-0">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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

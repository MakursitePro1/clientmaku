import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Download, MapPin, Globe, Map, Building, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const countriesData = {
  "United States": {
    flag: "🇺🇸",
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
    flag: "🇬🇧",
    streets: ["High Street","Church Lane","Mill Road","Station Road","Park Avenue","King Street","Queen Street","Victoria Road","London Road","Bridge Street"],
    cities: [
      { city: "London", state: "" },{ city: "Manchester", state: "" },{ city: "Birmingham", state: "" },
      { city: "Edinburgh", state: "" },{ city: "Liverpool", state: "" },{ city: "Bristol", state: "" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}\n${a.zip}\nUnited Kingdom`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}`,
  },
  "Canada": {
    flag: "🇨🇦",
    streets: ["Maple Street","Bay Street","Yonge Street","King Street","Queen Street","Bloor Street","Granville Street","Jasper Avenue","Portage Avenue"],
    cities: [
      { city: "Toronto", state: "ON" },{ city: "Vancouver", state: "BC" },{ city: "Montreal", state: "QC" },
      { city: "Calgary", state: "AB" },{ city: "Ottawa", state: "ON" },{ city: "Edmonton", state: "AB" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nCanada`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}`,
  },
  "Australia": {
    flag: "🇦🇺",
    streets: ["George Street","King Street","Collins Street","Pitt Street","Elizabeth Street","Flinders Street","Queen Street"],
    cities: [
      { city: "Sydney", state: "NSW" },{ city: "Melbourne", state: "VIC" },{ city: "Brisbane", state: "QLD" },
      { city: "Perth", state: "WA" },{ city: "Adelaide", state: "SA" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nAustralia`,
    zip: () => String(randNum(2000, 6999)),
  },
  "Bangladesh": {
    flag: "🇧🇩",
    streets: ["Dhanmondi Rd","Gulshan Ave","Mirpur Rd","Banani Road","Uttara Sector","Mohammadpur Rd","Old Dhaka Lane","Chittagong Rd"],
    cities: [
      { city: "Dhaka", state: "" },{ city: "Chittagong", state: "" },{ city: "Sylhet", state: "" },
      { city: "Rajshahi", state: "" },{ city: "Khulna", state: "" },{ city: "Comilla", state: "" },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city} ${a.zip}\nBangladesh`,
    zip: () => String(randNum(1000, 9999)),
  },
  "India": {
    flag: "🇮🇳",
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

  const currentCountry = countriesData[country];

  return (
    <ToolLayout title="Random Address Generator" description="Generate realistic addresses for 6 countries with CSV export">
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Settings Card */}
        <div className="tool-section-card p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold">Configuration</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={country} onValueChange={v => setCountry(v as CountryKey)}>
              <SelectTrigger className="rounded-xl flex-1 min-w-[160px] tool-input-colorful"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(countriesData) as CountryKey[]).map(c => (
                  <SelectItem key={c} value={c}>{countriesData[c].flag} {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
              <SelectTrigger className="rounded-xl w-24 tool-input-colorful"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,3,5,10,20].map(n => <SelectItem key={n} value={String(n)}>{n} addresses</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button onClick={generate} className="tool-btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
          <MapPin className="w-5 h-5" /> Generate Addresses
        </button>

        {/* Stats */}
        <AnimatePresence>
          {addresses.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="tool-stat-card">
                  <Map className="w-5 h-5 mx-auto text-primary mb-1" />
                  <div className="stat-value text-lg">{addresses.length}</div>
                  <div className="stat-label">Generated</div>
                </div>
                <div className="tool-stat-card">
                  <Building className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                  <div className="stat-value text-lg">{new Set(addresses.map(a => a.city)).size}</div>
                  <div className="stat-label">Cities</div>
                </div>
                <div className="tool-stat-card">
                  <Navigation className="w-5 h-5 mx-auto text-green-500 mb-1" />
                  <div className="stat-value text-lg">{currentCountry.flag}</div>
                  <div className="stat-label">Country</div>
                </div>
              </div>

              {/* Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="tool-section-card p-4 flex justify-between items-start gap-2 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <pre className="text-sm font-mono whitespace-pre-wrap flex-1 leading-relaxed">{a.full}</pre>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(a.full); toast.success("Copied!"); }}
                      className="text-muted-foreground hover:text-primary mt-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
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

        {/* Info Section - always visible */}
        <div className="tool-section-card overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 border-b border-primary/10 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold gradient-text">Supported Countries</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-border/20">
            {(Object.keys(countriesData) as CountryKey[]).map(c => (
              <button key={c} onClick={() => setCountry(c)}
                className={`p-3 text-center hover:bg-primary/5 transition-colors ${country === c ? "bg-primary/10" : ""}`}>
                <span className="text-xl block">{countriesData[c].flag}</span>
                <span className="text-[9px] text-muted-foreground font-bold mt-1 block">{c.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

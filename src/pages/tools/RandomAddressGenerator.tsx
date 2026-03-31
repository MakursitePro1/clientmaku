import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, RefreshCw, Download, MapPin, Globe, Map, Building, Navigation,
  User, Phone, Mail, Hash, Clock, Compass, Check, ChevronDown, ChevronUp,
  Search, Bookmark, BookmarkCheck, Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min: number, max: number) { return (Math.random() * (max - min) + min).toFixed(6); }
function randPhone(format: string) {
  return format.replace(/#/g, () => String(randNum(0, 9)));
}
function randEmail(first: string, last: string) {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com", "icloud.com"];
  const sep = rand([".", "_", ""]);
  return `${first.toLowerCase()}${sep}${last.toLowerCase()}${randNum(1, 999)}@${rand(domains)}`;
}

const firstNames = ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","David","Elizabeth","William","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Christopher","Karen","Daniel","Emily","Matthew","Ashley","Anthony","Amanda","Mark","Melissa","Steven","Rebecca","Andrew","Laura","Paul","Stephanie","Joshua","Nicole","Kenneth","Angela","Kevin","Michelle","Brian","Samantha","George","Katherine","Timothy","Christine","Ronald","Deborah","Edward","Rachel","Jason","Catherine","Jeffrey","Carolyn","Ryan","Janet","Jacob","Maria","Gary","Heather","Nicholas","Diane","Eric","Ruth","Jonathan","Julie"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];

const companySuffixes = ["Inc.", "LLC", "Corp.", "Ltd.", "Group", "Solutions", "Technologies", "Industries", "Enterprises", "Co."];
const companyWords = ["Global", "Pacific", "Summit", "Atlas", "Apex", "Nova", "Prime", "Pinnacle", "Sterling", "Vertex", "Horizon", "Alpha", "Omega", "Titan", "Phoenix"];

const countriesData: Record<string, CountryData> = {
  "United States": {
    flag: "🇺🇸", code: "+1", phoneFormat: "(###) ###-####", timezone: "EST/CST/PST",
    currency: "USD ($)",
    streets: ["Main St","Oak Ave","Elm St","Maple Dr","Pine Rd","Cedar Ln","Broadway","5th Avenue","Park Ave","Washington Blvd","Sunset Dr","Lake View Rd","Highland Ave","Forest Ln","Valley Dr","River Rd","Mountain View Dr","Spring St","Ocean Blvd","Heritage Way"],
    cities: [
      { city: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
      { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
      { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
      { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
      { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
      { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
      { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
      { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
      { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
      { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
      { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
      { city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nUnited States`,
    zip: () => String(randNum(10000, 99999)),
  },
  "United Kingdom": {
    flag: "🇬🇧", code: "+44", phoneFormat: "07### ######", timezone: "GMT/BST",
    currency: "GBP (£)",
    streets: ["High Street","Church Lane","Mill Road","Station Road","Park Avenue","King Street","Queen Street","Victoria Road","London Road","Bridge Street","Manor Way","Castle Drive","Abbey Road","Oxford Street","Baker Street"],
    cities: [
      { city: "London", state: "", lat: 51.5074, lng: -0.1278 },
      { city: "Manchester", state: "", lat: 53.4808, lng: -2.2426 },
      { city: "Birmingham", state: "", lat: 52.4862, lng: -1.8904 },
      { city: "Edinburgh", state: "", lat: 55.9533, lng: -3.1883 },
      { city: "Liverpool", state: "", lat: 53.4084, lng: -2.9916 },
      { city: "Bristol", state: "", lat: 51.4545, lng: -2.5879 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}\n${a.zip}\nUnited Kingdom`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))}`,
  },
  "Canada": {
    flag: "🇨🇦", code: "+1", phoneFormat: "(###) ###-####", timezone: "EST/CST/PST",
    currency: "CAD ($)",
    streets: ["Maple Street","Bay Street","Yonge Street","King Street","Queen Street","Bloor Street","Granville Street","Jasper Avenue","Portage Avenue","Robson Street","Wellington St","Rideau Street"],
    cities: [
      { city: "Toronto", state: "ON", lat: 43.6532, lng: -79.3832 },
      { city: "Vancouver", state: "BC", lat: 49.2827, lng: -123.1207 },
      { city: "Montreal", state: "QC", lat: 45.5017, lng: -73.5673 },
      { city: "Calgary", state: "AB", lat: 51.0447, lng: -114.0719 },
      { city: "Ottawa", state: "ON", lat: 45.4215, lng: -75.6972 },
      { city: "Edmonton", state: "AB", lat: 53.5461, lng: -113.4938 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nCanada`,
    zip: () => `${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))} ${randNum(1,9)}${String.fromCharCode(65+randNum(0,25))}${randNum(1,9)}`,
  },
  "Australia": {
    flag: "🇦🇺", code: "+61", phoneFormat: "04## ### ###", timezone: "AEST/ACST/AWST",
    currency: "AUD ($)",
    streets: ["George Street","King Street","Collins Street","Pitt Street","Elizabeth Street","Flinders Street","Queen Street","Bourke Street","Swanston Street"],
    cities: [
      { city: "Sydney", state: "NSW", lat: -33.8688, lng: 151.2093 },
      { city: "Melbourne", state: "VIC", lat: -37.8136, lng: 144.9631 },
      { city: "Brisbane", state: "QLD", lat: -27.4698, lng: 153.0251 },
      { city: "Perth", state: "WA", lat: -31.9505, lng: 115.8605 },
      { city: "Adelaide", state: "SA", lat: -34.9285, lng: 138.6007 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city}, ${a.state} ${a.zip}\nAustralia`,
    zip: () => String(randNum(2000, 6999)),
  },
  "Germany": {
    flag: "🇩🇪", code: "+49", phoneFormat: "01## #######", timezone: "CET/CEST",
    currency: "EUR (€)",
    streets: ["Hauptstraße","Berliner Straße","Schillerstraße","Goethestraße","Bahnhofstraße","Kirchstraße","Gartenstraße","Friedrichstraße","Lindenstraße"],
    cities: [
      { city: "Berlin", state: "", lat: 52.5200, lng: 13.4050 },
      { city: "Munich", state: "", lat: 48.1351, lng: 11.5820 },
      { city: "Hamburg", state: "", lat: 53.5511, lng: 9.9937 },
      { city: "Frankfurt", state: "", lat: 50.1109, lng: 8.6821 },
      { city: "Cologne", state: "", lat: 50.9375, lng: 6.9603 },
    ],
    format: (a: any) => `${a.street} ${a.num}\n${a.zip} ${a.city}\nGermany`,
    zip: () => String(randNum(10000, 99999)),
  },
  "France": {
    flag: "🇫🇷", code: "+33", phoneFormat: "06 ## ## ## ##", timezone: "CET/CEST",
    currency: "EUR (€)",
    streets: ["Rue de la Paix","Avenue des Champs","Boulevard Saint-Germain","Rue de Rivoli","Rue du Faubourg","Place de la République","Rue Lafayette","Avenue Victor Hugo"],
    cities: [
      { city: "Paris", state: "", lat: 48.8566, lng: 2.3522 },
      { city: "Lyon", state: "", lat: 45.7640, lng: 4.8357 },
      { city: "Marseille", state: "", lat: 43.2965, lng: 5.3698 },
      { city: "Toulouse", state: "", lat: 43.6047, lng: 1.4442 },
      { city: "Nice", state: "", lat: 43.7102, lng: 7.2620 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.zip} ${a.city}\nFrance`,
    zip: () => String(randNum(10000, 99999)),
  },
  "Japan": {
    flag: "🇯🇵", code: "+81", phoneFormat: "090-####-####", timezone: "JST",
    currency: "JPY (¥)",
    streets: ["Shibuya","Shinjuku","Ginza","Akihabara","Roppongi","Harajuku","Ikebukuro","Asakusa","Ueno","Odaiba"],
    cities: [
      { city: "Tokyo", state: "", lat: 35.6762, lng: 139.6503 },
      { city: "Osaka", state: "", lat: 34.6937, lng: 135.5023 },
      { city: "Kyoto", state: "", lat: 35.0116, lng: 135.7681 },
      { city: "Yokohama", state: "", lat: 35.4437, lng: 139.6380 },
      { city: "Fukuoka", state: "", lat: 33.5904, lng: 130.4017 },
    ],
    format: (a: any) => `${a.zip}\n${a.city}, ${a.street} ${a.num}\nJapan`,
    zip: () => `${randNum(100,999)}-${randNum(1000,9999)}`,
  },
  "Bangladesh": {
    flag: "🇧🇩", code: "+880", phoneFormat: "01#########", timezone: "BST",
    currency: "BDT (৳)",
    streets: ["Dhanmondi Rd","Gulshan Ave","Mirpur Rd","Banani Road","Uttara Sector","Mohammadpur Rd","Old Dhaka Lane","Chittagong Rd","Motijheel C/A","Farmgate Road"],
    cities: [
      { city: "Dhaka", state: "", lat: 23.8103, lng: 90.4125 },
      { city: "Chittagong", state: "", lat: 22.3569, lng: 91.7832 },
      { city: "Sylhet", state: "", lat: 24.8949, lng: 91.8687 },
      { city: "Rajshahi", state: "", lat: 24.3745, lng: 88.6042 },
      { city: "Khulna", state: "", lat: 22.8456, lng: 89.5403 },
      { city: "Comilla", state: "", lat: 23.4607, lng: 91.1809 },
    ],
    format: (a: any) => `${a.num} ${a.street}\n${a.city} ${a.zip}\nBangladesh`,
    zip: () => String(randNum(1000, 9999)),
  },
  "India": {
    flag: "🇮🇳", code: "+91", phoneFormat: "9#########", timezone: "IST",
    currency: "INR (₹)",
    streets: ["MG Road","Brigade Road","Park Street","Connaught Place","Marine Drive","Juhu Road","Linking Road","Anna Salai","Mount Road","Residency Road","FC Road","Law Garden Road"],
    cities: [
      { city: "Mumbai", state: "MH", lat: 19.0760, lng: 72.8777 },
      { city: "Delhi", state: "DL", lat: 28.7041, lng: 77.1025 },
      { city: "Bangalore", state: "KA", lat: 12.9716, lng: 77.5946 },
      { city: "Chennai", state: "TN", lat: 13.0827, lng: 80.2707 },
      { city: "Kolkata", state: "WB", lat: 22.5726, lng: 88.3639 },
      { city: "Hyderabad", state: "TS", lat: 17.3850, lng: 78.4867 },
    ],
    format: (a: any) => `${a.num}, ${a.street}\n${a.city}, ${a.state} ${a.zip}\nIndia`,
    zip: () => String(randNum(100000, 999999)),
  },
  "Brazil": {
    flag: "🇧🇷", code: "+55", phoneFormat: "(##) 9####-####", timezone: "BRT",
    currency: "BRL (R$)",
    streets: ["Rua Augusta","Avenida Paulista","Rua Oscar Freire","Rua da Consolação","Avenida Brasil","Rua das Flores","Avenida Atlântica","Rua XV de Novembro"],
    cities: [
      { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333 },
      { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 },
      { city: "Brasília", state: "DF", lat: -15.7975, lng: -47.8919 },
      { city: "Salvador", state: "BA", lat: -12.9714, lng: -38.5124 },
      { city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733 },
    ],
    format: (a: any) => `${a.street}, ${a.num}\n${a.city} - ${a.state}\n${a.zip}\nBrazil`,
    zip: () => `${randNum(10000,99999)}-${randNum(100,999)}`,
  },
};

interface CityData { city: string; state: string; lat: number; lng: number; }
interface CountryData {
  flag: string; code: string; phoneFormat: string; timezone: string; currency: string;
  streets: string[]; cities: CityData[];
  format: (a: any) => string;
  zip: () => string;
}

type CountryKey = keyof typeof countriesData;

interface FullAddress {
  // Person
  firstName: string; lastName: string; fullName: string;
  email: string; phone: string; username: string;
  // Address
  streetNum: number; street: string; fullStreet: string;
  city: string; state: string; zip: string; country: string;
  formatted: string;
  // Geo
  lat: string; lng: string;
  // Meta
  timezone: string; currency: string; countryCode: string;
  // Company
  company: string;
  // SSN-like ID
  nationalId: string;
}

function generateNationalId(country: string): string {
  switch (country) {
    case "United States": return `${randNum(100,999)}-${randNum(10,99)}-${randNum(1000,9999)}`;
    case "United Kingdom": return `${String.fromCharCode(65+randNum(0,25))}${String.fromCharCode(65+randNum(0,25))} ${randNum(100000,999999)} ${String.fromCharCode(65+randNum(0,25))}`;
    case "Bangladesh": return `${randNum(1000000000,9999999999)}`;
    case "India": return `${randNum(1000,9999)} ${randNum(1000,9999)} ${randNum(1000,9999)}`;
    default: return `${randNum(100000000,999999999)}`;
  }
}

export default function RandomAddressGenerator() {
  const [country, setCountry] = useState<CountryKey>("United States");
  const [count, setCount] = useState(3);
  const [addresses, setAddresses] = useState<FullAddress[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedField(null), 1500);
    });
  }, []);

  const generate = () => {
    const data = countriesData[country];
    const result: FullAddress[] = [];
    for (let i = 0; i < count; i++) {
      const cityData = rand(data.cities);
      const street = rand(data.streets);
      const num = randNum(1, 9999);
      const zip = data.zip();
      const firstName = rand(firstNames);
      const lastName = rand(lastNames);
      const phone = randPhone(data.phoneFormat);
      const latOff = parseFloat(randFloat(-0.05, 0.05));
      const lngOff = parseFloat(randFloat(-0.05, 0.05));

      const a = { num, street, city: cityData.city, state: cityData.state, zip };
      result.push({
        firstName, lastName, fullName: `${firstName} ${lastName}`,
        email: randEmail(firstName, lastName),
        phone: `${data.code} ${phone}`,
        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${randNum(1,99)}`,
        streetNum: num, street, fullStreet: `${num} ${street}`,
        city: cityData.city, state: cityData.state, zip, country,
        formatted: data.format(a),
        lat: (cityData.lat + latOff).toFixed(6),
        lng: (cityData.lng + lngOff).toFixed(6),
        timezone: data.timezone, currency: data.currency,
        countryCode: data.code,
        company: `${rand(companyWords)} ${rand(companyWords)} ${rand(companySuffixes)}`,
        nationalId: generateNationalId(country),
      });
    }
    setAddresses(result);
    setExpandedIdx(null);
    setBookmarked(new Set());
    setSearchTerm("");
    toast.success(`${count} detailed addresses generated!`);
  };

  const copyAll = () => {
    const text = addresses.map((a, i) => 
      `--- Address ${i+1} ---\nName: ${a.fullName}\nEmail: ${a.email}\nPhone: ${a.phone}\nAddress: ${a.fullStreet}, ${a.city}${a.state ? `, ${a.state}` : ""} ${a.zip}\nCountry: ${a.country}\nCoordinates: ${a.lat}, ${a.lng}\nTimezone: ${a.timezone}\nCompany: ${a.company}\nNational ID: ${a.nationalId}`
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("All addresses copied!");
  };

  const downloadCsv = () => {
    const header = "Name,Email,Phone,Username,Street,City,State,ZIP,Country,Latitude,Longitude,Timezone,Currency,Company,NationalID";
    const rows = addresses.map(a => 
      `"${a.fullName}","${a.email}","${a.phone}","${a.username}","${a.fullStreet}","${a.city}","${a.state}","${a.zip}","${a.country}","${a.lat}","${a.lng}","${a.timezone}","${a.currency}","${a.company}","${a.nationalId}"`
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "random-addresses.csv";
    link.click();
    toast.success("CSV downloaded!");
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(addresses, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "random-addresses.json";
    link.click();
    toast.success("JSON downloaded!");
  };

  const toggleBookmark = (idx: number) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const filtered = addresses.filter(a => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return a.fullName.toLowerCase().includes(s) || a.city.toLowerCase().includes(s) || 
           a.email.toLowerCase().includes(s) || a.street.toLowerCase().includes(s) ||
           a.company.toLowerCase().includes(s);
  });

  const CopyBtn = ({ text, label, size = "sm" }: { text: string; label: string; size?: "sm" | "xs" }) => {
    const isCopied = copiedField === `${label}-${text}`;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); copyText(text, `${label}-${text}`); }}
        className={`inline-flex items-center gap-1 rounded-lg transition-all duration-200 shrink-0
          ${size === "sm" ? "px-2 py-1 text-xs" : "px-1.5 py-0.5 text-[10px]"}
          ${isCopied 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/30"
          }`}
        title={`Copy ${label}`}
      >
        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
      </button>
    );
  };

  const DetailRow = ({ icon: Icon, label, value, iconColor = "text-primary" }: { icon: any; label: string; value: string; iconColor?: string }) => (
    <div className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 border-b border-border/30 last:border-0 group/row">
      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${iconColor}`} />
      <span className="text-[10px] sm:text-xs text-muted-foreground w-16 sm:w-20 shrink-0 font-medium">{label}</span>
      <span className="text-xs sm:text-sm flex-1 truncate font-mono">{value}</span>
      <CopyBtn text={value} label={label} size="xs" />
    </div>
  );

  const currentCountry = countriesData[country];

  return (
    <ToolLayout title="Random Address Generator" description="Generate ultra-detailed random identities with addresses for 10 countries">
      <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
        {/* Config */}
        <div className="tool-section-card p-3 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-xs sm:text-sm font-bold">Configuration</h3>
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {(Object.keys(countriesData) as CountryKey[]).map(c => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl transition-all duration-200 border-2
                  ${country === c 
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10" 
                    : "border-transparent hover:border-primary/30 hover:bg-muted/50"
                  }`}
              >
                <span className="text-lg sm:text-2xl">{countriesData[c].flag}</span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground font-medium mt-0.5 leading-tight text-center truncate w-full">
                  {c.length > 8 ? c.split(" ")[0] : c}
                </span>
              </button>
            ))}
          </div>

          {/* Count + Generate */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={String(count)} onValueChange={v => setCount(Number(v))}>
              <SelectTrigger className="rounded-xl sm:w-40 tool-input-colorful text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 3, 5, 10, 20, 50].map(n => (
                  <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "address" : "addresses"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={generate} className="tool-btn-primary flex-1 py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" /> Generate Addresses
            </button>
          </div>
        </div>

        <AnimatePresence>
          {addresses.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 sm:space-y-4">
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { icon: Map, value: addresses.length, label: "Generated", color: "text-primary" },
                  { icon: Building, value: new Set(addresses.map(a => a.city)).size, label: "Cities", color: "text-blue-500" },
                  { icon: User, value: addresses.length, label: "Identities", color: "text-emerald-500" },
                  { icon: Navigation, value: currentCountry.flag, label: country.split(" ")[0], color: "text-amber-500" },
                ].map((s, i) => (
                  <div key={i} className="tool-stat-card py-2 sm:py-3">
                    <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto ${s.color} mb-0.5 sm:mb-1`} />
                    <div className="stat-value text-base sm:text-lg">{s.value}</div>
                    <div className="stat-label text-[9px] sm:text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search + Actions Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, city, email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/30 border border-border/50 text-xs sm:text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-1.5">
                  <Button onClick={copyAll} variant="outline" size="sm" className="rounded-xl gap-1 text-[10px] sm:text-xs flex-1 sm:flex-none border-primary/20 hover:border-primary/40">
                    <Copy className="w-3.5 h-3.5" /> <span>Copy All</span>
                  </Button>
                  <Button onClick={downloadCsv} variant="outline" size="sm" className="rounded-xl gap-1 text-[10px] sm:text-xs flex-1 sm:flex-none border-primary/20 hover:border-primary/40">
                    <Download className="w-3.5 h-3.5" /> <span>CSV</span>
                  </Button>
                  <Button onClick={downloadJson} variant="outline" size="sm" className="rounded-xl gap-1 text-[10px] sm:text-xs flex-1 sm:flex-none border-primary/20 hover:border-primary/40">
                    <Download className="w-3.5 h-3.5" /> <span>JSON</span>
                  </Button>
                </div>
              </div>

              {/* Address Cards */}
              <div className="space-y-2 sm:space-y-3">
                {filtered.map((a, i) => {
                  const realIdx = addresses.indexOf(a);
                  const isExpanded = expandedIdx === realIdx;
                  const isBookmarked = bookmarked.has(realIdx);

                  return (
                    <motion.div
                      key={realIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="tool-section-card overflow-hidden"
                    >
                      {/* Card Header - Summary */}
                      <div
                        className="p-3 sm:p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedIdx(isExpanded ? null : realIdx)}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Avatar */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold text-primary-foreground"
                            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))" }}>
                            {a.firstName[0]}{a.lastName[0]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-bold truncate">{a.fullName}</h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                                {currentCountry.flag} {a.city}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                              {a.fullStreet}, {a.city}{a.state ? `, ${a.state}` : ""} {a.zip}
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {a.email}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {a.phone}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(realIdx); }}
                              className={`p-1.5 rounded-lg transition-all ${isBookmarked ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"}`}
                            >
                              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            <CopyBtn
                              text={`${a.fullName}\n${a.email}\n${a.phone}\n${a.fullStreet}, ${a.city}${a.state ? `, ${a.state}` : ""} ${a.zip}\n${a.country}`}
                              label={`card-${realIdx}`}
                              size="sm"
                            />
                            <div className={`p-1.5 rounded-lg text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border/30 px-3 sm:px-4 py-2 sm:py-3 space-y-0">
                              {/* Person Section */}
                              <div className="mb-2 sm:mb-3">
                                <h5 className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1">
                                  👤 Personal Information
                                </h5>
                                <DetailRow icon={User} label="Full Name" value={a.fullName} />
                                <DetailRow icon={Mail} label="Email" value={a.email} iconColor="text-blue-500" />
                                <DetailRow icon={Phone} label="Phone" value={a.phone} iconColor="text-green-500" />
                                <DetailRow icon={Hash} label="Username" value={a.username} iconColor="text-purple-500" />
                                <DetailRow icon={Hash} label="National ID" value={a.nationalId} iconColor="text-orange-500" />
                              </div>

                              {/* Address Section */}
                              <div className="mb-2 sm:mb-3">
                                <h5 className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1">
                                  📍 Address Details
                                </h5>
                                <DetailRow icon={MapPin} label="Street" value={a.fullStreet} />
                                <DetailRow icon={Building} label="City" value={a.city} iconColor="text-cyan-500" />
                                {a.state && <DetailRow icon={Map} label="State" value={a.state} iconColor="text-indigo-500" />}
                                <DetailRow icon={Hash} label="ZIP/Postal" value={a.zip} iconColor="text-teal-500" />
                                <DetailRow icon={Globe} label="Country" value={a.country} iconColor="text-rose-500" />
                              </div>

                              {/* Geo & Meta */}
                              <div className="mb-2 sm:mb-3">
                                <h5 className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1">
                                  🌐 Geographic & Meta
                                </h5>
                                <DetailRow icon={Compass} label="Latitude" value={a.lat} iconColor="text-emerald-500" />
                                <DetailRow icon={Compass} label="Longitude" value={a.lng} iconColor="text-emerald-500" />
                                <DetailRow icon={Clock} label="Timezone" value={a.timezone} iconColor="text-amber-500" />
                                <DetailRow icon={Hash} label="Currency" value={a.currency} iconColor="text-yellow-500" />
                                <DetailRow icon={Phone} label="Dial Code" value={a.countryCode} iconColor="text-sky-500" />
                              </div>

                              {/* Company */}
                              <div>
                                <h5 className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1">
                                  🏢 Company
                                </h5>
                                <DetailRow icon={Building} label="Company" value={a.company} iconColor="text-violet-500" />
                              </div>

                              {/* Copy All Details */}
                              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/30">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const text = `Name: ${a.fullName}\nEmail: ${a.email}\nPhone: ${a.phone}\nUsername: ${a.username}\nNational ID: ${a.nationalId}\n\nStreet: ${a.fullStreet}\nCity: ${a.city}\nState: ${a.state}\nZIP: ${a.zip}\nCountry: ${a.country}\n\nLatitude: ${a.lat}\nLongitude: ${a.lng}\nTimezone: ${a.timezone}\nCurrency: ${a.currency}\nDial Code: ${a.countryCode}\n\nCompany: ${a.company}`;
                                    copyText(text, `all-details-${realIdx}`);
                                  }}
                                  className="w-full py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                  <Copy className="w-4 h-4" /> Copy All Details
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bookmarked summary */}
              {bookmarked.size > 0 && (
                <div className="tool-section-card p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-amber-500" /> Bookmarked ({bookmarked.size})
                    </h4>
                    <button
                      onClick={() => {
                        const bookmarkedAddrs = Array.from(bookmarked).map(idx => addresses[idx]);
                        const text = bookmarkedAddrs.map((a, i) =>
                          `--- ${i+1}. ${a.fullName} ---\nEmail: ${a.email}\nPhone: ${a.phone}\nAddress: ${a.fullStreet}, ${a.city}${a.state ? `, ${a.state}` : ""} ${a.zip}, ${a.country}`
                        ).join("\n\n");
                        copyText(text, "bookmarked-all");
                      }}
                      className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy Bookmarked
                    </button>
                  </div>
                  <div className="space-y-1">
                    {Array.from(bookmarked).map(idx => (
                      <div key={idx} className="flex items-center justify-between py-1 text-xs">
                        <span className="truncate flex-1">{addresses[idx].fullName} — {addresses[idx].city}</span>
                        <button onClick={() => toggleBookmark(idx)} className="text-muted-foreground hover:text-red-500 ml-2">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && searchTerm && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No addresses match "{searchTerm}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
}

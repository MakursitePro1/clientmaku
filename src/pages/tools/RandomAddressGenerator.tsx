import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, RefreshCw, Download, MapPin, Globe, Map, Building, Navigation,
  User, Phone, Mail, Hash, Clock, Compass, Check, ChevronDown, ChevronUp,
  Search, Bookmark, BookmarkCheck, Trash2, Heart, Calendar, Ruler, Droplet,
  CreditCard, Car, Briefcase, GraduationCap, Wifi, Shield
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countriesData, continentCountries, continentEmojis, type CityData, type CountryData, type ContinentKey } from "@/data/countriesData";

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

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const eyeColors = ["Brown", "Blue", "Green", "Hazel", "Gray", "Amber"];
const hairColors = ["Black", "Brown", "Blonde", "Red", "Gray", "Auburn", "White"];
const occupations = ["Software Engineer", "Teacher", "Doctor", "Accountant", "Designer", "Nurse", "Manager", "Lawyer", "Architect", "Analyst", "Consultant", "Marketing Specialist", "Writer", "Electrician", "Chef", "Photographer", "Pharmacist", "Scientist", "Mechanic", "Sales Executive"];
const universities = ["MIT", "Harvard", "Stanford", "Oxford", "Cambridge", "Yale", "Princeton", "Columbia", "UCLA", "NYU", "University of Tokyo", "ETH Zurich", "Sorbonne", "NUS", "Tsinghua"];
const carBrands = ["Toyota", "Honda", "BMW", "Mercedes", "Audi", "Tesla", "Ford", "Volkswagen", "Hyundai", "Kia", "Nissan", "Chevrolet", "Lexus", "Porsche", "Mazda"];
const carModels: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander"], Honda: ["Civic", "Accord", "CR-V"], BMW: ["3 Series", "5 Series", "X5"],
  Mercedes: ["C-Class", "E-Class", "GLC"], Audi: ["A4", "A6", "Q5"], Tesla: ["Model 3", "Model Y", "Model S"],
  Ford: ["F-150", "Mustang", "Explorer"], Volkswagen: ["Golf", "Passat", "Tiguan"], Hyundai: ["Elantra", "Tucson", "Sonata"],
  Kia: ["Sportage", "Seltos", "K5"], Nissan: ["Altima", "Rogue", "Sentra"], Chevrolet: ["Malibu", "Equinox", "Silverado"],
  Lexus: ["IS", "RX", "ES"], Porsche: ["911", "Cayenne", "Macan"], Mazda: ["CX-5", "Mazda3", "CX-30"],
};
const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function generateMAC(): string {
  return Array.from({ length: 6 }, () => randNum(0, 255).toString(16).padStart(2, "0").toUpperCase()).join(":");
}
function generateIP(): string {
  return `${randNum(1, 254)}.${randNum(0, 255)}.${randNum(0, 255)}.${randNum(1, 254)}`;
}
function generateCreditCard(): string {
  const prefix = rand(["4", "5", "37", "6011"]);
  let num = prefix;
  while (num.length < 15) num += randNum(0, 9);
  // Luhn checksum
  let sum = 0;
  for (let i = 0; i < num.length; i++) {
    let d = parseInt(num[num.length - 1 - i]);
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  num += ((10 - (sum % 10)) % 10).toString();
  return num.replace(/(.{4})/g, "$1 ").trim();
}
function generateDOB(): { dob: string; age: number; zodiac: string } {
  const year = randNum(1960, 2005);
  const month = randNum(1, 12);
  const day = randNum(1, 28);
  const age = new Date().getFullYear() - year;
  const monthDay = month * 100 + day;
  let zodiac = "Capricorn";
  if (monthDay >= 120 && monthDay <= 218) zodiac = "Aquarius";
  else if (monthDay >= 219 && monthDay <= 320) zodiac = "Pisces";
  else if (monthDay >= 321 && monthDay <= 419) zodiac = "Aries";
  else if (monthDay >= 420 && monthDay <= 520) zodiac = "Taurus";
  else if (monthDay >= 521 && monthDay <= 620) zodiac = "Gemini";
  else if (monthDay >= 621 && monthDay <= 722) zodiac = "Cancer";
  else if (monthDay >= 723 && monthDay <= 822) zodiac = "Leo";
  else if (monthDay >= 823 && monthDay <= 922) zodiac = "Virgo";
  else if (monthDay >= 923 && monthDay <= 1022) zodiac = "Libra";
  else if (monthDay >= 1023 && monthDay <= 1121) zodiac = "Scorpio";
  else if (monthDay >= 1122 && monthDay <= 1221) zodiac = "Sagittarius";
  return { dob: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, age, zodiac };
}

type CountryKey = keyof typeof countriesData;

interface FullAddress {
  firstName: string; lastName: string; fullName: string;
  email: string; phone: string; username: string;
  streetNum: number; street: string; fullStreet: string;
  city: string; state: string; zip: string; country: string;
  formatted: string;
  lat: string; lng: string;
  timezone: string; currency: string; countryCode: string;
  company: string;
  nationalId: string;
  // Extended details
  dob: string; age: number; zodiac: string;
  bloodType: string; height: string; weight: string;
  eyeColor: string; hairColor: string;
  occupation: string; education: string;
  vehicle: string; licensePlate: string;
  creditCard: string; cvv: string; cardExpiry: string;
  ipAddress: string; macAddress: string; userAgent: string;
  password: string; website: string;
  motherMaiden: string;
  ssn: string;
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

function randPassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  return Array.from({ length: randNum(12, 16) }, () => chars[randNum(0, chars.length - 1)]).join("");
}

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Safari/17.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14) Chrome/120.0.6099.43",
  "Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0",
];

export default function RandomAddressGenerator() {
  const [country, setCountry] = useState<CountryKey>("United States");
  const [count, setCount] = useState(3);
  const [addresses, setAddresses] = useState<FullAddress[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [activeContinent, setActiveContinent] = useState<ContinentKey | "All">("All");

  const filteredCountries = useMemo(() => {
    let countries = activeContinent === "All" 
      ? Object.keys(countriesData) as CountryKey[]
      : (continentCountries[activeContinent] || []).filter(c => c in countriesData) as CountryKey[];
    if (countrySearch) {
      countries = countries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
    }
    return countries;
  }, [activeContinent, countrySearch]);

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
      const { dob, age, zodiac } = generateDOB();
      const carBrand = rand(carBrands);
      const carModel = rand(carModels[carBrand] || ["Sedan"]);

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
        dob, age, zodiac,
        bloodType: rand(bloodTypes),
        height: `${randNum(150, 195)} cm`,
        weight: `${randNum(50, 100)} kg`,
        eyeColor: rand(eyeColors),
        hairColor: rand(hairColors),
        occupation: rand(occupations),
        education: rand(universities),
        vehicle: `${carBrand} ${carModel} (${randNum(2015, 2024)})`,
        licensePlate: `${randChar()}${randChar()}${randChar()}-${randNum(1000, 9999)}`,
        creditCard: generateCreditCard(),
        cvv: String(randNum(100, 999)),
        cardExpiry: `${String(randNum(1, 12)).padStart(2, "0")}/${randNum(25, 30)}`,
        ipAddress: generateIP(),
        macAddress: generateMAC(),
        userAgent: rand(userAgents),
        password: randPassword(),
        website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.${rand(["com", "org", "net", "io", "dev"])}`,
        motherMaiden: rand(lastNames),
        ssn: generateNationalId(country),
      });
    }
    setAddresses(result);
    setExpandedIdx(0);
    setBookmarked(new Set());
    setSearchTerm("");
    toast.success(`${count} detailed identities generated!`);
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
    <ToolLayout title="Random Address Generator" description={`Generate ultra-detailed random identities with addresses for ${Object.keys(countriesData).length}+ countries`}>
      <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto">
        {/* Config */}
        <div className="tool-section-card p-3 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-xs sm:text-sm font-bold">Configuration</h3>
          </div>

          {/* Country Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${Object.keys(countriesData).length}+ countries...`}
              value={countrySearch}
              onChange={e => setCountrySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl tool-input-colorful text-xs sm:text-sm bg-background"
            />
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 sm:gap-1.5 max-h-[280px] overflow-y-auto rounded-xl p-1">
            {(Object.keys(countriesData) as CountryKey[])
              .filter(c => !countrySearch || c.toLowerCase().includes(countrySearch.toLowerCase()))
              .map(c => (
              <button
                key={c}
                onClick={() => { setCountry(c); setCountrySearch(""); }}
                className={`flex flex-col items-center p-1 sm:p-1.5 rounded-lg transition-all duration-200 border
                  ${country === c 
                    ? "border-primary bg-primary/10 shadow-sm shadow-primary/10" 
                    : "border-transparent hover:border-primary/30 hover:bg-muted/50"
                  }`}
              >
                <span className="text-base sm:text-lg">{countriesData[c].flag}</span>
                <span className="text-[7px] sm:text-[9px] text-muted-foreground font-medium mt-0.5 leading-tight text-center truncate w-full">
                  {c.length > 10 ? c.split(" ")[0] : c}
                </span>
              </button>
            ))}
          </div>
          
          <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
            Selected: <span className="font-semibold text-foreground">{countriesData[country].flag} {country}</span>
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

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const trains = [
  { name: "Subarna Express", from: "Dhaka", to: "Chittagong", departure: "07:00", arrival: "12:30", days: "Daily" },
  { name: "Turna Nishitha", from: "Dhaka", to: "Chittagong", departure: "23:00", arrival: "05:00", days: "Daily" },
  { name: "Parabat Express", from: "Dhaka", to: "Sylhet", departure: "06:40", arrival: "13:00", days: "Daily except Tue" },
  { name: "Upaban Express", from: "Dhaka", to: "Sylhet", departure: "21:40", arrival: "04:30", days: "Daily" },
  { name: "Silk City Express", from: "Dhaka", to: "Rajshahi", departure: "06:20", arrival: "12:30", days: "Daily" },
  { name: "Padma Express", from: "Dhaka", to: "Rajshahi", departure: "15:00", arrival: "21:10", days: "Daily" },
  { name: "Drutojan Express", from: "Dhaka", to: "Rajshahi", departure: "14:30", arrival: "20:40", days: "Daily" },
  { name: "Mohanagar Express", from: "Dhaka", to: "Chittagong", departure: "15:30", arrival: "22:00", days: "Daily" },
  { name: "Sundarban Express", from: "Dhaka", to: "Khulna", departure: "06:20", arrival: "15:30", days: "Daily" },
  { name: "Chitra Express", from: "Dhaka", to: "Khulna", departure: "22:00", arrival: "07:00", days: "Daily" },
];

export default function BdTrainInfo() {
  const [search, setSearch] = useState("");
  const [fromFilter, setFromFilter] = useState("all");

  const filtered = trains.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.to.toLowerCase().includes(search.toLowerCase());
    const matchFrom = fromFilter === "all" || t.to === fromFilter;
    return matchSearch && matchFrom;
  });

  const destinations = [...new Set(trains.map((t) => t.to))];

  return (
    <ToolLayout title="BD Train Info" description="Get Bangladesh train schedule and information">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          <Input placeholder="Search by train name or destination..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl flex-1 min-w-[200px]" />
          <Select value={fromFilter} onValueChange={setFromFilter}>
            <SelectTrigger className="w-48 rounded-xl"><SelectValue placeholder="Destination" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {destinations.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Train Name</th>
                <th className="text-left py-3 px-4 font-semibold">From</th>
                <th className="text-left py-3 px-4 font-semibold">To</th>
                <th className="text-left py-3 px-4 font-semibold">Departure</th>
                <th className="text-left py-3 px-4 font-semibold">Arrival</th>
                <th className="text-left py-3 px-4 font-semibold">Days</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{t.name}</td>
                  <td className="py-3 px-4">{t.from}</td>
                  <td className="py-3 px-4">{t.to}</td>
                  <td className="py-3 px-4">{t.departure}</td>
                  <td className="py-3 px-4">{t.arrival}</td>
                  <td className="py-3 px-4 text-muted-foreground">{t.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No trains found</p>}
        </div>
      </div>
    </ToolLayout>
  );
}

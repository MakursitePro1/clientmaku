import {
  Wifi, Calculator, Lock, QrCode, ScanLine, Gauge, Sparkles,
  MapPin, MessageCircle, BarChart3, ScanBarcode, Link, Phone, Mail, Type,
  CreditCard, ShieldAlert, User, MapPinned, Hash
} from "lucide-react";
} from "lucide-react";

export type ToolCategory = 
  | "all"
  | "utility";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: ToolCategory;
  path: string;
  color: string;
}

export const categories: { id: ToolCategory; label: string; icon: any }[] = [
  { id: "all", label: "All Tools", icon: Gauge },
  { id: "utility", label: "Utility Tools", icon: Sparkles },
];

export const tools: Tool[] = [
  { id: "internet-speed-tester", name: "Internet Speed Tester", description: "Test your internet connection speed instantly", icon: Wifi, category: "utility", path: "/tools/internet-speed-tester", color: "hsl(263, 85%, 58%)" },
  { id: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days", icon: Calculator, category: "utility", path: "/tools/age-calculator", color: "hsl(280, 90%, 55%)" },
  { id: "password-generator", name: "Password Generator", description: "Generate strong and secure passwords", icon: Lock, category: "utility", path: "/tools/password-generator", color: "hsl(340, 82%, 52%)" },
  { id: "qr-code-maker", name: "QR Code Maker", description: "Create QR codes for any text or URL", icon: QrCode, category: "utility", path: "/tools/qr-code-maker", color: "hsl(220, 90%, 56%)" },
  { id: "qr-code-scanner", name: "QR Code Scanner", description: "Scan and decode QR codes from images", icon: ScanLine, category: "utility", path: "/tools/qr-code-scanner", color: "hsl(170, 75%, 41%)" },
  { id: "ip-address-lookup", name: "IP Address Lookup", description: "Find geolocation and details of any IP address", icon: MapPin, category: "utility", path: "/tools/ip-address-lookup", color: "hsl(199, 89%, 48%)" },
  { id: "whatsapp-link-generator", name: "WhatsApp Link Generator", description: "Create direct WhatsApp chat links", icon: MessageCircle, category: "utility", path: "/tools/whatsapp-link-generator", color: "hsl(142, 71%, 45%)" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", icon: BarChart3, category: "utility", path: "/tools/barcode-generator", color: "hsl(220, 90%, 56%)" },
  { id: "barcode-scanner", name: "Barcode Scanner", description: "Scan barcodes from uploaded images", icon: ScanBarcode, category: "utility", path: "/tools/barcode-scanner", color: "hsl(30, 80%, 50%)" },
  { id: "url-shortener", name: "URL Shortener", description: "Shorten long URLs for easy sharing", icon: Link, category: "utility", path: "/tools/url-shortener", color: "hsl(200, 85%, 50%)" },
  { id: "temp-number", name: "Temp Number", description: "Get temporary phone numbers instantly", icon: Phone, category: "utility", path: "/tools/temp-number", color: "hsl(150, 70%, 45%)" },
  { id: "temp-mail", name: "Temp Mail", description: "Get a disposable temporary email address", icon: Mail, category: "utility", path: "/tools/temp-mail", color: "hsl(0, 75%, 55%)" },
  { id: "case-converter", name: "Text Case Converter", description: "Convert text between different cases", icon: Type, category: "utility", path: "/tools/case-converter", color: "hsl(270, 70%, 55%)" },
];

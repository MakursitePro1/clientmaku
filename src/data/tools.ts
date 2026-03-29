import {
  Wifi, Calculator, Lock, QrCode, ScanLine, Gauge, Sparkles,
  MapPin, MessageCircle, BarChart3, ScanBarcode, Link, Phone, Mail, Type,
  CreditCard, ShieldAlert, User, MapPinned, Hash,
  KeyRound, ShieldCheck, Globe, Keyboard, IdCard, Facebook, Shield, Wrench, Zap
} from "lucide-react";

export type ToolCategory = 
  | "all"
  | "security"
  | "generator"
  | "utility"
  | "identity";

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
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "generator", label: "Generators", icon: Zap },
  { id: "utility", label: "Utility Tools", icon: Wrench },
  { id: "identity", label: "ID & Card Makers", icon: IdCard },
];

export const tools: Tool[] = [
  // Utility
  { id: "internet-speed-tester", name: "Internet Speed Tester", description: "Test your internet connection speed instantly", icon: Wifi, category: "utility", path: "/tools/internet-speed-tester", color: "hsl(263, 85%, 58%)" },
  { id: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days", icon: Calculator, category: "utility", path: "/tools/age-calculator", color: "hsl(280, 90%, 55%)" },
  { id: "case-converter", name: "Text Case Converter", description: "Convert text between different cases", icon: Type, category: "utility", path: "/tools/case-converter", color: "hsl(270, 70%, 55%)" },
  { id: "typing-test", name: "Typing Test", description: "Test your typing speed and accuracy", icon: Keyboard, category: "utility", path: "/tools/typing-test", color: "hsl(50, 85%, 50%)" },
  { id: "ip-address-lookup", name: "IP Address Lookup", description: "Find geolocation and details of any IP address", icon: MapPin, category: "utility", path: "/tools/ip-address-lookup", color: "hsl(199, 89%, 48%)" },
  { id: "whois-lookup", name: "Whois Lookup", description: "Look up domain registration details", icon: Globe, category: "utility", path: "/tools/whois-lookup", color: "hsl(190, 80%, 45%)" },
  { id: "url-shortener", name: "URL Shortener", description: "Shorten long URLs for easy sharing", icon: Link, category: "utility", path: "/tools/url-shortener", color: "hsl(200, 85%, 50%)" },
  { id: "whatsapp-link-generator", name: "WhatsApp Link Generator", description: "Create direct WhatsApp chat links", icon: MessageCircle, category: "utility", path: "/tools/whatsapp-link-generator", color: "hsl(142, 71%, 45%)" },
  { id: "temp-number", name: "Temp Number", description: "Get temporary phone numbers instantly", icon: Phone, category: "utility", path: "/tools/temp-number", color: "hsl(150, 70%, 45%)" },
  { id: "temp-mail", name: "Temp Mail", description: "Get a disposable temporary email address", icon: Mail, category: "utility", path: "/tools/temp-mail", color: "hsl(0, 75%, 55%)" },

  // Security & Privacy
  { id: "password-generator", name: "Password Generator", description: "Generate strong and secure passwords", icon: Lock, category: "security", path: "/tools/password-generator", color: "hsl(340, 82%, 52%)" },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA1, SHA256 hashes", icon: Hash, category: "security", path: "/tools/hash-generator", color: "hsl(300, 65%, 50%)" },
  { id: "hash-decoder", name: "Hash Decoder / Cracker", description: "Dictionary-based hash cracker (educational)", icon: KeyRound, category: "security", path: "/tools/hash-decoder", color: "hsl(15, 85%, 55%)" },
  { id: "encryption-tool", name: "Encryption / Decryption", description: "Encrypt and decrypt text with AES & Base64", icon: ShieldCheck, category: "security", path: "/tools/encryption-tool", color: "hsl(230, 75%, 55%)" },
  { id: "bin-checker", name: "BIN Checker", description: "Look up bank info from card BIN numbers", icon: CreditCard, category: "security", path: "/tools/bin-checker", color: "hsl(350, 80%, 50%)" },
  { id: "ip-blacklist-checker", name: "IP Blacklist Checker", description: "Check if an IP is blacklisted", icon: ShieldAlert, category: "security", path: "/tools/ip-blacklist-checker", color: "hsl(10, 80%, 50%)" },

  // Generators
  { id: "qr-code-maker", name: "QR Code Maker", description: "Create QR codes for any text or URL", icon: QrCode, category: "generator", path: "/tools/qr-code-maker", color: "hsl(220, 90%, 56%)" },
  { id: "qr-code-scanner", name: "QR Code Scanner", description: "Scan and decode QR codes from images", icon: ScanLine, category: "generator", path: "/tools/qr-code-scanner", color: "hsl(170, 75%, 41%)" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", icon: BarChart3, category: "generator", path: "/tools/barcode-generator", color: "hsl(220, 90%, 56%)" },
  { id: "barcode-scanner", name: "Barcode Scanner", description: "Scan barcodes from uploaded images", icon: ScanBarcode, category: "generator", path: "/tools/barcode-scanner", color: "hsl(30, 80%, 50%)" },
  { id: "random-name-generator", name: "Random Name Generator", description: "Generate realistic random names", icon: User, category: "generator", path: "/tools/random-name-generator", color: "hsl(180, 60%, 45%)" },
  { id: "random-address-generator", name: "Random Address Generator", description: "Generate random addresses instantly", icon: MapPinned, category: "generator", path: "/tools/random-address-generator", color: "hsl(45, 80%, 50%)" },

  // Identity & Card Makers
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards instantly", icon: IdCard, category: "identity", path: "/tools/student-id-card", color: "hsl(210, 80%, 50%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: Facebook, category: "identity", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 55%)" },
];

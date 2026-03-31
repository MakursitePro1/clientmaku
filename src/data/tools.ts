import {
  Wifi, Calculator, Lock, QrCode, ScanLine, Gauge, Sparkles,
  MapPin, MessageCircle, BarChart3, ScanBarcode, Link, Phone, Mail, Type,
  CreditCard, ShieldAlert, User, MapPinned, Hash,
  KeyRound, ShieldCheck, Globe, Keyboard, IdCard, Facebook, Shield, Wrench, Zap,
  FileText, Palette, Braces, Binary, AlignLeft, Ruler, Timer, Paintbrush,
  Code, Diff, DollarSign, Image, Key, Regex, FileKey, Clock, Network,
  MonitorSmartphone, Server, LockKeyhole, Terminal
} from "lucide-react";

export type ToolCategory = 
  | "all"
  | "security"
  | "generator"
  | "utility"
  | "identity"
  | "developer"
  | "calculator";

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
  { id: "developer", label: "Developer Tools", icon: Code },
  { id: "calculator", label: "Calculators", icon: Calculator },
  { id: "identity", label: "ID & Card Makers", icon: IdCard },
];

export const tools: Tool[] = [
  // Utility
  { id: "internet-speed-tester", name: "Internet Speed Tester", description: "Test your internet connection speed instantly", icon: Wifi, category: "utility", path: "/tools/internet-speed-tester", color: "hsl(263, 85%, 58%)" },
  { id: "case-converter", name: "Text Case Converter", description: "Convert text between different cases", icon: Type, category: "utility", path: "/tools/case-converter", color: "hsl(270, 70%, 55%)" },
  { id: "typing-test", name: "Typing Test", description: "Test your typing speed and accuracy", icon: Keyboard, category: "utility", path: "/tools/typing-test", color: "hsl(50, 85%, 50%)" },
  { id: "ip-address-lookup", name: "IP Address Lookup", description: "Find geolocation and details of any IP address", icon: MapPin, category: "utility", path: "/tools/ip-address-lookup", color: "hsl(199, 89%, 48%)" },
  { id: "whois-lookup", name: "Whois Lookup", description: "Look up domain registration details", icon: Globe, category: "utility", path: "/tools/whois-lookup", color: "hsl(190, 80%, 45%)" },
  { id: "url-shortener", name: "URL Shortener", description: "Shorten long URLs for easy sharing", icon: Link, category: "utility", path: "/tools/url-shortener", color: "hsl(200, 85%, 50%)" },
  { id: "whatsapp-link-generator", name: "WhatsApp Link Generator", description: "Create direct WhatsApp chat links", icon: MessageCircle, category: "utility", path: "/tools/whatsapp-link-generator", color: "hsl(142, 71%, 45%)" },
  { id: "temp-number", name: "Temp Number", description: "Get temporary phone numbers instantly", icon: Phone, category: "utility", path: "/tools/temp-number", color: "hsl(150, 70%, 45%)" },
  { id: "temp-mail", name: "Temp Mail", description: "Get a disposable temporary email address", icon: Mail, category: "utility", path: "/tools/temp-mail", color: "hsl(0, 75%, 55%)" },
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences & more", icon: FileText, category: "utility", path: "/tools/word-counter", color: "hsl(210, 80%, 55%)" },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text instantly", icon: AlignLeft, category: "utility", path: "/tools/lorem-ipsum", color: "hsl(160, 60%, 45%)" },
  { id: "countdown-timer", name: "Countdown Timer", description: "Set countdown timers with alarm", icon: Timer, category: "utility", path: "/tools/countdown-timer", color: "hsl(30, 90%, 50%)" },
  { id: "text-diff", name: "Text Diff Checker", description: "Compare two texts and find differences", icon: Diff, category: "utility", path: "/tools/text-diff", color: "hsl(45, 85%, 50%)" },
  { id: "text-encoder-decoder", name: "Text Encoder/Decoder", description: "Encode/decode HTML, URL, Unicode, Binary", icon: Code, category: "utility", path: "/tools/text-encoder-decoder", color: "hsl(280, 75%, 55%)" },

  // Security & Privacy
  { id: "password-generator", name: "Password Generator", description: "Generate strong and secure passwords", icon: Lock, category: "security", path: "/tools/password-generator", color: "hsl(340, 82%, 52%)" },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA1, SHA256 hashes", icon: Hash, category: "security", path: "/tools/hash-generator", color: "hsl(300, 65%, 50%)" },
  { id: "hash-decoder", name: "Hash Decoder / Cracker", description: "Dictionary-based hash cracker (educational)", icon: KeyRound, category: "security", path: "/tools/hash-decoder", color: "hsl(15, 85%, 55%)" },
  { id: "encryption-tool", name: "Encryption / Decryption", description: "Encrypt and decrypt text with AES & Base64", icon: ShieldCheck, category: "security", path: "/tools/encryption-tool", color: "hsl(230, 75%, 55%)" },
  { id: "bin-checker", name: "BIN Checker", description: "Look up bank info from card BIN numbers", icon: CreditCard, category: "security", path: "/tools/bin-checker", color: "hsl(350, 80%, 50%)" },
  { id: "ip-blacklist-checker", name: "IP Blacklist Checker", description: "Check if an IP is blacklisted", icon: ShieldAlert, category: "security", path: "/tools/ip-blacklist-checker", color: "hsl(10, 80%, 50%)" },
  { id: "base64-tool", name: "Base64 Encoder/Decoder", description: "Encode and decode Base64 strings", icon: Binary, category: "security", path: "/tools/base64-tool", color: "hsl(250, 80%, 55%)" },

  // Generators
  { id: "qr-code-maker", name: "QR Code Maker", description: "Create QR codes for any text or URL", icon: QrCode, category: "generator", path: "/tools/qr-code-maker", color: "hsl(220, 90%, 56%)" },
  { id: "qr-code-scanner", name: "QR Code Scanner", description: "Scan and decode QR codes from images", icon: ScanLine, category: "generator", path: "/tools/qr-code-scanner", color: "hsl(170, 75%, 41%)" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", icon: BarChart3, category: "generator", path: "/tools/barcode-generator", color: "hsl(220, 90%, 56%)" },
  { id: "barcode-scanner", name: "Barcode Scanner", description: "Scan barcodes from uploaded images", icon: ScanBarcode, category: "generator", path: "/tools/barcode-scanner", color: "hsl(30, 80%, 50%)" },
  { id: "random-name-generator", name: "Random Name Generator", description: "Generate realistic random names", icon: User, category: "generator", path: "/tools/random-name-generator", color: "hsl(180, 60%, 45%)" },
  { id: "random-address-generator", name: "Fake Address Generator", description: "Generate random addresses instantly", icon: MapPinned, category: "generator", path: "/tools/random-address-generator", color: "hsl(45, 80%, 50%)" },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate random UUID v4 strings", icon: Key, category: "generator", path: "/tools/uuid-generator", color: "hsl(300, 70%, 50%)" },
  { id: "gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients with code", icon: Paintbrush, category: "generator", path: "/tools/gradient-generator", color: "hsl(330, 80%, 55%)" },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO-friendly meta tags", icon: Globe, category: "generator", path: "/tools/meta-tag-generator", color: "hsl(200, 75%, 50%)" },

  // Developer Tools
  { id: "html-css-js-runner", name: "HTML/CSS/JS Runner", description: "Write & run HTML, CSS, JavaScript with live preview", icon: Code, category: "developer", path: "/tools/html-css-js-runner", color: "hsl(25, 95%, 53%)" },
  { id: "json-formatter", name: "JSON Formatter", description: "Format, validate & minify JSON data", icon: Braces, category: "developer", path: "/tools/json-formatter", color: "hsl(40, 90%, 50%)" },
  { id: "color-picker", name: "Color Picker", description: "Pick colors, convert formats & generate palettes", icon: Palette, category: "developer", path: "/tools/color-picker", color: "hsl(320, 85%, 55%)" },
  { id: "markdown-preview", name: "Markdown Preview", description: "Write markdown and preview in real-time", icon: FileText, category: "developer", path: "/tools/markdown-preview", color: "hsl(210, 70%, 50%)" },
  { id: "image-to-base64", name: "Image to Base64", description: "Convert images to Base64 encoded strings", icon: Image, category: "developer", path: "/tools/image-to-base64", color: "hsl(260, 75%, 55%)" },

  // Calculators
  { id: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days", icon: Calculator, category: "calculator", path: "/tools/age-calculator", color: "hsl(280, 90%, 55%)" },
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate BMI, ideal weight & calorie needs", icon: Calculator, category: "calculator", path: "/tools/bmi-calculator", color: "hsl(142, 70%, 45%)" },
  { id: "loan-calculator", name: "Loan Calculator", description: "Calculate monthly payments & total interest", icon: DollarSign, category: "calculator", path: "/tools/loan-calculator", color: "hsl(170, 75%, 40%)" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature & more", icon: Ruler, category: "calculator", path: "/tools/unit-converter", color: "hsl(25, 85%, 55%)" },

  // Identity & Card Makers
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards instantly", icon: IdCard, category: "identity", path: "/tools/student-id-card", color: "hsl(210, 80%, 50%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: Facebook, category: "identity", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 55%)" },
  { id: "youtube-id-card", name: "YouTube ID Card Maker", description: "Create YouTube channel ID cards", icon: Sparkles, category: "identity", path: "/tools/youtube-id-card", color: "hsl(0, 85%, 55%)" },

  // Network / IP
  { id: "dns-lookup", name: "DNS Lookup", description: "Look up DNS records for any domain", icon: Globe, category: "utility", path: "/tools/dns-lookup", color: "hsl(195, 85%, 50%)" },
  { id: "cyber-chef", name: "CyberChef", description: "Universal encoder, decoder, hasher & transformer", icon: Sparkles, category: "developer", path: "/tools/cyber-chef", color: "hsl(25, 90%, 55%)" },

  // New Cyber Tools
  { id: "regex-tester", name: "Regex Tester", description: "Test, debug & visualize regular expressions in real-time", icon: Regex, category: "developer", path: "/tools/regex-tester", color: "hsl(145, 80%, 42%)" },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode, inspect & verify JSON Web Tokens", icon: FileKey, category: "security", path: "/tools/jwt-decoder", color: "hsl(35, 90%, 50%)" },
  { id: "cron-generator", name: "Cron Expression Generator", description: "Build & explain cron schedule expressions visually", icon: Clock, category: "developer", path: "/tools/cron-generator", color: "hsl(200, 85%, 48%)" },
  { id: "http-status-checker", name: "HTTP Status Code Lookup", description: "Look up all HTTP status codes with descriptions", icon: Network, category: "developer", path: "/tools/http-status-checker", color: "hsl(260, 80%, 58%)" },
  { id: "user-agent-parser", name: "User Agent Parser", description: "Parse & analyze browser user agent strings", icon: MonitorSmartphone, category: "utility", path: "/tools/user-agent-parser", color: "hsl(310, 75%, 50%)" },
  { id: "chmod-calculator", name: "Chmod Calculator", description: "Calculate Unix file permissions easily", icon: Terminal, category: "developer", path: "/tools/chmod-calculator", color: "hsl(120, 60%, 40%)" },
  { id: "port-scanner", name: "Port Reference Guide", description: "Common network ports reference & info lookup", icon: Server, category: "security", path: "/tools/port-scanner", color: "hsl(180, 70%, 42%)" },
  { id: "ssl-checker", name: "SSL Certificate Checker", description: "Check SSL/TLS certificate status & details", icon: LockKeyhole, category: "security", path: "/tools/ssl-checker", color: "hsl(150, 75%, 40%)" },
  { id: "cc-checker", name: "CC Checker / Validator", description: "Validate credit card numbers using Luhn algorithm", icon: CreditCard, category: "security", path: "/tools/cc-checker", color: "hsl(340, 80%, 52%)" },
];

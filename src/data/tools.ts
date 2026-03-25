import {
  Wifi, ShieldAlert, GraduationCap, Code2, Train, Image, Smile, 
  FileText, Link, Keyboard, Type, ImagePlus, Calculator, 
  Languages, Globe, Lock, Camera, QrCode, ScanLine, 
  CreditCard, IdCard, User, Sparkles, FileImage, Monitor,
  PenTool, Search, Gauge, Braces, FileDown, Pipette, Binary,
  FileEdit, Minimize2, Hash, ArrowLeftRight, Clock,
  AlignLeft, Activity, Percent, Banknote, UtensilsCrossed,
  Timer, StickyNote, ListChecks, Brain, Shrink, Maximize,
  Volume2, Shuffle, Coins, Dices, Zap, CaseSensitive,
  DollarSign, Replace, Tag, MapPin, FileCode, Link2,
  Palette, BookOpen, Grid3X3, FilePlus2,
  Code, ScreenShare, PenLine, MessageCircle, Eye, CalendarClock,
  BarChart3, KeyRound, AtSign, Radio, Hexagon, FileType, ShieldCheck,
  LinkIcon, Table2, Paintbrush, Key,
  Blend, TrendingUp, ImageDown, Gamepad2, Sparkle, CreditCard as CreditCardIcon,
  Fuel, Users, Database, PenSquare, Hash as HashIcon, Globe2,
  Crop, Bug, Zap as ZapIcon, FileSpreadsheet, Scissors, MousePointer,
  Shield, Fingerprint, LockKeyhole, Scan, FileWarning,
  PiggyBank, Receipt, Target, CircleDollarSign,
  Share2, MessageSquare, Youtube, Twitter, Tv,
  Joystick, Puzzle, Swords, Boxes, Trophy
} from "lucide-react";

export type ToolCategory = 
  | "all"
  | "text-language"
  | "image-media"
  | "id-card"
  | "developer"
  | "utility"
  | "security"
  | "finance"
  | "social"
  | "games";

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
  { id: "text-language", label: "Text & Language", icon: Type },
  { id: "image-media", label: "Image & Media", icon: Image },
  { id: "id-card", label: "ID Card Makers", icon: IdCard },
  { id: "developer", label: "Developer Tools", icon: Code2 },
  { id: "utility", label: "Utility Tools", icon: Sparkles },
];

export const tools: Tool[] = [
  // Utility Tools
  { id: "internet-speed-tester", name: "Internet Speed Tester", description: "Test your internet connection speed instantly", icon: Wifi, category: "utility", path: "/tools/internet-speed-tester", color: "hsl(263, 85%, 58%)" },
  { id: "courier-fraud-checker", name: "Courier Fraud Checker", description: "Check if a courier service is fraudulent", icon: ShieldAlert, category: "utility", path: "/tools/courier-fraud-checker", color: "hsl(0, 84%, 60%)" },
  { id: "board-results-checker", name: "Board Results Checker", description: "Check your board exam results quickly", icon: GraduationCap, category: "utility", path: "/tools/board-results-checker", color: "hsl(142, 71%, 45%)" },
  { id: "bd-train-info", name: "BD Train Info", description: "Get Bangladesh train schedule and info", icon: Train, category: "utility", path: "/tools/bd-train-info", color: "hsl(199, 89%, 48%)" },
  { id: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days", icon: Calculator, category: "utility", path: "/tools/age-calculator", color: "hsl(280, 90%, 55%)" },
  { id: "password-generator", name: "Password Generator", description: "Generate strong and secure passwords", icon: Lock, category: "utility", path: "/tools/password-generator", color: "hsl(340, 82%, 52%)" },
  { id: "qr-code-maker", name: "QR Code Maker", description: "Create QR codes for any text or URL", icon: QrCode, category: "utility", path: "/tools/qr-code-maker", color: "hsl(220, 90%, 56%)" },
  { id: "qr-code-scanner", name: "QR Code Scanner", description: "Scan and decode QR codes from images", icon: ScanLine, category: "utility", path: "/tools/qr-code-scanner", color: "hsl(170, 75%, 41%)" },
  { id: "color-picker", name: "Color Picker", description: "Pick colors and convert between HEX, RGB, HSL formats", icon: Pipette, category: "utility", path: "/tools/color-picker", color: "hsl(280, 90%, 55%)" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert between different units of measurement", icon: ArrowLeftRight, category: "utility", path: "/tools/unit-converter", color: "hsl(25, 95%, 53%)" },
  { id: "bmi-calculator", name: "BMI Calculator", description: "Calculate your Body Mass Index", icon: Activity, category: "utility", path: "/tools/bmi-calculator", color: "hsl(142, 71%, 45%)" },
  { id: "percentage-calculator", name: "Percentage Calculator", description: "Calculate percentages easily with multiple modes", icon: Percent, category: "utility", path: "/tools/percentage-calculator", color: "hsl(47, 95%, 55%)" },
  { id: "loan-calculator", name: "Loan/EMI Calculator", description: "Calculate monthly EMI payments for loans", icon: Banknote, category: "utility", path: "/tools/loan-calculator", color: "hsl(199, 89%, 48%)" },
  { id: "tip-calculator", name: "Tip Calculator", description: "Calculate tips and split bills between people", icon: UtensilsCrossed, category: "utility", path: "/tools/tip-calculator", color: "hsl(25, 95%, 53%)" },
  { id: "stopwatch-timer", name: "Stopwatch & Timer", description: "Precise stopwatch with laps and countdown timer", icon: Timer, category: "utility", path: "/tools/stopwatch-timer", color: "hsl(340, 82%, 52%)" },
  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Stay focused with the Pomodoro technique", icon: Brain, category: "utility", path: "/tools/pomodoro-timer", color: "hsl(0, 84%, 60%)" },
  { id: "random-number", name: "Random Number Generator", description: "Generate random numbers within a custom range", icon: Shuffle, category: "utility", path: "/tools/random-number", color: "hsl(263, 85%, 58%)" },
  { id: "flip-coin", name: "Flip a Coin", description: "Virtual coin flipper for quick decisions", icon: Coins, category: "utility", path: "/tools/flip-coin", color: "hsl(47, 95%, 55%)" },
  { id: "dice-roller", name: "Dice Roller", description: "Roll virtual dice with customizable sides", icon: Dices, category: "utility", path: "/tools/dice-roller", color: "hsl(220, 90%, 56%)" },
  { id: "electricity-calculator", name: "Electricity Bill Calculator", description: "Calculate electricity consumption and costs", icon: Zap, category: "utility", path: "/tools/electricity-calculator", color: "hsl(47, 95%, 55%)" },
  { id: "discount-calculator", name: "Discount Calculator", description: "Calculate discount prices with optional tax", icon: Tag, category: "utility", path: "/tools/discount-calculator", color: "hsl(142, 71%, 45%)" },
  { id: "currency-converter", name: "Currency Converter", description: "Convert between world currencies", icon: DollarSign, category: "utility", path: "/tools/currency-converter", color: "hsl(170, 75%, 41%)" },
  { id: "ip-address-lookup", name: "IP Address Lookup", description: "Find geolocation and details of any IP address", icon: MapPin, category: "utility", path: "/tools/ip-address-lookup", color: "hsl(199, 89%, 48%)" },

  // Text & Language Tools
  { id: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text for your designs", icon: FileText, category: "text-language", path: "/tools/lorem-ipsum-generator", color: "hsl(25, 95%, 53%)" },
  { id: "emoji-picker", name: "Emoji Picker", description: "Find and copy emojis easily", icon: Smile, category: "text-language", path: "/tools/emoji-picker", color: "hsl(47, 95%, 55%)" },
  { id: "text-diff-checker", name: "Text Diff Checker", description: "Compare two texts and find differences", icon: FileText, category: "text-language", path: "/tools/text-diff-checker", color: "hsl(199, 89%, 48%)" },
  { id: "typing-test", name: "Typing Test", description: "Test your typing speed and accuracy", icon: Keyboard, category: "text-language", path: "/tools/typing-test", color: "hsl(263, 85%, 58%)" },
  { id: "bangla-to-banglish", name: "Bangla to Banglish Converter", description: "Convert Bangla text to Banglish", icon: Languages, category: "text-language", path: "/tools/bangla-to-banglish", color: "hsl(142, 71%, 45%)" },
  { id: "banglish-to-bangla", name: "Banglish to Bangla Converter", description: "Convert Banglish text to Bangla", icon: Languages, category: "text-language", path: "/tools/banglish-to-bangla", color: "hsl(340, 82%, 52%)" },
  { id: "markdown-editor", name: "Markdown Editor", description: "Write and preview Markdown with a live editor", icon: FileEdit, category: "text-language", path: "/tools/markdown-editor", color: "hsl(220, 90%, 56%)" },
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, reading time", icon: AlignLeft, category: "text-language", path: "/tools/word-counter", color: "hsl(170, 75%, 41%)" },
  { id: "case-converter", name: "Case Converter", description: "Convert text between uppercase, lowercase, title case, and more", icon: CaseSensitive, category: "text-language", path: "/tools/case-converter", color: "hsl(280, 90%, 55%)" },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to speech with customizable voice", icon: Volume2, category: "text-language", path: "/tools/text-to-speech", color: "hsl(0, 84%, 60%)" },
  { id: "text-replacer", name: "Find & Replace", description: "Find and replace text with regex support", icon: Replace, category: "text-language", path: "/tools/text-replacer", color: "hsl(25, 95%, 53%)" },
  { id: "notepad", name: "Notepad", description: "Simple note-taking app with local storage", icon: StickyNote, category: "text-language", path: "/tools/notepad", color: "hsl(47, 95%, 55%)" },
  { id: "todo-list", name: "Todo List", description: "Simple and effective task management", icon: ListChecks, category: "text-language", path: "/tools/todo-list", color: "hsl(142, 71%, 45%)" },
  { id: "slug-generator", name: "Slug Generator", description: "Convert text into SEO-friendly URL slugs", icon: Link2, category: "text-language", path: "/tools/slug-generator", color: "hsl(220, 90%, 56%)" },
  { id: "character-map", name: "Character Map", description: "Browse and copy Unicode characters and symbols", icon: Grid3X3, category: "text-language", path: "/tools/character-map", color: "hsl(263, 85%, 58%)" },

  // Image & Media Tools
  { id: "image-to-base64", name: "Image to Base64 Converter", description: "Convert images to Base64 encoded strings", icon: FileImage, category: "image-media", path: "/tools/image-to-base64", color: "hsl(280, 90%, 55%)" },
  { id: "online-image-editor", name: "Online Image Editor", description: "Edit images with filters, crop, resize and more", icon: ImagePlus, category: "image-media", path: "/tools/online-image-editor", color: "hsl(199, 89%, 48%)" },
  { id: "photo-filter", name: "Photo Filter", description: "Apply beautiful filters to your photos", icon: Camera, category: "image-media", path: "/tools/photo-filter", color: "hsl(340, 82%, 52%)" },
  { id: "bangla-logo-maker", name: "Bangla Logo Maker", description: "Create logos with Bangla typography", icon: PenTool, category: "image-media", path: "/tools/bangla-logo-maker", color: "hsl(25, 95%, 53%)" },
  { id: "gemini-watermark-remover", name: "Gemini Watermark Remover", description: "Remove watermarks from images using AI", icon: Sparkles, category: "image-media", path: "/tools/gemini-watermark-remover", color: "hsl(263, 85%, 58%)" },
  { id: "website-screenshot", name: "Website Screenshot Taker", description: "Take screenshots of any website", icon: Monitor, category: "image-media", path: "/tools/website-screenshot", color: "hsl(220, 90%, 56%)" },
  { id: "image-compressor", name: "Image Compressor", description: "Compress images to reduce file size", icon: Shrink, category: "image-media", path: "/tools/image-compressor", color: "hsl(142, 71%, 45%)" },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact dimensions with presets", icon: Maximize, category: "image-media", path: "/tools/image-resizer", color: "hsl(199, 89%, 48%)" },

  // Developer Tools
  { id: "api-tester", name: "API Tester", description: "Test REST APIs with custom requests", icon: Code2, category: "developer", path: "/tools/api-tester", color: "hsl(142, 71%, 45%)" },
  { id: "regex-tester", name: "RegEx Tester", description: "Test and debug regular expressions", icon: Search, category: "developer", path: "/tools/regex-tester", color: "hsl(25, 95%, 53%)" },
  { id: "url-parser", name: "URL Parser", description: "Parse and analyze URL components", icon: Link, category: "developer", path: "/tools/url-parser", color: "hsl(220, 90%, 56%)" },
  { id: "bdix-server-tester", name: "BDIX Server Tester", description: "Test BDIX server connectivity", icon: Globe, category: "developer", path: "/tools/bdix-server-tester", color: "hsl(170, 75%, 41%)" },
  { id: "json-formatter", name: "JSON Formatter", description: "Format, minify, and validate JSON data", icon: Braces, category: "developer", path: "/tools/json-formatter", color: "hsl(47, 95%, 55%)" },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert HTML content to PDF documents", icon: FileDown, category: "developer", path: "/tools/html-to-pdf", color: "hsl(340, 82%, 52%)" },
  { id: "base64-encoder-decoder", name: "Base64 Encoder/Decoder", description: "Encode text to Base64 or decode Base64 to text", icon: Binary, category: "developer", path: "/tools/base64-encoder-decoder", color: "hsl(199, 89%, 48%)" },
  { id: "css-minifier", name: "CSS Minifier", description: "Minify or beautify your CSS code", icon: Minimize2, category: "developer", path: "/tools/css-minifier", color: "hsl(263, 85%, 58%)" },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes", icon: Hash, category: "developer", path: "/tools/hash-generator", color: "hsl(0, 84%, 60%)" },
  { id: "timestamp-converter", name: "Timestamp Converter", description: "Convert between Unix timestamps and dates", icon: Clock, category: "developer", path: "/tools/timestamp-converter", color: "hsl(142, 71%, 45%)" },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO-friendly meta tags for websites", icon: FileCode, category: "developer", path: "/tools/meta-tag-generator", color: "hsl(280, 90%, 55%)" },
  { id: "favicon-generator", name: "Favicon Generator", description: "Create favicons from text or images", icon: Image, category: "developer", path: "/tools/favicon-generator", color: "hsl(25, 95%, 53%)" },
  { id: "json-to-csv", name: "JSON to CSV", description: "Convert JSON data to CSV format", icon: FileText, category: "developer", path: "/tools/json-to-csv", color: "hsl(47, 95%, 55%)" },
  { id: "regex-cheat-sheet", name: "Regex Cheat Sheet", description: "Quick reference for regular expressions", icon: BookOpen, category: "developer", path: "/tools/regex-cheat-sheet", color: "hsl(340, 82%, 52%)" },
  { id: "color-palette-generator", name: "Color Palette Generator", description: "Generate beautiful color palettes instantly", icon: Palette, category: "developer", path: "/tools/color-palette-generator", color: "hsl(280, 90%, 55%)" },
  { id: "pdf-merger", name: "PDF Merger", description: "Merge multiple PDF files into one document", icon: FilePlus2, category: "developer", path: "/tools/pdf-merger", color: "hsl(0, 84%, 60%)" },

  // ID Card Makers
  { id: "fake-bd-old-nid", name: "Fake BD Old NID Card Maker", description: "Generate fake old format BD NID cards", icon: CreditCard, category: "id-card", path: "/tools/fake-bd-old-nid", color: "hsl(142, 71%, 45%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: User, category: "id-card", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 56%)" },
  { id: "fake-bd-smart-nid", name: "Fake BD Smart NID Card Maker", description: "Generate fake smart NID cards", icon: IdCard, category: "id-card", path: "/tools/fake-bd-smart-nid", color: "hsl(263, 85%, 58%)" },
  { id: "fake-pak-cnic", name: "Fake Pakistani CNIC Card Maker", description: "Generate fake Pakistani CNIC cards", icon: CreditCard, category: "id-card", path: "/tools/fake-pak-cnic", color: "hsl(142, 71%, 45%)" },
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards easily", icon: GraduationCap, category: "id-card", path: "/tools/student-id-card", color: "hsl(25, 95%, 53%)" },
  // Additional Tools
  { id: "html-entity-converter", name: "HTML Entity Converter", description: "Encode and decode HTML entities", icon: Code, category: "developer", path: "/tools/html-entity-converter", color: "hsl(199, 89%, 48%)" },
  { id: "screen-resolution", name: "Screen Resolution Checker", description: "Check your screen resolution and display info", icon: ScreenShare, category: "utility", path: "/tools/screen-resolution", color: "hsl(263, 85%, 58%)" },
  { id: "text-to-handwriting", name: "Text to Handwriting", description: "Convert typed text into handwriting-style images", icon: PenLine, category: "text-language", path: "/tools/text-to-handwriting", color: "hsl(25, 95%, 53%)" },
  { id: "whatsapp-link-generator", name: "WhatsApp Link Generator", description: "Create direct WhatsApp chat links", icon: MessageCircle, category: "utility", path: "/tools/whatsapp-link-generator", color: "hsl(142, 71%, 45%)" },
  { id: "color-blindness-simulator", name: "Color Blindness Simulator", description: "See how images look to people with color blindness", icon: Eye, category: "image-media", path: "/tools/color-blindness-simulator", color: "hsl(280, 90%, 55%)" },
  { id: "crontab-generator", name: "Crontab Generator", description: "Generate and understand cron expressions", icon: CalendarClock, category: "developer", path: "/tools/crontab-generator", color: "hsl(170, 75%, 41%)" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", icon: BarChart3, category: "utility", path: "/tools/barcode-generator", color: "hsl(220, 90%, 56%)" },
  { id: "privacy-policy-generator", name: "Privacy Policy Generator", description: "Generate a privacy policy for your website", icon: ShieldCheck, category: "developer", path: "/tools/privacy-policy-generator", color: "hsl(340, 82%, 52%)" },
  { id: "url-shortener", name: "URL Shortener", description: "Shorten long URLs for easy sharing", icon: LinkIcon, category: "utility", path: "/tools/url-shortener", color: "hsl(199, 89%, 48%)" },
  { id: "text-to-binary", name: "Text to Binary Converter", description: "Convert text to binary and binary to text", icon: Binary, category: "developer", path: "/tools/text-to-binary", color: "hsl(47, 95%, 55%)" },
  { id: "json-to-yaml", name: "JSON to YAML Converter", description: "Convert JSON to YAML format", icon: FileType, category: "developer", path: "/tools/json-to-yaml", color: "hsl(0, 84%, 60%)" },
  { id: "html-preview", name: "HTML Live Preview", description: "Write HTML and see live preview instantly", icon: Code2, category: "developer", path: "/tools/html-preview", color: "hsl(263, 85%, 58%)" },
  { id: "csv-viewer", name: "CSV Viewer", description: "View and parse CSV data in a table", icon: Table2, category: "developer", path: "/tools/csv-viewer", color: "hsl(142, 71%, 45%)" },
  { id: "image-color-extractor", name: "Image Color Extractor", description: "Extract dominant colors from any image", icon: Paintbrush, category: "image-media", path: "/tools/image-color-extractor", color: "hsl(340, 82%, 52%)" },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens", icon: KeyRound, category: "developer", path: "/tools/jwt-decoder", color: "hsl(25, 95%, 53%)" },
  { id: "password-strength-checker", name: "Password Strength Checker", description: "Check how strong your password is", icon: Key, category: "utility", path: "/tools/password-strength-checker", color: "hsl(142, 71%, 45%)" },
  { id: "email-validator", name: "Email Validator", description: "Validate email address format and structure", icon: AtSign, category: "utility", path: "/tools/email-validator", color: "hsl(220, 90%, 56%)" },
  { id: "text-to-morse", name: "Text to Morse Code", description: "Convert text to Morse code and vice versa", icon: Radio, category: "text-language", path: "/tools/text-to-morse", color: "hsl(47, 95%, 55%)" },
  { id: "hex-editor", name: "Hex Editor", description: "Convert text to hexadecimal and back", icon: Hexagon, category: "developer", path: "/tools/hex-editor", color: "hsl(280, 90%, 55%)" },
  { id: "text-encryption", name: "Text Encryption Tool", description: "Encrypt and decrypt text using Caesar cipher", icon: Lock, category: "developer", path: "/tools/text-encryption", color: "hsl(0, 84%, 60%)" },
  { id: "color-mixer", name: "Color Mixer", description: "Mix two colors and generate gradients", icon: Blend, category: "utility", path: "/tools/color-mixer", color: "hsl(280, 90%, 55%)" },
  { id: "investment-calculator", name: "Investment Calculator", description: "Calculate compound interest and investment growth", icon: TrendingUp, category: "utility", path: "/tools/investment-calculator", color: "hsl(142, 71%, 45%)" },
  { id: "placeholder-image", name: "Placeholder Image Generator", description: "Generate placeholder images for designs", icon: ImageDown, category: "image-media", path: "/tools/placeholder-image", color: "hsl(199, 89%, 48%)" },
  { id: "hangman-game", name: "Hangman Game", description: "Classic word guessing game", icon: Gamepad2, category: "utility", path: "/tools/hangman-game", color: "hsl(263, 85%, 58%)" },
  { id: "fancy-text-generator", name: "Fancy Text Generator", description: "Convert text into stylish Unicode fonts", icon: Sparkle, category: "text-language", path: "/tools/fancy-text-generator", color: "hsl(340, 82%, 52%)" },
  { id: "credit-card-validator", name: "Credit Card Validator", description: "Validate credit card numbers using Luhn algorithm", icon: CreditCard, category: "utility", path: "/tools/credit-card-validator", color: "hsl(220, 90%, 56%)" },
  { id: "fuel-cost-calculator", name: "Fuel Cost Calculator", description: "Calculate fuel cost for your trip", icon: Fuel, category: "utility", path: "/tools/fuel-cost-calculator", color: "hsl(25, 95%, 53%)" },
  { id: "social-media-bio", name: "Social Media Bio Generator", description: "Generate creative bios for social media", icon: Users, category: "text-language", path: "/tools/social-media-bio", color: "hsl(199, 89%, 48%)" },
  { id: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries", icon: Database, category: "developer", path: "/tools/sql-formatter", color: "hsl(47, 95%, 55%)" },
  { id: "drawing-board", name: "Drawing Board", description: "Free-hand drawing board with pen controls", icon: PenSquare, category: "image-media", path: "/tools/drawing-board", color: "hsl(0, 84%, 60%)" },
  { id: "number-base-converter", name: "Number Base Converter", description: "Convert between binary, octal, decimal, hex", icon: Hash, category: "developer", path: "/tools/number-base-converter", color: "hsl(170, 75%, 41%)" },
  { id: "domain-name-generator", name: "Domain Name Generator", description: "Generate creative domain name ideas", icon: Globe2, category: "utility", path: "/tools/domain-name-generator", color: "hsl(263, 85%, 58%)" },
  { id: "image-cropper", name: "Image Cropper", description: "Crop images to specific dimensions", icon: Crop, category: "image-media", path: "/tools/image-cropper", color: "hsl(142, 71%, 45%)" },
  { id: "user-agent-parser", name: "User Agent Parser", description: "Parse and analyze browser user agent strings", icon: Bug, category: "developer", path: "/tools/user-agent-parser", color: "hsl(25, 95%, 53%)" },
  { id: "reaction-time-test", name: "Reaction Time Test", description: "Test your reaction speed", icon: MousePointer, category: "utility", path: "/tools/reaction-time-test", color: "hsl(142, 71%, 45%)" },
  { id: "payroll-calculator", name: "Payroll Calculator", description: "Calculate net salary with tax and deductions", icon: FileSpreadsheet, category: "utility", path: "/tools/payroll-calculator", color: "hsl(220, 90%, 56%)" },
  { id: "text-summarizer", name: "Text Summarizer", description: "Summarize long texts by extracting key sentences", icon: Scissors, category: "text-language", path: "/tools/text-summarizer", color: "hsl(340, 82%, 52%)" },
];

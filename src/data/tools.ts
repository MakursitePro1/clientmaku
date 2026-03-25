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
  DollarSign, Replace, Tag
} from "lucide-react";

export type ToolCategory = 
  | "all"
  | "text-language"
  | "image-media"
  | "id-card"
  | "developer"
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

  // ID Card Makers
  { id: "fake-bd-old-nid", name: "Fake BD Old NID Card Maker", description: "Generate fake old format BD NID cards", icon: CreditCard, category: "id-card", path: "/tools/fake-bd-old-nid", color: "hsl(142, 71%, 45%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: User, category: "id-card", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 56%)" },
  { id: "fake-bd-smart-nid", name: "Fake BD Smart NID Card Maker", description: "Generate fake smart NID cards", icon: IdCard, category: "id-card", path: "/tools/fake-bd-smart-nid", color: "hsl(263, 85%, 58%)" },
  { id: "fake-pak-cnic", name: "Fake Pakistani CNIC Card Maker", description: "Generate fake Pakistani CNIC cards", icon: CreditCard, category: "id-card", path: "/tools/fake-pak-cnic", color: "hsl(142, 71%, 45%)" },
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards easily", icon: GraduationCap, category: "id-card", path: "/tools/student-id-card", color: "hsl(25, 95%, 53%)" },
];

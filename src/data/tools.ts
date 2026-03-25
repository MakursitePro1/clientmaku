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
  Joystick, Puzzle, Swords, Boxes, Trophy,
  // New icons for newly registered tools
  FlipHorizontal, Layers, Contrast, ImageMinus, SunMedium,
  FileImage as FileImageIcon, Grid2X2, Eraser, Wand2, RotateCcw,
  ArrowUpDown, GitCompare, Repeat, RefreshCw, Ruler,
  Square, Droplets, TimerReset, Home, GraduationCap as GradCapIcon,
  Wallet, Video, Award
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
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "finance", label: "Finance", icon: PiggyBank },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "games", label: "Games & Fun", icon: Gamepad2 },
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
  { id: "stopwatch-timer", name: "Stopwatch & Timer", description: "Precise stopwatch with laps and countdown timer", icon: Timer, category: "utility", path: "/tools/stopwatch-timer", color: "hsl(340, 82%, 52%)" },
  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Stay focused with the Pomodoro technique", icon: Brain, category: "utility", path: "/tools/pomodoro-timer", color: "hsl(0, 84%, 60%)" },
  { id: "random-number", name: "Random Number Generator", description: "Generate random numbers within a custom range", icon: Shuffle, category: "utility", path: "/tools/random-number", color: "hsl(263, 85%, 58%)" },
  { id: "flip-coin", name: "Flip a Coin", description: "Virtual coin flipper for quick decisions", icon: Coins, category: "utility", path: "/tools/flip-coin", color: "hsl(47, 95%, 55%)" },
  { id: "dice-roller", name: "Dice Roller", description: "Roll virtual dice with customizable sides", icon: Dices, category: "utility", path: "/tools/dice-roller", color: "hsl(220, 90%, 56%)" },
  { id: "electricity-calculator", name: "Electricity Bill Calculator", description: "Calculate electricity consumption and costs", icon: Zap, category: "utility", path: "/tools/electricity-calculator", color: "hsl(47, 95%, 55%)" },
  { id: "discount-calculator", name: "Discount Calculator", description: "Calculate discount prices with optional tax", icon: Tag, category: "utility", path: "/tools/discount-calculator", color: "hsl(142, 71%, 45%)" },
  { id: "currency-converter", name: "Currency Converter", description: "Convert between world currencies", icon: DollarSign, category: "utility", path: "/tools/currency-converter", color: "hsl(170, 75%, 41%)" },
  { id: "ip-address-lookup", name: "IP Address Lookup", description: "Find geolocation and details of any IP address", icon: MapPin, category: "utility", path: "/tools/ip-address-lookup", color: "hsl(199, 89%, 48%)" },
  { id: "screen-resolution", name: "Screen Resolution Checker", description: "Check your screen resolution and display info", icon: ScreenShare, category: "utility", path: "/tools/screen-resolution", color: "hsl(263, 85%, 58%)" },
  { id: "whatsapp-link-generator", name: "WhatsApp Link Generator", description: "Create direct WhatsApp chat links", icon: MessageCircle, category: "utility", path: "/tools/whatsapp-link-generator", color: "hsl(142, 71%, 45%)" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes from text", icon: BarChart3, category: "utility", path: "/tools/barcode-generator", color: "hsl(220, 90%, 56%)" },
  { id: "url-shortener", name: "URL Shortener", description: "Shorten long URLs for easy sharing", icon: LinkIcon, category: "utility", path: "/tools/url-shortener", color: "hsl(199, 89%, 48%)" },
  { id: "password-strength-checker", name: "Password Strength Checker", description: "Check how strong your password is", icon: Key, category: "utility", path: "/tools/password-strength-checker", color: "hsl(142, 71%, 45%)" },
  { id: "email-validator", name: "Email Validator", description: "Validate email address format and structure", icon: AtSign, category: "utility", path: "/tools/email-validator", color: "hsl(220, 90%, 56%)" },
  { id: "color-mixer", name: "Color Mixer", description: "Mix two colors and generate gradients", icon: Blend, category: "utility", path: "/tools/color-mixer", color: "hsl(280, 90%, 55%)" },
  { id: "domain-name-generator", name: "Domain Name Generator", description: "Generate creative domain name ideas", icon: Globe2, category: "utility", path: "/tools/domain-name-generator", color: "hsl(263, 85%, 58%)" },
  { id: "countdown-timer", name: "Countdown Timer", description: "Set countdown timers for events and deadlines", icon: TimerReset, category: "utility", path: "/tools/countdown-timer", color: "hsl(340, 82%, 52%)" },
  { id: "time-zone-converter", name: "Time Zone Converter", description: "Convert time between different time zones", icon: Globe, category: "utility", path: "/tools/time-zone-converter", color: "hsl(199, 89%, 48%)" },
  { id: "date-diff-calculator", name: "Date Difference Calculator", description: "Calculate difference between two dates", icon: CalendarClock, category: "utility", path: "/tools/date-diff-calculator", color: "hsl(25, 95%, 53%)" },
  { id: "roman-numeral-converter", name: "Roman Numeral Converter", description: "Convert between Roman numerals and numbers", icon: Award, category: "utility", path: "/tools/roman-numeral-converter", color: "hsl(47, 95%, 55%)" },
  { id: "aspect-ratio-calculator", name: "Aspect Ratio Calculator", description: "Calculate and convert aspect ratios", icon: Ruler, category: "utility", path: "/tools/aspect-ratio-calculator", color: "hsl(170, 75%, 41%)" },

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
  { id: "text-to-handwriting", name: "Text to Handwriting", description: "Convert typed text into handwriting-style images", icon: PenLine, category: "text-language", path: "/tools/text-to-handwriting", color: "hsl(25, 95%, 53%)" },
  { id: "text-to-morse", name: "Text to Morse Code", description: "Convert text to Morse code and vice versa", icon: Radio, category: "text-language", path: "/tools/text-to-morse", color: "hsl(47, 95%, 55%)" },
  { id: "fancy-text-generator", name: "Fancy Text Generator", description: "Convert text into stylish Unicode fonts", icon: Sparkle, category: "text-language", path: "/tools/fancy-text-generator", color: "hsl(340, 82%, 52%)" },
  { id: "social-media-bio", name: "Social Media Bio Generator", description: "Generate creative bios for social media", icon: Users, category: "text-language", path: "/tools/social-media-bio", color: "hsl(199, 89%, 48%)" },
  { id: "text-summarizer", name: "Text Summarizer", description: "Summarize long texts by extracting key sentences", icon: Scissors, category: "text-language", path: "/tools/text-summarizer", color: "hsl(340, 82%, 52%)" },
  { id: "text-reverser", name: "Text Reverser", description: "Reverse text, words, or sentences instantly", icon: RefreshCw, category: "text-language", path: "/tools/text-reverser", color: "hsl(263, 85%, 58%)" },
  { id: "duplicate-line-remover", name: "Duplicate Line Remover", description: "Remove duplicate lines from text", icon: Eraser, category: "text-language", path: "/tools/duplicate-line-remover", color: "hsl(0, 84%, 60%)" },
  { id: "text-sorter", name: "Text Line Sorter", description: "Sort text lines alphabetically or by length", icon: ArrowUpDown, category: "text-language", path: "/tools/text-sorter", color: "hsl(142, 71%, 45%)" },
  { id: "text-repeater", name: "Text Repeater", description: "Repeat text multiple times with separators", icon: Repeat, category: "text-language", path: "/tools/text-repeater", color: "hsl(25, 95%, 53%)" },
  { id: "text-to-unicode", name: "Text to Unicode", description: "Convert text to Unicode code points and back", icon: Code, category: "text-language", path: "/tools/text-to-unicode", color: "hsl(220, 90%, 56%)" },
  { id: "text-truncator", name: "Text Truncator", description: "Truncate text to specific length with ellipsis", icon: Scissors, category: "text-language", path: "/tools/text-truncator", color: "hsl(47, 95%, 55%)" },

  // Image & Media Tools
  { id: "image-to-base64", name: "Image to Base64 Converter", description: "Convert images to Base64 encoded strings", icon: FileImage, category: "image-media", path: "/tools/image-to-base64", color: "hsl(280, 90%, 55%)" },
  { id: "online-image-editor", name: "Online Image Editor", description: "Edit images with filters, crop, resize and more", icon: ImagePlus, category: "image-media", path: "/tools/online-image-editor", color: "hsl(199, 89%, 48%)" },
  { id: "photo-filter", name: "Photo Filter", description: "Apply beautiful filters to your photos", icon: Camera, category: "image-media", path: "/tools/photo-filter", color: "hsl(340, 82%, 52%)" },
  { id: "bangla-logo-maker", name: "Bangla Logo Maker", description: "Create logos with Bangla typography", icon: PenTool, category: "image-media", path: "/tools/bangla-logo-maker", color: "hsl(25, 95%, 53%)" },
  { id: "gemini-watermark-remover", name: "Gemini Watermark Remover", description: "Remove watermarks from images using AI", icon: Sparkles, category: "image-media", path: "/tools/gemini-watermark-remover", color: "hsl(263, 85%, 58%)" },
  { id: "website-screenshot", name: "Website Screenshot Taker", description: "Take screenshots of any website", icon: Monitor, category: "image-media", path: "/tools/website-screenshot", color: "hsl(220, 90%, 56%)" },
  { id: "image-compressor", name: "Image Compressor", description: "Compress images to reduce file size", icon: Shrink, category: "image-media", path: "/tools/image-compressor", color: "hsl(142, 71%, 45%)" },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact dimensions with presets", icon: Maximize, category: "image-media", path: "/tools/image-resizer", color: "hsl(199, 89%, 48%)" },
  { id: "color-blindness-simulator", name: "Color Blindness Simulator", description: "See how images look to people with color blindness", icon: Eye, category: "image-media", path: "/tools/color-blindness-simulator", color: "hsl(280, 90%, 55%)" },
  { id: "image-color-extractor", name: "Image Color Extractor", description: "Extract dominant colors from any image", icon: Paintbrush, category: "image-media", path: "/tools/image-color-extractor", color: "hsl(340, 82%, 52%)" },
  { id: "placeholder-image", name: "Placeholder Image Generator", description: "Generate placeholder images for designs", icon: ImageDown, category: "image-media", path: "/tools/placeholder-image", color: "hsl(199, 89%, 48%)" },
  { id: "drawing-board", name: "Drawing Board", description: "Free-hand drawing board with pen controls", icon: PenSquare, category: "image-media", path: "/tools/drawing-board", color: "hsl(0, 84%, 60%)" },
  { id: "image-cropper", name: "Image Cropper", description: "Crop images to specific dimensions", icon: Crop, category: "image-media", path: "/tools/image-cropper", color: "hsl(142, 71%, 45%)" },
  { id: "image-watermark", name: "Image Watermark", description: "Add text or image watermarks to your photos", icon: Layers, category: "image-media", path: "/tools/image-watermark", color: "hsl(220, 90%, 56%)" },
  { id: "image-flip-rotate", name: "Image Flip & Rotate", description: "Flip and rotate images with precision", icon: FlipHorizontal, category: "image-media", path: "/tools/image-flip-rotate", color: "hsl(25, 95%, 53%)" },
  { id: "image-border-adder", name: "Image Border Adder", description: "Add beautiful borders and frames to images", icon: Square, category: "image-media", path: "/tools/image-border-adder", color: "hsl(340, 82%, 52%)" },
  { id: "image-to-grayscale", name: "Image to Grayscale", description: "Convert color images to grayscale", icon: ImageMinus, category: "image-media", path: "/tools/image-to-grayscale", color: "hsl(0, 0%, 50%)" },
  { id: "image-text-overlay", name: "Image Text Overlay", description: "Add custom text overlays on images", icon: Type, category: "image-media", path: "/tools/image-text-overlay", color: "hsl(263, 85%, 58%)" },
  { id: "image-pixelator", name: "Image Pixelator", description: "Pixelate images or specific areas", icon: Grid2X2, category: "image-media", path: "/tools/image-pixelator", color: "hsl(142, 71%, 45%)" },
  { id: "image-brightness-contrast", name: "Brightness & Contrast", description: "Adjust image brightness and contrast", icon: SunMedium, category: "image-media", path: "/tools/image-brightness-contrast", color: "hsl(47, 95%, 55%)" },
  { id: "image-format-converter", name: "Image Format Converter", description: "Convert images between PNG, JPG, WebP formats", icon: FileImage, category: "image-media", path: "/tools/image-format-converter", color: "hsl(199, 89%, 48%)" },
  { id: "image-collage", name: "Image Collage Maker", description: "Create photo collages with multiple layouts", icon: Grid3X3, category: "image-media", path: "/tools/image-collage", color: "hsl(280, 90%, 55%)" },
  { id: "image-blur-tool", name: "Image Blur Tool", description: "Apply blur effects to images", icon: Droplets, category: "image-media", path: "/tools/image-blur-tool", color: "hsl(220, 90%, 56%)" },
  { id: "image-compare", name: "Image Compare", description: "Compare two images side by side with slider", icon: GitCompare, category: "image-media", path: "/tools/image-compare", color: "hsl(170, 75%, 41%)" },
  { id: "image-inverter", name: "Image Inverter", description: "Invert colors of any image", icon: Contrast, category: "image-media", path: "/tools/image-inverter", color: "hsl(0, 84%, 60%)" },
  { id: "meme-generator", name: "Meme Generator", description: "Create memes with custom text on images", icon: Smile, category: "image-media", path: "/tools/meme-generator", color: "hsl(47, 95%, 55%)" },
  { id: "image-effects", name: "Image Effects", description: "Apply Sepia, Solarize and artistic effects", icon: Wand2, category: "image-media", path: "/tools/image-effects", color: "hsl(263, 85%, 58%)" },

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
  { id: "html-entity-converter", name: "HTML Entity Converter", description: "Encode and decode HTML entities", icon: Code, category: "developer", path: "/tools/html-entity-converter", color: "hsl(199, 89%, 48%)" },
  { id: "crontab-generator", name: "Crontab Generator", description: "Generate and understand cron expressions", icon: CalendarClock, category: "developer", path: "/tools/crontab-generator", color: "hsl(170, 75%, 41%)" },
  { id: "privacy-policy-generator", name: "Privacy Policy Generator", description: "Generate a privacy policy for your website", icon: ShieldCheck, category: "developer", path: "/tools/privacy-policy-generator", color: "hsl(340, 82%, 52%)" },
  { id: "text-to-binary", name: "Text to Binary Converter", description: "Convert text to binary and binary to text", icon: Binary, category: "developer", path: "/tools/text-to-binary", color: "hsl(47, 95%, 55%)" },
  { id: "json-to-yaml", name: "JSON to YAML Converter", description: "Convert JSON to YAML format", icon: FileType, category: "developer", path: "/tools/json-to-yaml", color: "hsl(0, 84%, 60%)" },
  { id: "html-preview", name: "HTML Live Preview", description: "Write HTML and see live preview instantly", icon: Code2, category: "developer", path: "/tools/html-preview", color: "hsl(263, 85%, 58%)" },
  { id: "csv-viewer", name: "CSV Viewer", description: "View and parse CSV data in a table", icon: Table2, category: "developer", path: "/tools/csv-viewer", color: "hsl(142, 71%, 45%)" },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens", icon: KeyRound, category: "developer", path: "/tools/jwt-decoder", color: "hsl(25, 95%, 53%)" },
  { id: "text-encryption", name: "Text Encryption Tool", description: "Encrypt and decrypt text using Caesar cipher", icon: Lock, category: "developer", path: "/tools/text-encryption", color: "hsl(0, 84%, 60%)" },
  { id: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries", icon: Database, category: "developer", path: "/tools/sql-formatter", color: "hsl(47, 95%, 55%)" },
  { id: "number-base-converter", name: "Number Base Converter", description: "Convert between binary, octal, decimal, hex", icon: Hash, category: "developer", path: "/tools/number-base-converter", color: "hsl(170, 75%, 41%)" },
  { id: "user-agent-parser", name: "User Agent Parser", description: "Parse and analyze browser user agent strings", icon: Bug, category: "developer", path: "/tools/user-agent-parser", color: "hsl(25, 95%, 53%)" },
  { id: "hex-editor", name: "Hex Editor", description: "Convert text to hexadecimal and back", icon: Hexagon, category: "developer", path: "/tools/hex-editor", color: "hsl(280, 90%, 55%)" },
  { id: "color-converter", name: "Color Converter", description: "Convert colors between HEX, RGB, HSL formats", icon: Palette, category: "developer", path: "/tools/color-converter", color: "hsl(340, 82%, 52%)" },
  { id: "binary-converter", name: "Binary Converter", description: "Convert between text and binary representation", icon: Binary, category: "developer", path: "/tools/binary-converter", color: "hsl(199, 89%, 48%)" },
  { id: "box-shadow-generator", name: "Box Shadow Generator", description: "Generate CSS box shadow with live preview", icon: Square, category: "developer", path: "/tools/box-shadow-generator", color: "hsl(263, 85%, 58%)" },
  { id: "gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients visually", icon: Droplets, category: "developer", path: "/tools/gradient-generator", color: "hsl(280, 90%, 55%)" },
  { id: "border-radius-previewer", name: "Border Radius Previewer", description: "Preview and generate CSS border radius", icon: Square, category: "developer", path: "/tools/border-radius-previewer", color: "hsl(142, 71%, 45%)" },

  // ID Card Makers
  { id: "fake-bd-old-nid", name: "Fake BD Old NID Card Maker", description: "Generate fake old format BD NID cards", icon: CreditCard, category: "id-card", path: "/tools/fake-bd-old-nid", color: "hsl(142, 71%, 45%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: User, category: "id-card", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 56%)" },
  { id: "fake-bd-smart-nid", name: "Fake BD Smart NID Card Maker", description: "Generate fake smart NID cards", icon: IdCard, category: "id-card", path: "/tools/fake-bd-smart-nid", color: "hsl(263, 85%, 58%)" },
  { id: "fake-pak-cnic", name: "Fake Pakistani CNIC Card Maker", description: "Generate fake Pakistani CNIC cards", icon: CreditCard, category: "id-card", path: "/tools/fake-pak-cnic", color: "hsl(142, 71%, 45%)" },
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards easily", icon: GraduationCap, category: "id-card", path: "/tools/student-id-card", color: "hsl(25, 95%, 53%)" },

  // Security & Privacy Tools
  { id: "bulk-password-generator", name: "Bulk Password Generator", description: "Generate multiple secure passwords at once", icon: LockKeyhole, category: "security", path: "/tools/bulk-password-generator", color: "hsl(0, 84%, 60%)" },
  { id: "text-encryptor", name: "AES-like Text Encryptor", description: "Encrypt and decrypt text with a secret key", icon: Lock, category: "security", path: "/tools/text-encryptor", color: "hsl(263, 85%, 58%)" },
  { id: "phishing-link-checker", name: "Phishing Link Checker", description: "Check if a URL looks suspicious", icon: FileWarning, category: "security", path: "/tools/phishing-link-checker", color: "hsl(47, 95%, 55%)" },
  { id: "private-notepad", name: "Private Encrypted Notepad", description: "Write notes encrypted with your password", icon: Shield, category: "security", path: "/tools/private-notepad", color: "hsl(142, 71%, 45%)" },
  { id: "browser-fingerprint", name: "Browser Fingerprint Viewer", description: "See what info your browser reveals about you", icon: Fingerprint, category: "security", path: "/tools/browser-fingerprint", color: "hsl(220, 90%, 56%)" },
  { id: "credit-card-validator", name: "Credit Card Validator", description: "Validate credit card numbers using Luhn algorithm", icon: CreditCard, category: "security", path: "/tools/credit-card-validator", color: "hsl(340, 82%, 52%)" },

  // Finance Tools
  { id: "compound-interest", name: "Compound Interest Calculator", description: "Calculate compound vs simple interest", icon: CircleDollarSign, category: "finance", path: "/tools/compound-interest", color: "hsl(142, 71%, 45%)" },
  { id: "tax-calculator", name: "Income Tax Calculator", description: "Calculate income tax based on tax slabs", icon: Receipt, category: "finance", path: "/tools/tax-calculator", color: "hsl(0, 84%, 60%)" },
  { id: "savings-goal", name: "Savings Goal Calculator", description: "Plan how long to reach your savings goal", icon: Target, category: "finance", path: "/tools/savings-goal", color: "hsl(199, 89%, 48%)" },
  { id: "profit-margin", name: "Profit Margin Calculator", description: "Calculate profit margin and markup", icon: TrendingUp, category: "finance", path: "/tools/profit-margin", color: "hsl(47, 95%, 55%)" },
  { id: "loan-calculator", name: "Loan/EMI Calculator", description: "Calculate monthly EMI payments for loans", icon: Banknote, category: "finance", path: "/tools/loan-calculator", color: "hsl(199, 89%, 48%)" },
  { id: "tip-calculator", name: "Tip Calculator", description: "Calculate tips and split bills between people", icon: UtensilsCrossed, category: "finance", path: "/tools/tip-calculator", color: "hsl(25, 95%, 53%)" },
  { id: "investment-calculator", name: "Investment Calculator", description: "Calculate compound interest and investment growth", icon: TrendingUp, category: "finance", path: "/tools/investment-calculator", color: "hsl(142, 71%, 45%)" },
  { id: "mortgage-calculator", name: "Mortgage Calculator", description: "Calculate monthly mortgage payments and interest", icon: Home, category: "finance", path: "/tools/mortgage-calculator", color: "hsl(220, 90%, 56%)" },
  { id: "salary-calculator", name: "Salary Calculator", description: "Calculate net salary after taxes and deductions", icon: Wallet, category: "finance", path: "/tools/salary-calculator", color: "hsl(263, 85%, 58%)" },
  { id: "fuel-cost-calculator", name: "Fuel Cost Calculator", description: "Calculate fuel cost for your trip", icon: Fuel, category: "finance", path: "/tools/fuel-cost-calculator", color: "hsl(25, 95%, 53%)" },
  { id: "payroll-calculator", name: "Payroll Calculator", description: "Calculate net salary with tax and deductions", icon: FileSpreadsheet, category: "finance", path: "/tools/payroll-calculator", color: "hsl(220, 90%, 56%)" },
  { id: "gpa-calculator", name: "GPA Calculator", description: "Calculate GPA from course grades and credits", icon: GraduationCap, category: "finance", path: "/tools/gpa-calculator", color: "hsl(280, 90%, 55%)" },

  // Social Media Tools
  { id: "social-post-generator", name: "Social Post Generator", description: "Generate engaging social media posts", icon: MessageSquare, category: "social", path: "/tools/social-post-generator", color: "hsl(220, 90%, 56%)" },
  { id: "hashtag-generator", name: "Hashtag Generator", description: "Generate trending hashtags for social media", icon: Hash, category: "social", path: "/tools/hashtag-generator", color: "hsl(263, 85%, 58%)" },
  { id: "youtube-tag-generator", name: "YouTube Tag Generator", description: "Generate SEO tags for YouTube videos", icon: Youtube, category: "social", path: "/tools/youtube-tag-generator", color: "hsl(0, 84%, 60%)" },
  { id: "tweet-formatter", name: "Tweet/Thread Formatter", description: "Format and split text into tweet threads", icon: Twitter, category: "social", path: "/tools/tweet-formatter", color: "hsl(199, 89%, 48%)" },
  { id: "youtube-thumbnail", name: "YouTube Thumbnail Downloader", description: "Download thumbnails from YouTube videos", icon: Video, category: "social", path: "/tools/youtube-thumbnail", color: "hsl(0, 84%, 60%)" },

  // Games & Fun Tools
  { id: "memory-game", name: "Memory Card Game", description: "Test your memory by matching pairs", icon: Boxes, category: "games", path: "/tools/memory-game", color: "hsl(280, 90%, 55%)" },
  { id: "number-guessing", name: "Number Guessing Game", description: "Guess the secret number with hints", icon: Puzzle, category: "games", path: "/tools/number-guessing", color: "hsl(142, 71%, 45%)" },
  { id: "tic-tac-toe", name: "Tic Tac Toe", description: "Classic Tic Tac Toe for two players", icon: Swords, category: "games", path: "/tools/tic-tac-toe", color: "hsl(25, 95%, 53%)" },
  { id: "snake-game", name: "Snake Game", description: "Classic snake game with arrow keys", icon: Joystick, category: "games", path: "/tools/snake-game", color: "hsl(340, 82%, 52%)" },
  { id: "word-scramble", name: "Word Scramble Game", description: "Unscramble the letters to find the word", icon: Trophy, category: "games", path: "/tools/word-scramble", color: "hsl(47, 95%, 55%)" },
  { id: "hangman-game", name: "Hangman Game", description: "Classic word guessing game", icon: Gamepad2, category: "games", path: "/tools/hangman-game", color: "hsl(263, 85%, 58%)" },
  { id: "reaction-time-test", name: "Reaction Time Test", description: "Test your reaction speed", icon: MousePointer, category: "games", path: "/tools/reaction-time-test", color: "hsl(142, 71%, 45%)" },
];

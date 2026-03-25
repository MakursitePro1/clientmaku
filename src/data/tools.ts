import {
  Wifi, ShieldAlert, GraduationCap, Code2, Train, Image, Smile, 
  FileText, Link, Keyboard, Type, ImagePlus, Calculator, 
  Languages, Globe, Lock, Camera, QrCode, ScanLine, 
  CreditCard, IdCard, User, Sparkles, FileImage, Monitor,
  Palette, PenTool, Search, Gauge
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

  // Text & Language Tools
  { id: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text for your designs", icon: FileText, category: "text-language", path: "/tools/lorem-ipsum-generator", color: "hsl(25, 95%, 53%)" },
  { id: "emoji-picker", name: "Emoji Picker", description: "Find and copy emojis easily", icon: Smile, category: "text-language", path: "/tools/emoji-picker", color: "hsl(47, 95%, 55%)" },
  { id: "text-diff-checker", name: "Text Diff Checker", description: "Compare two texts and find differences", icon: FileText, category: "text-language", path: "/tools/text-diff-checker", color: "hsl(199, 89%, 48%)" },
  { id: "typing-test", name: "Typing Test", description: "Test your typing speed and accuracy", icon: Keyboard, category: "text-language", path: "/tools/typing-test", color: "hsl(263, 85%, 58%)" },
  { id: "bangla-to-banglish", name: "Bangla to Banglish Converter", description: "Convert Bangla text to Banglish", icon: Languages, category: "text-language", path: "/tools/bangla-to-banglish", color: "hsl(142, 71%, 45%)" },
  { id: "banglish-to-bangla", name: "Banglish to Bangla Converter", description: "Convert Banglish text to Bangla", icon: Languages, category: "text-language", path: "/tools/banglish-to-bangla", color: "hsl(340, 82%, 52%)" },

  // Image & Media Tools
  { id: "image-to-base64", name: "Image to Base64 Converter", description: "Convert images to Base64 encoded strings", icon: FileImage, category: "image-media", path: "/tools/image-to-base64", color: "hsl(280, 90%, 55%)" },
  { id: "online-image-editor", name: "Online Image Editor", description: "Edit images with filters, crop, resize and more", icon: ImagePlus, category: "image-media", path: "/tools/online-image-editor", color: "hsl(199, 89%, 48%)" },
  { id: "photo-filter", name: "Photo Filter", description: "Apply beautiful filters to your photos", icon: Camera, category: "image-media", path: "/tools/photo-filter", color: "hsl(340, 82%, 52%)" },
  { id: "bangla-logo-maker", name: "Bangla Logo Maker", description: "Create logos with Bangla typography", icon: PenTool, category: "image-media", path: "/tools/bangla-logo-maker", color: "hsl(25, 95%, 53%)" },
  { id: "gemini-watermark-remover", name: "Gemini Watermark Remover", description: "Remove watermarks from images using AI", icon: Sparkles, category: "image-media", path: "/tools/gemini-watermark-remover", color: "hsl(263, 85%, 58%)" },
  { id: "website-screenshot", name: "Website Screenshot Taker", description: "Take screenshots of any website", icon: Monitor, category: "image-media", path: "/tools/website-screenshot", color: "hsl(220, 90%, 56%)" },

  // Developer Tools
  { id: "api-tester", name: "API Tester", description: "Test REST APIs with custom requests", icon: Code2, category: "developer", path: "/tools/api-tester", color: "hsl(142, 71%, 45%)" },
  { id: "regex-tester", name: "RegEx Tester", description: "Test and debug regular expressions", icon: Search, category: "developer", path: "/tools/regex-tester", color: "hsl(25, 95%, 53%)" },
  { id: "url-parser", name: "URL Parser", description: "Parse and analyze URL components", icon: Link, category: "developer", path: "/tools/url-parser", color: "hsl(220, 90%, 56%)" },
  { id: "bdix-server-tester", name: "BDIX Server Tester", description: "Test BDIX server connectivity", icon: Globe, category: "developer", path: "/tools/bdix-server-tester", color: "hsl(170, 75%, 41%)" },

  // ID Card Makers
  { id: "fake-bd-old-nid", name: "Fake BD Old NID Card Maker", description: "Generate fake old format BD NID cards", icon: CreditCard, category: "id-card", path: "/tools/fake-bd-old-nid", color: "hsl(142, 71%, 45%)" },
  { id: "facebook-id-card", name: "Facebook ID Card Maker", description: "Create Facebook-style ID cards", icon: User, category: "id-card", path: "/tools/facebook-id-card", color: "hsl(220, 90%, 56%)" },
  { id: "fake-bd-smart-nid", name: "Fake BD Smart NID Card Maker", description: "Generate fake smart NID cards", icon: IdCard, category: "id-card", path: "/tools/fake-bd-smart-nid", color: "hsl(263, 85%, 58%)" },
  { id: "fake-pak-cnic", name: "Fake Pakistani CNIC Card Maker", description: "Generate fake Pakistani CNIC cards", icon: CreditCard, category: "id-card", path: "/tools/fake-pak-cnic", color: "hsl(142, 71%, 45%)" },
  { id: "student-id-card", name: "Student ID Card Maker", description: "Create student ID cards easily", icon: GraduationCap, category: "id-card", path: "/tools/student-id-card", color: "hsl(25, 95%, 53%)" },
];

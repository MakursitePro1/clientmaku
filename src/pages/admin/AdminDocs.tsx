import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Globe, Shield, Zap, ExternalLink, CheckCircle, AlertTriangle,
  BookOpen, FileText, ArrowRight, Copy, Monitor, Smartphone, Settings,
  Eye, BarChart3, Link2, Code, Bell, Users, Crown, Upload, Languages,
  Database, Key, Terminal, FolderOpen, Lock, Server, Layers, HardDrive,
  HelpCircle, ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06 },
});

type Lang = "bn" | "en";

const t = (lang: Lang, bn: string, en: string) => lang === "bn" ? bn : en;

interface StepItem {
  step: number;
  title: string;
  description: string;
  tip?: string;
  code?: string;
}

function StepCard({ item }: { item: StepItem }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-xs font-bold text-primary">{item.step}</span>
      </div>
      <div className="flex-1 space-y-1.5">
        <p className="text-sm font-semibold text-foreground">{item.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
        {item.code && (
          <div className="mt-2 p-2.5 rounded-lg bg-muted/80 border border-border/50 font-mono text-[11px] text-foreground overflow-x-auto whitespace-pre">
            {item.code}
          </div>
        )}
        {item.tip && (
          <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-primary/80 leading-relaxed">{item.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="mt-2">
      {label && <p className="text-[10px] text-muted-foreground mb-1 font-medium">{label}</p>}
      <div className="p-3 rounded-lg bg-muted/80 border border-border/50 font-mono text-[11px] text-foreground overflow-x-auto whitespace-pre">
        {code}
      </div>
    </div>
  );
}

const getDeploySteps = (lang: Lang): StepItem[] => [
  {
    step: 1,
    title: t(lang, "Supabase প্রজেক্ট তৈরি করুন", "Create a Supabase Project"),
    description: t(lang,
      "supabase.com-এ যান → Sign Up / Login করুন → 'New Project' ক্লিক করুন → প্রজেক্টের নাম দিন → ডেটাবেজ পাসওয়ার্ড সেট করুন → আপনার নিকটতম রিজিয়ন সিলেক্ট করুন → 'Create new project' ক্লিক করুন। প্রজেক্ট তৈরি হতে ১-২ মিনিট সময় লাগবে।",
      "Go to supabase.com → Sign Up / Login → Click 'New Project' → Enter project name → Set a database password → Select your nearest region → Click 'Create new project'. It takes 1-2 minutes to set up."
    ),
    tip: t(lang,
      "প্রজেক্ট তৈরি হওয়ার পর Settings → API পেজে যান। সেখান থেকে 'Project URL' (যেমন: https://xyzabc.supabase.co) এবং 'anon/public key' (যা eyJ... দিয়ে শুরু হয়) — এই দুটি কপি করে রাখুন। ⚠️ service_role key কখনো শেয়ার করবেন না!",
      "After creation, go to Settings → API. Copy your 'Project URL' (e.g., https://xyzabc.supabase.co) and 'anon/public key' (starts with eyJ...). ⚠️ NEVER share your service_role key!"
    ),
  },
  {
    step: 2,
    title: t(lang, "ডেটাবেজ স্কিমা সেটআপ করুন", "Set Up Database Schema"),
    description: t(lang,
      "Supabase Dashboard → বাম মেনু থেকে 'SQL Editor' ক্লিক করুন → 'New query' ক্লিক করুন → আপনার কোড ফোল্ডারে থাকা database-setup.sql ফাইলটি ওপেন করুন → পুরো SQL কোড কপি করে SQL Editor-এ পেস্ট করুন → নিচের 'Run' বাটনে ক্লিক করুন।",
      "Go to Supabase Dashboard → Click 'SQL Editor' from left menu → Click 'New query' → Open the database-setup.sql file from your code folder → Copy the entire SQL code and paste it into the SQL Editor → Click the 'Run' button at the bottom."
    ),
    tip: t(lang,
      "এই SQL ফাইলটি ১৮টি টেবিল তৈরি করবে: profiles, user_roles, site_settings, tool_settings, tool_seo, page_seo, custom_tools, favorites, ad_slots, blog_posts, page_views, subscription_plans, user_subscriptions, payment_requests, payment_gateways, premium_tools, totp_secrets, tool_ratings। সাথে RLS পলিসি, ফাংশন ও ট্রিগারও সেটআপ হবে।",
      "This SQL file creates 18 tables: profiles, user_roles, site_settings, tool_settings, tool_seo, page_seo, custom_tools, favorites, ad_slots, blog_posts, page_views, subscription_plans, user_subscriptions, payment_requests, payment_gateways, premium_tools, totp_secrets, tool_ratings. It also sets up RLS policies, functions, and triggers."
    ),
  },
  {
    step: 3,
    title: t(lang, "Storage Bucket তৈরি করুন", "Create Storage Bucket"),
    description: t(lang,
      "Supabase Dashboard → বাম মেনু থেকে 'Storage' ক্লিক করুন → 'New Bucket' বাটনে ক্লিক করুন → নাম দিন: admin-uploads → 'Public bucket' টগল চালু করুন → 'Create bucket' ক্লিক করুন।",
      "Go to Supabase Dashboard → Click 'Storage' from left menu → Click 'New Bucket' → Name it: admin-uploads → Enable the 'Public bucket' toggle → Click 'Create bucket'."
    ),
    tip: t(lang,
      "এই বাকেটটি সাইটের লোগো, ফেভিকন, ব্লগ পোস্টের ফিচারড ইমেজ, কাস্টম টুলস এবং এডমিন প্যানেল থেকে আপলোড করা সকল ফাইলের জন্য ব্যবহৃত হবে। Public bucket না করলে ইমেজ লোড হবে না!",
      "This bucket stores site logos, favicons, blog featured images, custom tools files, and all uploads from the admin panel. If not set to Public, images won't load!"
    ),
  },
  {
    step: 4,
    title: t(lang, "Environment Variables কনফিগার করুন", "Configure Environment Variables"),
    description: t(lang,
      "আপনার কোড ফোল্ডারে .env.example ফাইলটি আছে। এটি কপি করে .env নামে সংরক্ষণ করুন। তারপর নিচের ৩টি মান আপনার Supabase প্রজেক্ট থেকে দিন:",
      "In your code folder, there's a .env.example file. Copy it and save as .env. Then fill in the 3 values from your Supabase project:"
    ),
    code: `VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...YOUR_ANON_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID`,
    tip: t(lang,
      "VITE_SUPABASE_URL → Supabase Settings → API → Project URL থেকে কপি করুন। VITE_SUPABASE_PUBLISHABLE_KEY → একই পেজে anon/public key কপি করুন। VITE_SUPABASE_PROJECT_ID → আপনার URL-এর https:// ও .supabase.co মধ্যবর্তী অংশটি।",
      "VITE_SUPABASE_URL → Copy from Supabase Settings → API → Project URL. VITE_SUPABASE_PUBLISHABLE_KEY → Copy the anon/public key from the same page. VITE_SUPABASE_PROJECT_ID → The part between https:// and .supabase.co in your URL."
    ),
  },
  {
    step: 5,
    title: t(lang, "Edge Functions ডিপ্লয় করুন", "Deploy Edge Functions"),
    description: t(lang,
      "Edge Functions হলো সার্ভার-সাইড ফাংশন যা বিশেষ কাজের জন্য দরকার (যেমন: ইউজার ম্যানেজমেন্ট, টেম্প মেইল ইত্যাদি)। এগুলো ডিপ্লয় করতে Supabase CLI ব্যবহার করতে হবে।",
      "Edge Functions are server-side functions needed for special operations (e.g., user management, temp mail). You need the Supabase CLI to deploy them."
    ),
    code: `# Step 1: Install Supabase CLI
npm install -g supabase

# Step 2: Login to Supabase
supabase login

# Step 3: Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Step 4: Deploy all functions
supabase functions deploy admin-user-manage
supabase functions deploy temp-mail
supabase functions deploy temp-number
supabase functions deploy totp-manage`,
    tip: t(lang,
      "YOUR_PROJECT_ID-এর জায়গায় আপনার Supabase প্রজেক্টের ID দিন। Edge Functions ছাড়াও মূল ওয়েবসাইট কাজ করবে, তবে কিছু এডমিন ফিচার (যেমন: ইউজার ব্যান/আনব্যান) কাজ করবে না।",
      "Replace YOUR_PROJECT_ID with your actual Supabase project ID. The main website works without Edge Functions, but some admin features (e.g., user ban/unban) won't work without them."
    ),
  },
  {
    step: 6,
    title: t(lang, "প্রথম এডমিন অ্যাকাউন্ট সেটআপ করুন", "Set Up the First Admin Account"),
    description: t(lang,
      "আপনার ওয়েবসাইটে যান → Sign Up করুন আপনার ইমেইল দিয়ে → ইমেইল ভেরিফিকেশন সম্পন্ন করুন → তারপর Supabase Dashboard → SQL Editor-এ গিয়ে নিচের SQL চালান:",
      "Go to your website → Sign Up with your email → Complete email verification → Then go to Supabase Dashboard → SQL Editor and run this SQL:"
    ),
    code: `-- আপনার ইমেইল দিয়ে পরিবর্তন করুন / Replace with your email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;`,
    tip: t(lang,
      "ভবিষ্যতে স্বয়ংক্রিয়ভাবে এডমিন অ্যাসাইন করতে auto_assign_admin() ফাংশনে আপনার ইমেইল সেট করুন। এটি করলে ওই ইমেইল দিয়ে সাইনআপ করলে অটোমেটিক্যালি এডমিন রোল পাবে।",
      "For auto-admin assignment in the future, update the auto_assign_admin() function with your email. When someone signs up with that email, they'll automatically get the admin role."
    ),
  },
  {
    step: 7,
    title: t(lang, "ফ্রন্টএন্ড ডিপ্লয় করুন", "Deploy the Frontend"),
    description: t(lang,
      "আপনার কোডটি যেকোনো হোস্টিং প্ল্যাটফর্মে ডিপ্লয় করতে পারবেন। নিচে ৩টি জনপ্রিয় অপশন দেওয়া হলো:",
      "You can deploy your code to any hosting platform. Here are 3 popular options:"
    ),
    tip: t(lang,
      "যেকোনো হোস্টিং-এই ডিপ্লয় করুন, Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID) যোগ করতে ভুলবেন না!",
      "Whichever hosting you choose, don't forget to add the Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID)!"
    ),
  },
  {
    step: 8,
    title: t(lang, "এডমিন প্যানেল থেকে সাইট কনফিগার করুন", "Configure Site from Admin Panel"),
    description: t(lang,
      "এডমিন প্যানেলে যান (ডিফল্ট URL: /makuadmingowebs99) → Settings ট্যাবে যান → সাইটের নাম, লোগো, ফেভিকন, যোগাযোগ, সোশ্যাল মিডিয়া লিংক সেট করুন → SEO ট্যাবে মেটা তথ্য দিন → Subscriptions-এ প্ল্যান কনফিগার করুন → Tools-এ টুলস ম্যানেজ করুন।",
      "Go to Admin Panel (default URL: /makuadmingowebs99) → Go to Settings tab → Set site name, logo, favicon, contact info, social media links → Add meta info in SEO tab → Configure plans in Subscriptions → Manage tools in Tools."
    ),
    tip: t(lang,
      "⚠️ গুরুত্বপূর্ণ: প্রথম কাজ হিসেবে Admin → Settings → Security থেকে ডিফল্ট এডমিন URL (/makuadmingowebs99) পরিবর্তন করুন! এটি আপনার সাইটের নিরাপত্তার জন্য অত্যন্ত জরুরি।",
      "⚠️ IMPORTANT: As your first task, change the default admin URL (/makuadmingowebs99) from Admin → Settings → Security! This is critical for your site's security."
    ),
  },
];

const getHostingDetails = (lang: Lang) => [
  {
    name: "Vercel",
    badge: t(lang, "রেকমেন্ডেড", "Recommended"),
    steps: [
      t(lang, "GitHub-এ কোড পুশ করুন", "Push code to GitHub"),
      t(lang, "vercel.com → Import Project → আপনার রিপো সিলেক্ট করুন", "vercel.com → Import Project → Select your repo"),
      t(lang, "Framework Preset: Vite সিলেক্ট করুন", "Select Framework Preset: Vite"),
      t(lang, "Environment Variables যোগ করুন (৩টি VITE_ ভেরিয়েবল)", "Add Environment Variables (3 VITE_ variables)"),
      t(lang, "'Deploy' ক্লিক করুন — ব্যাস, হয়ে গেছে!", "Click 'Deploy' — that's it!"),
    ],
  },
  {
    name: "Netlify",
    badge: t(lang, "সহজ", "Easy"),
    steps: [
      t(lang, "GitHub-এ কোড পুশ করুন", "Push code to GitHub"),
      t(lang, "netlify.com → Add new site → Import from Git", "netlify.com → Add new site → Import from Git"),
      t(lang, "Build command: npm run build", "Build command: npm run build"),
      t(lang, "Publish directory: dist", "Publish directory: dist"),
      t(lang, "Environment Variables যোগ করুন ও Deploy করুন", "Add Environment Variables and Deploy"),
    ],
  },
  {
    name: "cPanel / Shared Hosting",
    badge: t(lang, "ম্যানুয়াল", "Manual"),
    steps: [
      t(lang, "লোকালে npm install ও npm run build চালান", "Run npm install and npm run build locally"),
      t(lang, "dist/ ফোল্ডারের ভেতরের সব ফাইল public_html-এ আপলোড করুন", "Upload all files from dist/ folder to public_html"),
      t(lang, ".htaccess ফাইল তৈরি করুন SPA রাউটিং-এর জন্য (নিচে দেওয়া হলো)", "Create .htaccess file for SPA routing (shown below)"),
    ],
    code: `# .htaccess for SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`,
  },
];

const getTroubleshootItems = (lang: Lang) => [
  {
    problem: t(lang, "সাইট লোড হচ্ছে না / ফাঁকা পেজ দেখাচ্ছে", "Site not loading / showing blank page"),
    solution: t(lang, ".env ফাইলের VITE_SUPABASE_URL ও VITE_SUPABASE_PUBLISHABLE_KEY সঠিক কিনা চেক করুন। ব্রাউজার কনসোলে (F12) এরর মেসেজ দেখুন।", "Check if VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env are correct. Check browser console (F12) for error messages."),
  },
  {
    problem: t(lang, "সাইনআপ/লগইন কাজ করছে না", "Sign up / Login not working"),
    solution: t(lang, "Supabase Dashboard → Authentication → Settings → Site URL আপনার ডোমেইন দিন। Email Templates-এ Confirm Signup URL সঠিক কিনা চেক করুন।", "Go to Supabase Dashboard → Authentication → Settings → Set your domain in Site URL. Check if Confirm Signup URL is correct in Email Templates."),
  },
  {
    problem: t(lang, "ডেটা দেখাচ্ছে না / টেবিল খালি", "Data not showing / Tables empty"),
    solution: t(lang, "database-setup.sql সম্পূর্ণ রান হয়েছে কিনা চেক করুন। Supabase → Table Editor-এ গিয়ে টেবিলগুলো আছে কিনা দেখুন। RLS পলিসি সঠিক কিনা দেখুন।", "Check if database-setup.sql ran completely. Go to Supabase → Table Editor and verify tables exist. Check RLS policies are correct."),
  },
  {
    problem: t(lang, "এডমিন প্যানেলে অ্যাক্সেস নেই", "No access to Admin Panel"),
    solution: t(lang, "user_roles টেবিলে আপনার user_id-তে 'admin' রোল আছে কিনা চেক করুন। Step 6 অনুযায়ী SQL চালান।", "Check if your user_id has 'admin' role in user_roles table. Run the SQL from Step 6."),
  },
  {
    problem: t(lang, "ইমেজ আপলোড হচ্ছে না", "Image upload not working"),
    solution: t(lang, "admin-uploads নামে Storage Bucket আছে কিনা চেক করুন। Bucket টি Public সেট আছে কিনা দেখুন। Storage → Policies-এ upload/read পলিসি আছে কিনা দেখুন।", "Check if admin-uploads Storage Bucket exists. Verify it's set to Public. Check Storage → Policies for upload/read policies."),
  },
  {
    problem: t(lang, "পেজ রিফ্রেশ করলে 404 দেখায়", "Page shows 404 on refresh"),
    solution: t(lang, "SPA রাউটিং কনফিগার করুন: Vercel-এ vercel.json, Netlify-তে _redirects ফাইল, cPanel-এ .htaccess ফাইল দরকার।", "Configure SPA routing: Vercel needs vercel.json, Netlify needs _redirects file, cPanel needs .htaccess file."),
  },
  {
    problem: t(lang, "Edge Functions কাজ করছে না", "Edge Functions not working"),
    solution: t(lang, "supabase functions deploy কমান্ড সঠিকভাবে চালিয়েছেন কিনা চেক করুন। Supabase Dashboard → Edge Functions-এ ফাংশনগুলো দেখা যাচ্ছে কিনা দেখুন।", "Check if you ran supabase functions deploy correctly. Verify functions are visible in Supabase Dashboard → Edge Functions."),
  },
];

const getAdminGuides = (lang: Lang) => [
  {
    title: t(lang, "টুলস ম্যানেজমেন্ট", "Managing Tools"),
    icon: Settings,
    color: "text-blue-400",
    items: [
      t(lang, "Admin → Tools-এ যান — যেকোনো টুল Enable/Disable করতে পারবেন", "Go to Admin → Tools to enable/disable any tool"),
      t(lang, "এডিট আইকনে ক্লিক করে যেকোনো টুলের নাম পরিবর্তন করুন", "Click the edit icon to rename any tool"),
      t(lang, "টগল সুইচ দিয়ে টুলস ওয়েবসাইটে দেখানো/লুকানো করুন", "Use the toggle switch to show/hide tools"),
      t(lang, "ড্র্যাগ করে টুলসের ক্রম পরিবর্তন করুন", "Drag to reorder tools display order"),
      t(lang, "Premium টুলস সেট করুন Admin → Subscriptions থেকে", "Set premium tools from Admin → Subscriptions"),
    ],
  },
  {
    title: t(lang, "ব্লগ ম্যানেজমেন্ট", "Blog Management"),
    icon: FileText,
    color: "text-green-400",
    items: [
      t(lang, "Admin → Blog-এ যান — নতুন পোস্ট তৈরি, এডিট বা ডিলিট করুন", "Go to Admin → Blog to create, edit, or delete posts"),
      t(lang, "রিচ টেক্সট এডিটরে Bold, Italic, ইমেজ, লিংক ইত্যাদি যোগ করুন", "Use rich text editor for Bold, Italic, images, links"),
      t(lang, "ফিচারড ইমেজ, ক্যাটাগরি ও ট্যাগ সেট করুন", "Set featured images, categories, and tags"),
      t(lang, "পোস্ট 'Draft' বা 'Published' হিসেবে সংরক্ষণ করুন", "Save posts as 'Draft' or 'Published'"),
      t(lang, "SEO মেটা ট্যাগ অটো-জেনারেট হয় তবে কাস্টমাইজও করা যায়", "SEO meta tags are auto-generated but customizable"),
    ],
  },
  {
    title: t(lang, "সাবস্ক্রিপশন ও প্রিমিয়াম", "Subscription & Premium"),
    icon: Crown,
    color: "text-yellow-400",
    items: [
      t(lang, "Admin → Subscriptions-এ প্ল্যান ও প্রাইসিং ম্যানেজ করুন", "Manage plans and pricing in Admin → Subscriptions"),
      t(lang, "প্ল্যানের নাম, দাম (USD ও BDT), ফিচার এডিট করুন", "Edit plan names, prices (USD & BDT), and features"),
      t(lang, "টুলস প্রিমিয়াম মার্ক করে সাবস্ক্রিপশন বাধ্যতামূলক করুন", "Mark tools as premium to require subscription"),
      t(lang, "পেমেন্ট রিকোয়েস্ট রিভিউ ও অ্যাপ্রুভ/রিজেক্ট করুন", "Review and approve/reject payment requests"),
      t(lang, "পেমেন্ট গেটওয়ে (bKash, Nagad ইত্যাদি) কনফিগার করুন", "Configure payment gateways (bKash, Nagad, etc.)"),
    ],
  },
  {
    title: t(lang, "SEO ম্যানেজমেন্ট", "SEO Management"),
    icon: Search,
    color: "text-purple-400",
    items: [
      t(lang, "Admin → SEO-তে প্রতিটি পেজ ও টুলের মেটা ট্যাগ এডিট করুন", "Edit meta tags for every page and tool in Admin → SEO"),
      t(lang, "কাস্টম টাইটেল, ডেসক্রিপশন, কীওয়ার্ড ও OG ইমেজ সেট করুন", "Set custom titles, descriptions, keywords, OG images"),
      t(lang, "Structured Data (JSON-LD) অটো-জেনারেট হয়", "Structured Data (JSON-LD) is auto-generated"),
      t(lang, "Canonical URL ডুপ্লিকেট কন্টেন্ট সমস্যা প্রতিরোধ করে", "Canonical URLs prevent duplicate content issues"),
      t(lang, "Robots মেটা ট্যাগ সার্চ ইঞ্জিন ইনডেক্সিং নিয়ন্ত্রণ করে", "Robots meta tags control search engine indexing"),
    ],
  },
  {
    title: t(lang, "ইউজার ম্যানেজমেন্ট", "User Management"),
    icon: Users,
    color: "text-red-400",
    items: [
      t(lang, "Admin → Users-এ সকল রেজিস্টার্ড ইউজার দেখুন", "View all registered users in Admin → Users"),
      t(lang, "Admin → Roles-এ এডমিন/মডারেটর রোল অ্যাসাইন করুন", "Assign admin/moderator roles in Admin → Roles"),
      t(lang, "ইউজারদের ডিটেইলস ও সাবস্ক্রিপশন দেখুন", "View user details and subscriptions"),
      t(lang, "রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল এডমিন ফিচার সুরক্ষিত রাখে", "Role-based access control protects admin features"),
    ],
  },
  {
    title: t(lang, "কাস্টম টুলস", "Custom Tools"),
    icon: Upload,
    color: "text-cyan-400",
    items: [
      t(lang, "Admin → Custom Tools-এ HTML-ভিত্তিক টুলস আপলোড করুন", "Upload HTML-based tools in Admin → Custom Tools"),
      t(lang, ".html ফাইল আপলোড করুন অথবা সরাসরি HTML কোড পেস্ট করুন", "Upload .html files or paste HTML content directly"),
      t(lang, "কাস্টম টুলস তাদের নিজস্ব URL ও SEO সেটিংস পায়", "Custom tools get their own URL and SEO settings"),
      t(lang, "ক্যাটাগরি, আইকন, রং ও বর্ণনা সেট করুন", "Set category, icon, color, and description"),
      t(lang, "যেকোনো সময় কাস্টম টুলস Enable/Disable করুন", "Enable/disable custom tools anytime"),
    ],
  },
];

const getGscSteps = (lang: Lang): StepItem[] => [
  { step: 1, title: t(lang, "Google Search Console-এ যান", "Go to Google Search Console"), description: t(lang, "https://search.google.com/search-console ভিজিট করুন এবং আপনার Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন।", "Visit https://search.google.com/search-console and sign in with your Google account."), tip: t(lang, "যে Google অ্যাকাউন্ট দিয়ে সব ওয়েবসাইট ম্যানেজ করতে চান সেটি ব্যবহার করুন।", "Use the Google account you want to manage all your websites from.") },
  { step: 2, title: t(lang, "আপনার সাইট যোগ করুন", "Add Your Property"), description: t(lang, "'Add property' ক্লিক করুন → 'URL prefix' মেথড সিলেক্ট করুন → আপনার পূর্ণ ডোমেইন দিন (যেমন: https://yourdomain.com)।", "Click 'Add property' → Choose 'URL prefix' method → Enter your full domain (e.g., https://yourdomain.com)."), tip: t(lang, "URL prefix মেথড সবচেয়ে সহজ — Domain verification-এ DNS অ্যাক্সেস লাগে।", "URL prefix is easier — Domain verification requires DNS access.") },
  { step: 3, title: t(lang, "HTML Tag ভেরিফিকেশন সিলেক্ট করুন", "Choose HTML Tag Verification"), description: t(lang, "ভেরিফিকেশন মেথড থেকে 'HTML tag' সিলেক্ট করুন। আপনি একটি meta tag দেখতে পাবেন।", "Select 'HTML tag' from verification methods. You'll see a meta tag.") },
  { step: 4, title: t(lang, "Content Value কপি করুন", "Copy the Content Value"), description: t(lang, "শুধু content-এর মান কপি করুন (যেমন: ABC123...) — পুরো meta tag নয়।", "Copy ONLY the content value (e.g., ABC123...) — not the entire meta tag.") },
  { step: 5, title: t(lang, "Admin Panel-এ পেস্ট করুন", "Paste in Admin Panel"), description: t(lang, "Admin → Indexing & Code → Verification Codes ট্যাবে যান। 'Google Verification' ফিল্ডে কোড পেস্ট করুন ও Save করুন।", "Go to Admin → Indexing & Code → Verification Codes tab. Paste the code in 'Google Verification' field and Save.") },
  { step: 6, title: t(lang, "Search Console-এ ভেরিফাই করুন", "Verify in Search Console"), description: t(lang, "Google Search Console-এ ফিরে যান এবং 'Verify' ক্লিক করুন।", "Go back to Google Search Console and click 'Verify'."), tip: t(lang, "ভেরিফিকেশন ব্যর্থ হলে কয়েক মিনিট অপেক্ষা করুন। সাইট পাবলিশ করা আছে কিনা নিশ্চিত করুন।", "If verification fails, wait a few minutes. Make sure your site is published.") },
  { step: 7, title: t(lang, "সাইটম্যাপ সাবমিট করুন", "Submit Your Sitemap"), description: t(lang, "ভেরিফিকেশনের পর Sitemaps → 'Add a new sitemap' → 'sitemap.xml' লিখুন → Submit করুন।", "After verification, go to Sitemaps → 'Add a new sitemap' → Enter 'sitemap.xml' → Submit.") },
];

const getBingSteps = (lang: Lang): StepItem[] => [
  { step: 1, title: t(lang, "Bing Webmaster Tools-এ যান", "Go to Bing Webmaster Tools"), description: t(lang, "https://www.bing.com/webmasters ভিজিট করুন এবং Microsoft অ্যাকাউন্ট দিয়ে সাইন ইন করুন।", "Visit https://www.bing.com/webmasters and sign in with your Microsoft account.") },
  { step: 2, title: t(lang, "সাইট যোগ করুন", "Add Your Site"), description: t(lang, "'Add a site' ক্লিক করুন ও ওয়েবসাইটের URL দিন। Google Search Console থেকেও ইমপোর্ট করতে পারেন।", "Click 'Add a site' and enter your URL. You can also import from Google Search Console.") },
  { step: 3, title: t(lang, "Meta Tag ভেরিফিকেশন সিলেক্ট করুন", "Choose Meta Tag Verification"), description: t(lang, "'HTML Meta Tag' অপশন সিলেক্ট করুন ও content value কপি করুন।", "Select 'HTML Meta Tag' option and copy the content value.") },
  { step: 4, title: t(lang, "Admin Panel-এ পেস্ট করুন", "Paste in Admin Panel"), description: t(lang, "Admin → Indexing & Code → Verification Codes → 'Bing Verification' ফিল্ডে পেস্ট করুন ও Save করুন।", "Go to Admin → Indexing & Code → Verification Codes → Paste in 'Bing Verification' field and Save.") },
  { step: 5, title: t(lang, "ভেরিফাই ও সাইটম্যাপ সাবমিট করুন", "Verify & Submit Sitemap"), description: t(lang, "Bing Webmaster Tools-এ Verify ক্লিক করুন, তারপর সাইটম্যাপ URL সাবমিট করুন।", "Click Verify in Bing Webmaster Tools, then submit your sitemap URL.") },
];

const getYandexSteps = (lang: Lang): StepItem[] => [
  { step: 1, title: t(lang, "Yandex Webmaster-এ যান", "Go to Yandex Webmaster"), description: t(lang, "https://webmaster.yandex.com ভিজিট করুন ও সাইন ইন করুন।", "Visit https://webmaster.yandex.com and sign in.") },
  { step: 2, title: t(lang, "সাইট যোগ করুন", "Add Site"), description: t(lang, "ওয়েবসাইটের URL দিন ও meta tag ভেরিফিকেশন মেথড সিলেক্ট করুন।", "Enter your website URL and select meta tag verification.") },
  { step: 3, title: t(lang, "কোড কপি ও পেস্ট করুন", "Copy & Paste Code"), description: t(lang, "ভেরিফিকেশন কোড কপি করুন ও Admin → Indexing & Code → Yandex Verification ফিল্ডে পেস্ট করুন।", "Copy verification code and paste in Admin → Indexing & Code → Yandex Verification field.") },
  { step: 4, title: t(lang, "ভেরিফাই করুন", "Verify"), description: t(lang, "Yandex Webmaster-এ ভেরিফিকেশন সম্পন্ন করুন ও সাইটম্যাপ সাবমিট করুন।", "Complete verification in Yandex Webmaster and submit sitemap.") },
];

export default function AdminDocs() {
  const [activeTab, setActiveTab] = useState("deploy");
  const [lang, setLang] = useState<Lang>("bn");
  const { settings } = useSiteSettings();
  const domain = settings.site_domain?.trim() || "https://cybervenoms.com";

  const tabs = [
    { id: "deploy", label: t(lang, "ডিপ্লয়মেন্ট", "Deployment"), icon: Upload },
    { id: "gsc", label: "Google", icon: Search },
    { id: "bing", label: "Bing", icon: Globe },
    { id: "yandex", label: "Yandex", icon: Globe },
    { id: "guides", label: t(lang, "এডমিন গাইড", "Admin Guides"), icon: BookOpen },
    { id: "checklist", label: t(lang, "SEO চেকলিস্ট", "SEO Checklist"), icon: CheckCircle },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  const deploySteps = getDeploySteps(lang);
  const hostingDetails = getHostingDetails(lang);
  const troubleshootItems = getTroubleshootItems(lang);
  const adminGuides = getAdminGuides(lang);
  const gscSteps = getGscSteps(lang);
  const bingSteps = getBingSteps(lang);
  const yandexSteps = getYandexSteps(lang);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            {t(lang, "ডকুমেন্টেশন ও গাইড", "Documentation & Guides")}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            {t(lang, "ডিপ্লয়মেন্ট, সার্চ ইঞ্জিন সেটআপ, সাইট ম্যানেজমেন্ট এবং SEO-এর জন্য বিস্তারিত গাইড", "Detailed guides for deployment, search engine setup, site management, and SEO")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
        >
          <Languages className="w-3.5 h-3.5" />
          {lang === "bn" ? "English" : "বাংলা"}
        </Button>
      </div>

      {/* Domain info */}
      <motion.div {...fadeIn(0)}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">{t(lang, "আপনার ডোমেইন", "Your Domain")}</p>
            <p className="text-sm font-mono text-primary truncate">{domain}</p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            <CheckCircle className="w-3 h-3 mr-1" /> {t(lang, "সক্রিয়", "Active")}
          </Badge>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ===== DEPLOYMENT TAB ===== */}
        <TabsContent value="deploy" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  {t(lang, "ডিপ্লয়মেন্ট ও স্ক্রিপ্ট বিতরণ গাইড", "Deployment & Script Distribution Guide")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "ওয়েবসাইট ডিপ্লয়, ডেটাবেজ সেটআপ, এবং স্ক্রিপ্ট বিক্রির জন্য সম্পূর্ণ নির্দেশিকা", "Complete guide for website deployment, database setup, and script distribution")}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Architecture */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" /> {t(lang, "আর্কিটেকচার কিভাবে কাজ করে?", "How Does the Architecture Work?")}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                    {t(lang,
                      "এই প্ল্যাটফর্মটি একটি Frontend-Backend ডিকাপলড আর্কিটেকচারে তৈরি। প্রতিটি ক্রেতা/ব্যবহারকারী একই ফ্রন্টএন্ড কোড (React + Vite) পায়, কিন্তু নিজস্ব Supabase প্রজেক্ট কানেক্ট করে। ফলে:",
                      "This platform uses a Frontend-Backend Decoupled architecture. Every buyer/user gets the same frontend code (React + Vite) but connects their own Supabase project. This means:"
                    )}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {[
                      { icon: Code, text: t(lang, "একই কোড — সবার জন্য", "Same code — for everyone") },
                      { icon: Database, text: t(lang, "আলাদা ডেটাবেজ — প্রতিটি ইন্সট্যান্সের জন্য", "Separate database — for each instance") },
                      { icon: Lock, text: t(lang, "স্বতন্ত্র Auth — নিজস্ব ইউজার সিস্টেম", "Independent Auth — own user system") },
                      { icon: Server, text: t(lang, "নিজস্ব এডমিন — পূর্ণ নিয়ন্ত্রণ", "Own admin — full control") },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/30">
                        <item.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {deploySteps.map((item) => (
                    <StepCard key={item.step} item={item} />
                  ))}
                </div>

                {/* Hosting Details */}
                <div className="mt-4 space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-primary" /> {t(lang, "হোস্টিং অপশন বিস্তারিত", "Hosting Options in Detail")}
                  </h4>
                  {hostingDetails.map((host) => (
                    <div key={host.name} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <HardDrive className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold text-foreground">{host.name}</span>
                        <Badge variant="outline" className="text-[9px]">{host.badge}</Badge>
                      </div>
                      <div className="space-y-1.5 ml-5">
                        {host.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                            <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      {host.code && <CodeBlock code={host.code} />}
                    </div>
                  ))}
                </div>

                {/* Ownership Table */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-primary" /> {t(lang, "মালিকানা কাঠামো", "Ownership Structure")}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      { label: t(lang, "ফ্রন্টএন্ড কোড", "Frontend Code"), shared: true },
                      { label: t(lang, "UI ডিজাইন", "UI Design"), shared: true },
                      { label: t(lang, "ডেটাবেজ", "Database"), shared: false },
                      { label: t(lang, "ইউজার ও Auth", "Users & Auth"), shared: false },
                      { label: t(lang, "এডমিন প্যানেল", "Admin Panel"), shared: false },
                      { label: t(lang, "সাবস্ক্রিপশন", "Subscriptions"), shared: false },
                      { label: t(lang, "সাইট সেটিংস", "Site Settings"), shared: false },
                      { label: t(lang, "ব্লগ কন্টেন্ট", "Blog Content"), shared: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/50">
                        <CheckCircle className={`w-3 h-3 ${item.shared ? "text-blue-400" : "text-green-400"}`} />
                        <span>{item.label}</span>
                        <Badge variant="outline" className="text-[9px] ml-auto">
                          {item.shared ? t(lang, "শেয়ারড", "Shared") : t(lang, "স্বতন্ত্র", "Independent")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="mt-4 p-4 rounded-xl bg-destructive/5 border border-destructive/15">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-destructive">{t(lang, "নিরাপত্তা চেকলিস্ট", "Security Checklist")}</p>
                      <ul className="text-[11px] text-destructive/70 mt-1.5 space-y-1.5">
                        <li>• {t(lang, "ডিফল্ট এডমিন URL (/makuadmingowebs99) অবশ্যই পরিবর্তন করুন", "Change the default admin URL (/makuadmingowebs99)")}</li>
                        <li>• {t(lang, "2FA (Google Authenticator) চালু করুন — Admin → Security", "Enable 2FA (Google Authenticator) — Admin → Security")}</li>
                        <li>• {t(lang, "Supabase service_role key কখনো ফ্রন্টএন্ডে রাখবেন না বা শেয়ার করবেন না", "Never put Supabase service_role key in frontend or share it")}</li>
                        <li>• {t(lang, "Email verification চালু রাখুন — সাইনআপের পর ইমেইল ভেরিফাই ছাড়া লগইন হবে না", "Keep email verification enabled — users can't login without verifying email")}</li>
                        <li>• {t(lang, "শক্তিশালী পাসওয়ার্ড ব্যবহার করুন (বড় হাতের অক্ষর, সংখ্যা, বিশেষ চিহ্ন)", "Use strong passwords (uppercase, numbers, special characters)")}</li>
                        <li>• {t(lang, "HTTPS সার্টিফিকেট সক্রিয় রাখুন", "Keep HTTPS certificate active")}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Files to deliver */}
                <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-primary" /> {t(lang, "ক্রেতাকে যা দিতে হবে", "What to Deliver to the Buyer")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {[
                      { name: "src/", desc: t(lang, "সোর্স কোড", "Source code") },
                      { name: "public/", desc: t(lang, "স্ট্যাটিক অ্যাসেট", "Static assets") },
                      { name: "supabase/", desc: t(lang, "Edge Functions", "Edge Functions") },
                      { name: "database-setup.sql", desc: t(lang, "ডেটাবেজ স্কিমা", "Database schema") },
                      { name: "package.json", desc: t(lang, "ডিপেন্ডেন্সি", "Dependencies") },
                      { name: ".env.example", desc: t(lang, "টেমপ্লেট env ফাইল", "Template env file") },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-background/50">
                        <Code className="w-3 h-3 text-primary shrink-0" />
                        <span className="font-mono font-semibold text-foreground">{item.name}</span>
                        <span className="text-muted-foreground ml-auto">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-2 rounded-lg bg-destructive/5 border border-destructive/10 text-[11px] text-destructive/70">
                    ⚠️ {t(lang, "দিবেন না: .env (আপনার credentials), node_modules/, dist/", "DO NOT include: .env (your credentials), node_modules/, dist/")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div {...fadeIn(1)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  {t(lang, "সমস্যা সমাধান (ট্রাবলশুটিং)", "Troubleshooting")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {troubleshootItems.map((item) => (
                    <div key={item.problem} className="flex items-start gap-2 text-[11px] p-2.5 rounded-lg bg-muted/30">
                      <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">{item.problem}:</span>{" "}
                        <span className="text-muted-foreground">{item.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== GOOGLE TAB ===== */}
        <TabsContent value="gsc" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    Google Search Console Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      Open GSC <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "Google Search Console আপনার সাইটকে Google-এ মনিটর ও অপ্টিমাইজ করতে সাহায্য করে।", "Google Search Console helps you monitor and optimize your site in Google search.")}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {gscSteps.map((item) => <StepCard key={item.step} item={item} />)}
                <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-destructive">{t(lang, "সাধারণ সমস্যা", "Common Issues")}</p>
                      <ul className="text-[11px] text-destructive/70 mt-1 space-y-1">
                        <li>• {t(lang, "ভেরিফাই করার আগে সাইট পাবলিশ করা আছে কিনা নিশ্চিত করুন", "Make sure your site is published before verifying")}</li>
                        <li>• {t(lang, "পুরো meta tag নয়, শুধু content VALUE পেস্ট করুন", "Only paste the content VALUE, not the full meta tag")}</li>
                        <li>• {t(lang, "DNS propagation-এ ৪৮ ঘণ্টা পর্যন্ত সময় লাগতে পারে", "DNS propagation may take up to 48 hours")}</li>
                        <li>• {t(lang, `নিশ্চিত করুন sitemap.xml অ্যাক্সেসযোগ্য: ${domain}/sitemap.xml`, `Ensure sitemap.xml is accessible at ${domain}/sitemap.xml`)}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeIn(1)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  Google Analytics Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StepCard item={{ step: 1, title: t(lang, "GA4 Property তৈরি করুন", "Create a GA4 Property"), description: t(lang, "https://analytics.google.com → Admin → Create Property। সেটআপ উইজার্ড অনুসরণ করুন।", "Go to https://analytics.google.com → Admin → Create Property. Follow the setup wizard.") }} />
                <StepCard item={{ step: 2, title: t(lang, "Measurement ID নিন", "Get Your Measurement ID"), description: t(lang, "Property তৈরির পর Data Streams → Web-এ যান। আপনার ID দেখতে G-XXXXXXXXXX এরকম হবে।", "After creating, go to Data Streams → Web. Your ID looks like G-XXXXXXXXXX.") }} />
                <StepCard item={{ step: 3, title: t(lang, "Admin Panel-এ যোগ করুন", "Add to Admin Panel"), description: t(lang, "Admin → Indexing & Code → Analytics ট্যাবে GA4 Measurement ID পেস্ট করুন ও সেভ করুন।", "Go to Admin → Indexing & Code → Analytics tab. Paste your GA4 Measurement ID and save."), tip: t(lang, "Google Tag Manager ব্যবহার করলে GTM-XXXXXXX ফরম্যাটের ID দিন।", "For Google Tag Manager, use the GTM-XXXXXXX format ID.") }} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== BING TAB ===== */}
        <TabsContent value="bing" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Bing Webmaster Tools Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">
                      Open Bing <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "Bing Webmaster Tools আপনার সাইটকে Bing সার্চে অপ্টিমাইজ করতে সাহায্য করে। Google Search Console থেকেও ইমপোর্ট করতে পারেন।", "Bing Webmaster Tools helps optimize your site for Bing search. You can also import from Google Search Console.")}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {bingSteps.map((item) => <StepCard key={item.step} item={item} />)}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== YANDEX TAB ===== */}
        <TabsContent value="yandex" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-red-400" />
                    Yandex Webmaster Setup
                  </CardTitle>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" asChild>
                    <a href="https://webmaster.yandex.com" target="_blank" rel="noopener noreferrer">
                      Open Yandex <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {yandexSteps.map((item) => <StepCard key={item.step} item={item} />)}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== ADMIN GUIDES TAB ===== */}
        <TabsContent value="guides" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminGuides.map((guide, i) => (
              <motion.div key={guide.title} {...fadeIn(i)}>
                <Card className="border-border/50 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <guide.icon className={`w-4 h-4 ${guide.color}`} />
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ArrowRight className="w-3 h-3 text-primary/50 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* ===== SEO CHECKLIST TAB ===== */}
        <TabsContent value="checklist" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {t(lang, "SEO অপ্টিমাইজেশন চেকলিস্ট", "SEO Optimization Checklist")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "আপনার ওয়েবসাইট সার্চ ইঞ্জিনের জন্য সম্পূর্ণ অপ্টিমাইজড কিনা নিশ্চিত করুন", "Ensure your website is fully optimized for search engines")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: t(lang, "টেকনিক্যাল SEO", "Technical SEO"), items: [
                      { text: t(lang, "Sitemap.xml Google ও Bing-এ সাবমিট করা হয়েছে", "Sitemap.xml submitted to Google & Bing"), done: true },
                      { text: t(lang, "Robots.txt সঠিকভাবে কনফিগার করা হয়েছে", "Robots.txt configured correctly"), done: true },
                      { text: t(lang, "SSL সার্টিফিকেট (HTTPS) সক্রিয়", "SSL certificate active (HTTPS)"), done: true },
                      { text: t(lang, "সকল পেজে ইউনিক মেটা টাইটেল আছে", "All pages have unique meta titles"), done: true },
                      { text: t(lang, "সকল পেজে মেটা ডেসক্রিপশন আছে", "All pages have meta descriptions"), done: true },
                      { text: t(lang, "Canonical URL সেট করা আছে", "Canonical URLs set for all pages"), done: true },
                      { text: t(lang, "Open Graph ট্যাগ সোশ্যাল শেয়ারিং-এর জন্য", "Open Graph tags for social sharing"), done: true },
                      { text: t(lang, "Structured Data (JSON-LD) যোগ করা হয়েছে", "Structured data (JSON-LD) added"), done: true },
                    ]},
                    { category: t(lang, "কন্টেন্ট SEO", "Content SEO"), items: [
                      { text: t(lang, "প্রতিটি টুলের ইউনিক ডেসক্রিপশন আছে", "Each tool has a unique description"), done: true },
                      { text: t(lang, "ব্লগ পোস্টে ক্যাটাগরি ও ট্যাগ আছে", "Blog posts have categories and tags"), done: true },
                      { text: t(lang, "ইমেজে alt text আছে", "Images have alt text"), done: false },
                      { text: t(lang, "পেজগুলোর মধ্যে ইন্টারনাল লিংকিং আছে", "Internal linking between pages"), done: true },
                      { text: t(lang, "টুলসে Focus Keyword সেট করা আছে", "Focus keywords set for tools"), done: true },
                    ]},
                    { category: t(lang, "পারফরম্যান্স", "Performance"), items: [
                      { text: t(lang, "ইমেজে Lazy Loading সক্রিয়", "Lazy loading for images"), done: true },
                      { text: t(lang, "Code Splitting (Lazy Routes) সক্রিয়", "Code splitting (lazy routes)"), done: true },
                      { text: t(lang, "CSS ও JavaScript Minified", "Minified CSS and JavaScript"), done: true },
                      { text: t(lang, "মোবাইলের জন্য Responsive Design", "Responsive design for mobile"), done: true },
                    ]},
                    { category: t(lang, "অ্যানালিটিক্স ও মনিটরিং", "Analytics & Monitoring"), items: [
                      { text: t(lang, "Google Search Console কানেক্ট করা হয়েছে", "Google Search Console connected"), done: false },
                      { text: t(lang, "Google Analytics কনফিগার করা হয়েছে", "Google Analytics configured"), done: false },
                      { text: t(lang, "Bing Webmaster Tools কানেক্ট করা হয়েছে", "Bing Webmaster Tools connected"), done: false },
                    ]},
                  ].map((section) => (
                    <div key={section.category}>
                      <h4 className="text-xs font-bold text-foreground mb-2">{section.category}</h4>
                      <div className="space-y-1.5">
                        {section.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                              {item.done ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                            </div>
                            <span className={item.done ? "text-muted-foreground" : "text-foreground font-medium"}>{item.text}</span>
                            {!item.done && <Badge variant="outline" className="text-[9px] ml-auto">{t(lang, "বাকি", "Pending")}</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== FAQ TAB ===== */}
        <TabsContent value="faq" className="space-y-4 mt-4">
          <motion.div {...fadeIn(0)}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  {t(lang, "সাধারণ প্রশ্ন-উত্তর (FAQ)", "Frequently Asked Questions (FAQ)")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t(lang, "এই প্ল্যাটফর্ম সম্পর্কে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্ন ও উত্তর", "Most commonly asked questions about this platform")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      q: t(lang, "একটি সাইটে পরিবর্তন করলে কি অন্য সাইটেও পরিবর্তন হবে?", "Will changes on one site affect another site?"),
                      a: t(lang, "না! প্রতিটি সাইটের নিজস্ব Supabase ডেটাবেজ আছে। একটি সাইটে করা পরিবর্তন ১০০% আলাদা এবং অন্য কোনো সাইটকে প্রভাবিত করবে না।", "No! Each site has its own Supabase database. Changes are 100% isolated and won't affect any other site."),
                    },
                    {
                      q: t(lang, "প্ল্যাটফর্মে কতগুলো টুলস আছে?", "How many tools does the platform include?"),
                      a: t(lang, "২১০+ বিল্ট-ইন টুলস আছে ১২+ ক্যাটাগরিতে। এছাড়াও Admin Panel থেকে কাস্টম HTML টুলস আপলোড করা যায়।", "210+ built-in tools across 12+ categories, plus custom HTML tool upload support from the Admin Panel."),
                    },
                    {
                      q: t(lang, "ক্রেতারা কি নিজের টুলস যোগ করতে পারবে?", "Can buyers add their own tools?"),
                      a: t(lang, "হ্যাঁ! Admin Panel → Custom Tools থেকে .html ফাইল আপলোড করে বা সরাসরি HTML কোড পেস্ট করে নতুন টুলস যোগ করা যায়। প্রতিটি কাস্টম টুলের নিজস্ব URL, SEO সেটিংস ও ক্যাটাগরি থাকবে।", "Yes! Upload .html files or paste HTML code directly from Admin → Custom Tools. Each custom tool gets its own URL, SEO settings, and category."),
                    },
                    {
                      q: t(lang, "কোন হোস্টিং-এ ডিপ্লয় করা ভালো?", "Which hosting is best for deployment?"),
                      a: t(lang, "Vercel সবচেয়ে সহজ এবং রেকমেন্ডেড — ফ্রি প্ল্যান আছে, GitHub ইন্টিগ্রেশন আছে, অটো-ডিপ্লয় আছে। Netlify-ও ভালো অপশন। cPanel/Shared Hosting-এও চলবে তবে .htaccess কনফিগার করতে হবে।", "Vercel is the easiest and recommended — has a free plan, GitHub integration, and auto-deploy. Netlify is also a good option. cPanel/Shared Hosting works too but requires .htaccess configuration."),
                    },
                    {
                      q: t(lang, "সাবস্ক্রিপশন/পেমেন্ট সিস্টেম কিভাবে কাজ করে?", "How does the subscription/payment system work?"),
                      a: t(lang, "Admin Panel → Subscriptions থেকে প্ল্যান তৈরি করুন (USD ও BDT দামসহ)। পেমেন্ট গেটওয়ে (bKash, Nagad ইত্যাদি) সেটআপ করুন। ইউজাররা পেমেন্ট করে ট্রানজেকশন ID দিলে এডমিন ম্যানুয়ালি অ্যাপ্রুভ করবেন।", "Create plans (with USD & BDT prices) from Admin → Subscriptions. Set up payment gateways (bKash, Nagad, etc.). When users pay and submit transaction IDs, admin manually approves them."),
                    },
                    {
                      q: t(lang, "প্রিমিয়াম টুলস কিভাবে সেটআপ করবো?", "How do I set up premium tools?"),
                      a: t(lang, "Admin → Subscriptions → Premium Tools সেকশনে যান। যে টুলসগুলো প্রিমিয়াম করতে চান সেগুলো সিলেক্ট করুন এবং মিনিমাম প্ল্যান সেট করুন। প্রিমিয়াম টুলসে স্বয়ংক্রিয়ভাবে Premium Badge দেখাবে।", "Go to Admin → Subscriptions → Premium Tools section. Select tools you want to make premium and set the minimum plan. Premium tools will automatically show a Premium Badge."),
                    },
                    {
                      q: t(lang, "SEO কিভাবে ম্যানেজ করবো?", "How do I manage SEO?"),
                      a: t(lang, "Admin → SEO-তে প্রতিটি পেজ ও টুলের মেটা টাইটেল, ডেসক্রিপশন, কীওয়ার্ড, OG ইমেজ এডিট করতে পারবেন। Structured Data (JSON-LD) অটো-জেনারেট হয়। সার্চ ইঞ্জিনে ইনডেক্স করতে Admin → Indexing & Code থেকে ভেরিফিকেশন কোড দিন।", "Edit meta titles, descriptions, keywords, OG images for every page and tool in Admin → SEO. Structured Data (JSON-LD) is auto-generated. For search engine indexing, add verification codes from Admin → Indexing & Code."),
                    },
                    {
                      q: t(lang, "ব্লগ সিস্টেম কি কাস্টমাইজেবল?", "Is the blog system customizable?"),
                      a: t(lang, "হ্যাঁ! Admin → Blog থেকে পোস্ট তৈরি, এডিট ও ডিলিট করতে পারবেন। রিচ টেক্সট এডিটর (Bold, Italic, ইমেজ, লিংক, হেডিং) আছে। ফিচারড ইমেজ, ক্যাটাগরি, ট্যাগ সব কাস্টমাইজ করা যায়।", "Yes! Create, edit, and delete posts from Admin → Blog. Rich text editor (Bold, Italic, images, links, headings) is included. Featured images, categories, and tags are all customizable."),
                    },
                    {
                      q: t(lang, "2FA / Two-Factor Authentication কিভাবে চালু করবো?", "How do I enable 2FA / Two-Factor Authentication?"),
                      a: t(lang, "Admin → Security-তে যান → 'Enable 2FA' ক্লিক করুন → Google Authenticator অ্যাপ দিয়ে QR কোড স্ক্যান করুন → 6-ডিজিট কোড দিয়ে ভেরিফাই করুন। এরপর থেকে প্রতিবার এডমিন লগইনে OTP লাগবে।", "Go to Admin → Security → Click 'Enable 2FA' → Scan QR code with Google Authenticator app → Verify with 6-digit code. After this, OTP will be required for every admin login."),
                    },
                    {
                      q: t(lang, "এডমিন URL পরিবর্তন করা কি জরুরি?", "Is it important to change the admin URL?"),
                      a: t(lang, "অবশ্যই! ডিফল্ট URL (/makuadm******) সবাই জানে। Admin → Settings → Security থেকে এটি পরিবর্তন করুন। এটি brute-force অ্যাটাক থেকে সুরক্ষিত রাখবে।", "Absolutely! The default URL (/makuadm******) is known to everyone. Change it from Admin → Settings → Security. This protects against brute-force attacks."),
                    },
                    {
                      q: t(lang, "Edge Functions ছাড়া কি ওয়েবসাইট চলবে?", "Will the website work without Edge Functions?"),
                      a: t(lang, "হ্যাঁ, মূল ওয়েবসাইট ও বেশিরভাগ ফিচার চলবে। তবে কিছু এডমিন ফিচার (ইউজার ব্যান/আনব্যান, টেম্প মেইল, টেম্প নম্বর, TOTP ম্যানেজমেন্ট) Edge Functions ছাড়া কাজ করবে না।", "Yes, the main website and most features will work. However, some admin features (user ban/unban, temp mail, temp number, TOTP management) won't work without Edge Functions."),
                    },
                    {
                      q: t(lang, "সাইটের লোগো ও ফেভিকন কিভাবে পরিবর্তন করবো?", "How do I change the site logo and favicon?"),
                      a: t(lang, "Admin → Settings → General ট্যাবে যান। সেখানে লোগো ও ফেভিকন আপলোড করার অপশন পাবেন। ইমেজ আপলোড করলে তা admin-uploads বাকেটে সংরক্ষিত হবে এবং পুরো সাইটে আপডেট হবে।", "Go to Admin → Settings → General tab. You'll find options to upload logo and favicon. Uploaded images are stored in the admin-uploads bucket and update across the entire site."),
                    },
                  ].map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
                      <summary className="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-muted/40 transition-colors list-none">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                        </div>
                        <span className="text-xs font-semibold text-foreground flex-1">{faq.q}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-3.5 pb-3.5 pt-0 ml-9">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ToolCatalogProvider } from "@/contexts/ToolCatalogContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { CodeInjector } from "@/components/CodeInjector";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminTools = lazy(() => import("./pages/admin/AdminTools"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSecurity = lazy(() => import("./pages/admin/AdminSecurity"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminAds = lazy(() => import("./pages/admin/AdminAds"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminCustomTools = lazy(() => import("./pages/admin/AdminCustomTools"));
const AdminSubscriptions = lazy(() => import("./pages/admin/AdminSubscriptions"));
const AdminIndexing = lazy(() => import("./pages/admin/AdminIndexing"));
const AdminDocs = lazy(() => import("./pages/admin/AdminDocs"));
import { AdminSlugChecker } from "@/components/AdminRouteWrapper";
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CustomToolPage = lazy(() => import("./pages/tools/CustomToolPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

// Tools
const InternetSpeedTester = lazy(() => import("./pages/tools/InternetSpeedTester"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const QrCodeMaker = lazy(() => import("./pages/tools/QrCodeMaker"));
const QrCodeScanner = lazy(() => import("./pages/tools/QrCodeScanner"));
const IpAddressLookup = lazy(() => import("./pages/tools/IpAddressLookup"));
const WhatsAppLinkGenerator = lazy(() => import("./pages/tools/WhatsAppLinkGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));
const BarcodeScanner = lazy(() => import("./pages/tools/BarcodeScanner"));
const UrlShortener = lazy(() => import("./pages/tools/UrlShortener"));
const TempNumber = lazy(() => import("./pages/tools/TempNumber"));
const TempMail = lazy(() => import("./pages/tools/TempMail"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const BinChecker = lazy(() => import("./pages/tools/BinChecker"));
const IPBlacklistChecker = lazy(() => import("./pages/tools/IPBlacklistChecker"));
const RandomNameGenerator = lazy(() => import("./pages/tools/RandomNameGenerator"));
const RandomAddressGenerator = lazy(() => import("./pages/tools/RandomAddressGenerator"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const HashDecoder = lazy(() => import("./pages/tools/HashDecoder"));
const EncryptionTool = lazy(() => import("./pages/tools/TextEncryption"));
const WhoisLookup = lazy(() => import("./pages/tools/WhoisLookup"));
const TypingTest = lazy(() => import("./pages/tools/TypingTest"));
const StudentIdCard = lazy(() => import("./pages/tools/StudentIdCard"));
const FacebookIdCard = lazy(() => import("./pages/tools/FacebookIdCard"));

// New Tools
const WordCounter = lazy(() => import("./pages/tools/WordCounter"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const Base64Tool = lazy(() => import("./pages/tools/Base64Tool"));
const LoremIpsum = lazy(() => import("./pages/tools/LoremIpsum"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const BmiCalculator = lazy(() => import("./pages/tools/BmiCalculator"));
const MarkdownPreview = lazy(() => import("./pages/tools/MarkdownPreview"));
const UuidGenerator = lazy(() => import("./pages/tools/UuidGenerator"));
const CountdownTimer = lazy(() => import("./pages/tools/CountdownTimer"));
const GradientGenerator = lazy(() => import("./pages/tools/GradientGenerator"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const TextDiff = lazy(() => import("./pages/tools/TextDiff"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const TextEncoderDecoder = lazy(() => import("./pages/tools/TextEncoderDecoder"));
const ImageToBase64 = lazy(() => import("./pages/tools/ImageToBase64"));
const CyberChef = lazy(() => import("./pages/tools/CyberChef"));
const YouTubeIdCard = lazy(() => import("./pages/tools/YouTubeIdCard"));
const DnsLookup = lazy(() => import("./pages/tools/DnsLookup"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const CronGenerator = lazy(() => import("./pages/tools/CronGenerator"));
const HttpStatusChecker = lazy(() => import("./pages/tools/HttpStatusChecker"));
const UserAgentParser = lazy(() => import("./pages/tools/UserAgentParser"));
const ChmodCalculator = lazy(() => import("./pages/tools/ChmodCalculator"));
const PortScanner = lazy(() => import("./pages/tools/PortScanner"));
const SslChecker = lazy(() => import("./pages/tools/SslChecker"));
const HtmlCssJsRunner = lazy(() => import("./pages/tools/HtmlCssJsRunner"));
const CcChecker = lazy(() => import("./pages/tools/CcChecker"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <SiteSettingsProvider>
          <ToolCatalogProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <CodeInjector />
              <BrowserRouter>
                <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Suspense fallback={<Loading />}><ToolsPage /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<Loading />}><AuthPage /></Suspense>} />
            <Route path="/favorites" element={<Suspense fallback={<Loading />}><FavoritesPage /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<Loading />}><ProfilePage /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<Loading />}><BlogPage /></Suspense>} />
            <Route path="/blog/:slug" element={<Suspense fallback={<Loading />}><BlogPostPage /></Suspense>} />
            <Route path="/policy" element={<Suspense fallback={<Loading />}><PolicyPage /></Suspense>} />
            <Route path="/categories" element={<Suspense fallback={<Loading />}><CategoriesPage /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<Loading />}><AboutPage /></Suspense>} />
            <Route path="/faq" element={<Suspense fallback={<Loading />}><FAQPage /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<Loading />}><PricingPage /></Suspense>} />
            <Route path="/tools/custom/:slug" element={<Suspense fallback={<Loading />}><CustomToolPage /></Suspense>} />
            {/* Tools */}
            <Route path="/tools/internet-speed-tester" element={<InternetSpeedTester />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/qr-code-maker" element={<QrCodeMaker />} />
            <Route path="/tools/qr-code-scanner" element={<QrCodeScanner />} />
            <Route path="/tools/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/whatsapp-link-generator" element={<WhatsAppLinkGenerator />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/barcode-scanner" element={<BarcodeScanner />} />
            <Route path="/tools/url-shortener" element={<UrlShortener />} />
            <Route path="/tools/temp-number" element={<TempNumber />} />
            <Route path="/tools/temp-mail" element={<TempMail />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/bin-checker" element={<BinChecker />} />
            <Route path="/tools/ip-blacklist-checker" element={<IPBlacklistChecker />} />
            <Route path="/tools/random-name-generator" element={<RandomNameGenerator />} />
            <Route path="/tools/random-address-generator" element={<RandomAddressGenerator />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/hash-decoder" element={<HashDecoder />} />
            <Route path="/tools/encryption-tool" element={<EncryptionTool />} />
            <Route path="/tools/whois-lookup" element={<WhoisLookup />} />
            <Route path="/tools/typing-test" element={<TypingTest />} />
            <Route path="/tools/student-id-card" element={<StudentIdCard />} />
            <Route path="/tools/facebook-id-card" element={<FacebookIdCard />} />
            {/* New Tools */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64-tool" element={<Base64Tool />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/markdown-preview" element={<MarkdownPreview />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/countdown-timer" element={<CountdownTimer />} />
            <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
            <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/text-encoder-decoder" element={<TextEncoderDecoder />} />
            <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/cyber-chef" element={<CyberChef />} />
            <Route path="/tools/youtube-id-card" element={<YouTubeIdCard />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/cron-generator" element={<CronGenerator />} />
            <Route path="/tools/http-status-checker" element={<HttpStatusChecker />} />
            <Route path="/tools/user-agent-parser" element={<UserAgentParser />} />
            <Route path="/tools/chmod-calculator" element={<ChmodCalculator />} />
            <Route path="/tools/port-scanner" element={<PortScanner />} />
            <Route path="/tools/ssl-checker" element={<SslChecker />} />
            <Route path="/tools/dns-lookup" element={<DnsLookup />} />
            <Route path="/tools/html-css-js-runner" element={<HtmlCssJsRunner />} />
            <Route path="/tools/cc-checker" element={<CcChecker />} />
            {/* Admin Panel - Dynamic Slug */}
            <Route path="/:adminSlug" element={<AdminSlugChecker />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="custom-tools" element={<AdminCustomTools />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="indexing" element={<AdminIndexing />} />
              <Route path="docs" element={<AdminDocs />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
          </ToolCatalogProvider>
        </SiteSettingsProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

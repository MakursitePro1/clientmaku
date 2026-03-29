import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
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
import { AdminSlugChecker } from "@/components/AdminRouteWrapper";
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CustomToolPage = lazy(() => import("./pages/tools/CustomToolPage"));

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            {/* Admin Panel - Dynamic Slug */}
            <Route path="/:adminSlug" element={<AdminSlugChecker />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="seo" element={<AdminSEO />} />
              <Route path="custom-tools" element={<AdminCustomTools />} />
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
    </SiteSettingsProvider>
    </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

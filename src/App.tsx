import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const InternetSpeedTester = lazy(() => import("./pages/tools/InternetSpeedTester"));
const CourierFraudChecker = lazy(() => import("./pages/tools/CourierFraudChecker"));
const BoardResultsChecker = lazy(() => import("./pages/tools/BoardResultsChecker"));
const ApiTester = lazy(() => import("./pages/tools/ApiTester"));
const BdTrainInfo = lazy(() => import("./pages/tools/BdTrainInfo"));
const ImageToBase64 = lazy(() => import("./pages/tools/ImageToBase64"));
const EmojiPicker = lazy(() => import("./pages/tools/EmojiPicker"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const TextDiffChecker = lazy(() => import("./pages/tools/TextDiffChecker"));
const UrlParser = lazy(() => import("./pages/tools/UrlParser"));
const TypingTest = lazy(() => import("./pages/tools/TypingTest"));
const LoremIpsumGenerator = lazy(() => import("./pages/tools/LoremIpsumGenerator"));
const OnlineImageEditor = lazy(() => import("./pages/tools/OnlineImageEditor"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));
const BanglaLogoMaker = lazy(() => import("./pages/tools/BanglaLogoMaker"));
const BanglaToBanglish = lazy(() => import("./pages/tools/BanglaToBanglish"));
const BanglishToBangla = lazy(() => import("./pages/tools/BanglishToBangla"));
const BdixServerTester = lazy(() => import("./pages/tools/BdixServerTester"));
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const PhotoFilter = lazy(() => import("./pages/tools/PhotoFilter"));
const QrCodeMaker = lazy(() => import("./pages/tools/QrCodeMaker"));
const QrCodeScanner = lazy(() => import("./pages/tools/QrCodeScanner"));
const FakeBdOldNid = lazy(() => import("./pages/tools/FakeBdOldNid"));
const FacebookIdCard = lazy(() => import("./pages/tools/FacebookIdCard"));
const FakeBdSmartNid = lazy(() => import("./pages/tools/FakeBdSmartNid"));
const GeminiWatermarkRemover = lazy(() => import("./pages/tools/GeminiWatermarkRemover"));
const FakePakCnic = lazy(() => import("./pages/tools/FakePakCnic"));
const StudentIdCard = lazy(() => import("./pages/tools/StudentIdCard"));
const WebsiteScreenshot = lazy(() => import("./pages/tools/WebsiteScreenshot"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const HtmlToPdf = lazy(() => import("./pages/tools/HtmlToPdf"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const Base64EncoderDecoder = lazy(() => import("./pages/tools/Base64EncoderDecoder"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools/internet-speed-tester" element={<InternetSpeedTester />} />
            <Route path="/tools/courier-fraud-checker" element={<CourierFraudChecker />} />
            <Route path="/tools/board-results-checker" element={<BoardResultsChecker />} />
            <Route path="/tools/api-tester" element={<ApiTester />} />
            <Route path="/tools/bd-train-info" element={<BdTrainInfo />} />
            <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="/tools/url-parser" element={<UrlParser />} />
            <Route path="/tools/typing-test" element={<TypingTest />} />
            <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/online-image-editor" element={<OnlineImageEditor />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/bangla-logo-maker" element={<BanglaLogoMaker />} />
            <Route path="/tools/bangla-to-banglish" element={<BanglaToBanglish />} />
            <Route path="/tools/banglish-to-bangla" element={<BanglishToBangla />} />
            <Route path="/tools/bdix-server-tester" element={<BdixServerTester />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/photo-filter" element={<PhotoFilter />} />
            <Route path="/tools/qr-code-maker" element={<QrCodeMaker />} />
            <Route path="/tools/qr-code-scanner" element={<QrCodeScanner />} />
            <Route path="/tools/fake-bd-old-nid" element={<FakeBdOldNid />} />
            <Route path="/tools/facebook-id-card" element={<FacebookIdCard />} />
            <Route path="/tools/fake-bd-smart-nid" element={<FakeBdSmartNid />} />
            <Route path="/tools/gemini-watermark-remover" element={<GeminiWatermarkRemover />} />
            <Route path="/tools/fake-pak-cnic" element={<FakePakCnic />} />
            <Route path="/tools/student-id-card" element={<StudentIdCard />} />
            <Route path="/tools/website-screenshot" element={<WebsiteScreenshot />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

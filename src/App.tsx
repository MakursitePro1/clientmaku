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
const MarkdownEditor = lazy(() => import("./pages/tools/MarkdownEditor"));
const CssMinifier = lazy(() => import("./pages/tools/CssMinifier"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
// New 20 tools
const WordCounter = lazy(() => import("./pages/tools/WordCounter"));
const BmiCalculator = lazy(() => import("./pages/tools/BmiCalculator"));
const PercentageCalculator = lazy(() => import("./pages/tools/PercentageCalculator"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const TipCalculator = lazy(() => import("./pages/tools/TipCalculator"));
const StopwatchTimer = lazy(() => import("./pages/tools/StopwatchTimer"));
const Notepad = lazy(() => import("./pages/tools/Notepad"));
const TodoList = lazy(() => import("./pages/tools/TodoList"));
const PomodoroTimer = lazy(() => import("./pages/tools/PomodoroTimer"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const TextToSpeech = lazy(() => import("./pages/tools/TextToSpeech"));
const RandomNumberGenerator = lazy(() => import("./pages/tools/RandomNumberGenerator"));
const FlipCoin = lazy(() => import("./pages/tools/FlipCoin"));
const DiceRoller = lazy(() => import("./pages/tools/DiceRoller"));
const ElectricityCalculator = lazy(() => import("./pages/tools/ElectricityCalculator"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const CurrencyConverter = lazy(() => import("./pages/tools/CurrencyConverter"));
const TextReplacer = lazy(() => import("./pages/tools/TextReplacer"));
const DiscountCalculator = lazy(() => import("./pages/tools/DiscountCalculator"));
const IpAddressLookup = lazy(() => import("./pages/tools/IpAddressLookup"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const FaviconGenerator = lazy(() => import("./pages/tools/FaviconGenerator"));
const SlugGenerator = lazy(() => import("./pages/tools/SlugGenerator"));
const JsonToCsv = lazy(() => import("./pages/tools/JsonToCsv"));
const ColorPaletteGenerator = lazy(() => import("./pages/tools/ColorPaletteGenerator"));
const RegexCheatSheet = lazy(() => import("./pages/tools/RegexCheatSheet"));
const CharacterMap = lazy(() => import("./pages/tools/CharacterMap"));
const PdfMerger = lazy(() => import("./pages/tools/PdfMerger"));
const HtmlEntityConverter = lazy(() => import("./pages/tools/HtmlEntityConverter"));
const ScreenResolutionChecker = lazy(() => import("./pages/tools/ScreenResolutionChecker"));
const TextToHandwriting = lazy(() => import("./pages/tools/TextToHandwriting"));
const WhatsAppLinkGenerator = lazy(() => import("./pages/tools/WhatsAppLinkGenerator"));
const ColorBlindnessSimulator = lazy(() => import("./pages/tools/ColorBlindnessSimulator"));
const CrontabGenerator = lazy(() => import("./pages/tools/CrontabGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));
const PrivacyPolicyGenerator = lazy(() => import("./pages/tools/PrivacyPolicyGenerator"));
const UrlShortener = lazy(() => import("./pages/tools/UrlShortener"));
const TextToBinary = lazy(() => import("./pages/tools/TextToBinary"));
const JsonToYaml = lazy(() => import("./pages/tools/JsonToYaml"));
const HtmlPreview = lazy(() => import("./pages/tools/HtmlPreview"));
const CsvViewer = lazy(() => import("./pages/tools/CsvViewer"));
const ImageColorExtractor = lazy(() => import("./pages/tools/ImageColorExtractor"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const PasswordStrengthChecker = lazy(() => import("./pages/tools/PasswordStrengthChecker"));
const EmailValidator = lazy(() => import("./pages/tools/EmailValidator"));
const TextToMorse = lazy(() => import("./pages/tools/TextToMorse"));
const HexEditor = lazy(() => import("./pages/tools/HexEditor"));
const TextEncryption = lazy(() => import("./pages/tools/TextEncryption"));

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
            <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tools/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            {/* New 20 tools */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/stopwatch-timer" element={<StopwatchTimer />} />
            <Route path="/tools/notepad" element={<Notepad />} />
            <Route path="/tools/todo-list" element={<TodoList />} />
            <Route path="/tools/pomodoro-timer" element={<PomodoroTimer />} />
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
            <Route path="/tools/random-number" element={<RandomNumberGenerator />} />
            <Route path="/tools/flip-coin" element={<FlipCoin />} />
            <Route path="/tools/dice-roller" element={<DiceRoller />} />
            <Route path="/tools/electricity-calculator" element={<ElectricityCalculator />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/text-replacer" element={<TextReplacer />} />
            <Route path="/tools/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/tools/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
            <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/slug-generator" element={<SlugGenerator />} />
            <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
            <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
            <Route path="/tools/regex-cheat-sheet" element={<RegexCheatSheet />} />
            <Route path="/tools/character-map" element={<CharacterMap />} />
            <Route path="/tools/pdf-merger" element={<PdfMerger />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
const ToolsPage = lazy(() => import("./pages/ToolsPage"));

// Utility Tools
const InternetSpeedTester = lazy(() => import("./pages/tools/InternetSpeedTester"));
const CourierFraudChecker = lazy(() => import("./pages/tools/CourierFraudChecker"));
const BoardResultsChecker = lazy(() => import("./pages/tools/BoardResultsChecker"));
const BdTrainInfo = lazy(() => import("./pages/tools/BdTrainInfo"));
const AgeCalculator = lazy(() => import("./pages/tools/AgeCalculator"));
const PasswordGenerator = lazy(() => import("./pages/tools/PasswordGenerator"));
const QrCodeMaker = lazy(() => import("./pages/tools/QrCodeMaker"));
const QrCodeScanner = lazy(() => import("./pages/tools/QrCodeScanner"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const BmiCalculator = lazy(() => import("./pages/tools/BmiCalculator"));
const PercentageCalculator = lazy(() => import("./pages/tools/PercentageCalculator"));
const StopwatchTimer = lazy(() => import("./pages/tools/StopwatchTimer"));
const PomodoroTimer = lazy(() => import("./pages/tools/PomodoroTimer"));
const RandomNumberGenerator = lazy(() => import("./pages/tools/RandomNumberGenerator"));
const FlipCoin = lazy(() => import("./pages/tools/FlipCoin"));
const DiceRoller = lazy(() => import("./pages/tools/DiceRoller"));
const ElectricityCalculator = lazy(() => import("./pages/tools/ElectricityCalculator"));
const DiscountCalculator = lazy(() => import("./pages/tools/DiscountCalculator"));
const CurrencyConverter = lazy(() => import("./pages/tools/CurrencyConverter"));
const IpAddressLookup = lazy(() => import("./pages/tools/IpAddressLookup"));
const ScreenResolutionChecker = lazy(() => import("./pages/tools/ScreenResolutionChecker"));
const WhatsAppLinkGenerator = lazy(() => import("./pages/tools/WhatsAppLinkGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));
const UrlShortener = lazy(() => import("./pages/tools/UrlShortener"));
const PasswordStrengthChecker = lazy(() => import("./pages/tools/PasswordStrengthChecker"));
const EmailValidator = lazy(() => import("./pages/tools/EmailValidator"));
const ColorMixer = lazy(() => import("./pages/tools/ColorMixer"));
const DomainNameGenerator = lazy(() => import("./pages/tools/DomainNameGenerator"));
const CountdownTimer = lazy(() => import("./pages/tools/CountdownTimer"));
const TimeZoneConverter = lazy(() => import("./pages/tools/TimeZoneConverter"));
const DateDiffCalculator = lazy(() => import("./pages/tools/DateDiffCalculator"));
const RomanNumeralConverter = lazy(() => import("./pages/tools/RomanNumeralConverter"));
const AspectRatioCalculator = lazy(() => import("./pages/tools/AspectRatioCalculator"));

// Text & Language Tools
const LoremIpsumGenerator = lazy(() => import("./pages/tools/LoremIpsumGenerator"));
const EmojiPicker = lazy(() => import("./pages/tools/EmojiPicker"));
const TextDiffChecker = lazy(() => import("./pages/tools/TextDiffChecker"));
const TypingTest = lazy(() => import("./pages/tools/TypingTest"));
const BanglaToBanglish = lazy(() => import("./pages/tools/BanglaToBanglish"));
const BanglishToBangla = lazy(() => import("./pages/tools/BanglishToBangla"));
const MarkdownEditor = lazy(() => import("./pages/tools/MarkdownEditor"));
const WordCounter = lazy(() => import("./pages/tools/WordCounter"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const TextToSpeech = lazy(() => import("./pages/tools/TextToSpeech"));
const TextReplacer = lazy(() => import("./pages/tools/TextReplacer"));
const Notepad = lazy(() => import("./pages/tools/Notepad"));
const TodoList = lazy(() => import("./pages/tools/TodoList"));
const SlugGenerator = lazy(() => import("./pages/tools/SlugGenerator"));
const CharacterMap = lazy(() => import("./pages/tools/CharacterMap"));
const TextToHandwriting = lazy(() => import("./pages/tools/TextToHandwriting"));
const TextToMorse = lazy(() => import("./pages/tools/TextToMorse"));
const FancyTextGenerator = lazy(() => import("./pages/tools/FancyTextGenerator"));
const SocialMediaBioGenerator = lazy(() => import("./pages/tools/SocialMediaBioGenerator"));
const TextSummarizer = lazy(() => import("./pages/tools/TextSummarizer"));
const TextReverser = lazy(() => import("./pages/tools/TextReverser"));
const DuplicateLineRemover = lazy(() => import("./pages/tools/DuplicateLineRemover"));
const TextSorter = lazy(() => import("./pages/tools/TextSorter"));
const TextRepeater = lazy(() => import("./pages/tools/TextRepeater"));
const TextToUnicode = lazy(() => import("./pages/tools/TextToUnicode"));
const TextTruncator = lazy(() => import("./pages/tools/TextTruncator"));

// Image & Media Tools
const ImageToBase64 = lazy(() => import("./pages/tools/ImageToBase64"));
const OnlineImageEditor = lazy(() => import("./pages/tools/OnlineImageEditor"));
const PhotoFilter = lazy(() => import("./pages/tools/PhotoFilter"));
const BanglaLogoMaker = lazy(() => import("./pages/tools/BanglaLogoMaker"));
const GeminiWatermarkRemover = lazy(() => import("./pages/tools/GeminiWatermarkRemover"));
const WebsiteScreenshot = lazy(() => import("./pages/tools/WebsiteScreenshot"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const ColorBlindnessSimulator = lazy(() => import("./pages/tools/ColorBlindnessSimulator"));
const ImageColorExtractor = lazy(() => import("./pages/tools/ImageColorExtractor"));
const LoremPicsumGenerator = lazy(() => import("./pages/tools/LoremPicsumGenerator"));
const DrawingBoard = lazy(() => import("./pages/tools/DrawingBoard"));
const ImageCropper = lazy(() => import("./pages/tools/ImageCropper"));
const ImageWatermark = lazy(() => import("./pages/tools/ImageWatermark"));
const ImageFlipRotate = lazy(() => import("./pages/tools/ImageFlipRotate"));
const ImageBorderAdder = lazy(() => import("./pages/tools/ImageBorderAdder"));
const ImageToGrayscale = lazy(() => import("./pages/tools/ImageToGrayscale"));
const ImageTextOverlay = lazy(() => import("./pages/tools/ImageTextOverlay"));
const ImagePixelator = lazy(() => import("./pages/tools/ImagePixelator"));
const ImageBrightnessContrast = lazy(() => import("./pages/tools/ImageBrightnessContrast"));
const ImageFormatConverter = lazy(() => import("./pages/tools/ImageFormatConverter"));
const ImageCollage = lazy(() => import("./pages/tools/ImageCollage"));
const ImageBlurTool = lazy(() => import("./pages/tools/ImageBlurTool"));
const ImageCompare = lazy(() => import("./pages/tools/ImageCompare"));
const ImageInverter = lazy(() => import("./pages/tools/ImageInverter"));
const MemeGenerator = lazy(() => import("./pages/tools/MemeGenerator"));
const ImageEffects = lazy(() => import("./pages/tools/ImageEffects"));

// Developer Tools
const ApiTester = lazy(() => import("./pages/tools/ApiTester"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const UrlParser = lazy(() => import("./pages/tools/UrlParser"));
const BdixServerTester = lazy(() => import("./pages/tools/BdixServerTester"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const HtmlToPdf = lazy(() => import("./pages/tools/HtmlToPdf"));
const Base64EncoderDecoder = lazy(() => import("./pages/tools/Base64EncoderDecoder"));
const CssMinifier = lazy(() => import("./pages/tools/CssMinifier"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const FaviconGenerator = lazy(() => import("./pages/tools/FaviconGenerator"));
const JsonToCsv = lazy(() => import("./pages/tools/JsonToCsv"));
const RegexCheatSheet = lazy(() => import("./pages/tools/RegexCheatSheet"));
const ColorPaletteGenerator = lazy(() => import("./pages/tools/ColorPaletteGenerator"));
const PdfMerger = lazy(() => import("./pages/tools/PdfMerger"));
const HtmlEntityConverter = lazy(() => import("./pages/tools/HtmlEntityConverter"));
const CrontabGenerator = lazy(() => import("./pages/tools/CrontabGenerator"));
const PrivacyPolicyGenerator = lazy(() => import("./pages/tools/PrivacyPolicyGenerator"));
const TextToBinary = lazy(() => import("./pages/tools/TextToBinary"));
const JsonToYaml = lazy(() => import("./pages/tools/JsonToYaml"));
const HtmlPreview = lazy(() => import("./pages/tools/HtmlPreview"));
const CsvViewer = lazy(() => import("./pages/tools/CsvViewer"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const TextEncryption = lazy(() => import("./pages/tools/TextEncryption"));
const SqlFormatter = lazy(() => import("./pages/tools/SqlFormatter"));
const NumberBaseConverter = lazy(() => import("./pages/tools/NumberBaseConverter"));
const UserAgentParser = lazy(() => import("./pages/tools/UserAgentParser"));
const HexEditor = lazy(() => import("./pages/tools/HexEditor"));
const ColorConverter = lazy(() => import("./pages/tools/ColorConverter"));
const BinaryConverter = lazy(() => import("./pages/tools/BinaryConverter"));
const BoxShadowGenerator = lazy(() => import("./pages/tools/BoxShadowGenerator"));
const GradientGenerator = lazy(() => import("./pages/tools/GradientGenerator"));
const BorderRadiusPreviewer = lazy(() => import("./pages/tools/BorderRadiusPreviewer"));

// PDF Tools
const PdfToImage = lazy(() => import("./pages/tools/PdfToImage"));
const PdfCompressor = lazy(() => import("./pages/tools/PdfCompressor"));
const PdfPageRemover = lazy(() => import("./pages/tools/PdfPageRemover"));
const PdfPageExtractor = lazy(() => import("./pages/tools/PdfPageExtractor"));
const PdfRotate = lazy(() => import("./pages/tools/PdfRotate"));
const PdfPasswordProtect = lazy(() => import("./pages/tools/PdfPasswordProtect"));
const PdfWatermark = lazy(() => import("./pages/tools/PdfWatermark"));
const PdfPageReorder = lazy(() => import("./pages/tools/PdfPageReorder"));
const PdfSplitter = lazy(() => import("./pages/tools/PdfSplitter"));
const PdfMetadataEditor = lazy(() => import("./pages/tools/PdfMetadataEditor"));
const PdfPageNumber = lazy(() => import("./pages/tools/PdfPageNumber"));
const PdfHeaderFooter = lazy(() => import("./pages/tools/PdfHeaderFooter"));
const PdfSign = lazy(() => import("./pages/tools/PdfSign"));
const PdfFormFiller = lazy(() => import("./pages/tools/PdfFormFiller"));
const PdfBookmarkEditor = lazy(() => import("./pages/tools/PdfBookmarkEditor"));
const PdfTextExtractor = lazy(() => import("./pages/tools/PdfTextExtractor"));
const PdfMergeImages = lazy(() => import("./pages/tools/PdfMergeImages"));
const PdfUnlock = lazy(() => import("./pages/tools/PdfUnlock"));
const PdfCompare = lazy(() => import("./pages/tools/PdfCompare"));
const PdfToText = lazy(() => import("./pages/tools/PdfToText"));

// Design Tools
const WireframeGenerator = lazy(() => import("./pages/tools/WireframeGenerator"));
const TypographyTester = lazy(() => import("./pages/tools/TypographyTester"));
const IconGenerator = lazy(() => import("./pages/tools/IconGenerator"));
const PatternGenerator = lazy(() => import("./pages/tools/PatternGenerator"));
const ColorSchemeGenerator = lazy(() => import("./pages/tools/ColorSchemeGenerator"));
const MockupGenerator = lazy(() => import("./pages/tools/MockupGenerator"));
const GridGenerator = lazy(() => import("./pages/tools/GridGenerator"));
const SvgEditor = lazy(() => import("./pages/tools/SvgEditor"));
const GlassmorphismGenerator = lazy(() => import("./pages/tools/GlassmorphismGenerator"));
const TextArtGenerator = lazy(() => import("./pages/tools/TextArtGenerator"));

// ID Card Makers
const FakeBdOldNid = lazy(() => import("./pages/tools/FakeBdOldNid"));
const FacebookIdCard = lazy(() => import("./pages/tools/FacebookIdCard"));
const FakeBdSmartNid = lazy(() => import("./pages/tools/FakeBdSmartNid"));
const FakePakCnic = lazy(() => import("./pages/tools/FakePakCnic"));
const StudentIdCard = lazy(() => import("./pages/tools/StudentIdCard"));

// Security & Privacy
const BulkPasswordGenerator = lazy(() => import("./pages/tools/BulkPasswordGenerator"));
const TextEncryptor = lazy(() => import("./pages/tools/TextEncryptor"));
const PhishingLinkChecker = lazy(() => import("./pages/tools/PhishingLinkChecker"));
const PrivateNotepad = lazy(() => import("./pages/tools/PrivateNotepad"));
const BrowserFingerprint = lazy(() => import("./pages/tools/BrowserFingerprint"));
const CreditCardValidator = lazy(() => import("./pages/tools/CreditCardValidator"));

// Finance
const CompoundInterestCalc = lazy(() => import("./pages/tools/CompoundInterestCalc"));
const TaxCalculator = lazy(() => import("./pages/tools/TaxCalculator"));
const SavingsGoalCalculator = lazy(() => import("./pages/tools/SavingsGoalCalculator"));
const ProfitMarginCalc = lazy(() => import("./pages/tools/ProfitMarginCalc"));
const LoanCalculator = lazy(() => import("./pages/tools/LoanCalculator"));
const TipCalculator = lazy(() => import("./pages/tools/TipCalculator"));
const InvestmentCalculator = lazy(() => import("./pages/tools/InvestmentCalculator"));
const MortgageCalculator = lazy(() => import("./pages/tools/MortgageCalculator"));
const SalaryCalculator = lazy(() => import("./pages/tools/SalaryCalculator"));
const FuelCostCalculator = lazy(() => import("./pages/tools/FuelCostCalculator"));
const PayrollCalculator = lazy(() => import("./pages/tools/PayrollCalculator"));
const GpaCalculator = lazy(() => import("./pages/tools/GpaCalculator"));

// Social Media
const SocialPostGenerator = lazy(() => import("./pages/tools/SocialPostGenerator"));
const HashtagGenerator = lazy(() => import("./pages/tools/HashtagGenerator"));
const YouTubeTagGenerator = lazy(() => import("./pages/tools/YouTubeTagGenerator"));
const TweetFormatter = lazy(() => import("./pages/tools/TweetFormatter"));
const YouTubeThumbnail = lazy(() => import("./pages/tools/YouTubeThumbnail"));

// Games & Fun
const MemoryGame = lazy(() => import("./pages/tools/MemoryGame"));
const NumberGuessingGame = lazy(() => import("./pages/tools/NumberGuessingGame"));
const TicTacToe = lazy(() => import("./pages/tools/TicTacToe"));
const SnakeGame = lazy(() => import("./pages/tools/SnakeGame"));
const WordScramble = lazy(() => import("./pages/tools/WordScramble"));
const HangmanGame = lazy(() => import("./pages/tools/HangmanGame"));
const ReactionTimeTest = lazy(() => import("./pages/tools/ReactionTimeTest"));
const RockPaperScissors = lazy(() => import("./pages/tools/RockPaperScissors"));
const Game2048 = lazy(() => import("./pages/tools/Game2048"));
const ColorGuessingGame = lazy(() => import("./pages/tools/ColorGuessingGame"));
const MathQuizGame = lazy(() => import("./pages/tools/MathQuizGame"));

// Additional Security
const PasswordExpiryChecker = lazy(() => import("./pages/tools/PasswordExpiryChecker"));
const IPBlacklistChecker = lazy(() => import("./pages/tools/IPBlacklistChecker"));
const DataLeakChecker = lazy(() => import("./pages/tools/DataLeakChecker"));

// Additional Social
const InstagramCaptionGen = lazy(() => import("./pages/tools/InstagramCaptionGen"));
const LinkedInPostGen = lazy(() => import("./pages/tools/LinkedInPostGen"));
const SocialImageResizer = lazy(() => import("./pages/tools/SocialImageResizer"));
const BioLinkGenerator = lazy(() => import("./pages/tools/BioLinkGenerator"));

// Additional ID Card
const BusinessCardMaker = lazy(() => import("./pages/tools/BusinessCardMaker"));
const EmployeeIdCard = lazy(() => import("./pages/tools/EmployeeIdCard"));
const EventBadgeMaker = lazy(() => import("./pages/tools/EventBadgeMaker"));

// Email Tools
const EmailSignatureGenerator = lazy(() => import("./pages/tools/EmailSignatureGenerator"));
const EmailTemplateBuilder = lazy(() => import("./pages/tools/EmailTemplateBuilder"));
const MailtoLinkGenerator = lazy(() => import("./pages/tools/MailtoLinkGenerator"));
const EmailHeaderAnalyzer = lazy(() => import("./pages/tools/EmailHeaderAnalyzer"));
const EmailExtractor = lazy(() => import("./pages/tools/EmailExtractor"));
const EmailObfuscator = lazy(() => import("./pages/tools/EmailObfuscator"));
const EmailSubjectTester = lazy(() => import("./pages/tools/EmailSubjectTester"));
const DisposableEmailChecker = lazy(() => import("./pages/tools/DisposableEmailChecker"));
const BulkEmailValidator = lazy(() => import("./pages/tools/BulkEmailValidator"));
const EmailFormatter = lazy(() => import("./pages/tools/EmailFormatter"));

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
            <Route path="/tools" element={<Suspense fallback={<Loading />}><ToolsPage /></Suspense>} />
            {/* Utility */}
            <Route path="/tools/internet-speed-tester" element={<InternetSpeedTester />} />
            <Route path="/tools/courier-fraud-checker" element={<CourierFraudChecker />} />
            <Route path="/tools/board-results-checker" element={<BoardResultsChecker />} />
            <Route path="/tools/bd-train-info" element={<BdTrainInfo />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/qr-code-maker" element={<QrCodeMaker />} />
            <Route path="/tools/qr-code-scanner" element={<QrCodeScanner />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/stopwatch-timer" element={<StopwatchTimer />} />
            <Route path="/tools/pomodoro-timer" element={<PomodoroTimer />} />
            <Route path="/tools/random-number" element={<RandomNumberGenerator />} />
            <Route path="/tools/flip-coin" element={<FlipCoin />} />
            <Route path="/tools/dice-roller" element={<DiceRoller />} />
            <Route path="/tools/electricity-calculator" element={<ElectricityCalculator />} />
            <Route path="/tools/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/screen-resolution" element={<ScreenResolutionChecker />} />
            <Route path="/tools/whatsapp-link-generator" element={<WhatsAppLinkGenerator />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/url-shortener" element={<UrlShortener />} />
            <Route path="/tools/password-strength-checker" element={<PasswordStrengthChecker />} />
            <Route path="/tools/email-validator" element={<EmailValidator />} />
            <Route path="/tools/color-mixer" element={<ColorMixer />} />
            <Route path="/tools/domain-name-generator" element={<DomainNameGenerator />} />
            <Route path="/tools/countdown-timer" element={<CountdownTimer />} />
            <Route path="/tools/time-zone-converter" element={<TimeZoneConverter />} />
            <Route path="/tools/date-diff-calculator" element={<DateDiffCalculator />} />
            <Route path="/tools/roman-numeral-converter" element={<RomanNumeralConverter />} />
            <Route path="/tools/aspect-ratio-calculator" element={<AspectRatioCalculator />} />
            {/* Text & Language */}
            <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
            <Route path="/tools/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="/tools/typing-test" element={<TypingTest />} />
            <Route path="/tools/bangla-to-banglish" element={<BanglaToBanglish />} />
            <Route path="/tools/banglish-to-bangla" element={<BanglishToBangla />} />
            <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
            <Route path="/tools/text-replacer" element={<TextReplacer />} />
            <Route path="/tools/notepad" element={<Notepad />} />
            <Route path="/tools/todo-list" element={<TodoList />} />
            <Route path="/tools/slug-generator" element={<SlugGenerator />} />
            <Route path="/tools/character-map" element={<CharacterMap />} />
            <Route path="/tools/text-to-handwriting" element={<TextToHandwriting />} />
            <Route path="/tools/text-to-morse" element={<TextToMorse />} />
            <Route path="/tools/fancy-text-generator" element={<FancyTextGenerator />} />
            <Route path="/tools/social-media-bio" element={<SocialMediaBioGenerator />} />
            <Route path="/tools/text-summarizer" element={<TextSummarizer />} />
            <Route path="/tools/text-reverser" element={<TextReverser />} />
            <Route path="/tools/duplicate-line-remover" element={<DuplicateLineRemover />} />
            <Route path="/tools/text-sorter" element={<TextSorter />} />
            <Route path="/tools/text-repeater" element={<TextRepeater />} />
            <Route path="/tools/text-to-unicode" element={<TextToUnicode />} />
            <Route path="/tools/text-truncator" element={<TextTruncator />} />
            {/* Image & Media */}
            <Route path="/tools/image-to-base64" element={<ImageToBase64 />} />
            <Route path="/tools/online-image-editor" element={<OnlineImageEditor />} />
            <Route path="/tools/photo-filter" element={<PhotoFilter />} />
            <Route path="/tools/bangla-logo-maker" element={<BanglaLogoMaker />} />
            <Route path="/tools/gemini-watermark-remover" element={<GeminiWatermarkRemover />} />
            <Route path="/tools/website-screenshot" element={<WebsiteScreenshot />} />
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/color-blindness-simulator" element={<ColorBlindnessSimulator />} />
            <Route path="/tools/image-color-extractor" element={<ImageColorExtractor />} />
            <Route path="/tools/placeholder-image" element={<LoremPicsumGenerator />} />
            <Route path="/tools/drawing-board" element={<DrawingBoard />} />
            <Route path="/tools/image-cropper" element={<ImageCropper />} />
            <Route path="/tools/image-watermark" element={<ImageWatermark />} />
            <Route path="/tools/image-flip-rotate" element={<ImageFlipRotate />} />
            <Route path="/tools/image-border-adder" element={<ImageBorderAdder />} />
            <Route path="/tools/image-to-grayscale" element={<ImageToGrayscale />} />
            <Route path="/tools/image-text-overlay" element={<ImageTextOverlay />} />
            <Route path="/tools/image-pixelator" element={<ImagePixelator />} />
            <Route path="/tools/image-brightness-contrast" element={<ImageBrightnessContrast />} />
            <Route path="/tools/image-format-converter" element={<ImageFormatConverter />} />
            <Route path="/tools/image-collage" element={<ImageCollage />} />
            <Route path="/tools/image-blur-tool" element={<ImageBlurTool />} />
            <Route path="/tools/image-compare" element={<ImageCompare />} />
            <Route path="/tools/image-inverter" element={<ImageInverter />} />
            <Route path="/tools/meme-generator" element={<MemeGenerator />} />
            <Route path="/tools/image-effects" element={<ImageEffects />} />
            {/* Developer */}
            <Route path="/tools/api-tester" element={<ApiTester />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/url-parser" element={<UrlParser />} />
            <Route path="/tools/bdix-server-tester" element={<BdixServerTester />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/tools/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
            <Route path="/tools/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
            <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
            <Route path="/tools/regex-cheat-sheet" element={<RegexCheatSheet />} />
            <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
            <Route path="/tools/pdf-merger" element={<PdfMerger />} />
            <Route path="/tools/html-entity-converter" element={<HtmlEntityConverter />} />
            <Route path="/tools/crontab-generator" element={<CrontabGenerator />} />
            <Route path="/tools/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
            <Route path="/tools/text-to-binary" element={<TextToBinary />} />
            <Route path="/tools/json-to-yaml" element={<JsonToYaml />} />
            <Route path="/tools/html-preview" element={<HtmlPreview />} />
            <Route path="/tools/csv-viewer" element={<CsvViewer />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/text-encryption" element={<TextEncryption />} />
            <Route path="/tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tools/user-agent-parser" element={<UserAgentParser />} />
            <Route path="/tools/hex-editor" element={<HexEditor />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/binary-converter" element={<BinaryConverter />} />
            <Route path="/tools/box-shadow-generator" element={<BoxShadowGenerator />} />
            <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
            <Route path="/tools/border-radius-previewer" element={<BorderRadiusPreviewer />} />
            {/* PDF Tools */}
            <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
            <Route path="/tools/pdf-compressor" element={<PdfCompressor />} />
            <Route path="/tools/pdf-page-remover" element={<PdfPageRemover />} />
            <Route path="/tools/pdf-page-extractor" element={<PdfPageExtractor />} />
            <Route path="/tools/pdf-rotate" element={<PdfRotate />} />
            <Route path="/tools/pdf-password-protect" element={<PdfPasswordProtect />} />
            <Route path="/tools/pdf-watermark" element={<PdfWatermark />} />
            <Route path="/tools/pdf-page-reorder" element={<PdfPageReorder />} />
            <Route path="/tools/pdf-splitter" element={<PdfSplitter />} />
            <Route path="/tools/pdf-metadata-editor" element={<PdfMetadataEditor />} />
            <Route path="/tools/pdf-page-number" element={<PdfPageNumber />} />
            <Route path="/tools/pdf-header-footer" element={<PdfHeaderFooter />} />
            <Route path="/tools/pdf-sign" element={<PdfSign />} />
            <Route path="/tools/pdf-form-filler" element={<PdfFormFiller />} />
            <Route path="/tools/pdf-bookmark-editor" element={<PdfBookmarkEditor />} />
            <Route path="/tools/pdf-text-extractor" element={<PdfTextExtractor />} />
            <Route path="/tools/pdf-merge-images" element={<PdfMergeImages />} />
            <Route path="/tools/pdf-unlock" element={<PdfUnlock />} />
            <Route path="/tools/pdf-compare" element={<PdfCompare />} />
            <Route path="/tools/pdf-to-text" element={<PdfToText />} />
            {/* Design Tools */}
            <Route path="/tools/wireframe-generator" element={<WireframeGenerator />} />
            <Route path="/tools/typography-tester" element={<TypographyTester />} />
            <Route path="/tools/icon-generator" element={<IconGenerator />} />
            <Route path="/tools/pattern-generator" element={<PatternGenerator />} />
            <Route path="/tools/color-scheme-generator" element={<ColorSchemeGenerator />} />
            <Route path="/tools/mockup-generator" element={<MockupGenerator />} />
            <Route path="/tools/grid-generator" element={<GridGenerator />} />
            <Route path="/tools/svg-editor" element={<SvgEditor />} />
            <Route path="/tools/glassmorphism-generator" element={<GlassmorphismGenerator />} />
            <Route path="/tools/text-art-generator" element={<TextArtGenerator />} />
            {/* ID Card */}
            <Route path="/tools/fake-bd-old-nid" element={<FakeBdOldNid />} />
            <Route path="/tools/facebook-id-card" element={<FacebookIdCard />} />
            <Route path="/tools/fake-bd-smart-nid" element={<FakeBdSmartNid />} />
            <Route path="/tools/fake-pak-cnic" element={<FakePakCnic />} />
            <Route path="/tools/student-id-card" element={<StudentIdCard />} />
            {/* Security */}
            <Route path="/tools/bulk-password-generator" element={<BulkPasswordGenerator />} />
            <Route path="/tools/text-encryptor" element={<TextEncryptor />} />
            <Route path="/tools/phishing-link-checker" element={<PhishingLinkChecker />} />
            <Route path="/tools/private-notepad" element={<PrivateNotepad />} />
            <Route path="/tools/browser-fingerprint" element={<BrowserFingerprint />} />
            <Route path="/tools/credit-card-validator" element={<CreditCardValidator />} />
            {/* Finance */}
            <Route path="/tools/compound-interest" element={<CompoundInterestCalc />} />
            <Route path="/tools/tax-calculator" element={<TaxCalculator />} />
            <Route path="/tools/savings-goal" element={<SavingsGoalCalculator />} />
            <Route path="/tools/profit-margin" element={<ProfitMarginCalc />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/investment-calculator" element={<InvestmentCalculator />} />
            <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/tools/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/tools/fuel-cost-calculator" element={<FuelCostCalculator />} />
            <Route path="/tools/payroll-calculator" element={<PayrollCalculator />} />
            <Route path="/tools/gpa-calculator" element={<GpaCalculator />} />
            {/* Social */}
            <Route path="/tools/social-post-generator" element={<SocialPostGenerator />} />
            <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
            <Route path="/tools/youtube-tag-generator" element={<YouTubeTagGenerator />} />
            <Route path="/tools/tweet-formatter" element={<TweetFormatter />} />
            <Route path="/tools/youtube-thumbnail" element={<YouTubeThumbnail />} />
            {/* Games */}
            <Route path="/tools/memory-game" element={<MemoryGame />} />
            <Route path="/tools/number-guessing" element={<NumberGuessingGame />} />
            <Route path="/tools/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/tools/snake-game" element={<SnakeGame />} />
            <Route path="/tools/word-scramble" element={<WordScramble />} />
            <Route path="/tools/hangman-game" element={<HangmanGame />} />
            <Route path="/tools/reaction-time-test" element={<ReactionTimeTest />} />
            <Route path="/tools/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/tools/game-2048" element={<Game2048 />} />
            <Route path="/tools/color-guessing-game" element={<ColorGuessingGame />} />
            <Route path="/tools/math-quiz" element={<MathQuizGame />} />
            {/* Additional Security */}
            <Route path="/tools/password-security-analyzer" element={<PasswordExpiryChecker />} />
            <Route path="/tools/ip-blacklist-checker" element={<IPBlacklistChecker />} />
            <Route path="/tools/data-leak-checker" element={<DataLeakChecker />} />
            {/* Additional Social */}
            <Route path="/tools/instagram-caption-gen" element={<InstagramCaptionGen />} />
            <Route path="/tools/linkedin-post-gen" element={<LinkedInPostGen />} />
            <Route path="/tools/social-image-resizer" element={<SocialImageResizer />} />
            <Route path="/tools/bio-link-generator" element={<BioLinkGenerator />} />
            {/* Additional ID Card */}
            <Route path="/tools/business-card-maker" element={<BusinessCardMaker />} />
            <Route path="/tools/employee-id-card" element={<EmployeeIdCard />} />
            <Route path="/tools/event-badge-maker" element={<EventBadgeMaker />} />
            {/* Email Tools */}
            <Route path="/tools/email-signature-generator" element={<EmailSignatureGenerator />} />
            <Route path="/tools/email-template-builder" element={<EmailTemplateBuilder />} />
            <Route path="/tools/mailto-link-generator" element={<MailtoLinkGenerator />} />
            <Route path="/tools/email-header-analyzer" element={<EmailHeaderAnalyzer />} />
            <Route path="/tools/email-extractor" element={<EmailExtractor />} />
            <Route path="/tools/email-obfuscator" element={<EmailObfuscator />} />
            <Route path="/tools/email-subject-tester" element={<EmailSubjectTester />} />
            <Route path="/tools/disposable-email-checker" element={<DisposableEmailChecker />} />
            <Route path="/tools/bulk-email-validator" element={<BulkEmailValidator />} />
            <Route path="/tools/email-formatter" element={<EmailFormatter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

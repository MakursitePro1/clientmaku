import { useState, useCallback, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import {
  Play, RotateCcw, Download, Copy, Maximize2, Minimize2,
  Code2, Paintbrush, Braces, Eye, EyeOff, Smartphone, Monitor, Tablet,
  ChevronDown, ChevronUp, Trash2, FileCode, Terminal
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, World! 🌍</h1>
  <p>Edit the HTML, CSS & JavaScript panels to see live changes.</p>
  <button id="btn">Click Me!</button>
  <div id="output" class="output-box">Output appears here</div>
  <div id="counter" class="counter">0</div>
</div>`;

const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}

.container {
  text-align: center;
  padding: 2.5rem;
  background: rgba(255,255,255,0.12);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.18);
  max-width: 440px;
  width: 90%;
}

h1 { font-size: 2.2rem; margin-bottom: 0.6rem; }

p {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

#btn {
  padding: 0.75rem 2.2rem;
  border: none;
  border-radius: 10px;
  background: #fff;
  color: #764ba2;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

#btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

#btn:active { transform: scale(0.97); }

.output-box {
  margin-top: 1.2rem;
  padding: 1rem;
  background: rgba(0,0,0,0.25);
  border-radius: 10px;
  font-size: 0.95rem;
  min-height: 50px;
  transition: all 0.3s;
}

.counter {
  margin-top: 1rem;
  font-size: 3rem;
  font-weight: 800;
  opacity: 0.9;
  transition: transform 0.15s;
}`;

const DEFAULT_JS = `let count = 0;
const btn = document.getElementById('btn');
const output = document.getElementById('output');
const counter = document.getElementById('counter');

const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#20c997'];

btn.addEventListener('click', function() {
  count++;
  const color = colors[count % colors.length];

  btn.style.background = color;
  btn.style.color = '#fff';

  output.textContent = 'Clicked ' + count + ' time' + (count > 1 ? 's' : '') + '!';
  output.style.borderLeft = '4px solid ' + color;

  counter.textContent = count;
  counter.style.transform = 'scale(1.2)';
  setTimeout(() => counter.style.transform = 'scale(1)', 150);

  console.log('Button clicked! Count:', count);
});

console.log('🚀 App initialized successfully!');`;

type Panel = "html" | "css" | "js";
type Device = "desktop" | "tablet" | "mobile";

const PANELS: { id: Panel; label: string; icon: typeof Code2; accent: string }[] = [
  { id: "html", label: "HTML", icon: Code2, accent: "text-orange-400" },
  { id: "css", label: "CSS", icon: Paintbrush, accent: "text-blue-400" },
  { id: "js", label: "JS", icon: Braces, accent: "text-yellow-400" },
];

const DEVICES: { id: Device; icon: typeof Monitor; width: string; label: string }[] = [
  { id: "desktop", icon: Monitor, width: "100%", label: "Desktop" },
  { id: "tablet", icon: Tablet, width: "768px", label: "Tablet" },
  { id: "mobile", icon: Smartphone, width: "375px", label: "Mobile" },
];

function buildDocument(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
(function(){
  var _l=console.log,_e=console.error,_w=console.warn,_i=console.info;
  function _s(t,a){
    try{window.parent.postMessage({__console:true,level:t,data:Array.prototype.slice.call(a).map(function(x){return typeof x==='object'?JSON.stringify(x,null,2):String(x)}).join(' ')},'*')}catch(e){}
  }
  console.log=function(){_s('log',arguments);_l.apply(console,arguments)};
  console.error=function(){_s('error',arguments);_e.apply(console,arguments)};
  console.warn=function(){_s('warn',arguments);_w.apply(console,arguments)};
  console.info=function(){_s('info',arguments);_i.apply(console,arguments)};
  window.onerror=function(m,u,l,c,e){_s('error',['Error: '+m+' (line '+l+')']);return true};
  window.onunhandledrejection=function(e){_s('error',['Unhandled Promise: '+(e.reason||e)])};
})();
try{
${js}
}catch(e){
  console.error(e.message);
}
<\/script>
</body>
</html>`;
}

export default function HtmlCssJsRunner() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activePanel, setActivePanel] = useState<Panel>("html");
  const [autoRun, setAutoRun] = useState(true);
  const [device, setDevice] = useState<Device>("desktop");
  const [fullscreen, setFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLines, setConsoleLines] = useState<{ level: string; text: string }[]>([]);
  const [srcDoc, setSrcDoc] = useState("");
  const [runKey, setRunKey] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for console messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.__console) {
        setConsoleLines((prev) => [...prev.slice(-199), { level: e.data.level, text: e.data.data }]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Build and run
  const run = useCallback(() => {
    setConsoleLines([]);
    setSrcDoc(buildDocument(html, css, js));
    setRunKey((k) => k + 1);
  }, [html, css, js]);

  // Auto-run with debounce
  useEffect(() => {
    if (!autoRun) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(run, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [html, css, js, autoRun, run]);

  // Initial run
  useEffect(() => { run(); }, []);

  // Keyboard shortcut: Ctrl+Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
        toast.success("Code executed!");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [run]);

  // Tab key support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);
      setCurrentCode(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const currentCode = activePanel === "html" ? html : activePanel === "css" ? css : js;
  const setCurrentCode = activePanel === "html" ? setHtml : activePanel === "css" ? setCss : setJs;
  const lineCount = currentCode.split("\n").length;
  const deviceWidth = DEVICES.find((d) => d.id === device)?.width || "100%";

  const resetAll = () => {
    setHtml(DEFAULT_HTML); setCss(DEFAULT_CSS); setJs(DEFAULT_JS);
    setConsoleLines([]);
    toast.success("Reset to default!");
  };

  const clearPanel = () => {
    setCurrentCode("");
    toast.success(`${activePanel.toUpperCase()} cleared`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
    toast.success(`${activePanel.toUpperCase()} copied!`);
  };

  const downloadProject = () => {
    const blob = new Blob([buildDocument(html, css, js)], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "project.html";
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout title="HTML, CSS & JS Runner" description="">
      <div className={cn(
        "mx-auto space-y-2.5",
        fullscreen ? "fixed inset-0 z-50 bg-background p-2.5 overflow-hidden" : "max-w-7xl"
      )}>

        {/* ─── Toolbar ─── */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-foreground/10 bg-card px-2.5 py-2">
          <Button size="sm" onClick={() => { run(); toast.success("Executed!"); }} className="gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
            <Play className="h-3.5 w-3.5" /> Run
          </Button>
          <Button size="sm" variant="outline" onClick={resetAll} className="gap-1 rounded-lg text-xs"><RotateCcw className="h-3 w-3" /> Reset</Button>
          <Button size="sm" variant="outline" onClick={clearPanel} className="gap-1 rounded-lg text-xs"><Trash2 className="h-3 w-3" /> Clear</Button>
          <Button size="sm" variant="outline" onClick={copyCode} className="gap-1 rounded-lg text-xs"><Copy className="h-3 w-3" /> Copy</Button>
          <Button size="sm" variant="outline" onClick={downloadProject} className="gap-1 rounded-lg text-xs"><Download className="h-3 w-3" /> Download</Button>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden text-[10px] text-muted-foreground sm:inline">Ctrl+Enter to Run</span>

            <Button
              size="sm"
              variant={autoRun ? "default" : "outline"}
              onClick={() => setAutoRun(!autoRun)}
              className="gap-1 rounded-lg text-xs"
            >
              {autoRun ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {autoRun ? "Auto" : "Manual"}
            </Button>

            <div className="flex rounded-lg border border-foreground/10 p-0.5">
              {DEVICES.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDevice(id)}
                  className={cn("rounded-md p-1.5 transition-colors", device === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  title={id}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <Button size="sm" variant="outline" onClick={() => setFullscreen(!fullscreen)} className="rounded-lg p-2">
              {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div className={cn(
          "grid gap-2.5",
          fullscreen ? "h-[calc(100vh-72px)]" : "min-h-[520px]",
          showPreview ? "lg:grid-cols-2" : ""
        )}>

          {/* ─── Editor ─── */}
          <div className="flex flex-col rounded-xl border-2 border-foreground/10 bg-card overflow-hidden min-h-[300px]">

            {/* Panel Tabs */}
            <div className="flex items-center gap-1 border-b border-foreground/10 bg-muted/30 px-2 py-1.5">
              {PANELS.map(({ id, label, icon: Icon, accent }) => (
                <button
                  key={id}
                  onClick={() => setActivePanel(id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                    activePanel === id
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <Icon className={cn("h-3 w-3", activePanel === id ? accent : "")} />
                  {label}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                <FileCode className="h-3 w-3" />
                <span>{lineCount} lines</span>
                <span className="opacity-40">|</span>
                <span>{currentCode.length} chars</span>
              </div>
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 flex overflow-auto">
                {/* Line numbers */}
                <div className="sticky left-0 z-10 flex-shrink-0 w-10 border-r border-foreground/5 bg-muted/20 select-none">
                  <div className="py-3 pr-2">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div key={i} className="text-right text-[11px] leading-[20px] text-muted-foreground/40 pr-1">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code input */}
                <textarea
                  ref={textareaRef}
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none bg-transparent py-3 pl-3 pr-4 text-[13px] leading-[20px] text-foreground font-mono outline-none placeholder:text-muted-foreground/30 min-h-full whitespace-pre overflow-auto"
                  placeholder={`Write your ${activePanel.toUpperCase()} code here...`}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  wrap="off"
                />
              </div>
            </div>

            {/* Console */}
            {showConsole && (
              <div className="border-t-2 border-foreground/10 bg-muted/15 max-h-[160px] flex flex-col">
                <div className="flex items-center justify-between px-3 py-1 border-b border-foreground/5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Terminal className="h-3 w-3" /> Console
                    {consoleLines.length > 0 && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-primary text-[9px] font-bold">{consoleLines.length}</span>
                    )}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setConsoleLines([])} className="h-5 px-2 text-[10px]">Clear</Button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-1.5 font-mono text-[11px] leading-relaxed">
                  {consoleLines.length === 0 ? (
                    <div className="text-muted-foreground/40 py-2 text-center">No output yet. Run your code!</div>
                  ) : (
                    consoleLines.map((line, i) => (
                      <div
                        key={i}
                        className={cn(
                          "py-0.5 border-b border-foreground/5 last:border-0",
                          line.level === "error" ? "text-destructive" : line.level === "warn" ? "text-yellow-500" : "text-foreground/75"
                        )}
                      >
                        <span className="opacity-40 mr-1.5">{line.level === "error" ? "❌" : line.level === "warn" ? "⚠️" : "›"}</span>
                        {line.text}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-foreground/10 bg-muted/30 px-3 py-1">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConsole ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                Console
                {consoleLines.length > 0 && !showConsole && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
          </div>

          {/* ─── Preview ─── */}
          {showPreview && (
            <div className="flex flex-col rounded-xl border-2 border-foreground/10 bg-card overflow-hidden min-h-[300px]">
              <div className="flex items-center justify-between border-b border-foreground/10 bg-muted/30 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Preview</span>
                  <span className="text-[9px] text-muted-foreground/50 hidden sm:inline">
                    ({DEVICES.find((d) => d.id === device)?.label})
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={run}
                  className="h-6 gap-1 px-2 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-2.5 w-2.5" /> Refresh
                </Button>
              </div>

              <div className="flex-1 flex items-start justify-center overflow-auto bg-white">
                <iframe
                  key={runKey}
                  ref={iframeRef}
                  srcDoc={srcDoc}
                  title="Live Preview"
                  sandbox="allow-scripts allow-modals allow-forms allow-popups"
                  className="border-0 min-h-[400px] h-full"
                  style={{
                    width: deviceWidth,
                    maxWidth: "100%",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

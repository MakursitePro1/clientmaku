import { useState, useCallback, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play, RotateCcw, Download, Copy, Maximize2, Minimize2,
  Code2, Paintbrush, Braces, Eye, EyeOff, Smartphone, Monitor, Tablet,
  Sun, Moon, ChevronDown, ChevronUp, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DEFAULT_HTML = `<div class="container">
  <h1>Hello, World! 🌍</h1>
  <p>Edit the HTML, CSS & JavaScript panels to see live changes.</p>
  <button id="btn" onclick="changeColor()">Click Me!</button>
  <div id="output" class="output-box">Output will appear here</div>
</div>`;

const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.container {
  text-align: center;
  padding: 2rem;
  background: rgba(255,255,255,0.12);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  max-width: 420px;
  width: 90%;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

p {
  opacity: 0.85;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

#btn {
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 8px;
  background: #fff;
  color: #764ba2;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

#btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.output-box {
  margin-top: 1.2rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 48px;
  transition: all 0.3s;
}`;

const DEFAULT_JS = `let clickCount = 0;

function changeColor() {
  clickCount++;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8'];
  const color = colors[clickCount % colors.length];

  document.getElementById('btn').style.background = color;
  document.getElementById('btn').style.color = '#fff';

  const output = document.getElementById('output');
  output.textContent = 'Clicked ' + clickCount + ' time' + (clickCount > 1 ? 's' : '') + '!';
  output.style.borderLeft = '3px solid ' + color;
}`;

type ActivePanel = "html" | "css" | "js";
type PreviewDevice = "desktop" | "tablet" | "mobile";

const PANEL_CONFIG: { id: ActivePanel; label: string; icon: typeof Code2; color: string }[] = [
  { id: "html", label: "HTML", icon: Code2, color: "text-orange-400" },
  { id: "css", label: "CSS", icon: Paintbrush, color: "text-blue-400" },
  { id: "js", label: "JS", icon: Braces, color: "text-yellow-400" },
];

const DEVICE_CONFIG: { id: PreviewDevice; icon: typeof Monitor; w: string }[] = [
  { id: "desktop", icon: Monitor, w: "100%" },
  { id: "tablet", icon: Tablet, w: "768px" },
  { id: "mobile", icon: Smartphone, w: "375px" },
];

export default function HtmlCssJsRunner() {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activePanel, setActivePanel] = useState<ActivePanel>("html");
  const [autoRun, setAutoRun] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const buildSrcDoc = useCallback(() => {
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
(function() {
  const _log = console.log;
  const _error = console.error;
  const _warn = console.warn;
  function send(type, args) {
    try { window.parent.postMessage({ type: 'console', level: type, data: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*'); } catch(e) {}
  }
  console.log = function() { send('log', arguments); _log.apply(console, arguments); };
  console.error = function() { send('error', arguments); _error.apply(console, arguments); };
  console.warn = function() { send('warn', arguments); _warn.apply(console, arguments); };
  window.onerror = function(msg, url, line) { send('error', ['Error: ' + msg + ' (line ' + line + ')']); };
})();
try {
${js}
} catch(e) {
  console.error(e.message);
}
<\/script>
</body>
</html>`;
    setSrcDoc(doc);
  }, [html, css, js]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "console") {
        const prefix = e.data.level === "error" ? "❌ " : e.data.level === "warn" ? "⚠️ " : "› ";
        setConsoleOutput((prev) => [...prev.slice(-99), prefix + e.data.data]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!autoRun) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(buildSrcDoc, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [html, css, js, autoRun, buildSrcDoc]);

  useEffect(() => {
    if (!autoRun) return;
    buildSrcDoc();
  }, []);

  const runCode = () => {
    setConsoleOutput([]);
    buildSrcDoc();
    toast.success("Code executed!");
  };

  const resetCode = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setConsoleOutput([]);
    toast.success("Code reset to default!");
  };

  const clearCode = () => {
    if (activePanel === "html") setHtml("");
    else if (activePanel === "css") setCss("");
    else setJs("");
    toast.success(`${activePanel.toUpperCase()} cleared`);
  };

  const copyCode = () => {
    const code = activePanel === "html" ? html : activePanel === "css" ? css : js;
    navigator.clipboard.writeText(code);
    toast.success(`${activePanel.toUpperCase()} copied!`);
  };

  const downloadProject = () => {
    const fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>My Project</title>\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n<script>\n${js}\n<\/script>\n</body>\n</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Project downloaded!");
  };

  const currentCode = activePanel === "html" ? html : activePanel === "css" ? css : js;
  const setCurrentCode = activePanel === "html" ? setHtml : activePanel === "css" ? setCss : setJs;

  const deviceWidth = DEVICE_CONFIG.find((d) => d.id === previewDevice)?.w || "100%";

  const lineCount = currentCode.split("\n").length;

  return (
    <ToolLayout title="HTML, CSS & JS Runner" description="">
      <div className={cn("mx-auto space-y-3", isFullscreen ? "fixed inset-0 z-50 bg-background p-3" : "max-w-7xl")}>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-foreground/10 bg-card p-2.5">
          <Button size="sm" onClick={runCode} className="gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
            <Play className="h-3.5 w-3.5" /> Run
          </Button>
          <Button size="sm" variant="outline" onClick={resetCode} className="gap-1.5 rounded-lg text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button size="sm" variant="outline" onClick={clearCode} className="gap-1.5 rounded-lg text-xs">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
          <Button size="sm" variant="outline" onClick={copyCode} className="gap-1.5 rounded-lg text-xs">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" variant="outline" onClick={downloadProject} className="gap-1.5 rounded-lg text-xs">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              size="sm"
              variant={autoRun ? "default" : "outline"}
              onClick={() => setAutoRun(!autoRun)}
              className="gap-1 rounded-lg text-xs"
            >
              {autoRun ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {autoRun ? "Auto" : "Manual"}
            </Button>

            <div className="flex items-center rounded-lg border border-foreground/10 p-0.5">
              {DEVICE_CONFIG.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPreviewDevice(id)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    previewDevice === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-lg p-2"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className={cn("grid gap-3", isFullscreen ? "h-[calc(100vh-80px)]" : "min-h-[550px]", showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1")}>

          {/* Editor Panel */}
          {!editorCollapsed && (
            <div className="flex flex-col rounded-xl border-2 border-foreground/10 bg-card overflow-hidden">
              {/* Panel Tabs */}
              <div className="flex items-center justify-between border-b border-foreground/10 bg-muted/30 px-2 py-1.5">
                <Tabs value={activePanel} onValueChange={(v) => setActivePanel(v as ActivePanel)}>
                  <TabsList className="h-8 bg-transparent p-0 gap-1">
                    {PANEL_CONFIG.map(({ id, label, icon: Icon, color }) => (
                      <TabsTrigger
                        key={id}
                        value={id}
                        className={cn(
                          "h-7 gap-1.5 rounded-md px-3 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm",
                        )}
                      >
                        <Icon className={cn("h-3 w-3", activePanel === id ? color : "text-muted-foreground")} />
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>{lineCount} lines</span>
                  <span>•</span>
                  <span>{currentCode.length} chars</span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 flex">
                  {/* Line Numbers */}
                  <div className="flex-shrink-0 w-10 overflow-hidden border-r border-foreground/5 bg-muted/20 text-right">
                    <div className="p-2 pt-3">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i} className="text-[11px] leading-[20px] text-muted-foreground/50 pr-2 select-none">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    className="flex-1 resize-none bg-transparent p-3 text-[13px] leading-[20px] text-foreground font-mono outline-none placeholder:text-muted-foreground/40 overflow-auto"
                    placeholder={`Write your ${activePanel.toUpperCase()} here...`}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
              </div>

              {/* Console */}
              {showConsole && (
                <div className="border-t border-foreground/10 bg-muted/20">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Console</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConsoleOutput([])}
                      className="h-5 px-2 text-[10px]"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="max-h-[120px] overflow-y-auto px-3 pb-2 font-mono text-[11px]">
                    {consoleOutput.length === 0 ? (
                      <div className="text-muted-foreground/50 py-2">No output yet...</div>
                    ) : (
                      consoleOutput.map((line, i) => (
                        <div
                          key={i}
                          className={cn(
                            "py-0.5 border-b border-foreground/5 last:border-0",
                            line.startsWith("❌") ? "text-destructive" : line.startsWith("⚠️") ? "text-yellow-500" : "text-foreground/80"
                          )}
                        >
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Editor Footer */}
              <div className="flex items-center justify-between border-t border-foreground/10 bg-muted/30 px-3 py-1">
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConsole ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                  Console {consoleOutput.length > 0 && `(${consoleOutput.length})`}
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <div className="flex flex-col rounded-xl border-2 border-foreground/10 bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-foreground/10 bg-muted/30 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Live Preview
                  </span>
                </div>

                <button
                  onClick={() => setEditorCollapsed(!editorCollapsed)}
                  className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {editorCollapsed ? "Show Editor" : "Expand"}
                </button>
              </div>

              <div className="flex-1 flex items-start justify-center overflow-auto bg-white p-0">
                <iframe
                  ref={iframeRef}
                  srcDoc={srcDoc}
                  title="Preview"
                  sandbox="allow-scripts allow-modals"
                  className="border-0 h-full min-h-[400px]"
                  style={{ width: deviceWidth, maxWidth: "100%", transition: "width 0.3s ease" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

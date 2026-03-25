import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Base64EncoderDecoder() {
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      setError("");
      // Handle Unicode properly
      const encoded = btoa(unescape(encodeURIComponent(encodeInput)));
      setEncodeOutput(encoded);
    } catch (e: any) {
      setError("Encoding error: " + e.message);
    }
  };

  const decode = () => {
    try {
      setError("");
      const decoded = decodeURIComponent(escape(atob(decodeInput)));
      setDecodeOutput(decoded);
    } catch (e: any) {
      setError("Decoding error: Invalid Base64 string");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <ToolLayout title="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 to text">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="w-full mb-5">
          <TabsTrigger value="encode" className="flex-1">Encode</TabsTrigger>
          <TabsTrigger value="decode" className="flex-1">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Plain Text</label>
            <Textarea
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text to encode..."
              className="rounded-xl font-mono text-sm"
              rows={5}
            />
          </div>
          <Button onClick={encode} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Encode to Base64</Button>
          {encodeOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Base64 Output</label>
                <Button variant="ghost" size="sm" onClick={() => copy(encodeOutput)}>Copy</Button>
              </div>
              <Textarea readOnly value={encodeOutput} className="rounded-xl bg-accent/50 font-mono text-sm" rows={5} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="decode" className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block">Base64 String</label>
            <Textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Enter Base64 string to decode..."
              className="rounded-xl font-mono text-sm"
              rows={5}
            />
          </div>
          <Button onClick={decode} className="gradient-bg text-primary-foreground rounded-xl font-semibold">Decode from Base64</Button>
          {decodeOutput && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Decoded Text</label>
                <Button variant="ghost" size="sm" onClick={() => copy(decodeOutput)}>Copy</Button>
              </div>
              <Textarea readOnly value={decodeOutput} className="rounded-xl bg-accent/50 font-mono text-sm" rows={5} />
            </div>
          )}
        </TabsContent>
      </Tabs>
      {error && <p className="text-sm text-destructive font-medium mt-3">{error}</p>}
    </ToolLayout>
  );
}

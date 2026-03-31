import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://receive-smss.com";

interface NumberInfo {
  number: string;
  country: string;
  slug: string;
}

interface SMSMessage {
  id: string;
  message: string;
  sender: string;
  time: string;
}

function parseNumbers(html: string): NumberInfo[] {
  const numbers: NumberInfo[] = [];
  // Match pattern: number-boxes-itemm-number with the number, then country
  const numberRegex = /class="number-boxes-itemm-number"[^>]*>([^<]+)<\/div>\s*<div[^>]*class="number-boxes-item-country[^"]*"[^>]*>([^<]+)/g;
  let match;
  while ((match = numberRegex.exec(html)) !== null) {
    const num = match[1].trim();
    const country = match[2].trim();
    const digits = num.replace(/[^0-9]/g, "");
    numbers.push({
      number: num,
      country,
      slug: digits,
    });
  }
  return numbers;
}

function parseMessages(html: string): SMSMessage[] {
  const messages: SMSMessage[] = [];
  // Match message_details rows (skip blurred/ad rows)
  const rowRegex = /<div class="row message_details"(?!.*blurred)[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
  let match;
  let idx = 0;
  
  // Alternative simpler approach: find all message_details divs
  const parts = html.split('<div class="row message_details"');
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    // Skip blurred/ad messages
    if (part.includes("blurred") || part.includes("extension")) continue;
    
    // Extract message text - content inside <span> within msgg div
    let message = "";
    const msgMatch = part.match(/class="col-md-6 msgg"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>\s*<\/div>/);
    if (msgMatch) {
      // Clean HTML tags from message, keep text
      message = msgMatch[1]
        .replace(/<span[^>]*>/g, "")
        .replace(/<\/span>/g, "")
        .replace(/<b>/g, "")
        .replace(/<\/b>/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
    
    if (!message) continue;
    
    // Extract sender
    let sender = "";
    const senderMatch = part.match(/class="col-md-3 senderr"[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    if (senderMatch) {
      sender = senderMatch[1].trim();
    }
    
    // Extract time
    let time = "";
    const timeMatch = part.match(/class="col-md-3 time"[\s\S]*?<label>Time<\/label><br>([^<]+)/);
    if (timeMatch) {
      time = timeMatch[1].trim();
    }
    
    messages.push({
      id: `msg-${idx++}-${Date.now()}`,
      message,
      sender,
      time,
    });
  }
  
  return messages;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, country, numberSlug } = body;

    if (action === "getNumbers") {
      // Fetch main page to get available numbers
      const res = await fetch(BASE_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch numbers: ${res.status}`);
      }
      
      const html = await res.text();
      let numbers = parseNumbers(html);
      
      // Filter by country if specified
      if (country) {
        numbers = numbers.filter(n => 
          n.country.toLowerCase().includes(country.toLowerCase())
        );
      }
      
      return new Response(JSON.stringify({ numbers }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getMessages") {
      if (!numberSlug) {
        return new Response(JSON.stringify({ error: "numberSlug required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const url = `${BASE_URL}/sms/${numberSlug}/`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.status}`);
      }
      
      const html = await res.text();
      const messages = parseMessages(html);
      
      return new Response(JSON.stringify({ messages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
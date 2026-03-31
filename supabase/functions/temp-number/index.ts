import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_URL = "https://receive-smss.com";
const BASE_URL_2 = "https://www.receivesms.co";

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
};

interface NumberInfo {
  number: string;
  country: string;
  slug: string;
  source?: string;
  pageUrl?: string;
}

interface SMSMessage {
  id: string;
  message: string;
  sender: string;
  time: string;
}

interface CountryPage {
  country: string;
  url: string;
  count: number;
  code: string;
}

// ── Source 1: receive-smss.com ──
function parseNumbers(html: string): NumberInfo[] {
  const numbers: NumberInfo[] = [];
  const numberRegex = /class="number-boxes-itemm-number"[^>]*>([^<]+)<\/div>\s*<div[^>]*class="number-boxes-item-country[^"]*"[^>]*>([^<]+)/g;
  let match;
  while ((match = numberRegex.exec(html)) !== null) {
    const num = match[1].trim();
    const country = match[2].trim();
    const digits = num.replace(/[^0-9]/g, "");
    numbers.push({ number: num, country, slug: digits, source: "receive-smss" });
  }
  return numbers;
}

function parseMessages(html: string): SMSMessage[] {
  const messages: SMSMessage[] = [];
  const parts = html.split('<div class="row message_details"');
  let idx = 0;

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes("blurred") || part.includes("extension")) continue;

    let message = "";
    const msgMatch = part.match(/class="col-md-6 msgg"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>\s*<\/div>/);
    if (msgMatch) {
      message = msgMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }
    if (!message) continue;

    let sender = "";
    const senderMatch = part.match(/class="col-md-3 senderr"[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    if (senderMatch) sender = senderMatch[1].trim();

    let time = "";
    const timeMatch = part.match(/class="col-md-3 time"[\s\S]*?<label>Time<\/label><br>([^<]+)/);
    if (timeMatch) time = timeMatch[1].trim();

    messages.push({ id: `msg-${idx++}-${Date.now()}`, message, sender, time });
  }
  return messages;
}

// ── Source 2: receivesms.co ──
function parseCountryPages(html: string): CountryPage[] {
  const pages: CountryPage[] = [];
  const regex = /<a class="card card-link" href="(https:\/\/www\.receivesms\.co\/[^"]+)">\s*<div class="row">\s*<img[^>]*alt="([^"]*)"[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/div>\s*<div class="muted">Active numbers:\s*(\d+)<\/div>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    pages.push({ url: m[1], code: m[2], country: m[3].trim(), count: parseInt(m[4]) });
  }
  return pages;
}

function parseSource2Numbers(html: string, country: string): NumberInfo[] {
  const numbers: NumberInfo[] = [];
  // Match: <strong>+1 219-295-8005</strong> inside card links
  const regex = /<a class="card card-link" href="(https:\/\/www\.receivesms\.co\/[^"]+\/(\d+)\/)">\s*<div class="row">\s*<img[^>]*>\s*<strong>([^<]+)<\/strong>/g;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const num = m[3].trim();
    const digits = num.replace(/[^0-9]/g, "");
    numbers.push({
      number: num,
      country,
      slug: digits,
      source: "receivesms-co",
      pageUrl: m[1],
    });
  }
  return numbers;
}

function parseSource2Messages(html: string): SMSMessage[] {
  const messages: SMSMessage[] = [];
  const parts = html.split('<article class="entry-card');
  let idx = 0;

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    let message = "";
    const bodyMatch = part.match(/<div class="sms">([\s\S]*?)<\/div>/);
    if (bodyMatch) {
      message = bodyMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }
    if (!message) continue;

    let sender = "";
    const senderMatch = part.match(/class="from-link">([^<]+)<\/a>/);
    if (senderMatch) sender = senderMatch[1].trim();

    let time = "";
    const timeMatch = part.match(/<span class="muted">([^<]+)<\/span>/);
    if (timeMatch) time = timeMatch[1].trim();

    messages.push({ id: `s2-${idx++}-${Date.now()}`, message, sender, time });
  }
  return messages;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, country, numberSlug, countryUrl, source } = body;

    if (action === "getNumbers") {
      const res = await fetch(BASE_URL, { headers: FETCH_HEADERS });
      if (!res.ok) throw new Error(`Failed to fetch numbers: ${res.status}`);
      const html = await res.text();
      let numbers = parseNumbers(html);
      if (country) {
        numbers = numbers.filter(n => n.country.toLowerCase().includes(country.toLowerCase()));
      }
      return new Response(JSON.stringify({ numbers }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getCountryList") {
      const res = await fetch(BASE_URL_2, { headers: FETCH_HEADERS });
      if (!res.ok) throw new Error(`Failed to fetch country list: ${res.status}`);
      const html = await res.text();
      const countries = parseCountryPages(html);
      return new Response(JSON.stringify({ countries }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getCountryNumbers") {
      if (!countryUrl) {
        return new Response(JSON.stringify({ error: "countryUrl required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const countryName = body.countryName || "Unknown";
      const res = await fetch(countryUrl, { headers: FETCH_HEADERS });
      if (!res.ok) throw new Error(`Failed to fetch country numbers: ${res.status}`);
      const html = await res.text();
      const numbers = parseSource2Numbers(html, countryName);
      return new Response(JSON.stringify({ numbers }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getMessages") {
      if (!numberSlug) {
        return new Response(JSON.stringify({ error: "numberSlug required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Determine source
      const msgSource = source || "receive-smss";

      if (msgSource === "receivesms-co") {
        // For receivesms.co, we need the pageUrl
        const pageUrl = body.pageUrl;
        if (!pageUrl) {
          return new Response(JSON.stringify({ error: "pageUrl required for receivesms-co source" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const res = await fetch(pageUrl, { headers: FETCH_HEADERS });
        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
        const html = await res.text();
        const messages = parseSource2Messages(html);
        return new Response(JSON.stringify({ messages }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Default: receive-smss.com
      const url = `${BASE_URL}/sms/${numberSlug}/`;
      const res = await fetch(url, { headers: FETCH_HEADERS });
      if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
      const html = await res.text();
      const messages = parseMessages(html);
      return new Response(JSON.stringify({ messages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

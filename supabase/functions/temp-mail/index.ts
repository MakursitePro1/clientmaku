import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_BASE = "https://www.1secmail.com/api/v1/";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === "getDomains") {
      const res = await fetch(`${API_BASE}?action=getDomainList`);
      const data = await res.json();
      return new Response(JSON.stringify({ domains: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generateEmail") {
      const { domain } = params;
      // Generate a random login
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let login = "";
      for (let i = 0; i < 12; i++) {
        login += chars[Math.floor(Math.random() * chars.length)];
      }
      return new Response(JSON.stringify({ login, domain, address: `${login}@${domain}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getMessages") {
      const { login, domain } = params;
      const res = await fetch(`${API_BASE}?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getMessage") {
      const { login, domain, id } = params;
      const res = await fetch(`${API_BASE}?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${id}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Primary: mail.gw (better accepted domains like oakon.com, teihu.com)
// Fallback: mail.tm
const PROVIDERS = [
  { name: "mail.gw", base: "https://api.mail.gw" },
  { name: "mail.tm", base: "https://api.mail.tm" },
];

async function tryFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  return res;
}

async function getDomains(): Promise<{ domains: any[]; provider: string }> {
  for (const p of PROVIDERS) {
    try {
      const res = await tryFetch(`${p.base}/domains`);
      if (res.ok) {
        const data = await res.json();
        // mail.gw returns array directly, mail.tm returns hydra format
        const domains = Array.isArray(data) ? data : (data?.["hydra:member"] || data?.member || []);
        if (domains.length > 0) {
          return { domains, provider: p.base };
        }
      } else {
        await res.text(); // consume body
      }
    } catch {
      // try next provider
    }
  }
  return { domains: [], provider: "" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const providerBase = params.providerBase || "";

    if (action === "getDomains") {
      const { domains, provider } = await getDomains();
      return new Response(JSON.stringify({ domains, providerBase: provider }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "createAccount") {
      const { address, password } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "login") {
      const { address, password } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "getMessages") {
      const { token } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      // Guard against HTML responses
      try {
        const data = JSON.parse(text);
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ "hydra:member": [], error: "Invalid response from provider" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "getMessage") {
      const { token, messageId } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid response from provider" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "deleteMessage") {
      const { token, messageId } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.text(); // consume
      return new Response(JSON.stringify({ success: res.ok }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "deleteAccount") {
      const { token, accountId } = params;
      const base = providerBase || PROVIDERS[0].base;
      const res = await tryFetch(`${base}/accounts/${accountId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.text(); // consume
      return new Response(JSON.stringify({ success: res.ok }), {
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

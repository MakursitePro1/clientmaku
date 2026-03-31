import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_BASE = "https://api.mail.tm";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === "getDomains") {
      const res = await fetch(`${API_BASE}/domains`);
      const data = await res.json();
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "createAccount") {
      const { address, password } = params;
      const res = await fetch(`${API_BASE}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "login") {
      const { address, password } = params;
      const res = await fetch(`${API_BASE}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, password }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "getMessages") {
      const { token } = params;
      const res = await fetch(`${API_BASE}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "getMessage") {
      const { token, messageId } = params;
      const res = await fetch(`${API_BASE}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "deleteMessage") {
      const { token, messageId } = params;
      const res = await fetch(`${API_BASE}/messages/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return new Response(JSON.stringify({ success: res.ok }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "deleteAccount") {
      const { token, accountId } = params;
      const res = await fetch(`${API_BASE}/accounts/${accountId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return new Response(JSON.stringify({ success: res.ok }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

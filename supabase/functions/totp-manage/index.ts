import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// TOTP implementation using Web Crypto API
function base32Encode(buffer: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(encoded: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanInput = encoded.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  for (let i = 0; i < cleanInput.length; i++) {
    const idx = alphabet.indexOf(cleanInput[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
}

async function generateHOTP(secret: Uint8Array, counter: bigint): Promise<string> {
  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setBigUint64(0, counter, false);

  const key = await crypto.subtle.importKey(
    "raw", secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, counterBuffer);
  const hmac = new Uint8Array(signature);

  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, "0");
}

async function generateTOTP(secret: Uint8Array, timeStep = 30): Promise<string> {
  const counter = BigInt(Math.floor(Date.now() / 1000 / timeStep));
  return generateHOTP(secret, counter);
}

async function verifyTOTP(secret: Uint8Array, token: string, window = 1): Promise<boolean> {
  const timeStep = 30;
  const counter = BigInt(Math.floor(Date.now() / 1000 / timeStep));
  for (let i = -window; i <= window; i++) {
    const code = await generateHOTP(secret, counter + BigInt(i));
    if (code === token) return true;
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // User client to get current user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for DB operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check if user is admin
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, code } = await req.json();

    if (action === "setup") {
      // Generate new TOTP secret
      const secretBytes = new Uint8Array(20);
      crypto.getRandomValues(secretBytes);
      const secret = base32Encode(secretBytes);

      // Store secret (upsert)
      await adminClient.from("totp_secrets").upsert(
        { user_id: user.id, secret, is_verified: false },
        { onConflict: "user_id" }
      );

      const issuer = "Cyber Venom Admin";
      const accountName = user.email || "admin";
      const uri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

      return new Response(JSON.stringify({ secret, uri }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify") {
      if (!code || code.length !== 6) {
        return new Response(JSON.stringify({ error: "Invalid code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: totpData } = await adminClient
        .from("totp_secrets")
        .select("secret, is_verified")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!totpData) {
        return new Response(JSON.stringify({ error: "TOTP not set up" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const secretBytes = base32Decode(totpData.secret);
      const valid = await verifyTOTP(secretBytes, code);

      if (valid && !totpData.is_verified) {
        await adminClient
          .from("totp_secrets")
          .update({ is_verified: true })
          .eq("user_id", user.id);
      }

      return new Response(JSON.stringify({ valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "status") {
      const { data: totpData } = await adminClient
        .from("totp_secrets")
        .select("is_verified")
        .eq("user_id", user.id)
        .maybeSingle();

      return new Response(JSON.stringify({
        enabled: !!totpData?.is_verified,
        setup_pending: totpData ? !totpData.is_verified : false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "disable") {
      if (!code || code.length !== 6) {
        return new Response(JSON.stringify({ error: "Code required to disable" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: totpData } = await adminClient
        .from("totp_secrets")
        .select("secret")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!totpData) {
        return new Response(JSON.stringify({ error: "TOTP not set up" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const secretBytes = base32Decode(totpData.secret);
      const valid = await verifyTOTP(secretBytes, code);

      if (!valid) {
        return new Response(JSON.stringify({ error: "Invalid code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await adminClient.from("totp_secrets").delete().eq("user_id", user.id);

      return new Response(JSON.stringify({ disabled: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

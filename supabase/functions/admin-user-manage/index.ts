import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Verify the caller is an admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // ACTION: create-admin — Create a new user and assign admin role
    if (action === "create-admin") {
      const { email, password, display_name } = body;

      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (password.length < 6) {
        return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create user via admin API
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: display_name || email },
      });

      if (createError) {
        // Check if user already exists
        if (createError.message?.includes("already been registered") || createError.message?.includes("already exists")) {
          return new Response(JSON.stringify({ error: "A user with this email already exists. Use 'Add Existing User' instead." }), {
            status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Assign admin role
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({ user_id: newUser.user.id, role: "admin" });

      if (roleError) {
        return new Response(JSON.stringify({ error: `User created but role assignment failed: ${roleError.message}` }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        user_id: newUser.user.id,
        message: `Admin user "${display_name || email}" created successfully.`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: toggle-totp — Enable or disable TOTP requirement for a user
    if (action === "toggle-totp") {
      const { target_user_id, enabled } = body;

      if (!target_user_id) {
        return new Response(JSON.stringify({ error: "target_user_id is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (enabled) {
        // Check if TOTP secret already exists
        const { data: existing } = await adminClient
          .from("totp_secrets")
          .select("id")
          .eq("user_id", target_user_id)
          .maybeSingle();

        if (!existing) {
          // Generate a TOTP secret for the user
          const secretBytes = new Uint8Array(20);
          crypto.getRandomValues(secretBytes);
          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
          let bits = 0, value = 0, secret = "";
          for (let i = 0; i < secretBytes.length; i++) {
            value = (value << 8) | secretBytes[i];
            bits += 8;
            while (bits >= 5) { secret += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; }
          }
          if (bits > 0) secret += alphabet[(value << (5 - bits)) & 31];

          await adminClient.from("totp_secrets").insert({
            user_id: target_user_id,
            secret,
            is_verified: false,
          });
        }

        return new Response(JSON.stringify({ success: true, totp_enabled: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        // Disable — remove TOTP secret
        await adminClient.from("totp_secrets").delete().eq("user_id", target_user_id);

        return new Response(JSON.stringify({ success: true, totp_enabled: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ACTION: get-totp-status — Get TOTP status for multiple users
    if (action === "get-totp-status") {
      const { user_ids } = body;

      if (!user_ids || !Array.isArray(user_ids)) {
        return new Response(JSON.stringify({ error: "user_ids array is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: totpData } = await adminClient
        .from("totp_secrets")
        .select("user_id, is_verified")
        .in("user_id", user_ids);

      const statusMap: Record<string, { enabled: boolean; verified: boolean }> = {};
      for (const uid of user_ids) {
        const entry = totpData?.find((t: any) => t.user_id === uid);
        statusMap[uid] = {
          enabled: !!entry,
          verified: !!entry?.is_verified,
        };
      }

      return new Response(JSON.stringify({ statuses: statusMap }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ACTION: get-admin-emails — Get emails for admin users
    if (action === "get-admin-emails") {
      const { user_ids } = body;

      if (!user_ids || !Array.isArray(user_ids)) {
        return new Response(JSON.stringify({ error: "user_ids array is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const emailMap: Record<string, string> = {};
      for (const uid of user_ids) {
        const { data: userData } = await adminClient.auth.admin.getUserById(uid);
        if (userData?.user?.email) {
          emailMap[uid] = userData.user.email;
        }
      }

      return new Response(JSON.stringify({ emails: emailMap }), {
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

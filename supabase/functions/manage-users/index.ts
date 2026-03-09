import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: caller } } = await anonClient.auth.getUser();
    if (!caller) throw new Error("Unauthorized");

    const { data: hasAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (!hasAdmin) throw new Error("Admin access required");

    const { action, ...params } = await req.json();

    if (action === "list") {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;

      const { data: allRoles } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role");

      const { data: allProfiles } = await supabaseAdmin
        .from("profiles")
        .select("id, display_name");

      const enriched = users.map((u) => {
        const roles = allRoles?.filter((r) => r.user_id === u.id).map((r) => r.role) || [];
        const profile = allProfiles?.find((p) => p.id === u.id);
        return {
          id: u.id,
          email: u.email,
          display_name: profile?.display_name || u.email,
          windows_account: u.user_metadata?.windows_account || "",
          roles,
          banned: u.banned_until ? new Date(u.banned_until) > new Date() : false,
          created_at: u.created_at,
        };
      });

      return new Response(JSON.stringify(enriched), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const { email, password, display_name, role, windows_account } = params;
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name: display_name || email,
          windows_account: windows_account || "",
        },
      });
      if (createError) throw createError;

      if (role) {
        await supabaseAdmin.from("user_roles").insert({
          user_id: newUser.user.id,
          role,
        });
      }

      return new Response(JSON.stringify({ message: "User created", id: newUser.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_role") {
      const { user_id, role } = params;
      await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
      if (role) {
        await supabaseAdmin.from("user_roles").insert({ user_id, role });
      }
      return new Response(JSON.stringify({ message: "Role updated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "toggle_ban") {
      const { user_id, ban } = params;
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        ban_duration: ban ? "876000h" : "none",
      });
      if (error) throw error;
      return new Response(JSON.stringify({ message: ban ? "User banned" : "User unbanned" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "batch_set_windows_account") {
      // Set windows_account = display_name for all users that don't have one
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      let updated = 0;
      for (const u of users) {
        const wa = u.user_metadata?.windows_account;
        const dn = u.user_metadata?.display_name || u.email;
        if (!wa || wa === "") {
          await supabaseAdmin.auth.admin.updateUserById(u.id, {
            user_metadata: { ...u.user_metadata, windows_account: dn },
          });
          updated++;
        }
      }
      return new Response(JSON.stringify({ message: `Updated ${updated} users` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { user_id, display_name, windows_account } = params;
      // Update user_metadata
      const { error: metaErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        user_metadata: { display_name, windows_account: windows_account || "" },
      });
      if (metaErr) throw metaErr;
      // Update profile display_name
      await supabaseAdmin.from("profiles").update({ display_name }).eq("id", user_id);
      return new Response(JSON.stringify({ message: "User updated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { user_id } = params;
      // Prevent deleting yourself
      if (user_id === caller.id) throw new Error("Cannot delete yourself");
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ message: "User deleted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unknown action: " + action);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

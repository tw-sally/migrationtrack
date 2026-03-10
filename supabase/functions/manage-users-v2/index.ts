import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller } } = await anonClient.auth.getUser();
    if (!caller) throw new Error("Unauthorized");

    const { data: hasAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });
    if (!hasAdmin) throw new Error("Admin access required");

    const body = await req.json();
    const action = body?.action;

    // LIST
    if (action === "list") {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;

      const { data: allRoles } = await supabaseAdmin.from("user_roles").select("user_id, role");
      const { data: allProfiles } = await supabaseAdmin.from("profiles").select("id, display_name");

      const enriched = (users ?? []).map((u: any) => {
        const roles = allRoles?.filter((r: any) => r.user_id === u.id).map((r: any) => r.role) || [];
        const profile = allProfiles?.find((p: any) => p.id === u.id);
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
      return jsonResponse(enriched);
    }

    // CREATE
    if (action === "create") {
      const { email, password, display_name, role, windows_account } = body;
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
        const { error: roleError } = await supabaseAdmin.from("user_roles").insert({ user_id: newUser.user.id, role });
        if (roleError) throw roleError;
      }
      return jsonResponse({ message: "User created", id: newUser.user.id });
    }

    // UPDATE ROLE
    if (action === "update_role") {
      const { user_id, role } = body;
      await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
      if (role) {
        const { error } = await supabaseAdmin.from("user_roles").insert({ user_id, role });
        if (error) throw error;
      }
      return jsonResponse({ message: "Role updated" });
    }

    // TOGGLE BAN
    if (action === "toggle_ban") {
      const { user_id, ban } = body;
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        ban_duration: ban ? "876000h" : "none",
      });
      if (error) throw error;
      return jsonResponse({ message: ban ? "User banned" : "User unbanned" });
    }

    // BATCH SET WINDOWS ACCOUNT
    if (action === "batch_set_windows_account") {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;

      let updated = 0;
      for (const u of users ?? []) {
        const wa = u.user_metadata?.windows_account;
        const dn = u.user_metadata?.display_name || u.email;
        if (!wa || wa === "") {
          const { error: ue } = await supabaseAdmin.auth.admin.updateUserById(u.id, {
            user_metadata: { ...u.user_metadata, windows_account: dn },
          });
          if (ue) throw ue;
          updated++;
        }
      }
      return jsonResponse({ message: `Updated ${updated} users` });
    }

    // UPDATE
    if (action === "update") {
      const { user_id, display_name, windows_account } = body;
      const { error: metaErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        user_metadata: { display_name, windows_account: windows_account || "" },
      });
      if (metaErr) throw metaErr;

      const { error: profileErr } = await supabaseAdmin.from("profiles").update({ display_name }).eq("id", user_id);
      if (profileErr) throw profileErr;
      return jsonResponse({ message: "User updated" });
    }

    // DELETE
    if (action === "delete") {
      const { user_id } = body;
      if (user_id === caller.id) throw new Error("Cannot delete yourself");
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return jsonResponse({ message: "User deleted" });
    }

    throw new Error("Unknown action: " + action);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 400);
  }
});

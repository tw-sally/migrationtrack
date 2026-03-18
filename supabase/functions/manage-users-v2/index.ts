import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await anonClient.auth.getUser();
    if (!caller) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: caller.id,
      _role: "admin",
    });

    const body = await req.json();
    const { action } = body;

    // === Self-service actions (any authenticated user) ===

    if (action === "get_self") {
      const { data: profile } = await supabaseAdmin.from("profiles").select("display_name").eq("id", caller.id).single();
      const { data: userAuth } = await supabaseAdmin.auth.admin.getUserById(caller.id);
      return json({
        id: caller.id,
        email: caller.email,
        display_name: profile?.display_name || caller.email,
        windows_account: userAuth?.user?.user_metadata?.windows_account || "",
      });
    }

    if (action === "update_self") {
      const { password, email } = body;
      const updateData: Record<string, unknown> = {};
      if (password) updateData.password = password;
      if (email) updateData.email = email;
      if (Object.keys(updateData).length === 0) return json({ error: "Nothing to update" }, 400);
      const { error } = await supabaseAdmin.auth.admin.updateUserById(caller.id, updateData);
      if (error) throw error;
      return json({ message: "Account updated" });
    }

    // === Admin-only actions below ===
    if (!isAdmin) return json({ error: "Admin access required" }, 403);

    if (action === "list") {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      const { data: allRoles } = await supabaseAdmin.from("user_roles").select("user_id, role");
      const { data: allProfiles } = await supabaseAdmin.from("profiles").select("id, display_name");
      const result = (users ?? []).map((u: any) => ({
        id: u.id,
        email: u.email,
        display_name: allProfiles?.find((p: any) => p.id === u.id)?.display_name || u.email,
        windows_account: u.user_metadata?.windows_account || "",
        roles: allRoles?.filter((r: any) => r.user_id === u.id).map((r: any) => r.role) || [],
        banned: u.banned_until ? new Date(u.banned_until) > new Date() : false,
        created_at: u.created_at,
      }));
      return json(result);
    }

    if (action === "create") {
      const { email, password, display_name, role, windows_account } = body;
      const { data: newUser, error: err } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: display_name || email, windows_account: windows_account || "" },
      });
      if (err) throw err;
      if (role) {
        await supabaseAdmin.from("user_roles").insert({ user_id: newUser.user.id, role });
      }
      return json({ message: "User created", id: newUser.user.id });
    }

    if (action === "update_role") {
      const { user_id, role } = body;
      await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
      if (role) {
        const { error } = await supabaseAdmin.from("user_roles").insert({ user_id, role });
        if (error) throw error;
      }
      return json({ message: "Role updated" });
    }

    if (action === "toggle_ban") {
      const { user_id, ban } = body;
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        ban_duration: ban ? "876000h" : "none",
      });
      if (error) throw error;
      return json({ message: ban ? "Banned" : "Unbanned" });
    }

    if (action === "batch_set_windows_account") {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      let updated = 0;
      for (const u of users ?? []) {
        const wa = u.user_metadata?.windows_account;
        if (!wa || wa === "") {
          const dn = u.user_metadata?.display_name || u.email;
          await supabaseAdmin.auth.admin.updateUserById(u.id, {
            user_metadata: { ...u.user_metadata, windows_account: dn },
          });
          updated++;
        }
      }
      return json({ message: `Updated ${updated} users` });
    }

    if (action === "update") {
      const { user_id, display_name, windows_account, password, email } = body;
      const authUpdate: Record<string, unknown> = {
        user_metadata: { display_name, windows_account: windows_account || "" },
      };
      if (password) authUpdate.password = password;
      if (email) authUpdate.email = email;
      await supabaseAdmin.auth.admin.updateUserById(user_id, authUpdate);
      await supabaseAdmin.from("profiles").update({ display_name }).eq("id", user_id);
      return json({ message: "User updated" });
    }

    if (action === "delete") {
      const { user_id } = body;
      if (user_id === caller.id) return json({ error: "Cannot delete yourself" }, 400);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return json({ message: "User deleted" });
    }

    if (action === "reset_all_passwords") {
      const { password } = body;
      if (!password) return json({ error: "password required" }, 400);
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      let updated = 0;
      for (const u of users ?? []) {
        await supabaseAdmin.auth.admin.updateUserById(u.id, { password });
        updated++;
      }
      return json({ message: `Reset ${updated} user passwords` });
    }

    return json({ error: "Unknown action: " + action }, 400);
  } catch (e: any) {
    return json({ error: e.message || String(e) }, 400);
  }
});

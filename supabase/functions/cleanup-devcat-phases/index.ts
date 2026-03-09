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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find all Dev/CAT template IDs
    const { data: templates, error: tErr } = await supabase
      .from("task_templates")
      .select("id, name")
      .or("name.ilike.%dev%,name.ilike.%cat%");
    if (tErr) throw tErr;

    const devCatTemplateIds = templates?.map(t => t.id) || [];
    if (devCatTemplateIds.length === 0) {
      return new Response(JSON.stringify({ message: "No Dev/CAT templates found", deleted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find not_started migrations using these templates
    const { data: migrations, error: mErr } = await supabase
      .from("migrations")
      .select("id")
      .in("template_id", devCatTemplateIds)
      .eq("overall_status", "not_started");
    if (mErr) throw mErr;

    const migrationIds = migrations?.map(m => m.id) || [];
    if (migrationIds.length === 0) {
      return new Response(JSON.stringify({ message: "No not_started Dev/CAT migrations found", deleted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete D-3M and D-2M tasks for these migrations
    const { data: deleted, error: dErr } = await supabase
      .from("migration_tasks")
      .delete()
      .in("migration_id", migrationIds)
      .in("milestone", ["D-3M", "D-2M"])
      .select("id");
    if (dErr) throw dErr;

    return new Response(JSON.stringify({
      message: `Removed D-3M & D-2M tasks from ${migrationIds.length} migrations`,
      migrations_affected: migrationIds.length,
      tasks_deleted: deleted?.length || 0,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

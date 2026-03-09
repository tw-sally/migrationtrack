import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { dbids, milestone, status } = await req.json();
  if (!dbids || !Array.isArray(dbids) || !milestone || !status) {
    return new Response(JSON.stringify({ error: "dbids, milestone, status required" }), { status: 400, headers: corsHeaders });
  }

  const today = new Date().toISOString().split("T")[0];

  // Get migration IDs
  const { data: migrations, error: mErr } = await supabase
    .from("migrations")
    .select("id, dbid")
    .in("dbid", dbids);

  if (mErr) {
    return new Response(JSON.stringify({ error: mErr.message }), { status: 500, headers: corsHeaders });
  }

  const migrationIds = (migrations || []).map((m: any) => m.id);
  const results: any[] = [];

  for (const mig of (migrations || [])) {
    const { data: tasks, error: tErr } = await supabase
      .from("migration_tasks")
      .update({
        status,
        completed_at: status === "completed" ? today : null,
      })
      .eq("migration_id", mig.id)
      .eq("milestone", milestone)
      .select("id");

    if (tErr) {
      results.push({ dbid: mig.dbid, error: tErr.message });
      continue;
    }

    // Recalculate completion percent
    const { data: allTasks } = await supabase
      .from("migration_tasks")
      .select("status")
      .eq("migration_id", mig.id);

    if (allTasks && allTasks.length > 0) {
      const completed = allTasks.filter((t: any) => t.status === "completed").length;
      const percent = Math.round((completed / allTasks.length) * 100);
      await supabase.from("migrations").update({
        completion_percent: percent,
        overall_status: percent === 100 ? "completed" : percent > 0 ? "in_progress" : "not_started",
      }).eq("id", mig.id);
    }

    results.push({ dbid: mig.dbid, tasksUpdated: tasks?.length || 0 });
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

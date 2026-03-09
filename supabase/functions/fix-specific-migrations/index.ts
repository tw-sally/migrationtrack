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

  const { dbids } = await req.json();
  if (!dbids || !Array.isArray(dbids)) {
    return new Response(JSON.stringify({ error: "dbids array required" }), { status: 400, headers: corsHeaders });
  }

  const { data: migrations, error: mErr } = await supabase
    .from("migrations")
    .select("*")
    .in("dbid", dbids);

  if (mErr) {
    return new Response(JSON.stringify({ error: mErr.message }), { status: 500, headers: corsHeaders });
  }

  const { data: allTemplateTasks } = await supabase
    .from("template_tasks")
    .select("*")
    .order("order");

  const results: any[] = [];

  for (const mig of (migrations || [])) {
    if (!mig.template_id) continue;

    const tplTasks = (allTemplateTasks || []).filter((t: any) => t.template_id === mig.template_id);
    if (tplTasks.length === 0) continue;

    await supabase.from("migration_tasks").delete().eq("migration_id", mig.id);

    const getDueDate = (milestone: string) => {
      if (milestone === "D-3M") return mig.d_minus_3m || mig.migration_date;
      if (milestone === "D-2M") return mig.d_minus_2m || mig.migration_date;
      if (milestone === "D-1M") return mig.d_minus_1m || mig.migration_date;
      return mig.migration_date;
    };

    const newTasks = tplTasks.map((tt: any) => ({
      migration_id: mig.id,
      title: tt.title,
      milestone: tt.milestone,
      input_type: tt.input_type,
      assignee: tt.assignee || mig.dba,
      due_date: getDueDate(tt.milestone),
      order: tt.order,
      remarks: tt.remarks || "",
      status: "not_started",
    }));

    await supabase.from("migration_tasks").insert(newTasks);
    await supabase.from("migrations").update({ completion_percent: 0, overall_status: "not_started" }).eq("id", mig.id);

    results.push({ dbid: mig.dbid, taskCount: newTasks.length });
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

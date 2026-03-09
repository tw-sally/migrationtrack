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

  const { migration_month } = await req.json();
  if (!migration_month) {
    return new Response(JSON.stringify({ error: "migration_month required (e.g. 2026-01)" }), { status: 400, headers: corsHeaders });
  }

  // Get all migrations for the month
  const { data: migrations, error: mErr } = await supabase
    .from("migrations")
    .select("*")
    .like("migration_date", `${migration_month}%`);

  if (mErr) {
    return new Response(JSON.stringify({ error: mErr.message }), { status: 500, headers: corsHeaders });
  }

  const results: { dbid: string; taskCount: number }[] = [];

  for (const mig of migrations) {
    if (!mig.template_id) continue;

    // Get template tasks
    const { data: tplTasks } = await supabase
      .from("template_tasks")
      .select("*")
      .eq("template_id", mig.template_id)
      .order("order");

    if (!tplTasks || tplTasks.length === 0) continue;

    // Delete existing tasks
    await supabase.from("migration_tasks").delete().eq("migration_id", mig.id);

    // Build due dates
    const getDueDate = (milestone: string) => {
      if (milestone === "D-3M") return mig.d_minus_3m || mig.migration_date;
      if (milestone === "D-2M") return mig.d_minus_2m || mig.migration_date;
      if (milestone === "D-1M") return mig.d_minus_1m || mig.migration_date;
      return mig.migration_date;
    };

    // Insert new tasks as completed
    const newTasks = tplTasks.map((tt: any) => ({
      migration_id: mig.id,
      title: tt.title,
      milestone: tt.milestone,
      input_type: tt.input_type,
      assignee: tt.assignee || mig.dba,
      due_date: getDueDate(tt.milestone),
      order: tt.order,
      remarks: tt.remarks || "",
      status: "completed",
      completed_at: new Date().toISOString().split("T")[0],
    }));

    const { error: insErr } = await supabase.from("migration_tasks").insert(newTasks);
    if (insErr) {
      console.error(`Failed to insert tasks for ${mig.dbid}:`, insErr);
      continue;
    }

    // Update migration to 100%
    await supabase.from("migrations").update({
      completion_percent: 100,
      overall_status: "completed",
    }).eq("id", mig.id);

    results.push({ dbid: mig.dbid, taskCount: newTasks.length });
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

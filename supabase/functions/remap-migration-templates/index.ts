import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Template IDs
    const STANDARD_PROD = "00000000-0000-0000-0000-000000000001";
    const DBVM = "00000000-0000-0000-0000-000000000002";
    const DEV_CAT = "00000000-0000-0000-0000-000000000003";

    // Step 1: Update template_id based on rules (TEST first, then Physical, then DBVM)
    // TEST → Dev/CAT DB Migration
    await supabase.from("migrations").update({ template_id: DEV_CAT }).eq("prod_or_test", "TEST");
    // Physical → Standard PROD Migration (only non-TEST)
    await supabase.from("migrations").update({ template_id: STANDARD_PROD }).neq("prod_or_test", "TEST").ilike("db_type", "%Physical%");
    // DBVM → DBVM Migration (only non-TEST)
    await supabase.from("migrations").update({ template_id: DBVM }).neq("prod_or_test", "TEST").ilike("db_type", "%DBVM%");

    // Step 2: Get all migrations
    const { data: migrations, error: mErr } = await supabase.from("migrations").select("id, template_id, dba, migration_date, d_minus_3m, d_minus_2m, d_minus_1m");
    if (mErr) throw mErr;

    // Step 3: Get all template tasks
    const { data: templateTasks, error: tErr } = await supabase.from("template_tasks").select("*").order("order");
    if (tErr) throw tErr;

    // Step 4: Get migrations that already have tasks
    const { data: existingTasks, error: etErr } = await supabase.from("migration_tasks").select("migration_id");
    if (etErr) throw etErr;
    const migrationsWithTasks = new Set((existingTasks || []).map(t => t.migration_id));

    // Step 5: For migrations without tasks, generate from template
    const tasksToInsert: any[] = [];
    for (const m of (migrations || [])) {
      if (!m.template_id) continue;
      if (migrationsWithTasks.has(m.id)) continue;

      const tplTasks = (templateTasks || []).filter(t => t.template_id === m.template_id);
      for (const tt of tplTasks) {
        let dueDate = m.migration_date;
        if (tt.milestone === "D-3M") dueDate = m.d_minus_3m || m.migration_date;
        else if (tt.milestone === "D-2M") dueDate = m.d_minus_2m || m.migration_date;
        else if (tt.milestone === "D-1M") dueDate = m.d_minus_1m || m.migration_date;
        else if (tt.milestone === "Post") dueDate = m.migration_date;

        tasksToInsert.push({
          migration_id: m.id,
          title: tt.title,
          milestone: tt.milestone,
          input_type: tt.input_type,
          assignee: tt.assignee || m.dba,
          due_date: dueDate,
          order: tt.order,
          remarks: tt.remarks || "",
          status: "not_started",
        });
      }
    }

    // Insert in batches of 500
    let inserted = 0;
    for (let i = 0; i < tasksToInsert.length; i += 500) {
      const batch = tasksToInsert.slice(i, i + 500);
      const { error: iErr } = await supabase.from("migration_tasks").insert(batch);
      if (iErr) throw iErr;
      inserted += batch.length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        migrationsUpdated: (migrations || []).length,
        tasksGenerated: inserted,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

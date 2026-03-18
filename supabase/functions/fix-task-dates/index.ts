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

  // Get all migrations
  const { data: migrations, error: mErr } = await supabase.from("migrations").select("*");
  if (mErr) return new Response(JSON.stringify({ error: mErr.message }), { status: 500, headers: corsHeaders });

  let updatedCount = 0;

  for (const m of (migrations || [])) {
    const { data: tasks } = await supabase.from("migration_tasks").select("id, milestone, due_date").eq("migration_id", m.id);
    if (!tasks) continue;

    for (const t of tasks) {
      let expectedDueDate = m.migration_date;
      if (t.milestone === "D-3M") expectedDueDate = m.d_minus_3m;
      else if (t.milestone === "D-2M") expectedDueDate = m.d_minus_2m;
      else if (t.milestone === "D-1M") expectedDueDate = m.d_minus_1m;

      if (t.due_date !== expectedDueDate) {
        const endDate = new Date(expectedDueDate + "T00:00:00");
        endDate.setMonth(endDate.getMonth() + 1);
        const endDateStr = endDate.toISOString().split("T")[0];

        await supabase.from("migration_tasks").update({
          due_date: expectedDueDate,
          end_date: endDateStr,
        }).eq("id", t.id);
        updatedCount++;
      }
    }
  }

  return new Response(JSON.stringify({ success: true, updatedCount }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

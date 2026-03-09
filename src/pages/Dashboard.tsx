import { useState, useMemo, useEffect } from "react";
import { useMigrationData, MigrationDB } from "@/contexts/MigrationContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Database, AlertTriangle, CheckCircle, Clock, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const COLORS = [
  "hsl(215, 80%, 48%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(270, 60%, 55%)",
];

export default function Dashboard() {
  const { migrations, templates } = useMigrationData();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [delayedMigrationIds, setDelayedMigrationIds] = useState<Set<string>>(new Set());

  const toggleTemplate = (id: string) => {
    setSelectedTemplates(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const filtered = useMemo(() => {
    if (selectedTemplates.length === 0) return migrations;
    return migrations.filter(m => m.template_id && selectedTemplates.includes(m.template_id));
  }, [migrations, selectedTemplates]);

  // Compute delayed: current date > migration_date AND first D-Day task not completed
  useEffect(() => {
    const computeDelayed = async () => {
      const today = new Date().toISOString().split("T")[0];
      const pastDueMigrations = migrations.filter(m => m.migration_date < today && m.overall_status !== "completed");
      if (pastDueMigrations.length === 0) { setDelayedMigrationIds(new Set()); return; }

      const ids = pastDueMigrations.map(m => m.id);
      const { data: dDayTasks } = await supabase
        .from("migration_tasks")
        .select("id, migration_id, status, order")
        .in("migration_id", ids)
        .eq("milestone", "D-Day")
        .order("order", { ascending: true });

      // Group by migration_id, check if first D-Day task is not completed
      const delayedIds = new Set<string>();
      const seen = new Set<string>();
      for (const t of (dDayTasks || [])) {
        if (!seen.has(t.migration_id)) {
          seen.add(t.migration_id);
          if (t.status !== "completed") {
            delayedIds.add(t.migration_id);
          }
        }
      }
      // Also include past-due migrations with no D-Day tasks at all
      for (const m of pastDueMigrations) {
        if (!seen.has(m.id)) delayedIds.add(m.id);
      }
      setDelayedMigrationIds(delayedIds);
    };
    computeDelayed();
  }, [migrations]);

  const delayedMigrations = useMemo(() => filtered.filter(m => delayedMigrationIds.has(m.id)), [filtered, delayedMigrationIds]);

  const total = filtered.length;
  const completed = filtered.filter(m => m.overall_status === "completed").length;
  const inProgress = filtered.filter(m => m.overall_status === "in_progress").length;
  const delayed = delayedMigrations.length;
  const notStarted = filtered.filter(m => m.overall_status === "not_started").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byMonth: Record<string, { month: string; count: number; completed: number; delayed: number }> = {};
  filtered.forEach(m => {
    const month = m.migration_date.substring(0, 7);
    if (!byMonth[month]) byMonth[month] = { month, count: 0, completed: 0, delayed: 0 };
    byMonth[month].count++;
    if (m.overall_status === "completed") byMonth[month].completed++;
    if (m.overall_status === "delayed") byMonth[month].delayed++;
  });
  const monthlyData = Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));

  const byTaskOwner: Record<string, { prod: number; test: number }> = {};
  filtered.forEach(m => {
    if (!byTaskOwner[m.task_owner]) byTaskOwner[m.task_owner] = { prod: 0, test: 0 };
    if (m.prod_or_test === "PROD") byTaskOwner[m.task_owner].prod++;
    else byTaskOwner[m.task_owner].test++;
  });
  const dbaData = Object.entries(byTaskOwner)
    .map(([name, v]) => ({ name, prod: v.prod, test: v.test, total: v.prod + v.test }))
    .sort((a, b) => b.total - a.total);
  const dbaChartHeight = Math.max(250, dbaData.length * 40);

  const statusData = [
    { name: "Completed", value: completed }, { name: "In Progress", value: inProgress },
    { name: "Not Started", value: notStarted }, { name: "Delayed", value: delayed },
  ].filter(d => d.value > 0);

  const summaryCards = [
    { title: "Total DBs", value: total, icon: Database, color: "text-primary" },
    { title: "Completed", value: completed, icon: CheckCircle, color: "text-success" },
    { title: "In Progress", value: inProgress, icon: Clock, color: "text-in-progress" },
    { title: "Delayed", value: delayed, icon: AlertTriangle, color: "text-delay" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Migration Dashboard</h1>
          <p className="text-muted-foreground">Track progress of all database migrations</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
              {selectedTemplates.length === 0 ? "All Templates" : `${selectedTemplates.length} template(s)`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-3" align="end">
            <div className="space-y-2">
              {templates.map(t => (
                <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={selectedTemplates.includes(t.id)} onCheckedChange={() => toggleTemplate(t.id)} />
                  {t.name}
                </label>
              ))}
              {selectedTemplates.length > 0 && (
                <Button variant="ghost" size="sm" className="w-full mt-1 text-xs" onClick={() => setSelectedTemplates([])}>Clear All</Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map(card => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{card.title}</p><p className="text-3xl font-bold">{card.value}</p></div>
                <card.icon className={`h-8 w-8 ${card.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Completion Rate</p><p className="text-3xl font-bold">{completionRate}%</p></div>
              <Percent className="h-8 w-8 text-success opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Migration Count</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
                <Bar dataKey="count" name="Total" fill="hsl(215, 80%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Migration Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Task Owner Workload Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={dbaChartHeight}>
            <BarChart data={dbaData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={110} />
              <Tooltip />
              <Legend />
              <Bar dataKey="prod" name="PROD" stackId="a" fill="hsl(215, 80%, 48%)" radius={[0, 0, 0, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(215, 80%, 48%)" }} />
              <Bar dataKey="test" name="TEST" stackId="a" fill="hsl(220, 13%, 75%)" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(220, 13%, 55%)" }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-delay" /> Delayed Migrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {delayedMigrations.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-delay/5 border border-delay/20">
                <div>
                  <p className="font-medium font-mono text-sm">
                    <span className={m.prod_or_test === "PROD" ? "text-blue-600" : "text-foreground"}>{m.prod_or_test}:{m.dbid}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Task Owner: {m.task_owner} | D-Day: {m.migration_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={m.completion_percent} className="w-32" />
                  <StatusBadge status={m.overall_status} />
                </div>
              </div>
            ))}
            {delayedMigrations.length === 0 && (
              <p className="text-sm text-muted-foreground">No delayed migrations 🎉</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

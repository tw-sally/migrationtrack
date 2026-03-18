import { useState, useEffect } from "react";
import { useMigrationData, MigrationTaskDB } from "@/contexts/MigrationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Loader2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function MyTasks() {
  const { migrations } = useMigrationData();
  const { displayName } = useAuth();
  const taskOwners = [...new Set(migrations.map(m => m.task_owner).filter(Boolean))].sort();
  const [selectedOwner, setSelectedOwner] = useState("");
  const [allTasks, setAllTasks] = useState<MigrationTaskDB[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedOwner && displayName && taskOwners.includes(displayName)) {
      setSelectedOwner(displayName);
    } else if (!selectedOwner && taskOwners.length > 0) {
      setSelectedOwner(taskOwners[0]);
    }
  }, [displayName, taskOwners, selectedOwner]);

  const myMigrationIds = migrations.filter(m => m.task_owner === selectedOwner).map(m => m.id);

  useEffect(() => {
    if (!selectedOwner || myMigrationIds.length === 0) {
      setAllTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase.from("migration_tasks").select("*").in("migration_id", myMigrationIds).order("order")
      .then(({ data }) => {
        setAllTasks((data || []) as MigrationTaskDB[]);
        setLoading(false);
      });
  }, [selectedOwner, myMigrationIds.join(",")]);

  const myMigrations = migrations.filter(m => m.task_owner === selectedOwner && m.overall_status !== "completed").sort((a, b) => a.migration_date.localeCompare(b.migration_date));
  const prodMigrations = myMigrations.filter(m => m.prod_or_test === "PROD");
  const testMigrations = myMigrations.filter(m => m.prod_or_test === "TEST");
  const delayed = myMigrations.filter(m => m.overall_status === "delayed");
  const inProgress = myMigrations.filter(m => m.overall_status === "in_progress");
  const upcoming = myMigrations.filter(m => m.overall_status === "not_started");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const rawRemindingTasks: MigrationTaskDB[] = [];
  const rawDelayTasks: MigrationTaskDB[] = [];

  myMigrations.forEach(m => {
    const phasesDates = [
      { key: "D-3M", date: m.d_minus_3m },
      { key: "D-2M", date: m.d_minus_2m },
      { key: "D-1M", date: m.d_minus_1m },
      { key: "D-Day", date: m.migration_date },
      { key: "Post", date: m.migration_date },
    ];

    phasesDates.forEach(phase => {
      const phaseDate = new Date(phase.date);
      phaseDate.setHours(0, 0, 0, 0);

      const tasksInPhase = allTasks
        .filter(t => t.migration_id === m.id && t.milestone === phase.key && t.status !== "completed")
        .sort((a, b) => a.order - b.order);

      tasksInPhase.forEach(task => {
        const endDate = task.end_date ? new Date(task.end_date) : null;
        if (endDate) endDate.setHours(0, 0, 0, 0);
        const startDate = new Date(task.due_date);
        startDate.setHours(0, 0, 0, 0);

        // Delay: end_date has passed & task not completed
        if (endDate && today > endDate) {
          rawDelayTasks.push(task);
        }
        // Reminding: start date in current month & end_date not yet passed
        else if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear && (!endDate || today <= endDate)) {
          rawRemindingTasks.push(task);
        }
      });
    });
  });

  // Get unique DB (migration_id) sets
  const delayDbIds = new Set(rawDelayTasks.map(t => t.migration_id));
  // Remove reminding tasks whose DB already appears in delay tasks
  const filteredRemindingTasks = rawRemindingTasks.filter(t => !delayDbIds.has(t.migration_id));

  // Determine how many tasks to show per DB based on unique DB count
  const remindingDbIds = new Set(filteredRemindingTasks.map(t => t.migration_id));
  const allUniqueDbCount = new Set([...delayDbIds, ...remindingDbIds]).size;

  const pickTasksPerDb = (tasks: MigrationTaskDB[], maxPerDb: number): MigrationTaskDB[] => {
    const byDb = new Map<string, MigrationTaskDB[]>();
    tasks.forEach(t => {
      if (!byDb.has(t.migration_id)) byDb.set(t.migration_id, []);
      byDb.get(t.migration_id)!.push(t);
    });
    const result: MigrationTaskDB[] = [];
    byDb.forEach(dbTasks => {
      dbTasks.sort((a, b) => a.order - b.order);
      result.push(...dbTasks.slice(0, maxPerDb));
    });
    return result.sort((a, b) => a.order - b.order);
  };

  const tasksPerDb = allUniqueDbCount > 2 ? 1 : 2;
  const remindingTasks = pickTasksPerDb(filteredRemindingTasks, tasksPerDb);
  const delayTasks = pickTasksPerDb(rawDelayTasks, tasksPerDb);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Task Owner personal task view</p>
        </div>
        <Select value={selectedOwner} onValueChange={setSelectedOwner}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>{taskOwners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-delay" /><div><p className="text-2xl font-bold">{delayed.length}</p><p className="text-xs text-muted-foreground">Delayed</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-5 w-5 text-in-progress" /><div><p className="text-2xl font-bold">{inProgress.length}</p><p className="text-xs text-muted-foreground">In Progress</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">{upcoming.length}</p><p className="text-xs text-muted-foreground">Not Started</p></div></CardContent></Card>
      </div>

      {/* Reminding & Delay Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-in-progress" /> Reminding Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {remindingTasks.slice(0, 2).map(task => {
              const migration = migrations.find(m => m.id === task.migration_id);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-in-progress/5 border border-in-progress/20 cursor-pointer hover:bg-in-progress/10" onClick={() => migration && navigate(`/migrations/${migration.id}`)}>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{migration?.dbid} · <Badge variant="outline" className="text-[10px] px-1 py-0">{task.milestone}</Badge> · {task.due_date}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              );
            })}
            {remindingTasks.length === 0 && <p className="text-sm text-muted-foreground">No reminding tasks this month</p>}
          </CardContent>
        </Card>
        <Card className="border-delay/30">
          <CardHeader className="pb-3"><CardTitle className="text-base text-delay flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Delay Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {delayTasks.slice(0, 2).map(task => {
              const migration = migrations.find(m => m.id === task.migration_id);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-delay/5 border border-delay/20 cursor-pointer hover:bg-delay/10" onClick={() => migration && navigate(`/migrations/${migration.id}`)}>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{migration?.dbid} · <Badge variant="outline" className="text-[10px] px-1 py-0">{task.milestone}</Badge> · {task.due_date}</p>
                  </div>
                  <StatusBadge status="delayed" />
                </div>
              );
            })}
            {delayTasks.length === 0 && <p className="text-sm text-muted-foreground">No delayed tasks</p>}
          </CardContent>
        </Card>
      </div>

      {/* PROD & TEST Migration Lists */}
      {[{ label: "PROD", items: prodMigrations }, { label: "TEST", items: testMigrations }].map(group => (
        <Card key={group.label}>
          <CardHeader><CardTitle className="text-base">{group.label} Migrations ({group.items.length})</CardTitle></CardHeader>
          <CardContent className="space-y-0">
            <div className="grid grid-cols-8 gap-4 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <span>DBID</span><span>Phase</span><span>DB Type</span><span>DB Role</span><span>Migration Phase</span><span>D-Day</span><span>Completion</span><span>Status</span>
            </div>
            {group.items.map(m => {
              const todayLocal = new Date();
              todayLocal.setHours(0, 0, 0, 0);
              const phases = [
                { key: "D-3M", label: "D-3M", date: m.d_minus_3m },
                { key: "D-2M", label: "D-2M", date: m.d_minus_2m },
                { key: "D-1M", label: "D-1M", date: m.d_minus_1m },
                { key: "D-Day", label: "D-Day", date: m.migration_date },
                { key: "Post", label: "Post", date: m.migration_date },
              ];
              let currentPhase = phases[0];
              for (let i = phases.length - 1; i >= 0; i--) {
                const phaseDate = new Date(phases[i].date);
                phaseDate.setHours(0, 0, 0, 0);
                if (todayLocal >= phaseDate) { currentPhase = phases[i]; break; }
              }
              const phaseTasks = allTasks.filter(t => t.migration_id === m.id && t.milestone === currentPhase.key).sort((a, b) => a.order - b.order);
              const firstTask = phaseTasks[0];
              const isDelayNotStarted = firstTask && firstTask.status !== "completed" && new Date(firstTask.due_date) < todayLocal;

              return (
                <div key={m.id} className="grid grid-cols-8 gap-4 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/migrations/${m.id}`)}>
                  <span className="font-mono font-medium text-sm">{m.dbid}</span>
                  <Badge variant="secondary" className="text-xs w-fit">{m.phase}</Badge>
                  <span className="text-xs">{m.db_type}</span>
                  <Badge variant="outline" className="text-xs w-fit">{m.prod_or_test}</Badge>
                  <span className="text-xs font-mono">{currentPhase.label}: {currentPhase.date}</span>
                  <span className="text-xs font-mono">{m.migration_date}</span>
                  <ProgressBar value={m.completion_percent} className="w-full" />
                  {isDelayNotStarted ? (
                    <Badge variant="outline" className="text-xs w-fit bg-destructive/15 text-destructive border-destructive/30 font-medium">Delay</Badge>
                  ) : (
                    <StatusBadge status={m.overall_status} />
                  )}
                </div>
              );
            })}
            {group.items.length === 0 && <p className="text-sm text-muted-foreground p-3">No {group.label.toLowerCase()} migrations assigned</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

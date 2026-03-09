import { useState, useEffect } from "react";
import { useMigrationData, MigrationTaskDB } from "@/contexts/MigrationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, CheckCircle, Clock, Zap, PenLine, Check, Send, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function MyTasks() {
  const { migrations, toggleTaskComplete } = useMigrationData();
  const { windowsAccount } = useAuth();
  const taskOwners = [...new Set(migrations.map(m => m.task_owner).filter(Boolean))].sort();
  const [selectedOwner, setSelectedOwner] = useState("");
  const [completedOpen, setCompletedOpen] = useState(false);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [allTasks, setAllTasks] = useState<MigrationTaskDB[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Default to logged-in user's windows account
  useEffect(() => {
    if (!selectedOwner && windowsAccount && taskOwners.includes(windowsAccount)) {
      setSelectedOwner(windowsAccount);
    } else if (!selectedOwner && taskOwners.length > 0) {
      setSelectedOwner(taskOwners[0]);
    }
  }, [windowsAccount, taskOwners, selectedOwner]);

  // Fetch all tasks for the selected DBA
  useEffect(() => {
    if (!selectedOwner) return;
    setLoading(true);
    supabase.from("migration_tasks").select("*").eq("assignee", selectedOwner).order("order")
      .then(({ data }) => {
        setAllTasks((data || []) as MigrationTaskDB[]);
        setLoading(false);
      });
  }, [selectedOwner]);

  const myMigrations = migrations.filter(m => m.task_owner === selectedOwner).sort((a, b) => a.migration_date.localeCompare(b.migration_date));
  const delayed = myMigrations.filter(m => m.overall_status === "delayed");
  const inProgress = myMigrations.filter(m => m.overall_status === "in_progress");
  const upcoming = myMigrations.filter(m => m.overall_status === "not_started");

  const milestoneOrder: Record<string, number> = { "D-3M": 0, "D-2M": 1, "D-1M": 2, "D-Day": 3, "Post": 4 };
  const completedTasks = allTasks.filter(t => t.status === "completed");

  // For each migration, find the next 1 uncompleted task per active phase (current date > phase date)
  const pendingTasks: MigrationTaskDB[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  myMigrations.forEach(m => {
    const phasesDates: { key: string; date: string }[] = [
      { key: "D-3M", date: m.d_minus_3m },
      { key: "D-2M", date: m.d_minus_2m },
      { key: "D-1M", date: m.d_minus_1m },
      { key: "D-Day", date: m.migration_date },
      { key: "Post", date: m.migration_date },
    ];

    phasesDates.forEach(phase => {
      const phaseDate = new Date(phase.date);
      phaseDate.setHours(0, 0, 0, 0);
      if (today > phaseDate) {
        const tasksInPhase = allTasks
          .filter(t => t.migration_id === m.id && t.milestone === phase.key && t.status !== "completed")
          .sort((a, b) => a.order - b.order);
        if (tasksInPhase.length > 0) {
          pendingTasks.push(tasksInPhase[0]);
        }
      }
    });
  });

  pendingTasks.sort((a, b) => (milestoneOrder[a.milestone] ?? 99) - (milestoneOrder[b.milestone] ?? 99) || a.order - b.order);

  const handleToggle = async (taskId: string) => {
    await toggleTaskComplete(taskId);
    // Refresh tasks
    const { data } = await supabase.from("migration_tasks").select("*").eq("assignee", selectedOwner).order("order");
    setAllTasks((data || []) as MigrationTaskDB[]);
  };

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

      {delayed.length > 0 && (
        <Card className="border-delay/30">
          <CardHeader className="pb-3"><CardTitle className="text-base text-delay flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Delayed Items Requiring Attention</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {delayed.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-delay/5 border border-delay/20 cursor-pointer hover:bg-delay/10" onClick={() => navigate(`/migrations/${m.id}`)}>
                <div><p className="font-mono font-medium text-sm">{m.dbid}</p><p className="text-xs text-muted-foreground">D-Day: {m.migration_date}</p></div>
                <ProgressBar value={m.completion_percent} className="w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">My Migrations ({myMigrations.length})</CardTitle></CardHeader>
        <CardContent className="space-y-0">
          <div className="grid grid-cols-8 gap-4 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
            <span>DBID</span><span>Phase</span><span>DB Type</span><span>DB Role</span><span>Migration Phase</span><span>D-Day</span><span>Completion</span><span>Status</span>
          </div>
          {myMigrations.map(m => {
            // Determine current migration phase based on today's date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const phases: { key: string; label: string; date: string }[] = [
              { key: "D-3M", label: "D-3M", date: m.d_minus_3m },
              { key: "D-2M", label: "D-2M", date: m.d_minus_2m },
              { key: "D-1M", label: "D-1M", date: m.d_minus_1m },
              { key: "D-Day", label: "D-Day", date: m.migration_date },
              { key: "Post", label: "Post", date: m.migration_date },
            ];

            // Find which phase we're currently in
            let currentPhase = phases[0];
            for (let i = phases.length - 1; i >= 0; i--) {
              const phaseDate = new Date(phases[i].date);
              phaseDate.setHours(0, 0, 0, 0);
              if (today >= phaseDate) {
                currentPhase = phases[i];
                break;
              }
            }

            // Check if first task in current phase is overdue and not completed
            const phaseTasks = allTasks.filter(t => t.migration_id === m.id && t.milestone === currentPhase.key).sort((a, b) => a.order - b.order);
            const firstTask = phaseTasks[0];
            const isDelayNotStarted = firstTask && firstTask.status !== "completed" && new Date(firstTask.due_date) < today;

            return (
              <div key={m.id} className="grid grid-cols-8 gap-4 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`/migrations/${m.id}`)}>
                <span className="font-mono font-medium text-sm">{m.dbid}</span>
                <Badge variant="secondary" className="text-xs w-fit">{m.phase}</Badge>
                <span className="text-xs">{m.db_type}</span>
                <Badge variant="outline" className="text-xs w-fit">{m.prod_or_test}</Badge>
                <span className="text-xs font-mono">{currentPhase.label}: {currentPhase.date}</span>
                <span className="text-xs font-mono">{m.migration_date}</span>
                <ProgressBar value={m.overall_status === "completed" ? 100 : m.completion_percent} className="w-full" />
                {isDelayNotStarted ? (
                  <Badge variant="outline" className="text-xs w-fit bg-destructive/15 text-destructive border-destructive/30 font-medium">
                    Delay - Not Started
                  </Badge>
                ) : (
                  <StatusBadge status={m.overall_status} />
                )}
              </div>
            );
          })}
          {myMigrations.length === 0 && <p className="text-sm text-muted-foreground p-3">No migrations assigned</p>}
        </CardContent>
      </Card>

      {pendingTasks.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Pending Tasks ({pendingTasks.length})</CardTitle></CardHeader>
          <CardContent className="space-y-0">
            <div className="grid grid-cols-[40px_1fr_100px_100px_110px_110px_100px_180px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
              <span>#</span><span>Task Name</span><span>Sponsor</span><span>Due Date</span><span>Completed</span><span>Check Mode</span><span>Status</span><span>Notes</span>
            </div>
            {pendingTasks.map((task, i) => {
              const migration = migrations.find(m => m.id === task.migration_id);
              return (
                <div key={task.id} className="grid grid-cols-[40px_1fr_100px_100px_110px_110px_100px_180px] gap-2 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-mono text-muted-foreground">{i + 1}</span>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-6 w-6 shrink-0" onClick={() => handleToggle(task.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <div>
                      <span className="text-sm">{task.title}</span>
                      <p className="text-[10px] text-muted-foreground">{migration?.dbid} · <Badge variant="outline" className="text-[10px] px-1 py-0">{task.milestone}</Badge></p>
                    </div>
                  </div>
                  <span className="text-xs">{task.assignee}</span>
                  <span className="text-xs font-mono">{task.due_date}</span>
                  <span className="text-xs font-mono">{task.completed_at || "—"}</span>
                  <div>
                    {task.input_type === "api" ? (
                      <Badge variant="outline" className="text-[10px] gap-1"><Zap className="h-2.5 w-2.5" /> API</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] gap-1"><PenLine className="h-2.5 w-2.5" /> Manual</Badge>
                    )}
                  </div>
                  <StatusBadge status={task.status} />
                  <div className="flex items-center gap-1">
                    <Textarea placeholder="Add a note..." className="text-xs min-h-[28px] h-7 resize-none flex-1" value={noteInput[task.id] || ""} onChange={e => setNoteInput(prev => ({ ...prev, [task.id]: e.target.value }))} />
                    <Button size="sm" variant="ghost" className="h-7 px-1.5"><Send className="h-3 w-3" /></Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {completedTasks.length > 0 && (
        <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
          <Card>
            <CardHeader>
              <CollapsibleTrigger className="flex items-center gap-2 w-full">
                <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                  Completed Tasks ({completedTasks.length})
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${completedOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-0 pt-0">
                <div className="grid grid-cols-[40px_1fr_100px_100px_110px_110px_100px_180px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  <span>#</span><span>Task Name</span><span>Sponsor</span><span>Due Date</span><span>Completed</span><span>Check Mode</span><span>Status</span><span>Notes</span>
                </div>
                {completedTasks.map((task, i) => {
                  const migration = migrations.find(m => m.id === task.migration_id);
                  return (
                    <div key={task.id} className="grid grid-cols-[40px_1fr_100px_100px_110px_110px_100px_180px] gap-2 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors opacity-70">
                      <span className="text-sm font-mono text-muted-foreground">{i + 1}</span>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-6 w-6 shrink-0 bg-success/10 border-success/30" onClick={() => handleToggle(task.id)}>
                          <Check className="h-3 w-3 text-success" />
                        </Button>
                        <div>
                          <span className="text-sm line-through text-muted-foreground">{task.title}</span>
                          <p className="text-[10px] text-muted-foreground">{migration?.dbid} · <Badge variant="outline" className="text-[10px] px-1 py-0">{task.milestone}</Badge></p>
                        </div>
                      </div>
                      <span className="text-xs">{task.assignee}</span>
                      <span className="text-xs font-mono">{task.due_date}</span>
                      <span className="text-xs font-mono">{task.completed_at || "—"}</span>
                      <div>
                        {task.input_type === "api" ? (
                          <Badge variant="outline" className="text-[10px] gap-1"><Zap className="h-2.5 w-2.5" /> API</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] gap-1"><PenLine className="h-2.5 w-2.5" /> Manual</Badge>
                        )}
                      </div>
                      <StatusBadge status={task.status} />
                      <div className="flex items-center gap-1">
                        <Textarea placeholder="Add a note..." className="text-xs min-h-[28px] h-7 resize-none flex-1" value={noteInput[task.id] || ""} onChange={e => setNoteInput(prev => ({ ...prev, [task.id]: e.target.value }))} />
                        <Button size="sm" variant="ghost" className="h-7 px-1.5"><Send className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}

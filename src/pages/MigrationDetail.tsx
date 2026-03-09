import { useParams, useNavigate } from "react-router-dom";
import { useMigrationData, MigrationTaskDB } from "@/contexts/MigrationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Calendar, User, Zap, PenLine, Save, Check, AlertTriangle, Loader2, RefreshCw, CheckCheck, XCircle } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isAfter, parseISO } from "date-fns";

type MilestonePhase = "D-3M" | "D-2M" | "D-1M" | "D-Day" | "Post";
const milestoneOrder: MilestonePhase[] = ["D-3M", "D-2M", "D-1M", "D-Day", "Post"];
const milestoneColors: Record<MilestonePhase, string> = {
  "D-3M": "bg-accent text-accent-foreground",
  "D-2M": "bg-in-progress/10 text-in-progress",
  "D-1M": "bg-warning/10 text-warning",
  "D-Day": "bg-delay/10 text-delay",
  "Post": "bg-success/10 text-success",
};

export default function MigrationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { migrations, migrationTasks, fetchMigrationTasks, addTaskNote, templates, regenerateMigrationTasks, fetchMigrations } = useMigrationData();
  const migration = migrations.find(m => m.id === id);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingPhase, setSavingPhase] = useState<string | null>(null);
  // Local status overrides (not yet saved)
  const [localStatusOverrides, setLocalStatusOverrides] = useState<Record<string, { status: string; completed_at: string | null }>>({});

  const template = useMemo(() => {
    if (!migration?.template_id) return null;
    return templates.find(t => t.id === migration.template_id) || null;
  }, [templates, migration?.template_id]);

  const templateName = template?.name || "—";

  // Dev/CAT templates only use D-1M, D-Day, Post
  const activeMilestones = useMemo(() => {
    const name = templateName.toLowerCase();
    if (name.includes("dev") || name.includes("cat")) {
      return milestoneOrder.filter(m => m !== "D-3M" && m !== "D-2M");
    }
    return milestoneOrder;
  }, [templateName]);

  useEffect(() => {
    if (id) {
      fetchMigrationTasks(id).then(() => setLoading(false));
    }
  }, [id, fetchMigrationTasks]);

  if (!migration) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Migration not found</p></div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const tasks = migrationTasks.filter(t => t.migration_id === id);
  const milestones = activeMilestones;

  const getMilestoneDate = (ms: MilestonePhase) => {
    switch (ms) {
      case "D-3M": return migration.d_minus_3m;
      case "D-2M": return migration.d_minus_2m;
      case "D-1M": return migration.d_minus_1m;
      case "D-Day": return migration.migration_date;
      default: return "";
    }
  };

  const getTaskStatus = (task: MigrationTaskDB) => {
    return localStatusOverrides[task.id]?.status ?? task.status;
  };
  const getTaskCompletedAt = (task: MigrationTaskDB) => {
    return localStatusOverrides[task.id]?.completed_at ?? task.completed_at;
  };

  const toggleLocalStatus = (taskId: string) => {
    const task = migrationTasks.find(t => t.id === taskId);
    if (!task) return;
    const currentStatus = getTaskStatus(task);
    const isCompleting = currentStatus !== "completed";
    setLocalStatusOverrides(prev => ({
      ...prev,
      [taskId]: {
        status: isCompleting ? "completed" : "not_started",
        completed_at: isCompleting ? new Date().toISOString().split("T")[0] : null,
      },
    }));
  };

  const batchTogglePhase = (msTasks: MigrationTaskDB[], check: boolean) => {
    setLocalStatusOverrides(prev => {
      const next = { ...prev };
      msTasks.forEach(t => {
        next[t.id] = {
          status: check ? "completed" : "not_started",
          completed_at: check ? new Date().toISOString().split("T")[0] : null,
        };
      });
      return next;
    });
  };

  const hasPhaseChanges = (msTasks: MigrationTaskDB[]) => {
    return msTasks.some(t => localStatusOverrides[t.id] !== undefined) || msTasks.some(t => noteInput[t.id]?.trim());
  };

  const handleBulkSave = async (milestone: MilestonePhase) => {
    const msTasks = migrationTasks.filter(t => t.migration_id === id && t.milestone === milestone);
    setSavingPhase(milestone);
    try {
      // Save status changes
      const statusUpdates = msTasks.filter(t => localStatusOverrides[t.id] !== undefined);
      if (statusUpdates.length > 0) {
        await Promise.all(statusUpdates.map(t => 
          supabase.from("migration_tasks").update({
            status: localStatusOverrides[t.id].status,
            completed_at: localStatusOverrides[t.id].completed_at,
          }).eq("id", t.id)
        ));
      }

      // Save notes
      const notesToSave = msTasks.filter(t => noteInput[t.id]?.trim());
      if (notesToSave.length > 0) {
        await Promise.all(notesToSave.map(t => addTaskNote(t.id, migration!.dba, noteInput[t.id].trim())));
      }

      // Clear local overrides for this phase
      setLocalStatusOverrides(prev => {
        const next = { ...prev };
        msTasks.forEach(t => delete next[t.id]);
        return next;
      });
      setNoteInput(prev => {
        const next = { ...prev };
        msTasks.forEach(t => { next[t.id] = ""; });
        return next;
      });

      // Refresh data
      if (id) {
        await fetchMigrationTasks(id);
        // Update migration completion percent
        const allTasks = migrationTasks.map(t => localStatusOverrides[t.id] ? { ...t, ...localStatusOverrides[t.id] } : t);
        const myTasks = allTasks.filter(t => t.migration_id === id);
        const completedCount = myTasks.filter(t => t.status === "completed").length;
        const percent = Math.round((completedCount / myTasks.length) * 100);
        await supabase.from("migrations").update({ completion_percent: percent, overall_status: percent === 100 ? "completed" : percent > 0 ? "in_progress" : "not_started" }).eq("id", id);
        await fetchMigrations();
      }

      toast.success(`${milestone} phase saved`);
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSavingPhase(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono">{migration.dbid}</h1>
            <StatusBadge status={migration.overall_status} />
            <Badge variant="outline" className="text-xs">{templateName}</Badge>
          </div>
          <p className="text-muted-foreground">{migration.db_type}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={async () => { if (id) { setLoading(true); setLocalStatusOverrides({}); setNoteInput({}); await regenerateMigrationTasks(id); setLoading(false); } }}>
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Calendar className="h-3.5 w-3.5" /> D-Day</div><p className="font-mono font-bold">{migration.migration_date}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><User className="h-3.5 w-3.5" /> DBA</div><p className="font-medium">{migration.dba}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4"><div className="text-sm text-muted-foreground mb-1">AP Sponsor</div><p className="font-medium">{migration.ap_sponsor}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4"><div className="text-sm text-muted-foreground mb-1">Overall Progress</div><ProgressBar value={migration.completion_percent} /></CardContent></Card>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {milestoneOrder.map((ms, i) => (
          <div key={ms} className="flex items-center">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${milestoneColors[ms]}`}>
              {ms} {getMilestoneDate(ms) && `(${getMilestoneDate(ms)})`}
            </div>
            {i < milestoneOrder.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      {milestones.map((ms, msIdx) => {
        const msTasks = tasks.filter(t => t.milestone === ms).sort((a, b) => a.order - b.order);
        const nextMs = milestones[msIdx + 1];
        const nextMsStartDate = nextMs ? getMilestoneDate(nextMs) : null;
        const lastTask = msTasks[msTasks.length - 1];
        const lastTaskDate = lastTask ? (lastTask.completed_at || lastTask.due_date) : null;
        const isDelayed = lastTaskDate && nextMsStartDate && isAfter(parseISO(lastTaskDate), parseISO(nextMsStartDate));

        return (
          <Card key={ms} className={isDelayed ? "border-destructive/50" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline" className={milestoneColors[ms]}>{ms}</Badge>
                <span className="text-muted-foreground text-sm font-normal">{msTasks.filter(t => getTaskStatus(t) === "completed").length}/{msTasks.length} completed</span>
                {isDelayed && (
                  <Badge variant="destructive" className="text-[10px] gap-1 ml-auto">
                    <AlertTriangle className="h-3 w-3" /> Delayed — exceeds {nextMs} start
                  </Badge>
                )}
                {msTasks.length > 0 && (
                  <div className={`flex items-center gap-1.5 ${isDelayed ? '' : 'ml-auto'}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => batchTogglePhase(msTasks, true)}>
                      <CheckCheck className="h-3 w-3" /> Check All
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => batchTogglePhase(msTasks, false)}>
                      <XCircle className="h-3 w-3" /> Uncheck All
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="grid grid-cols-[40px_1fr_100px_1fr_100px_110px_130px_100px_200px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <span>#</span><span>Task Name</span><span>Sponsor</span><span>Remarks</span><span>Due Date</span><span>Completed</span><span>Check Mode</span><span>Status</span><span>Notes</span>
              </div>
              {msTasks.map((task, i) => (
                <div key={task.id} className="grid grid-cols-[40px_1fr_100px_1fr_100px_110px_130px_100px_200px] gap-2 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-mono text-muted-foreground">{i + 1}</span>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant={getTaskStatus(task) === "completed" ? "default" : "outline"} className={`h-6 w-6 shrink-0 ${getTaskStatus(task) === "completed" ? "bg-success hover:bg-success/80" : ""}`} onClick={() => toggleLocalStatus(task.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        {getTaskStatus(task) !== "completed" && (
                          <TooltipContent>
                            <p>Please click to confirm the completion.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <span className={`text-sm ${getTaskStatus(task) === "completed" ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                  </div>
                  <span className="text-xs">{task.assignee}</span>
                  <span className="text-xs text-muted-foreground truncate">{task.remarks || "—"}</span>
                  <span className="text-xs font-mono">{task.due_date}</span>
                  <span className="text-xs font-mono">{getTaskCompletedAt(task) || "—"}</span>
                  <div>
                    {task.input_type === "api" ? (
                      <Badge variant="outline" className="text-[10px] gap-1"><Zap className="h-2.5 w-2.5" /> API</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] gap-1"><PenLine className="h-2.5 w-2.5" /> Manual</Badge>
                    )}
                  </div>
                  <StatusBadge status={getTaskStatus(task)} />
                  <div className="flex items-center">
                    <Textarea placeholder="Add a note..." className="text-xs min-h-[28px] h-7 resize-none flex-1" value={noteInput[task.id] || ""} onChange={e => setNoteInput(prev => ({ ...prev, [task.id]: e.target.value }))} />
                  </div>
                </div>
              ))}
              {msTasks.length === 0 && <p className="text-sm text-muted-foreground p-3">No tasks in this phase</p>}
              {msTasks.length > 0 && (
                <div className="flex justify-end p-3 pt-2">
                  <Button size="sm" className="gap-1.5" disabled={savingPhase === ms || !hasPhaseChanges(msTasks)} onClick={() => handleBulkSave(ms)}>
                    {savingPhase === ms ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

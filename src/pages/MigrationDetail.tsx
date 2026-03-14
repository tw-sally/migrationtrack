import { useParams, useNavigate } from "react-router-dom";
import { useMigrationData, MigrationTaskDB } from "@/contexts/MigrationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  // Local date overrides for start_date and end_date
  const [localDateOverrides, setLocalDateOverrides] = useState<Record<string, { due_date?: string; end_date?: string }>>({});

  const template = useMemo(() => {
    if (!migration?.template_id) return null;
    return templates.find(t => t.id === migration.template_id) || null;
  }, [templates, migration?.template_id]);

  const templateName = template?.name || "—";

  // Use dynamic milestones from template offsets, fallback to hardcoded
  const activeMilestones = useMemo(() => {
    if (template && template.milestoneOffsets.length > 0) {
      return [...template.milestoneOffsets]
        .sort((a, b) => a.offset_months - b.offset_months)
        .map(o => o.milestone);
    }
    const name = templateName.toLowerCase();
    if (name.includes("dev") || name.includes("cat")) {
      return milestoneOrder.filter(m => m !== "D-3M" && m !== "D-2M") as string[];
    }
    return milestoneOrder as string[];
  }, [template, templateName]);

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

  const getMilestoneDate = (ms: string) => {
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
  const getTaskDueDate = (task: MigrationTaskDB) => {
    return localDateOverrides[task.id]?.due_date ?? task.due_date;
  };
  const getTaskEndDate = (task: MigrationTaskDB) => {
    return localDateOverrides[task.id]?.end_date ?? task.end_date ?? "";
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
    return msTasks.some(t => localStatusOverrides[t.id] !== undefined) 
      || msTasks.some(t => noteInput[t.id]?.trim())
      || msTasks.some(t => localDateOverrides[t.id] !== undefined);
  };

  // Determine delay status for tasks based on end_date
  const computeDelayStatus = (taskId: string, currentStatus: string, endDate: string | null) => {
    if (currentStatus === "completed") return "completed";
    const today = new Date().toISOString().split("T")[0];
    if (endDate && today > endDate) return "delayed";
    return currentStatus === "delayed" ? "not_started" : currentStatus;
  };

  const handleBulkSave = async (milestone: string) => {
    const msTasks = migrationTasks.filter(t => t.migration_id === id && t.milestone === milestone);
    setSavingPhase(milestone);
    try {
      // Prepare all updates per task
      for (const t of msTasks) {
        const statusOverride = localStatusOverrides[t.id];
        const dateOverride = localDateOverrides[t.id];
        
        const currentStatus = statusOverride?.status ?? t.status;
        const currentEndDate = dateOverride?.end_date ?? t.end_date;
        
        // Re-evaluate delay based on end_date
        const finalStatus = computeDelayStatus(t.id, currentStatus, currentEndDate);
        
        const update: Record<string, any> = {};
        if (statusOverride) {
          update.status = finalStatus;
          update.completed_at = statusOverride.completed_at;
        } else if (finalStatus !== t.status) {
          update.status = finalStatus;
        }
        if (dateOverride?.due_date) update.due_date = dateOverride.due_date;
        if (dateOverride?.end_date !== undefined) update.end_date = dateOverride.end_date;
        
        if (Object.keys(update).length > 0) {
          await supabase.from("migration_tasks").update(update).eq("id", t.id);
        }
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
      setLocalDateOverrides(prev => {
        const next = { ...prev };
        msTasks.forEach(t => delete next[t.id]);
        return next;
      });
      setNoteInput(prev => {
        const next = { ...prev };
        msTasks.forEach(t => { next[t.id] = ""; });
        return next;
      });

      // Refresh data & recompute migration-level status
      if (id) {
        const freshTasks = await fetchMigrationTasks(id);
        const myTasks = freshTasks.filter(t => t.migration_id === id);
        const hasAnyDelayed = myTasks.some(t => t.status === "delayed");
        const completedCount = myTasks.filter(t => t.status === "completed").length;
        const percent = Math.round((completedCount / myTasks.length) * 100);
        
        let overallStatus = "not_started";
        if (hasAnyDelayed) overallStatus = "delayed";
        else if (percent === 100) overallStatus = "completed";
        else if (percent > 0) overallStatus = "in_progress";
        
        await supabase.from("migrations").update({ completion_percent: percent, overall_status: overallStatus }).eq("id", id);
        await fetchMigrations();
      }

      toast.success(`${milestone} phase saved`);
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSavingPhase(null);
    }
  };

  // Check if a task should show delay warning visually (before saving)
  const isTaskVisuallyDelayed = (task: MigrationTaskDB) => {
    const status = getTaskStatus(task);
    if (status === "completed") return false;
    const endDate = getTaskEndDate(task);
    const today = new Date().toISOString().split("T")[0];
    return endDate && today > endDate;
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
        <Button variant="outline" size="sm" className="gap-1.5" onClick={async () => { if (id) { setLoading(true); setLocalStatusOverrides({}); setLocalDateOverrides({}); setNoteInput({}); await regenerateMigrationTasks(id); setLoading(false); } }}>
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
        {activeMilestones.map((ms, i) => (
          <div key={ms} className="flex items-center">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${milestoneColors[ms as MilestonePhase] || "bg-muted text-muted-foreground"}`}>
              {ms} {getMilestoneDate(ms) && `(${getMilestoneDate(ms)})`}
            </div>
            {i < activeMilestones.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      {milestones.map((ms) => {
        const msTasks = tasks.filter(t => t.milestone === ms).sort((a, b) => a.order - b.order);
        return (
          <Card key={ms}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline" className={milestoneColors[ms as MilestonePhase] || ""}>{ms}</Badge>
                <span className="text-muted-foreground text-sm font-normal">{msTasks.filter(t => getTaskStatus(t) === "completed").length}/{msTasks.length} completed</span>
                {msTasks.length > 0 && (
                  <div className="flex items-center gap-1.5 ml-auto">
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
              <div className="grid grid-cols-[40px_1fr_100px_1fr_100px_100px_100px_130px_80px_200px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <span>#</span><span>Task Name</span><span>Sponsor</span><span>Remarks</span><span>Start Date</span><span>End Date</span><span>Completed</span><span>Check Mode</span><span>Status</span><span>Notes</span>
              </div>
              {msTasks.map((task, i) => {
                const delayed = isTaskVisuallyDelayed(task);
                return (
                <div key={task.id} className={`grid grid-cols-[40px_1fr_100px_1fr_100px_100px_100px_130px_80px_200px] gap-2 items-center px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${delayed ? "bg-delay/5" : ""}`}>
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
                    {delayed && <AlertTriangle className="h-3.5 w-3.5 text-delay shrink-0" />}
                  </div>
                  <span className="text-xs">{task.assignee}</span>
                  <span className="text-xs text-muted-foreground truncate">{task.remarks || "—"}</span>
                  <Input
                    type="date"
                    className="h-7 text-xs font-mono px-1"
                    value={getTaskDueDate(task)}
                    onChange={e => setLocalDateOverrides(prev => ({ ...prev, [task.id]: { ...prev[task.id], due_date: e.target.value } }))}
                  />
                  <Input
                    type="date"
                    className={`h-7 text-xs font-mono px-1 ${delayed ? "border-delay text-delay" : ""}`}
                    value={getTaskEndDate(task)}
                    onChange={e => setLocalDateOverrides(prev => ({ ...prev, [task.id]: { ...prev[task.id], end_date: e.target.value } }))}
                  />
                  <span className="text-xs font-mono">{getTaskCompletedAt(task) || "—"}</span>
                  <div>
                    {task.input_type === "api" ? (
                      <Badge variant="outline" className="text-[10px] gap-1"><Zap className="h-2.5 w-2.5" /> API</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] gap-1"><PenLine className="h-2.5 w-2.5" /> Manual</Badge>
                    )}
                  </div>
                  <StatusBadge status={delayed ? "delayed" : getTaskStatus(task)} />
                  <div className="flex items-center">
                    <Textarea placeholder="Add a note..." className="text-xs min-h-[28px] h-7 resize-none flex-1" value={noteInput[task.id] || ""} onChange={e => setNoteInput(prev => ({ ...prev, [task.id]: e.target.value }))} />
                  </div>
                </div>
                );
              })}
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
import { useState } from "react";
import { useMigrationData, TemplateWithTasks, TemplateTaskDB } from "@/contexts/MigrationContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, PenLine, Zap, Loader2, Pencil, Save, Calendar } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type MilestonePhase = "D-3M" | "D-2M" | "D-1M" | "D-Day" | "Post";
const milestoneOrder: MilestonePhase[] = ["D-3M", "D-2M", "D-1M", "D-Day", "Post"];
const defaultOffsets: Record<MilestonePhase, number> = { "D-3M": -3, "D-2M": -2, "D-1M": -1, "D-Day": 0, "Post": 1 };

// Local draft for editing a single task row
interface TaskDraft {
  title: string;
  input_type: string;
  remarks: string;
}

export default function TaskTemplates() {
  const {
    templates, templatesLoading,
    addTemplate, deleteTemplate,
    addTemplateTask, updateTemplateTask, deleteTemplateTask,
    updateMilestoneOffset,
  } = useMigrationData();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Track which task is being edited + its local draft
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TaskDraft>({ title: "", input_type: "manual", remarks: "" });
  const [editingOffsetsTemplateId, setEditingOffsetsTemplateId] = useState<string | null>(null);
  const [offsetDraft, setOffsetDraft] = useState<Record<string, number>>({});

  const startEditing = (task: TemplateTaskDB) => {
    setEditingTaskId(task.id);
    setDraft({ title: task.title, input_type: task.input_type, remarks: task.remarks || "" });
  };

  const saveEditing = async () => {
    if (!editingTaskId) return;
    await updateTemplateTask(editingTaskId, { title: draft.title, input_type: draft.input_type as "manual" | "api", remarks: draft.remarks });
    setEditingTaskId(null);
    toast.success("Task updated");
  };

  const handleAddRow = (tpl: TemplateWithTasks, milestone: MilestonePhase) => {
    const maxOrder = tpl.tasks.length > 0 ? Math.max(...tpl.tasks.map(t => t.order)) : 0;
    addTemplateTask({
      template_id: tpl.id,
      title: "",
      input_type: "manual",
      milestone,
      assignee: "",
      order: maxOrder + 1,
      remarks: "",
    });
  };

  const handleRemoveRow = (taskId: string) => {
    deleteTemplateTask(taskId);
  };

  const handleCreate = async () => {
    if (!newName.trim()) { toast.error("Template name is required"); return; }
    const tpl = await addTemplate(newName.trim(), newDesc.trim());
    if (tpl) {
      await addTemplateTask({
        template_id: tpl.id,
        title: "Confirm migration date",
        input_type: "manual",
        milestone: "D-3M",
        assignee: "",
        order: 1,
        remarks: "",
      });
    }
    setShowCreateDialog(false);
    setNewName("");
    setNewDesc("");
    toast.success("Template created");
  };

  if (templatesLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Templates</h1>
          <p className="text-muted-foreground">Manage and customize migration task templates</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-1">
          <Plus className="h-4 w-4" /> New Template
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="space-y-3">
        {[...templates].sort((a, b) => {
          // Put "DBVM" templates first, "Standard PROD" after
          const aIsDBVM = a.name.toLowerCase().includes("dbvm");
          const bIsDBVM = b.name.toLowerCase().includes("dbvm");
          if (aIsDBVM && !bIsDBVM) return -1;
          if (!aIsDBVM && bIsDBVM) return 1;
          return 0;
        }).map(tpl => (
          <AccordionItem key={tpl.id} value={tpl.id} className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <div className="flex flex-col items-start gap-0.5">
                  <span>{tpl.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{tpl.description}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-7 px-2" onClick={e => e.stopPropagation()}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete "{tpl.name}"? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTemplate(tpl.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* Milestone Offset Settings */}
              <div className="mb-4 p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phase Start Date Offsets (months from D-Day)</span>
                  </div>
                  {editingOffsetsTemplateId === tpl.id ? (
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={async () => {
                      for (const milestone of milestoneOrder) {
                        const val = offsetDraft[milestone];
                        if (val !== undefined) {
                          const saved = tpl.milestoneOffsets.find(o => o.milestone === milestone);
                          const currentVal = saved ? saved.offset_months : defaultOffsets[milestone];
                          if (val !== currentVal) await updateMilestoneOffset(tpl.id, milestone, val);
                        }
                      }
                      setEditingOffsetsTemplateId(null);
                      toast.success("Offsets saved");
                    }}>
                      <Save className="h-3 w-3" /> Save
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => {
                      const draft: Record<string, number> = {};
                      milestoneOrder.forEach(m => {
                        const saved = tpl.milestoneOffsets.find(o => o.milestone === m);
                        draft[m] = saved ? saved.offset_months : defaultOffsets[m];
                      });
                      setOffsetDraft(draft);
                      setEditingOffsetsTemplateId(tpl.id);
                    }}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {milestoneOrder.map(milestone => {
                    const saved = tpl.milestoneOffsets.find(o => o.milestone === milestone);
                    const currentVal = editingOffsetsTemplateId === tpl.id
                      ? (offsetDraft[milestone] ?? (saved ? saved.offset_months : defaultOffsets[milestone]))
                      : (saved ? saved.offset_months : defaultOffsets[milestone]);
                    return (
                      <div key={milestone} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">{milestone}</span>
                        {editingOffsetsTemplateId === tpl.id ? (
                          <Input
                            type="number"
                            value={currentVal}
                            onChange={e => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) setOffsetDraft(d => ({ ...d, [milestone]: val }));
                            }}
                            className="h-8 w-20 text-center text-sm"
                          />
                        ) : (
                          <span className="h-8 w-20 flex items-center justify-center text-sm font-mono">{currentVal}</span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {currentVal === 0 ? "D-Day" : currentVal > 0 ? `D+${currentVal}M` : `D${currentVal}M`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {milestoneOrder.map(milestone => {
                  const milestoneTasks = tpl.tasks.filter(t => t.milestone === milestone).sort((a, b) => a.order - b.order);
                  return (
                    <div key={milestone}>
                      <Badge variant="outline" className="mb-3 text-xs">{milestone}</Badge>
                      {milestoneTasks.length > 0 && (
                        <>
                        <div className="grid grid-cols-[40px_2fr_2fr_140px_80px] gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                             <span>#</span><span>Task Name</span><span>Remarks</span><span className="text-right">Check Mode</span><span />
                          </div>
                          {milestoneTasks.map((task, i) => {
                            const isEditing = editingTaskId === task.id;
                            return (
                              <div key={task.id} className="grid grid-cols-[40px_2fr_2fr_140px_80px] gap-2 items-start px-3 py-2.5 border-b border-border hover:bg-muted/30 transition-colors">
                                <span className="text-sm font-mono text-muted-foreground pt-1">{i + 1}</span>
                                {isEditing ? (
                                  <Input
                                    autoFocus
                                    value={draft.title}
                                    onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                                    className="h-8 text-sm border border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 rounded focus-visible:ring-amber-400"
                                    placeholder="Task name..."
                                  />
                                ) : (
                                  <div className="text-sm whitespace-pre-wrap break-words max-h-[6.5rem] overflow-y-auto">{task.title || <span className="text-muted-foreground italic">Untitled</span>}</div>
                                )}
                                {isEditing ? (
                                  <Input
                                    value={draft.remarks}
                                    onChange={e => setDraft(d => ({ ...d, remarks: e.target.value }))}
                                    className="h-8 text-sm border border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 rounded focus-visible:ring-amber-400"
                                    placeholder="Remarks..."
                                  />
                                ) : (
                                  <div className="text-sm whitespace-pre-wrap break-words max-h-[6.5rem] overflow-y-auto text-muted-foreground">{task.remarks || "-"}</div>
                                )}
                                <div className="flex justify-end">
                                  {isEditing ? (
                                    <Select value={draft.input_type} onValueChange={v => setDraft(d => ({ ...d, input_type: v }))}>
                                      <SelectTrigger className="h-7 w-[130px] text-[11px] border border-amber-400 rounded-md bg-amber-50 dark:bg-amber-950/30">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="manual"><span className="flex items-center gap-1"><PenLine className="h-3 w-3" /> DBA Manual</span></SelectItem>
                                        <SelectItem value="api"><span className="flex items-center gap-1"><Zap className="h-3 w-3" /> API Auto</span></SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <span className="text-[11px] flex items-center gap-1 text-muted-foreground">
                                      {task.input_type === "api" ? <><Zap className="h-3 w-3" /> API Auto</> : <><PenLine className="h-3 w-3" /> DBA Manual</>}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-center gap-0.5">
                                  {isEditing ? (
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700" onClick={saveEditing}>
                                      <Save className="h-3.5 w-3.5" />
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEditing(task)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => handleRemoveRow(task.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      <div className="px-3 py-2">
                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => handleAddRow(tpl, milestone)}>
                          <Plus className="h-3 w-3" /> Add Row
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Template</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Template Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Custom PROD Migration" /></div>
            <div><Label>Description</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Brief description..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

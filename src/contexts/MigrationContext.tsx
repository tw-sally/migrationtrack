import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { addMonths, format, parse } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types matching DB schema
export interface TaskTemplateDB {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateTaskDB {
  id: string;
  template_id: string;
  title: string;
  input_type: "manual" | "api";
  milestone: string;
  assignee: string;
  order: number;
  remarks: string;
  created_at: string;
}

export interface MigrationDB {
  id: string;
  dbid: string;
  phase: string;
  db_type: string;
  prod_or_test: "PROD" | "TEST";
  migration_date: string;
  d_minus_3m: string;
  d_minus_2m: string;
  d_minus_1m: string;
  dba: string;
  task_owner: string;
  ap_sponsor: string;
  ap_manager: string;
  migration_strategy: string | null;
  source_db_type: string | null;
  overall_status: string;
  completion_percent: number;
  template_id: string | null;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface MigrationTaskDB {
  id: string;
  migration_id: string;
  title: string;
  description: string | null;
  milestone: string;
  input_type: "manual" | "api";
  status: string;
  assignee: string;
  due_date: string;
  end_date: string | null;
  completed_at: string | null;
  order: number;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface TaskNoteDB {
  id: string;
  task_id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface MilestoneOffsetDB {
  id: string;
  template_id: string;
  milestone: string;
  offset_months: number;
  created_at: string;
}

// Template with nested tasks for convenience
export interface TemplateWithTasks extends TaskTemplateDB {
  tasks: TemplateTaskDB[];
  milestoneOffsets: MilestoneOffsetDB[];
}

interface MigrationContextType {
  // Templates
  templates: TemplateWithTasks[];
  templatesLoading: boolean;
  fetchTemplates: () => Promise<void>;
  addTemplate: (name: string, description: string) => Promise<TaskTemplateDB | null>;
  updateTemplate: (id: string, data: Partial<Pick<TaskTemplateDB, "name" | "description">>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  addTemplateTask: (task: Omit<TemplateTaskDB, "id" | "created_at">) => Promise<void>;
  updateTemplateTask: (id: string, data: Partial<Pick<TemplateTaskDB, "title" | "input_type" | "milestone" | "assignee" | "order" | "remarks">>) => Promise<void>;
  deleteTemplateTask: (id: string) => Promise<void>;
  updateMilestoneOffset: (templateId: string, milestone: string, offsetMonths: number) => Promise<void>;
  deleteMilestoneOffset: (templateId: string, milestone: string) => Promise<void>;

  // Migrations
  migrations: MigrationDB[];
  migrationsLoading: boolean;
  fetchMigrations: () => Promise<void>;
  addMigration: (migration: Omit<MigrationDB, "id" | "created_at" | "updated_at">, tasks: Omit<MigrationTaskDB, "id" | "created_at" | "updated_at">[]) => Promise<void>;
  updateMigration: (id: string, data: Partial<Omit<MigrationDB, "id" | "created_at" | "updated_at">>) => Promise<void>;
  deleteMigration: (id: string) => Promise<void>;

  // Migration Tasks
  migrationTasks: MigrationTaskDB[];
  fetchMigrationTasks: (migrationId: string) => Promise<MigrationTaskDB[]>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  regenerateMigrationTasks: (migrationId: string) => Promise<void>;
  applyTemplateToNotStartedMigrations: (templateId: string) => Promise<number>;

  // Task Notes
  taskNotes: Record<string, TaskNoteDB[]>;
  fetchTaskNotes: (taskId: string) => Promise<TaskNoteDB[]>;
  addTaskNote: (taskId: string, author: string, content: string) => Promise<void>;
}

const MigrationContext = createContext<MigrationContextType | null>(null);

export function MigrationProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<TemplateWithTasks[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [migrations, setMigrations] = useState<MigrationDB[]>([]);
  const [migrationsLoading, setMigrationsLoading] = useState(true);
  const [migrationTasks, setMigrationTasks] = useState<MigrationTaskDB[]>([]);
  const [taskNotes, setTaskNotes] = useState<Record<string, TaskNoteDB[]>>({});

  // ─── Templates ───
  const fetchTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    const { data: tpls, error: e1 } = await supabase.from("task_templates").select("*").order("created_at");
    if (e1) { toast.error("Failed to load templates"); setTemplatesLoading(false); return; }

    const { data: tasks, error: e2 } = await supabase.from("template_tasks").select("*").order("order");
    if (e2) { toast.error("Failed to load template tasks"); setTemplatesLoading(false); return; }

    const { data: offsets, error: e3 } = await supabase.from("template_milestone_offsets").select("*");
    if (e3) { toast.error("Failed to load milestone offsets"); setTemplatesLoading(false); return; }

    const result: TemplateWithTasks[] = (tpls || []).map(t => ({
      ...t,
      tasks: (tasks || []).filter(tt => tt.template_id === t.id) as TemplateTaskDB[],
      milestoneOffsets: (offsets || []).filter(o => o.template_id === t.id) as MilestoneOffsetDB[],
    }));
    setTemplates(result);
    setTemplatesLoading(false);
  }, []);

  const addTemplate = useCallback(async (name: string, description: string) => {
    const { data, error } = await supabase.from("task_templates").insert({ name, description }).select().single();
    if (error) { toast.error("Failed to create template"); return null; }
    await fetchTemplates();
    return data as TaskTemplateDB;
  }, [fetchTemplates]);

  const updateTemplate = useCallback(async (id: string, data: Partial<Pick<TaskTemplateDB, "name" | "description">>) => {
    const { error } = await supabase.from("task_templates").update(data).eq("id", id);
    if (error) { toast.error("Failed to update template"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    const { error } = await supabase.from("task_templates").delete().eq("id", id);
    if (error) { toast.error("Failed to delete template"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const addTemplateTask = useCallback(async (task: Omit<TemplateTaskDB, "id" | "created_at">) => {
    const { error } = await supabase.from("template_tasks").insert(task);
    if (error) { toast.error("Failed to add task"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const updateTemplateTask = useCallback(async (id: string, data: Partial<Pick<TemplateTaskDB, "title" | "input_type" | "milestone" | "assignee" | "order" | "remarks">>) => {
    const { error } = await supabase.from("template_tasks").update(data).eq("id", id);
    if (error) { toast.error("Failed to update task"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const deleteTemplateTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("template_tasks").delete().eq("id", id);
    if (error) { toast.error("Failed to delete task"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const updateMilestoneOffset = useCallback(async (templateId: string, milestone: string, offsetMonths: number) => {
    const { error } = await supabase.from("template_milestone_offsets").upsert(
      { template_id: templateId, milestone, offset_months: offsetMonths },
      { onConflict: "template_id,milestone" }
    );
    if (error) { toast.error("Failed to update milestone offset"); return; }
    await fetchTemplates();
  }, [fetchTemplates]);

  const deleteMilestoneOffset = useCallback(async (templateId: string, milestone: string) => {
    const { error } = await supabase.from("template_milestone_offsets").delete()
      .eq("template_id", templateId).eq("milestone", milestone);
    if (error) { toast.error("Failed to delete milestone"); return; }
    // Also delete template tasks with this milestone
    await supabase.from("template_tasks").delete()
      .eq("template_id", templateId).eq("milestone", milestone);
    await fetchTemplates();
  }, [fetchTemplates]);

  // ─── Migrations ───
  const fetchMigrations = useCallback(async () => {
    setMigrationsLoading(true);
    const { data, error } = await supabase.from("migrations").select("*").order("migration_date");
    if (error) { toast.error("Failed to load migrations"); setMigrationsLoading(false); return; }
    setMigrations((data || []) as MigrationDB[]);
    setMigrationsLoading(false);
  }, []);

  const addMigration = useCallback(async (
    migration: Omit<MigrationDB, "id" | "created_at" | "updated_at">,
    tasks: Omit<MigrationTaskDB, "id" | "created_at" | "updated_at">[]
  ) => {
    const { data, error } = await supabase.from("migrations").insert(migration).select().single();
    if (error) { toast.error("Failed to add migration"); return; }
    if (tasks.length > 0) {
      const tasksWithMigrationId = tasks.map(t => ({ ...t, migration_id: data.id }));
      const { error: e2 } = await supabase.from("migration_tasks").insert(tasksWithMigrationId);
      if (e2) { toast.error("Failed to add migration tasks"); }
    }
    await fetchMigrations();
  }, [fetchMigrations]);

  const updateMigration = useCallback(async (id: string, data: Partial<Omit<MigrationDB, "id" | "created_at" | "updated_at">>) => {
    // Check if milestone dates changed
    const oldMigration = migrations.find(m => m.id === id);
    const datesChanged = oldMigration && (
      (data.migration_date && data.migration_date !== oldMigration.migration_date) ||
      (data.d_minus_3m && data.d_minus_3m !== oldMigration.d_minus_3m) ||
      (data.d_minus_2m && data.d_minus_2m !== oldMigration.d_minus_2m) ||
      (data.d_minus_1m && data.d_minus_1m !== oldMigration.d_minus_1m)
    );

    const { error } = await supabase.from("migrations").update(data).eq("id", id);
    if (error) { toast.error("Failed to update migration"); return; }

    // If milestone dates changed, recalculate task due_date and end_date
    if (datesChanged) {
      const newDates = {
        migration_date: data.migration_date || oldMigration!.migration_date,
        d_minus_3m: data.d_minus_3m || oldMigration!.d_minus_3m,
        d_minus_2m: data.d_minus_2m || oldMigration!.d_minus_2m,
        d_minus_1m: data.d_minus_1m || oldMigration!.d_minus_1m,
      };

      const { data: tasks } = await supabase.from("migration_tasks").select("id, milestone").eq("migration_id", id);
      if (tasks && tasks.length > 0) {
        for (const task of tasks) {
          let dueDate = newDates.migration_date;
          if (task.milestone === "D-3M") dueDate = newDates.d_minus_3m;
          else if (task.milestone === "D-2M") dueDate = newDates.d_minus_2m;
          else if (task.milestone === "D-1M") dueDate = newDates.d_minus_1m;
          const endDate = format(addMonths(parse(dueDate, "yyyy-MM-dd", new Date()), 1), "yyyy-MM-dd");
          await supabase.from("migration_tasks").update({ due_date: dueDate, end_date: endDate }).eq("id", task.id);
        }
      }
    }

    await fetchMigrations();
  }, [fetchMigrations, migrations]);

  const deleteMigration = useCallback(async (id: string) => {
    // Delete related tasks and notes first
    const { data: tasks } = await supabase.from("migration_tasks").select("id").eq("migration_id", id);
    if (tasks && tasks.length > 0) {
      const taskIds = tasks.map(t => t.id);
      await supabase.from("task_notes").delete().in("task_id", taskIds);
      await supabase.from("migration_tasks").delete().eq("migration_id", id);
    }
    const { error } = await supabase.from("migrations").delete().eq("id", id);
    if (error) { toast.error("Failed to delete migration"); return; }
    toast.success("Migration deleted");
    await fetchMigrations();
  }, [fetchMigrations]);


  const fetchMigrationTasks = useCallback(async (migrationId: string) => {
    const { data, error } = await supabase.from("migration_tasks").select("*").eq("migration_id", migrationId).order("order");
    if (error) { toast.error("Failed to load tasks"); return []; }
    const result = (data || []) as MigrationTaskDB[];
    setMigrationTasks(result);
    return result;
  }, []);

  const toggleTaskComplete = useCallback(async (taskId: string) => {
    const task = migrationTasks.find(t => t.id === taskId);
    if (!task) return;
    const isCompleting = task.status !== "completed";
    const update = {
      status: isCompleting ? "completed" : "not_started",
      completed_at: isCompleting ? new Date().toISOString().split("T")[0] : null,
    };
    const { error } = await supabase.from("migration_tasks").update(update).eq("id", taskId);
    if (error) { toast.error("Failed to update task"); return; }

    // Update local state
    setMigrationTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...update } : t));

    // Update migration completion percent
    if (task.migration_id) {
      const allTasks = migrationTasks.map(t => t.id === taskId ? { ...t, ...update } : t);
      const mTasks = allTasks.filter(t => t.migration_id === task.migration_id);
      const completedCount = mTasks.filter(t => t.status === "completed").length;
      const percent = Math.round((completedCount / mTasks.length) * 100);
      await supabase.from("migrations").update({ completion_percent: percent, overall_status: percent === 100 ? "completed" : percent > 0 ? "in_progress" : "not_started" }).eq("id", task.migration_id);
      await fetchMigrations();
    }
  }, [migrationTasks, fetchMigrations]);

  const regenerateMigrationTasks = useCallback(async (migrationId: string) => {
    const migration = migrations.find(m => m.id === migrationId);
    if (!migration || !migration.template_id) {
      toast.error("No template assigned to this migration");
      return;
    }
    const tpl = templates.find(t => t.id === migration.template_id);
    if (!tpl) { toast.error("Template not found"); return; }

    // Delete existing tasks
    const { error: delErr } = await supabase.from("migration_tasks").delete().eq("migration_id", migrationId);
    if (delErr) { toast.error("Failed to delete existing tasks"); return; }

    // Generate new tasks from template
    const newTasks = tpl.tasks.map(tt => {
      let dueDate = migration.migration_date;
      if (tt.milestone === "D-3M") dueDate = migration.d_minus_3m || migration.migration_date;
      else if (tt.milestone === "D-2M") dueDate = migration.d_minus_2m || migration.migration_date;
      else if (tt.milestone === "D-1M") dueDate = migration.d_minus_1m || migration.migration_date;
      const endDate = format(addMonths(parse(dueDate, "yyyy-MM-dd", new Date()), 1), "yyyy-MM-dd");
      return {
        migration_id: migrationId,
        title: tt.title,
        milestone: tt.milestone,
        input_type: tt.input_type,
        assignee: tt.assignee || migration.dba,
        due_date: dueDate,
        end_date: endDate,
        order: tt.order,
        remarks: tt.remarks || "",
        status: "not_started",
      };
    });

    const { error: insErr } = await supabase.from("migration_tasks").insert(newTasks);
    if (insErr) { toast.error("Failed to generate tasks"); return; }

    await fetchMigrationTasks(migrationId);
    toast.success("Tasks regenerated from template");
  }, [migrations, templates, fetchMigrationTasks]);

  // ─── Apply Template to Not Started Migrations ───
  const applyTemplateToNotStartedMigrations = useCallback(async (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) { toast.error("Template not found"); return 0; }

    // Find migrations using this template
    const linkedMigrations = migrations.filter(m => m.template_id === templateId);
    if (linkedMigrations.length === 0) { toast.info("No migrations using this template"); return 0; }

    let appliedCount = 0;

    for (const migration of linkedMigrations) {
      // Fetch current tasks for this migration
      const { data: existingTasks, error: fetchErr } = await supabase
        .from("migration_tasks")
        .select("*")
        .eq("migration_id", migration.id);
      if (fetchErr) continue;

      // Skip if any task is not "not_started"
      const allNotStarted = (existingTasks || []).every(t => t.status === "not_started");
      if (!allNotStarted) continue;

      // Delete existing tasks and their notes
      if (existingTasks && existingTasks.length > 0) {
        const taskIds = existingTasks.map(t => t.id);
        await supabase.from("task_notes").delete().in("task_id", taskIds);
      }
      await supabase.from("migration_tasks").delete().eq("migration_id", migration.id);

      // Generate new tasks from template
      const newTasks = tpl.tasks.map(tt => {
        let dueDate = migration.migration_date;
        if (tt.milestone === "D-3M") dueDate = migration.d_minus_3m || migration.migration_date;
        else if (tt.milestone === "D-2M") dueDate = migration.d_minus_2m || migration.migration_date;
        else if (tt.milestone === "D-1M") dueDate = migration.d_minus_1m || migration.migration_date;
        const endDate = format(addMonths(parse(dueDate, "yyyy-MM-dd", new Date()), 1), "yyyy-MM-dd");
        return {
          migration_id: migration.id,
          title: tt.title,
          milestone: tt.milestone,
          input_type: tt.input_type,
          assignee: tt.assignee || migration.dba,
          due_date: dueDate,
          end_date: endDate,
          order: tt.order,
          remarks: tt.remarks || "",
          status: "not_started",
        };
      });

      if (newTasks.length > 0) {
        const { error: insErr } = await supabase.from("migration_tasks").insert(newTasks);
        if (!insErr) appliedCount++;
      }
    }

    if (appliedCount > 0) {
      toast.success(`Template applied to ${appliedCount} migration(s)`);
    } else {
      toast.info("No eligible migrations found (all have started tasks)");
    }
    return appliedCount;
  }, [templates, migrations]);

  // ─── Task Notes ───
  const fetchTaskNotes = useCallback(async (taskId: string) => {
    const { data, error } = await supabase.from("task_notes").select("*").eq("task_id", taskId).order("created_at");
    if (error) { return []; }
    const result = (data || []) as TaskNoteDB[];
    setTaskNotes(prev => ({ ...prev, [taskId]: result }));
    return result;
  }, []);

  const addTaskNote = useCallback(async (taskId: string, author: string, content: string) => {
    const { error } = await supabase.from("task_notes").insert({ task_id: taskId, author, content });
    if (error) { toast.error("Failed to add note"); return; }
    await fetchTaskNotes(taskId);
  }, [fetchTaskNotes]);

  // Initial load
  useEffect(() => {
    fetchTemplates();
    fetchMigrations();
  }, [fetchTemplates, fetchMigrations]);

  return (
    <MigrationContext.Provider value={{
      templates, templatesLoading, fetchTemplates,
      addTemplate, updateTemplate, deleteTemplate,
      addTemplateTask, updateTemplateTask, deleteTemplateTask, updateMilestoneOffset, deleteMilestoneOffset,
      migrations, migrationsLoading, fetchMigrations, addMigration, updateMigration, deleteMigration,
      migrationTasks, fetchMigrationTasks, toggleTaskComplete, regenerateMigrationTasks, applyTemplateToNotStartedMigrations,
      taskNotes, fetchTaskNotes, addTaskNote,
    }}>
      {children}
    </MigrationContext.Provider>
  );
}

export function useMigrationData() {
  const ctx = useContext(MigrationContext);
  if (!ctx) throw new Error("useMigrationData must be used within MigrationProvider");
  return ctx;
}

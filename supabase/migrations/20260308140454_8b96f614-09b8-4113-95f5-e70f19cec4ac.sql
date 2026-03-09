
-- Task Templates
CREATE TABLE public.task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Template Tasks (tasks within a template)
CREATE TABLE public.template_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.task_templates(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  input_type TEXT NOT NULL DEFAULT 'manual' CHECK (input_type IN ('manual', 'api')),
  milestone TEXT NOT NULL CHECK (milestone IN ('D-3M', 'D-2M', 'D-1M', 'D-Day', 'Post')),
  assignee TEXT NOT NULL DEFAULT '',
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrations
CREATE TABLE public.migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dbid TEXT NOT NULL,
  phase TEXT NOT NULL,
  db_type TEXT NOT NULL,
  prod_or_test TEXT NOT NULL DEFAULT 'PROD' CHECK (prod_or_test IN ('PROD', 'TEST')),
  migration_date TEXT NOT NULL,
  d_minus_3m TEXT NOT NULL DEFAULT '',
  d_minus_2m TEXT NOT NULL DEFAULT '',
  d_minus_1m TEXT NOT NULL DEFAULT '',
  dba TEXT NOT NULL,
  task_owner TEXT NOT NULL DEFAULT '',
  ap_sponsor TEXT NOT NULL DEFAULT '',
  ap_manager TEXT NOT NULL DEFAULT '',
  migration_strategy TEXT,
  source_db_type TEXT,
  overall_status TEXT NOT NULL DEFAULT 'not_started' CHECK (overall_status IN ('not_started', 'in_progress', 'completed', 'delayed', 'blocked')),
  completion_percent INT NOT NULL DEFAULT 0,
  template_id UUID REFERENCES public.task_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration Tasks
CREATE TABLE public.migration_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id UUID REFERENCES public.migrations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  milestone TEXT NOT NULL CHECK (milestone IN ('D-3M', 'D-2M', 'D-1M', 'D-Day', 'Post')),
  input_type TEXT NOT NULL DEFAULT 'manual' CHECK (input_type IN ('manual', 'api')),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed', 'blocked')),
  assignee TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL,
  completed_at TEXT,
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Task Notes
CREATE TABLE public.task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.migration_tasks(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disable RLS for now (no auth yet)
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_notes ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (public, no auth)
CREATE POLICY "Allow all on task_templates" ON public.task_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on template_tasks" ON public.template_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on migrations" ON public.migrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on migration_tasks" ON public.migration_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on task_notes" ON public.task_notes FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_template_tasks_template_id ON public.template_tasks(template_id);
CREATE INDEX idx_migration_tasks_migration_id ON public.migration_tasks(migration_id);
CREATE INDEX idx_task_notes_task_id ON public.task_notes(task_id);
CREATE INDEX idx_migrations_template_id ON public.migrations(template_id);

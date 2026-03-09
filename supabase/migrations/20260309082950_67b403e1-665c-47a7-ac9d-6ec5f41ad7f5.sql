
CREATE TABLE public.template_milestone_offsets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.task_templates(id) ON DELETE CASCADE,
  milestone text NOT NULL,
  offset_months integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(template_id, milestone)
);

ALTER TABLE public.template_milestone_offsets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on template_milestone_offsets" ON public.template_milestone_offsets
  FOR ALL USING (true) WITH CHECK (true);


-- Seed template data
INSERT INTO public.task_templates (id, name, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Standard PROD Migration', 'Standard migration workflow for ENT Physical PROD'),
  ('00000000-0000-0000-0000-000000000002', 'DBVM Migration', 'Migration workflow for ENT DBVM PROD'),
  ('00000000-0000-0000-0000-000000000003', 'Dev/CAT DB Migration', 'Streamlined migration workflow for Dev/CAT test environments');

INSERT INTO public.template_tasks (template_id, title, input_type, milestone, assignee, "order") VALUES
  ('00000000-0000-0000-0000-000000000001', 'AP testing - confirm migration date (user confirmation)', 'manual', 'D-3M', '', 1),
  ('00000000-0000-0000-0000-000000000001', 'Release Pre-prod (environment setup)', 'manual', 'D-3M', '', 2),
  ('00000000-0000-0000-0000-000000000001', 'AP testing validation (post-restore)', 'api', 'D-2M', '', 3),
  ('00000000-0000-0000-0000-000000000001', 'Data validation script', 'api', 'D-2M', '', 4),
  ('00000000-0000-0000-0000-000000000001', 'Rehearsal & Logship', 'manual', 'D-1M', '', 5),
  ('00000000-0000-0000-0000-000000000001', 'Final backup', 'api', 'D-1M', '', 6),
  ('00000000-0000-0000-0000-000000000001', 'D-Day Migration execution', 'manual', 'D-Day', '', 7),
  ('00000000-0000-0000-0000-000000000001', 'Post-migration validation', 'manual', 'Post', '', 8),
  ('00000000-0000-0000-0000-000000000002', 'Confirm migration date', 'manual', 'D-3M', '', 1),
  ('00000000-0000-0000-0000-000000000002', 'Pre-prod environment setup', 'api', 'D-3M', '', 2),
  ('00000000-0000-0000-0000-000000000002', 'AP testing', 'manual', 'D-2M', '', 3),
  ('00000000-0000-0000-0000-000000000002', 'Rehearsal migration', 'manual', 'D-1M', '', 4),
  ('00000000-0000-0000-0000-000000000002', 'D-Day Migration', 'manual', 'D-Day', '', 5),
  ('00000000-0000-0000-0000-000000000002', 'Post validation', 'api', 'Post', '', 6),
  ('00000000-0000-0000-0000-000000000003', 'Confirm migration date', 'manual', 'D-3M', '', 1),
  ('00000000-0000-0000-0000-000000000003', 'Dev/CAT environment setup', 'api', 'D-2M', '', 2),
  ('00000000-0000-0000-0000-000000000003', 'Data copy & restore', 'api', 'D-1M', '', 3),
  ('00000000-0000-0000-0000-000000000003', 'AP connectivity validation', 'api', 'D-1M', '', 4),
  ('00000000-0000-0000-0000-000000000003', 'D-Day Migration execution', 'manual', 'D-Day', '', 5),
  ('00000000-0000-0000-0000-000000000003', 'Post-migration validation', 'api', 'Post', '', 6);

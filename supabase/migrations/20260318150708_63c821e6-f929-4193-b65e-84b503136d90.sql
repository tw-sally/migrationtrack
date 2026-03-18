
-- Fix Standard PROD Migration: add missing offsets (already has D-3M:-3)
INSERT INTO public.template_milestone_offsets (template_id, milestone, offset_months)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'D-2M', -2),
  ('00000000-0000-0000-0000-000000000001', 'D-1M', -1),
  ('00000000-0000-0000-0000-000000000001', 'D-Day', 0),
  ('00000000-0000-0000-0000-000000000001', 'Post', 1)
ON CONFLICT (template_id, milestone) DO UPDATE SET offset_months = EXCLUDED.offset_months;

-- Fix DBVM Migration: add all offsets (has 0)
INSERT INTO public.template_milestone_offsets (template_id, milestone, offset_months)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'D-3M', -3),
  ('00000000-0000-0000-0000-000000000002', 'D-2M', -2),
  ('00000000-0000-0000-0000-000000000002', 'D-1M', -1),
  ('00000000-0000-0000-0000-000000000002', 'D-Day', 0),
  ('00000000-0000-0000-0000-000000000002', 'Post', 1)
ON CONFLICT (template_id, milestone) DO UPDATE SET offset_months = EXCLUDED.offset_months;

-- Fix Dev/CAT DB Migration: remove wrong D-3M and D-2M, add correct D-1M, D-Day, Post
DELETE FROM public.template_milestone_offsets 
WHERE template_id = '00000000-0000-0000-0000-000000000003';

INSERT INTO public.template_milestone_offsets (template_id, milestone, offset_months)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'D-1M', -1),
  ('00000000-0000-0000-0000-000000000003', 'D-Day', 0),
  ('00000000-0000-0000-0000-000000000003', 'Post', 1)
ON CONFLICT (template_id, milestone) DO UPDATE SET offset_months = EXCLUDED.offset_months;

-- Fix SPC DB Migration: add offset for D-3M
INSERT INTO public.template_milestone_offsets (template_id, milestone, offset_months)
VALUES 
  ('2187b39b-a63b-4e96-9e67-024c5a21f5da', 'D-3M', -3)
ON CONFLICT (template_id, milestone) DO UPDATE SET offset_months = EXCLUDED.offset_months;

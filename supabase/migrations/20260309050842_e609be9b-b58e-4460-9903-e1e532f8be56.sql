
-- Clear existing DBVM tasks
DELETE FROM template_tasks WHERE template_id = '00000000-0000-0000-0000-000000000002';

-- Copy all tasks from Standard PROD Migration to DBVM Migration
INSERT INTO template_tasks (template_id, title, input_type, milestone, assignee, "order", remarks)
SELECT '00000000-0000-0000-0000-000000000002', title, input_type, milestone, assignee, "order", remarks
FROM template_tasks
WHERE template_id = '00000000-0000-0000-0000-000000000001'
ORDER BY milestone, "order";

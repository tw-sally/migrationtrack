UPDATE public.migration_tasks
SET end_date = to_char(
  (to_date(due_date, 'YYYY-MM-DD') + INTERVAL '1 month'),
  'YYYY-MM-DD'
)
WHERE due_date IS NOT NULL AND due_date != '';
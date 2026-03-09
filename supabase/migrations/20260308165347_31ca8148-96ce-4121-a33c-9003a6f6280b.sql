
-- Insert migration_tasks for all 14 PROD DBs shown in the image
-- Using template structures and setting statuses based on current progress

-- ===== ESMK (Physical, Jan, ALL DONE) =====
INSERT INTO migration_tasks (migration_id, title, milestone, input_type, assignee, due_date, status, completed_at, "order") VALUES
('7ed7df90-a9d8-443d-8178-986febccbb17', 'AP testing - confirm migration date', 'D-3M', 'manual', 'STRUANB', '2025-10-15', 'completed', '2025-10-20', 1),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'STRUANB', '2025-10-15', 'completed', '2025-10-25', 2),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'AP testing validation (post-restore)', 'D-2M', 'api', 'STRUANB', '2025-11-15', 'completed', '2025-11-18', 3),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'AP testing to make sure migration date', 'D-2M', 'api', 'STRUANB', '2025-11-15', 'completed', '2025-11-20', 4),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'Final backup & restore', 'D-1M', 'manual', 'STRUANB', '2025-12-15', 'completed', '2025-12-18', 5),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'Setup logshipping', 'D-1M', 'api', 'STRUANB', '2025-12-15', 'completed', '2025-12-20', 6),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'D-Day Migration execution', 'D-Day', 'manual', 'STRUANB', '2026-01-15', 'completed', '2026-01-15', 7),
('7ed7df90-a9d8-443d-8178-986febccbb17', 'Post-migration validation', 'Post', 'manual', 'STRUANB', '2026-01-15', 'completed', '2026-01-16', 8),

-- ===== SCM (Physical TSID, Mar, D-3M done) =====
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'AP testing - confirm migration date', 'D-3M', 'manual', 'WYCHIANG', '2025-12-15', 'completed', '2026-01-10', 1),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'WYCHIANG', '2025-12-15', 'completed', '2026-01-15', 2),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'AP testing validation (post-restore)', 'D-2M', 'api', 'WYCHIANG', '2026-01-15', 'not_started', NULL, 3),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'AP testing to make sure migration date', 'D-2M', 'api', 'WYCHIANG', '2026-01-15', 'not_started', NULL, 4),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'Final backup & restore', 'D-1M', 'manual', 'WYCHIANG', '2026-02-15', 'not_started', NULL, 5),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'Setup logshipping', 'D-1M', 'api', 'WYCHIANG', '2026-02-15', 'not_started', NULL, 6),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'D-Day Migration execution', 'D-Day', 'manual', 'WYCHIANG', '2026-03-15', 'not_started', NULL, 7),
('d1c2e493-a3d6-42a0-a6f4-2e6b906304dc', 'Post-migration validation', 'Post', 'manual', 'WYCHIANG', '2026-03-15', 'not_started', NULL, 8),

-- ===== IPSMDB (DBVM, Mar, D-1M done) =====
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'Confirm migration date', 'D-3M', 'manual', 'YHLUZS', '2025-12-15', 'completed', '2026-01-05', 1),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'Pre-prod environment setup', 'D-3M', 'api', 'YHLUZS', '2025-12-15', 'completed', '2026-01-10', 2),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'AP testing', 'D-2M', 'manual', 'YHLUZS', '2026-01-15', 'completed', '2026-01-20', 3),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'Rehearsal migration', 'D-1M', 'manual', 'YHLUZS', '2026-02-15', 'completed', '2026-02-18', 4),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'D-Day Migration', 'D-Day', 'manual', 'YHLUZS', '2026-03-15', 'not_started', NULL, 5),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'Post validation', 'Post', 'api', 'YHLUZS', '2026-03-15', 'not_started', NULL, 6),
('d4b60a82-cc33-476a-8542-2e814e083d9c', 'AP testing to make sure migration date', 'D-2M', 'manual', 'YHLUZS', '2026-01-15', 'completed', '2026-01-22', 7),

-- ===== EQP_PHY (Physical BSID, Apr, D-2M done, D-1M in progress) =====
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'AP testing - confirm migration date', 'D-3M', 'manual', 'CHWUAZZI', '2026-01-15', 'completed', '2026-01-15', 1),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'CHWUAZZI', '2026-01-15', 'completed', '2026-01-20', 2),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'AP testing validation (post-restore)', 'D-2M', 'api', 'CHWUAZZI', '2026-02-15', 'completed', '2026-02-18', 3),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'AP testing to make sure migration date', 'D-2M', 'api', 'CHWUAZZI', '2026-02-15', 'completed', '2026-02-20', 4),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'Final backup & restore', 'D-1M', 'manual', 'CHWUAZZI', '2026-03-15', 'in_progress', NULL, 5),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'Setup logshipping', 'D-1M', 'api', 'CHWUAZZI', '2026-03-15', 'not_started', NULL, 6),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'D-Day Migration execution', 'D-Day', 'manual', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 7),
('260c35c0-cfa9-41c7-87ae-4de609c0a8c2', 'Post-migration validation', 'Post', 'manual', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 8),

-- ===== OP3PRD (DBVM, Apr, D-3M done, D-2M in progress) =====
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'Confirm migration date', 'D-3M', 'manual', 'RXYEA', '2026-01-15', 'completed', '2026-01-15', 1),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'Pre-prod environment setup', 'D-3M', 'api', 'RXYEA', '2026-01-15', 'completed', '2026-01-20', 2),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'AP testing', 'D-2M', 'manual', 'RXYEA', '2026-02-15', 'in_progress', NULL, 3),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'Rehearsal migration', 'D-1M', 'manual', 'RXYEA', '2026-03-15', 'not_started', NULL, 4),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'D-Day Migration', 'D-Day', 'manual', 'RXYEA', '2026-04-15', 'not_started', NULL, 5),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'Post validation', 'Post', 'api', 'RXYEA', '2026-04-15', 'not_started', NULL, 6),
('07620ece-5db3-4ec5-b645-68ed27d282e3', 'AP testing to make sure migration date', 'D-2M', 'manual', 'RXYEA', '2026-02-15', 'in_progress', NULL, 7),

-- ===== RMPROD (Physical BSID, May, D-3M done, D-2M in progress) =====
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'AP testing - confirm migration date', 'D-3M', 'manual', 'CHWUAZZI', '2026-02-15', 'completed', '2026-02-15', 1),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'CHWUAZZI', '2026-02-15', 'completed', '2026-02-20', 2),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'AP testing validation (post-restore)', 'D-2M', 'api', 'CHWUAZZI', '2026-03-15', 'in_progress', NULL, 3),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'AP testing to make sure migration date', 'D-2M', 'api', 'CHWUAZZI', '2026-03-15', 'not_started', NULL, 4),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'Final backup & restore', 'D-1M', 'manual', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 5),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'Setup logshipping', 'D-1M', 'api', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 6),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'D-Day Migration execution', 'D-Day', 'manual', 'CHWUAZZI', '2026-05-15', 'not_started', NULL, 7),
('d297f7b0-14f6-4471-b390-d0fe335544b5', 'Post-migration validation', 'Post', 'manual', 'CHWUAZZI', '2026-05-15', 'not_started', NULL, 8),

-- ===== JCP_PHY (Physical BSID, May, D-3M task1 done, task2 in progress) =====
('25dad173-d338-4e23-8438-f6719b8404cf', 'AP testing - confirm migration date', 'D-3M', 'manual', 'CHWUAZZI', '2026-02-15', 'completed', '2026-02-15', 1),
('25dad173-d338-4e23-8438-f6719b8404cf', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'CHWUAZZI', '2026-02-15', 'in_progress', NULL, 2),
('25dad173-d338-4e23-8438-f6719b8404cf', 'AP testing validation (post-restore)', 'D-2M', 'api', 'CHWUAZZI', '2026-03-15', 'not_started', NULL, 3),
('25dad173-d338-4e23-8438-f6719b8404cf', 'AP testing to make sure migration date', 'D-2M', 'api', 'CHWUAZZI', '2026-03-15', 'not_started', NULL, 4),
('25dad173-d338-4e23-8438-f6719b8404cf', 'Final backup & restore', 'D-1M', 'manual', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 5),
('25dad173-d338-4e23-8438-f6719b8404cf', 'Setup logshipping', 'D-1M', 'api', 'CHWUAZZI', '2026-04-15', 'not_started', NULL, 6),
('25dad173-d338-4e23-8438-f6719b8404cf', 'D-Day Migration execution', 'D-Day', 'manual', 'CHWUAZZI', '2026-05-15', 'not_started', NULL, 7),
('25dad173-d338-4e23-8438-f6719b8404cf', 'Post-migration validation', 'Post', 'manual', 'CHWUAZZI', '2026-05-15', 'not_started', NULL, 8),

-- ===== EBOSTG (DBVM, May, D-3M task1 done, task2 in progress) =====
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'Confirm migration date', 'D-3M', 'manual', 'HEHUANGB', '2026-02-15', 'completed', '2026-02-15', 1),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'Pre-prod environment setup', 'D-3M', 'api', 'HEHUANGB', '2026-02-15', 'in_progress', NULL, 2),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'AP testing', 'D-2M', 'manual', 'HEHUANGB', '2026-03-15', 'not_started', NULL, 3),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'Rehearsal migration', 'D-1M', 'manual', 'HEHUANGB', '2026-04-15', 'not_started', NULL, 4),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'D-Day Migration', 'D-Day', 'manual', 'HEHUANGB', '2026-05-15', 'not_started', NULL, 5),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'Post validation', 'Post', 'api', 'HEHUANGB', '2026-05-15', 'not_started', NULL, 6),
('a6a36313-9e7a-41e2-89b9-cc97f95e7ec4', 'AP testing to make sure migration date', 'D-2M', 'manual', 'HEHUANGB', '2026-03-15', 'not_started', NULL, 7),

-- ===== CCH (Physical TSID, May, D-3M done) =====
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'AP testing - confirm migration date', 'D-3M', 'manual', 'HMHSIEHC', '2026-02-15', 'completed', '2026-02-15', 1),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'HMHSIEHC', '2026-02-15', 'completed', '2026-02-20', 2),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'AP testing validation (post-restore)', 'D-2M', 'api', 'HMHSIEHC', '2026-03-15', 'not_started', NULL, 3),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'AP testing to make sure migration date', 'D-2M', 'api', 'HMHSIEHC', '2026-03-15', 'not_started', NULL, 4),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'Final backup & restore', 'D-1M', 'manual', 'HMHSIEHC', '2026-04-15', 'not_started', NULL, 5),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'Setup logshipping', 'D-1M', 'api', 'HMHSIEHC', '2026-04-15', 'not_started', NULL, 6),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'D-Day Migration execution', 'D-Day', 'manual', 'HMHSIEHC', '2026-05-15', 'not_started', NULL, 7),
('44d1f811-fa9a-4686-a5ea-d07541e369b3', 'Post-migration validation', 'Post', 'manual', 'HMHSIEHC', '2026-05-15', 'not_started', NULL, 8),

-- ===== EDB01 (Physical TSID, May, D-3M done) =====
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'AP testing - confirm migration date', 'D-3M', 'manual', 'JRLULAI', '2026-02-15', 'completed', '2026-02-15', 1),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'JRLULAI', '2026-02-15', 'completed', '2026-02-20', 2),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'AP testing validation (post-restore)', 'D-2M', 'api', 'JRLULAI', '2026-03-15', 'not_started', NULL, 3),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'AP testing to make sure migration date', 'D-2M', 'api', 'JRLULAI', '2026-03-15', 'not_started', NULL, 4),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'Final backup & restore', 'D-1M', 'manual', 'JRLULAI', '2026-04-15', 'not_started', NULL, 5),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'Setup logshipping', 'D-1M', 'api', 'JRLULAI', '2026-04-15', 'not_started', NULL, 6),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'D-Day Migration execution', 'D-Day', 'manual', 'JRLULAI', '2026-05-15', 'not_started', NULL, 7),
('1bc8d7ba-d24b-49a4-9c82-6303074a8242', 'Post-migration validation', 'Post', 'manual', 'JRLULAI', '2026-05-15', 'not_started', NULL, 8),

-- ===== CMPROD_NEW (Physical BSID, May, D-3M task1 done, task2 in progress) =====
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'AP testing - confirm migration date', 'D-3M', 'manual', 'STRUANB', '2026-02-15', 'completed', '2026-02-15', 1),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'STRUANB', '2026-02-15', 'in_progress', NULL, 2),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'AP testing validation (post-restore)', 'D-2M', 'api', 'STRUANB', '2026-03-15', 'not_started', NULL, 3),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'AP testing to make sure migration date', 'D-2M', 'api', 'STRUANB', '2026-03-15', 'not_started', NULL, 4),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'Final backup & restore', 'D-1M', 'manual', 'STRUANB', '2026-04-15', 'not_started', NULL, 5),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'Setup logshipping', 'D-1M', 'api', 'STRUANB', '2026-04-15', 'not_started', NULL, 6),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'D-Day Migration execution', 'D-Day', 'manual', 'STRUANB', '2026-05-15', 'not_started', NULL, 7),
('4954e5e9-ecf3-44a9-877f-799b0334987a', 'Post-migration validation', 'Post', 'manual', 'STRUANB', '2026-05-15', 'not_started', NULL, 8),

-- ===== ESCMPRD3 (Physical BSID, Jun, D-3M starting) =====
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'AP testing - confirm migration date', 'D-3M', 'manual', 'STRUANB', '2026-03-15', 'in_progress', NULL, 1),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'Release Pre-prod (environment setup)', 'D-3M', 'manual', 'STRUANB', '2026-03-15', 'not_started', NULL, 2),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'AP testing validation (post-restore)', 'D-2M', 'api', 'STRUANB', '2026-04-15', 'not_started', NULL, 3),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'AP testing to make sure migration date', 'D-2M', 'api', 'STRUANB', '2026-04-15', 'not_started', NULL, 4),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'Final backup & restore', 'D-1M', 'manual', 'STRUANB', '2026-05-15', 'not_started', NULL, 5),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'Setup logshipping', 'D-1M', 'api', 'STRUANB', '2026-05-15', 'not_started', NULL, 6),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'D-Day Migration execution', 'D-Day', 'manual', 'STRUANB', '2026-06-15', 'not_started', NULL, 7),
('7a11047b-7bb2-4a85-a04d-a030af667b16', 'Post-migration validation', 'Post', 'manual', 'STRUANB', '2026-06-15', 'not_started', NULL, 8),

-- ===== EDWODS (DBVM, Jun, D-3M starting) =====
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'Confirm migration date', 'D-3M', 'manual', 'WYCHIANG', '2026-03-15', 'in_progress', NULL, 1),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'Pre-prod environment setup', 'D-3M', 'api', 'WYCHIANG', '2026-03-15', 'not_started', NULL, 2),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'AP testing', 'D-2M', 'manual', 'WYCHIANG', '2026-04-15', 'not_started', NULL, 3),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'Rehearsal migration', 'D-1M', 'manual', 'WYCHIANG', '2026-05-15', 'not_started', NULL, 4),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'D-Day Migration', 'D-Day', 'manual', 'WYCHIANG', '2026-06-15', 'not_started', NULL, 5),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'Post validation', 'Post', 'api', 'WYCHIANG', '2026-06-15', 'not_started', NULL, 6),
('83379704-c084-4fd0-894c-e2ebcfe160d6', 'AP testing to make sure migration date', 'D-2M', 'manual', 'WYCHIANG', '2026-04-15', 'not_started', NULL, 7),

-- ===== MESBK (DBVM, Jun, D-3M done) =====
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'Confirm migration date', 'D-3M', 'manual', 'JRLULAI', '2026-03-15', 'completed', '2026-03-05', 1),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'Pre-prod environment setup', 'D-3M', 'api', 'JRLULAI', '2026-03-15', 'completed', '2026-03-08', 2),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'AP testing', 'D-2M', 'manual', 'JRLULAI', '2026-04-15', 'not_started', NULL, 3),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'Rehearsal migration', 'D-1M', 'manual', 'JRLULAI', '2026-05-15', 'not_started', NULL, 4),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'D-Day Migration', 'D-Day', 'manual', 'JRLULAI', '2026-06-15', 'not_started', NULL, 5),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'Post validation', 'Post', 'api', 'JRLULAI', '2026-06-15', 'not_started', NULL, 6),
('fa30feb3-80d4-43d0-9040-e0f136497b6a', 'AP testing to make sure migration date', 'D-2M', 'manual', 'JRLULAI', '2026-04-15', 'not_started', NULL, 7);

-- Update migration completion percentages and statuses
UPDATE migrations SET completion_percent = 100, overall_status = 'completed' WHERE id = '7ed7df90-a9d8-443d-8178-986febccbb17'; -- ESMK
UPDATE migrations SET completion_percent = 25, overall_status = 'in_progress' WHERE id = 'd1c2e493-a3d6-42a0-a6f4-2e6b906304dc'; -- SCM
UPDATE migrations SET completion_percent = 71, overall_status = 'in_progress' WHERE id = 'd4b60a82-cc33-476a-8542-2e814e083d9c'; -- IPSMDB
UPDATE migrations SET completion_percent = 50, overall_status = 'in_progress' WHERE id = '260c35c0-cfa9-41c7-87ae-4de609c0a8c2'; -- EQP_PHY
UPDATE migrations SET completion_percent = 29, overall_status = 'in_progress' WHERE id = '07620ece-5db3-4ec5-b645-68ed27d282e3'; -- OP3PRD
UPDATE migrations SET completion_percent = 25, overall_status = 'in_progress' WHERE id = 'd297f7b0-14f6-4471-b390-d0fe335544b5'; -- RMPROD
UPDATE migrations SET completion_percent = 13, overall_status = 'in_progress' WHERE id = '25dad173-d338-4e23-8438-f6719b8404cf'; -- JCP_PHY
UPDATE migrations SET completion_percent = 14, overall_status = 'in_progress' WHERE id = 'a6a36313-9e7a-41e2-89b9-cc97f95e7ec4'; -- EBOSTG
UPDATE migrations SET completion_percent = 25, overall_status = 'in_progress' WHERE id = '44d1f811-fa9a-4686-a5ea-d07541e369b3'; -- CCH
UPDATE migrations SET completion_percent = 25, overall_status = 'in_progress' WHERE id = '1bc8d7ba-d24b-49a4-9c82-6303074a8242'; -- EDB01
UPDATE migrations SET completion_percent = 13, overall_status = 'in_progress' WHERE id = '4954e5e9-ecf3-44a9-877f-799b0334987a'; -- CMPROD_NEW
UPDATE migrations SET completion_percent = 0, overall_status = 'in_progress' WHERE id = '7a11047b-7bb2-4a85-a04d-a030af667b16'; -- ESCMPRD3
UPDATE migrations SET completion_percent = 0, overall_status = 'in_progress' WHERE id = '83379704-c084-4fd0-894c-e2ebcfe160d6'; -- EDWODS
UPDATE migrations SET completion_percent = 29, overall_status = 'in_progress' WHERE id = 'fa30feb3-80d4-43d0-9040-e0f136497b6a'; -- MESBK

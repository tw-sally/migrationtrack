
INSERT INTO template_tasks (template_id, title, input_type, milestone, assignee, "order", remarks) VALUES
('00000000-0000-0000-0000-000000000001', '此階段需與AP Sponsor 建立weekly meeting機制for migration討論 & schedule control 務必要定期review, 否則這個階段很容易滑掉~~~', 'manual', 'D-2M', '', 1, ''),
('00000000-0000-0000-0000-000000000001', 'AP Connection Test Done', 'manual', 'D-2M', 'AP', 2, '請AP提供 performance / stress test report (格式不拘)'),
('00000000-0000-0000-0000-000000000001', 'AP connection string change (optional)', 'manual', 'D-2M', 'AP', 3, 'weekly 看進度 (可開audit確認old service usage)'),
('00000000-0000-0000-0000-000000000001', 'DB 上游 / 下游 盤點 & 開通 (mail 提醒下游DBA, 並建立下游DBA teams群組, test pre-prod connection, disable/enable snapshot, change connection string)', 'manual', 'D-2M', '', 4, '(若有要走proxy的, 請提供下游IP資訊給AP申請白名單)'),
('00000000-0000-0000-0000-000000000001', 'AP pre-prod testing (performance/stress test)', 'manual', 'D-2M', 'AP', 5, '請AP提供 performance / stress test report (格式不拘)'),
('00000000-0000-0000-0000-000000000001', '確認下游DBA teams完成連線測試', 'manual', 'D-2M', '', 6, ''),
('00000000-0000-0000-0000-000000000001', '確定migration日期，並提供給EGG', 'manual', 'D-2M', '', 7, '至少migration day 一個月前');

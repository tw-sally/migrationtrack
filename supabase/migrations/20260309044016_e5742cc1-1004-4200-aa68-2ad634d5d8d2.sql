
-- Delete existing D-3M tasks for Standard PROD Migration template
DELETE FROM template_tasks 
WHERE template_id = '00000000-0000-0000-0000-000000000001' AND milestone = 'D-3M';

-- Insert 25 D-3M tasks (item 23 placeholder - not visible in images)
INSERT INTO template_tasks (template_id, title, input_type, milestone, assignee, "order", remarks) VALUES
('00000000-0000-0000-0000-000000000001', '與AP & EGG通知接下來migration準備開始，建立teams migration溝通群組', 'manual', 'D-3M', '', 1, ''),
('00000000-0000-0000-0000-000000000001', '評估size & 申請 pre-prod / standby LUN 空間(DATA/FRA)', 'manual', 'D-3M', '', 2, ''),
('00000000-0000-0000-0000-000000000001', 'backup NAS / 白名單申請 (pre-prod & new standby)', 'manual', 'D-3M', '', 3, ''),
('00000000-0000-0000-0000-000000000001', '申請 OCR NAS (by server)', 'manual', 'D-3M', '', 4, ''),
('00000000-0000-0000-0000-000000000001', '確認申請 Service Cname，VIP Cname DNS (指向舊機器)', 'manual', 'D-3M', '', 5, ''),
('00000000-0000-0000-0000-000000000001', '申請新的GA或把新server掛入舊的GA', 'manual', 'D-3M', '', 6, ''),
('00000000-0000-0000-0000-000000000001', '提供logon record for 30 days on LOC & account owner list 給AP做impact survey & 溝通', 'manual', 'D-3M', 'AP', 7, '請AP於Pre-prod release day前完成'),
('00000000-0000-0000-0000-000000000001', '提供 Client Version too old Check from Dashboard', 'manual', 'D-3M', '', 8, ''),
('00000000-0000-0000-0000-000000000001', '提供new server hostname / IP 資訊給AP進行FW/Proxy開通', 'manual', 'D-3M', '', 9, '請AP於Pre-prod release day前完成'),
('00000000-0000-0000-0000-000000000001', 'Auto create diskgroup (pre-prod & new standby)', 'api', 'D-3M', '', 10, ''),
('00000000-0000-0000-0000-000000000001', 'Auto Mount backup NAS (pre-prod & new standby)', 'api', 'D-3M', '', 11, ''),
('00000000-0000-0000-0000-000000000001', 'Auto Restore DB for pre-prod 建置', 'api', 'D-3M', '', 12, ''),
('00000000-0000-0000-0000-000000000001', 'Auto Upgrade (Prepare) for pre-prod 建置，特別注意需要 Single 轉RAC 以及是否需要 Rename DB', 'api', 'D-3M', '', 13, 'Result Report 特別注意以下, 需要與AP溝通：Fix Different Table and Index Owner (紀錄清單), TSMC_DDL_PRIV_CONTROL_TRIG 需特別確認前後是否有不同, before / after parameter : case_sensitive_logon, invisible_index, invalid objects'),
('00000000-0000-0000-0000-000000000001', 'Add new service on PROD & pre-prod for connection string change (optional)', 'manual', 'D-3M', '', 14, ''),
('00000000-0000-0000-0000-000000000001', 'add Pre-Prod inventory', 'manual', 'D-3M', '', 15, ''),
('00000000-0000-0000-0000-000000000001', 'Set up CPU cage', 'manual', 'D-3M', 'DBA', 16, ''),
('00000000-0000-0000-0000-000000000001', 'Auto change NAS for RAC OCR 第三份', 'api', 'D-3M', '', 17, ''),
('00000000-0000-0000-0000-000000000001', 'Auto QA / Sanity Check & Fix', 'api', 'D-3M', '', 18, 'Result Report 特別注意以下, 需要與AP溝通：check_DB_USERS_PASSWORD_VERSIONS only 10g account'),
('00000000-0000-0000-0000-000000000001', 'Auto apply hostbase firewall', 'api', 'D-3M', '', 19, ''),
('00000000-0000-0000-0000-000000000001', 'Auto HA test', 'api', 'D-3M', '', 20, ''),
('00000000-0000-0000-0000-000000000001', 'Auto SPA testing for SQL performance checking (Result 提供給AP)', 'api', 'D-3M', '', 21, ''),
('00000000-0000-0000-0000-000000000001', 'test ilo alert mail (by server)', 'manual', 'D-3M', '', 22, ''),
('00000000-0000-0000-0000-000000000001', '(placeholder - item 23)', 'manual', 'D-3M', '', 23, ''),
('00000000-0000-0000-0000-000000000001', 'Pre-prod Release mail to AP', 'manual', 'D-3M', '', 24, ''),
('00000000-0000-0000-0000-000000000001', '進行Migration Release 會議：Migration細節說明，提供 D-day task breakdown 及相關material給AP，建立weekly meeting機制', 'manual', 'D-3M', '', 25, '內容包含：1.Summary Page (as-is to-be Arch.), 2.Spec Comparison, 3.CPU estimation, 4.Pre-prod info, 5.D-day task breakdown, 6.Migration WBS, 7.其他Custom task 說明：connection string change, rename db, single to RAC, Fix Different Table and Index Owner, TSMC_DDL_PRIV_CONTROL_TRIG 需特別確認前後是否有不同, before / after parameter : case_sensitive_logon, DB_USERS_PASSWORD_VERSIONS only 10g account, invisible_index, invalid objects');

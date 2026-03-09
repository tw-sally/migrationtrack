
-- Insert TEST DB records batch 2 (2026-05 to 2026-08)
INSERT INTO migrations (dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
SELECT v.dbid, v.phase, v.db_type, v.prod_or_test, v.migration_date, v.d_minus_3m, v.d_minus_2m, v.d_minus_1m, v.dba, v.task_owner, v.ap_sponsor, v.ap_manager, v.migration_strategy, v.source_db_type, v.overall_status, v.completion_percent::int
FROM (VALUES
-- 2026年5月
('ESCMUAT3','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','STRUANB','HEHUANGB','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('SEARCHUAT','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','RXYEA','HEHUANGB','PTWANG','YCPENGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('JIRADEV','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','STRUANB','HEHUANGB','PTWANG','YCPENGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('JIRAUAT','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','STRUANB','HEHUANGB','PTWANG','YCPENGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TNA_UAT','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','JRLULAI','HMHSIEHC','JYCHENBL','XWHUANGC','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ECDEV','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','JRLULAI','HMHSIEHC','JYLIUM','YENLIN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('PQO_UAT2','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','JRLULAI','HMHSIEHC','SYTSAIJ','HUANGSYE','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TOMCNDEV','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','RXYEA','HMHSIEHC','SWCHANGL -> TCHSIAOD','BWTSENGA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('CIDEV','TEST','TestDB_Full_Copy','TEST','2026-05-15','2026-02-15','2026-03-15','2026-04-15','RXYEA','RXYEA','WANGCHC','BWTSENGA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
-- 2026年6月
('IPMUAT','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','YHLUZS','CHWUAZZI','YCYANGZU','YJTANGA','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('PTDEV','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','STRUANB','CHWUAZZI','YRCHOU','HYTAI','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('PTUAT','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','STRUANB','CHWUAZZI','YRCHOU','HYTAI','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('SCMD','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','WYCHIANG','CHWUAZZI','TYWANGW / HYFANGC','HUANGSCM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('RMDEV','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','JRLULAI','RXYEA','CHYUX','HUANGSCM','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ODSPROJU','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','RXYEA','RXYEA','YHHSUEHG','TLSHIHA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ODSUAT','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','RXYEA','RXYEA','YHHSUEHG','TLSHIHA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('NWMUAT','TEST','TestDB_Full_Copy','TEST','2026-06-15','2026-03-15','2026-04-15','2026-05-15','RXYEA','RXYEA','BTHUANG','CHLIUZP','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
-- 2026年7月
('CIUAT','TEST','TestDB_Full_Copy','TEST','2026-07-15','2026-04-15','2026-05-15','2026-06-15','RXYEA','WYCHIANG','WANGCHC','BWTSENGA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TOMCNUAT','TEST','TestDB_Full_Copy','TEST','2026-07-15','2026-04-15','2026-05-15','2026-06-15','RXYEA','WYCHIANG','TCHSIAOD -> TCHSIAOD','TYHUANGU -> BWTSENGA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
-- 2026年8月
('RDDEV','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','YHLUZS','WYCHIANG','CHANGCCM','TYWENG','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('CSV_UAT','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','RXYEA','WYCHIANG','XXYANGA','CHLIUZP','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('AIMDEV','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','WYCHIANG','WYCHIANG','HSIEHYCD','CHIANGHH','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('SCMDEV','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','WYCHIANG','WYCHIANG','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EPMST','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','JRLULAI','YXCHENZG','CHENYSZM','CHWUAO','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EBOODST','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','JRLULAI','YXCHENZG','CYLAIZB -> LINCWD','CHENJCC -> JYLEEN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EBOSTGT','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','JRLULAI','YXCHENZG','CYLAIZB -> LINCWD','CHENJCC -> JYLEEN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TOMUAT','TEST','TestDB_Full_Copy','TEST','2026-08-15','2026-05-15','2026-06-15','2026-07-15','RXYEA','YXCHENZG','JMKO','XCPAN','Migration_After_Release','TestDB_Full_Copy','not_started','0')
) AS v(dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
WHERE NOT EXISTS (SELECT 1 FROM migrations m WHERE m.dbid = v.dbid AND m.prod_or_test = v.prod_or_test);

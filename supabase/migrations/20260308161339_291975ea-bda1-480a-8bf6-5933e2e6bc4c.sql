
-- Insert TEST DB records batch 1 (2026-01 to 2026-04)
INSERT INTO migrations (dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
SELECT v.dbid, v.phase, v.db_type, v.prod_or_test, v.migration_date, v.d_minus_3m, v.d_minus_2m, v.d_minus_1m, v.dba, v.task_owner, v.ap_sponsor, v.ap_manager, v.migration_strategy, v.source_db_type, v.overall_status, v.completion_percent::int
FROM (VALUES
-- 2026年1月
('IPSMSIT','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','YHLUZS','CHWUAZZI','CJCHUNGC','JHKAOA','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ESMKDEV','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','STRUANB','CHWUAZZI','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('CMDEV','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','STRUANB','CHWUAZZI','CWYEHU','SYWANGZB','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EQQ','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','WYCHIANG','CHWUAZZI','HYFANGC','HUANGSCM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TOMDEV','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','RXYEA','RXYEA','JMKO','XCPAN','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('RMUAT','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','JRLULAI','RXYEA','TYWANGW','HUANGSCM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ONEFACUT','TEST','TestDB_Full_Copy','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','JRLULAI','RXYEA','CCYANGAF','JHCHENW','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('U8RD1CT1','TEST','','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','YHLUZS','YHLUZS','','','','','not_started','0'),
('U8RD2CT1','TEST','','TEST','2026-01-15','2025-10-15','2025-11-15','2025-12-15','YHLUZS','YHLUZS','','','','','not_started','0'),
-- 2026年3月
('DSAPUAT','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','YHLUZS','CHWUAZZI','PCTU','CCSHIHN','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('RDITDEV','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','WYCHIANG','CHWUAZZI','PCTU / JJJHAOA','CCSHIHN / TCCHENZR','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('JCQ','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','WYCHIANG','CHWUAZZI','TYWANGW','HUANGSCM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('DMMUAT','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','WYCHIANG','CHWUAZZI','JJJHAOA','TCCHENZR','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('TNADEV','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','JRLULAI','RXYEA','JYCHENBL','XWHUANGC','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ESCMDEV','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','STRUANB','RXYEA','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ESCMSIT','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','STRUANB','RXYEA','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('CMUAT','TEST','TestDB_Full_Copy','TEST','2026-03-15','2025-12-15','2026-01-15','2026-02-15','STRUANB','RXYEA','CWYEHU','SYWANGZB','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
-- 2026年4月
('DLGDEV','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','IHKAO -> HMHSIEHC','HMHSIEHC','CHTANGN','CJTUB','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('FAMT','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','JRLULAI','HMHSIEHC','YSCHUNGD','CWWUZI','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('OPTDEV','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','IHKAO -> HMHSIEHC','HMHSIEHC','TYYUP -> CHWANGBK','YRLEEE -> KHWONG','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('IPDEV','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','YHLUZS','HMHSIEHC','YCYANGZU','YJTANGA','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('OP2UAT','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','RXYEA','RXYEA','KYYU -> GHQIU','WDKUO','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ESCMUAT2','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','STRUANB','RXYEA','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ESMKUAT','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','STRUANB','RXYEA','STKUO','YLLINZY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('CSV_DEV','TEST','TestDB_Full_Copy','TEST','2026-04-15','2026-01-15','2026-02-15','2026-03-15','RXYEA','RXYEA','XXYANGA','CHLIUZP','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0')
) AS v(dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
WHERE NOT EXISTS (SELECT 1 FROM migrations m WHERE m.dbid = v.dbid AND m.prod_or_test = v.prod_or_test);

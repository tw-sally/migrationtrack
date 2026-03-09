
-- Insert TEST DB records batch 3 (2026-09 to 2026-12)
INSERT INTO migrations (dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
SELECT v.dbid, v.phase, v.db_type, v.prod_or_test, v.migration_date, v.d_minus_3m, v.d_minus_2m, v.d_minus_1m, v.dba, v.task_owner, v.ap_sponsor, v.ap_manager, v.migration_strategy, v.source_db_type, v.overall_status, v.completion_percent::int
FROM (VALUES
-- 2026年9月
('WBFDEV','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','JRLULAI','CHWUAZZI','CHENYYO','YWCHENGI','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('WISDBT','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','JRLULAI','CHWUAZZI','PHHUANGX','MCWUZJ','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('EWIMDEP','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','JRLULAI','CHWUAZZI','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('TOMPROJU','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','RXYEA','HEHUANGB','JMKO','XCPAN','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('AIMUAT','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','WYCHIANG','HEHUANGB','HSIEHYCD','CHIANGHH','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('AIMRMUAT','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','WYCHIANG','HEHUANGB','HSIEHYCD','CHIANGHH','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('MPCSUAT','TEST','TestDB_Full_Copy','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','WYCHIANG','HEHUANGB','YCTANGC','CHANGCWR','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('IWINT','TEST','PROD_Schema_Only','TEST','2026-09-15','2026-06-15','2026-07-15','2026-08-15','WYCHIANG','WYCHIANG','JYLINZE','ZRHSIEHA','Migration_After_Release','PROD_Schema_Only','not_started','0'),
-- 2026年10月
('DLGUAT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','IHKAO -> HMHSIEHC','WYCHIANG','CHTANGN','CJTUB','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('MATDBT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','JRLULAI','WYCHIANG','YHWANGAH','CHANGYYC','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('CCHUAT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','IHKAO -> HMHSIEHC','WYCHIANG','ZYSHANGA','CHANGYYC','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ONEDATAD','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','STRUANB','WYCHIANG','KFLINB','CHANGMHC','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('ISCDEV','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','STRUANB','YXCHENZG','LINYTK','HYCHEN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ISCUAT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','STRUANB','YXCHENZG','LINYTK','HYCHEN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('MFAUAT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','STRUANB','YXCHENZG','TCWANGZL','CYWUAZX','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('MLIODSDEV','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','YHLUZS','YXCHENZG','RSWANG','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('BIDWT','TEST','TestDB_Full_Copy','TEST','2026-10-15','2026-07-15','2026-08-15','2026-09-15','YHLUZS','YXCHENZG','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
-- 2026年11月
('IDSBKTST','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','YHLUZS','RXYEA','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('LEGALUAT','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','YHLUZS','RXYEA','CYLOQ','CYWUAZX','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('BIDWTST','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','YHLUZS','RXYEA','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('BPOPDEV','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','WYCHIANG','RXYEA','UCCHENGD','CHANGMHC','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('PQOUAT','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','JRLULAI','WYCHIANG','SYTSAIJ','HUANGSYE','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ENTTST','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','JRLULAI','WYCHIANG','KRCHEN','HMCHENU','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('CPISDEV','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','JRLULAI','WYCHIANG','CHKUOZA','WCWUY','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('WISDBDEV','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','JRLULAI','WYCHIANG','PHHUANGX','MCWUZJ','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ONEDATAU','TEST','TestDB_Full_Copy','TEST','2026-11-15','2026-08-15','2026-09-15','2026-10-15','STRUANB','WYCHIANG','KFLINB','CHANGMHC','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
-- 2026年12月
('BIDWDEV','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','YHLUZS','HEHUANGB','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EDW11GUAT','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','WYCHIANG','HEHUANGB','PSCHUNG','WCHENQ','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('EDWODUAT','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','WYCHIANG','HEHUANGB','PSCHUNG','WCHENQ','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('WBFTST','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','HEHUANGB','CHENYYO','YWCHENGI','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('PSCVSIT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSSIT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSU8SIT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSCVPOC','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSUAT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSCVUAT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSU8UAT','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('PSDEV','TEST','','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','STRUANB','STRUANB','','','','','not_started','0'),
('EWIMTST','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','YXCHENZG','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('PQO_DEV2','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','YXCHENZG','SYTSAIJ','HUANGSYE','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ENTUAT','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','YXCHENZG','KRCHEN','HMCHENU','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ENTDEV','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','YXCHENZG','KRCHEN','HMCHENU','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('CPISVMUAT','TEST','TestDB_Full_Copy','TEST','2026-12-15','2026-09-15','2026-10-15','2026-11-15','JRLULAI','YXCHENZG','CHKUOZA','WCWUY','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0')
) AS v(dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
WHERE NOT EXISTS (SELECT 1 FROM migrations m WHERE m.dbid = v.dbid AND m.prod_or_test = v.prod_or_test);

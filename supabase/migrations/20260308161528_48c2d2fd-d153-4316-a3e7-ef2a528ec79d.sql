
-- Insert TEST DB records batch 4 (2027-01 to 2027-03)
INSERT INTO migrations (dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
SELECT v.dbid, v.phase, v.db_type, v.prod_or_test, v.migration_date, v.d_minus_3m, v.d_minus_2m, v.d_minus_1m, v.dba, v.task_owner, v.ap_sponsor, v.ap_manager, v.migration_strategy, v.source_db_type, v.overall_status, v.completion_percent::int
FROM (VALUES
-- 2027年1月
('IDSBKDEV','TEST','TestDB_Full_Copy','TEST','2027-01-15','2026-10-15','2026-11-15','2026-12-15','YHLUZS','RXYEA','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('MLIODST','TEST','TestDB_Full_Copy','TEST','2027-01-15','2026-10-15','2026-11-15','2026-12-15','YHLUZS','RXYEA','RSWANG','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('SCMUAT','TEST','TestDB_Full_Copy','TEST','2027-01-15','2026-10-15','2026-11-15','2026-12-15','WYCHIANG','RXYEA','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ECUAT','TEST','TestDB_Full_Copy','TEST','2027-01-15','2026-10-15','2026-11-15','2026-12-15','JRLULAI','RXYEA','JYLIUM','YENLIN','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('ITEMCAT','TEST','PROD_Schema_Only','TEST','2027-01-15','2026-10-15','2026-11-15','2026-12-15','WYCHIANG','WYCHIANG','YSSUI','TYLEEW','Scheduled_Downtime_Migration','PROD_Schema_Only','not_started','0'),
-- 2027年3月
('EWIMUAT','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','JRLULAI','CHWUAZZI','MTLINB','HMCHANGM','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('BKS01DEV','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','JRLULAI','CHWUAZZI','CIHOA','HYCHENBX','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('BKS01T','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','JRLULAI','CHWUAZZI','SYHSUU','HYCHENBX','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('MESBKDEV','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','JRLULAI','CHWUAZZI','MTLINB','HMCHANGM','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('IDSBKUAT','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','YHLUZS','HMHSIEHC','MTLINB','CITUB','Migration_After_Release','TestDB_Full_Copy','not_started','0'),
('PFUAT','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','YXCHENZG','HMHSIEHC','MRLEEC','HYCHENBX','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0'),
('MESBKTST','TEST','TestDB_Full_Copy','TEST','2027-03-15','2026-12-15','2027-01-15','2027-02-15','JRLULAI','HMHSIEHC','SYHSUU','HYCHENBX','Scheduled_Downtime_Migration','TestDB_Full_Copy','not_started','0')
) AS v(dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, migration_strategy, source_db_type, overall_status, completion_percent)
WHERE NOT EXISTS (SELECT 1 FROM migrations m WHERE m.dbid = v.dbid AND m.prod_or_test = v.prod_or_test);

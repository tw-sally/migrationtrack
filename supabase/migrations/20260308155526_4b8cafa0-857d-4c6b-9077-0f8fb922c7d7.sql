
DELETE FROM task_notes;
DELETE FROM migration_tasks;
DELETE FROM migrations;

INSERT INTO migrations (dbid, phase, db_type, prod_or_test, migration_date, d_minus_3m, d_minus_2m, d_minus_1m, dba, task_owner, ap_sponsor, ap_manager, overall_status, completion_percent)
VALUES
  -- 2026年1月
  ('ESMK', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-01-15', '2025-10-15', '2025-11-15', '2025-12-15', 'STRUANB', 'STRUANB', 'STKUO', 'YLLINZY', 'completed', 100),
  ('RMANFOC', 'PLED', 'ENT DBVM PROD', 'PROD', '2026-01-15', '2025-10-15', '2025-11-15', '2025-12-15', 'DYWUL', 'DYWUL', 'DYWUL', 'THLINQ', 'completed', 100),
  -- 2026年3月
  ('SCM', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-03-15', '2025-12-15', '2026-01-15', '2026-02-15', 'WYCHIANG', 'WYCHIANG', 'MTLINB', 'HMCHANGM', 'not_started', 0),
  ('IPSMDB', 'ICSD', 'ENT DBVM PROD', 'PROD', '2026-03-15', '2025-12-15', '2026-01-15', '2026-02-15', 'YHLUZS', 'YHLUZS', 'CJCHUNGC', 'JHKAOA', 'not_started', 0),
  ('IPQRS_PROD', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-03-15', '2025-12-15', '2026-01-15', '2026-02-15', 'YHLUZS', 'YHLUZS', 'YCYANGZU', 'YJTANGA', 'not_started', 0),
  ('ONEFAC', 'IMC', 'ENT DBVM PROD', 'PROD', '2026-03-15', '2025-12-15', '2026-01-15', '2026-02-15', 'JRLULAI', 'JRLULAI', 'KYCHENGJ', 'YCLINAE', 'not_started', 0),
  -- 2026年4月
  ('EQP_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-04-15', '2026-01-15', '2026-02-15', '2026-03-15', 'WYCHIANG', 'CHWUAZZI', 'HYFANGC', 'HUANGSCM', 'not_started', 0),
  ('OP3PRD', 'AUDIT', 'ENT DBVM PROD', 'PROD', '2026-04-15', '2026-01-15', '2026-02-15', '2026-03-15', 'RXYEA', 'RXYEA', 'KYYU -> GHQIU', 'WDKUO', 'not_started', 0),
  -- 2026年5月
  ('RMPROD', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'JRLULAI', 'CHWUAZZI', 'TYWANGW', 'HUANGSCM', 'not_started', 0),
  ('JCP_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'WYCHIANG', 'CHWUAZZI', 'TYWANGW', 'HUANGSCM', 'not_started', 0),
  ('EBOSTG', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'JRLULAI', 'HEHUANGB', 'CYLAIZB -> LINCWD', 'CHENJCC -> JYLEEN', 'not_started', 0),
  ('CCH', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'IHKAO -> HMHSIEHC', 'HMHSIEHC', 'ZYSHANGA', 'CHANGYYC', 'not_started', 0),
  ('EDB01', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'JRLULAI', 'JRLULAI', 'KRCHEN', 'KRCHEN', 'not_started', 0),
  ('CMPROD_NEW', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'STRUANB', 'STRUANB', 'CWYEHU', 'SYWANGZB', 'not_started', 0),
  ('DMMDB', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'WYCHIANG', 'YXCHENZG', 'JJJHAOA', 'TCCHENZR', 'not_started', 0),
  ('DSAP', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-05-15', '2026-02-15', '2026-03-15', '2026-04-15', 'YHLUZS', 'YXCHENZG', 'PCTU', 'CCSHIHN', 'not_started', 0),
  -- 2026年6月
  ('ESCMPRD3', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'STRUANB', 'STRUANB', 'STKUO', 'YLLINZY', 'not_started', 0),
  ('EDWODS', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'WYCHIANG', 'WYCHIANG', 'PSCHUNG', 'WCHENQ', 'not_started', 0),
  ('MESBK', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'JRLULAI', 'JRLULAI', 'SYHSUU', 'HYCHENBX', 'not_started', 0),
  ('BKS01', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'JRLULAI', 'YXCHENZG', 'CIHOA', 'HYCHENBX', 'not_started', 0),
  ('MPCS200', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'WYCHIANG', 'WYCHIANG', 'YCTANGC', 'CHANGCWR', 'not_started', 0),
  ('WAFERCAR', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'WYCHIANG', 'HMHSIEHC', 'WTYANGH', 'HUANGCYG', 'not_started', 0),
  ('SPC18G2', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  ('SPCSC1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-06-15', '2026-03-15', '2026-04-15', '2026-05-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  -- 2026年7月
  ('PSCV', 'BSID', 'ENT Physical PROD (BSID) TDE', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'STRUANB', 'STRUANB', 'CWHSIAOE/TCYANGW', 'YCHIANGV', 'not_started', 0),
  ('PSU8', 'BSID', 'ENT Physical PROD (BSID) TDE', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'STRUANB', 'STRUANB', 'CWHSIAOE/TCYANGW', 'YCHIANGV', 'not_started', 0),
  ('PS', 'BSID', 'ENT Physical PROD (BSID) TDE', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'STRUANB', 'STRUANB', 'CWHSIAOE/TCYANGW', 'YCHIANGV', 'not_started', 0),
  ('FAM23', 'FAC', 'ENT DBVM PROD', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'JRLULAI', 'JRLULAI', 'YSCHUNGD', 'CWWUZI', 'not_started', 0),
  ('FAM_ARCH', 'FAC', 'ENT DBVM PROD', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'JRLULAI', 'JRLULAI', 'YSCHUNGD', 'CWWUZI', 'not_started', 0),
  ('EBOODS', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'JRLULAI', 'HEHUANGB', 'CYLAIZB -> LINCWD', 'CHENJCC -> JYLEEN', 'not_started', 0),
  ('EWIM', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-07-15', '2026-04-15', '2026-05-15', '2026-06-15', 'JRLULAI', 'JRLULAI', 'MTLINB', 'HMCHANGM', 'not_started', 0),
  -- 2026年8月
  ('MPCS300', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'YHLUZS', 'WYCHIANG', 'YCTANGC', 'CHANGCWR', 'not_started', 0),
  ('TNA_PROD', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'JRLULAI', 'JRLULAI', 'JYCHENBL', 'XWHUANGC', 'not_started', 0),
  ('TOMCNPRD', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'RXYEA', 'RXYEA', 'CMHUANGN -> TCHSIAC', 'TYHUANGU -> BWTSENGA', 'not_started', 0),
  ('ONEDATAP', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'STRUANB', 'STRUANB', 'KFLINB', 'CHANGMHC', 'not_started', 0),
  ('ECODS_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'RXYEA', 'RXYEA', 'YHHSUEHG', 'TLSHIHA', 'not_started', 0),
  ('U8RD1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  ('U8RD2', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-08-15', '2026-05-15', '2026-06-15', '2026-07-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  -- 2026年9月
  ('QOCC', 'TSID', 'ENT DBVM PROD', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'YHLUZS', 'HEHUANGB', 'CJJIANGC', 'CHANGYYC', 'not_started', 0),
  ('ESCMPRD2_NEW', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'STRUANB', 'STRUANB', 'STKUO', 'YLLINZY', 'not_started', 0),
  ('PTPRD', 'ICSD', 'ENT DBVM PROD', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'STRUANB', 'YXCHENZG', 'YRCHOU', 'HYTAI', 'not_started', 0),
  ('EDW', 'TSID', 'ENT Physical PROD (TSID)', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'WYCHIANG', 'WYCHIANG', 'PSCHUNG', 'WCHENQ', 'not_started', 0),
  ('A4_PROD', 'PLED', 'ENT DBVM PROD', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'YHLUZS', 'YHLUZS', 'HUANGYZL/PYSUNH', 'CHLEEZO/HUANGYZL', 'not_started', 0),
  ('SECDOCDB', 'PLED', 'ENT DBVM PROD', 'PROD', '2026-09-15', '2026-06-15', '2026-07-15', '2026-08-15', 'JRLULAI', 'JRLULAI', 'HUANGYZL/PYSUNH', 'CHLEEZO/HUANGYZL', 'not_started', 0),
  -- 2026年10月
  ('JIRAPRD', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'STRUANB', 'STRUANB', 'PTWANG', 'YCPENGM', 'not_started', 0),
  ('TOM', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'RXYEA', 'RXYEA', 'JMKO', 'XCPAN', 'not_started', 0),
  ('FAM21', 'FAC', 'ENT DBVM PROD', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'JRLULAI', 'JRLULAI', 'YSCHUNGD', 'CWWUZI', 'not_started', 0),
  ('SPC14G2', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  ('RDCIM', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'JRLULAI', 'CHWUAZZI', 'PYCHENZE', 'YBHUANGC', 'not_started', 0),
  ('RDMP', 'AAID', 'ENT DBVM PROD', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'JRLULAI', 'CHWUAZZI', 'PYCHENZE/CHENJCC', 'YBHUANGC', 'not_started', 0),
  ('ONEFAC_PIRUN', 'IMC', 'ENT DBVM PROD', 'PROD', '2026-10-15', '2026-07-15', '2026-08-15', '2026-09-15', 'JRLULAI', 'JRLULAI', 'CCYANGAF', 'JHCHENW', 'not_started', 0),
  -- 2026年11月
  ('MFA', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-11-15', '2026-08-15', '2026-09-15', '2026-10-15', 'STRUANB', 'HEHUANGB', 'TCWANGZL', 'CYWUAZX', 'not_started', 0),
  ('CSV_PROD', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-11-15', '2026-08-15', '2026-09-15', '2026-10-15', 'RXYEA', 'RXYEA', 'XXYANGA', 'CHLIUZP', 'not_started', 0),
  ('ISCPRN', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-11-15', '2026-08-15', '2026-09-15', '2026-10-15', 'STRUANB', 'STRUANB', 'LINYTK', 'HYCHEN', 'not_started', 0),
  ('NWM_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-11-15', '2026-08-15', '2026-09-15', '2026-10-15', 'RXYEA', 'HMHSIEHC', 'BTHUANG', 'CHLIUZP', 'not_started', 0),
  -- 2026年12月
  ('SEARCH', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'RXYEA', 'STRUANB', 'PTWANG', 'YCPENGM', 'not_started', 0),
  ('CIPROD_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'RXYEA', 'RXYEA', 'WANGCHC', 'BWTSENGA', 'not_started', 0),
  ('FAM', 'FAC', 'ENT DBVM PROD', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'JRLULAI', 'JRLULAI', 'YSCHUNGD', 'CWWUZI', 'not_started', 0),
  ('CIMGMPEB', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'HMHSIEHC', 'HMHSIEHC', '', '', 'not_started', 0),
  ('CIMEBO1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'HMHSIEHC', 'HMHSIEHC', '', '', 'not_started', 0),
  ('SPCEBOG1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  ('OPTPROD', 'BSID', 'ENT DBVM PROD', 'PROD', '2026-12-15', '2026-09-15', '2026-10-15', '2026-11-15', 'IHKAO -> HMHSIEHC', 'YXCHENZG', 'TYYUP -> CHWANGBK', 'YRLEE -> KHWONG', 'not_started', 0),
  -- 2027年1月
  ('CPIS_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2027-01-15', '2026-10-15', '2026-11-15', '2026-12-15', 'JRLULAI', 'JRLULAI', 'CHKUOZA', 'WCWUY', 'not_started', 0),
  ('LCCM', 'BSID', 'ENT DBVM PROD', 'PROD', '2027-01-15', '2026-10-15', '2026-11-15', '2026-12-15', 'YHLUZS', 'HEHUANGB', 'CYLOQ', 'CYWUAZX', 'not_started', 0),
  ('IDSBK', 'TSID', 'ENT DBVM PROD', 'PROD', '2027-01-15', '2026-10-15', '2026-11-15', '2026-12-15', 'YHLUZS', 'YHLUZS', 'MTLINB', 'HMCHANGM', 'not_started', 0),
  ('SPC12G1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2027-01-15', '2026-10-15', '2026-11-15', '2026-12-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0),
  -- 2027年3月
  ('BPOPTWP_PRD', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2027-03-15', '2026-12-15', '2027-01-15', '2027-02-15', 'WYCHIANG', 'WYCHIANG', 'UCCHENGD', 'CHANGMHC', 'not_started', 0),
  ('DLGPRD', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2027-03-15', '2026-12-15', '2027-01-15', '2027-02-15', 'IHKAO -> HMHSIEHC', 'YXCHENZG', 'CHTANGN', 'CJTUB', 'not_started', 0),
  ('PQOPROD', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2027-03-15', '2026-12-15', '2027-01-15', '2027-02-15', 'JRLULAI', 'CHWUAZZI', 'SYTSAI', 'HUANGSYE', 'not_started', 0),
  ('WBFPROD_PHY', 'BSID', 'ENT Physical PROD (BSID)', 'PROD', '2027-03-15', '2026-12-15', '2027-01-15', '2027-02-15', 'JRLULAI', 'JRLULAI', 'CHENYYO', 'YWCHENQ', 'not_started', 0),
  -- 2027年5月
  ('SPC14G1', '300mm', '300mm Physical PROD (含Provision)', 'PROD', '2027-05-15', '2027-02-15', '2027-03-15', '2027-04-15', 'YHLUZS', 'YHLUZS', '', '', 'not_started', 0);

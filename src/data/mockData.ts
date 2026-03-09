import { MigrationDB, MigrationTask, TaskTemplate, User } from "@/types/migration";

export const mockUsers: User[] = [
  { id: "u1", name: "STRUANB", role: "dba", email: "struanb@company.com" },
  { id: "u2", name: "WYCHIANG", role: "dba", email: "wychiang@company.com" },
  { id: "u3", name: "YHLUZS", role: "dba", email: "yhluzs@company.com" },
  { id: "u4", name: "JRLULAI", role: "dba", email: "jrlulai@company.com" },
  { id: "u5", name: "RXYEA", role: "dba", email: "rxyea@company.com" },
  { id: "u6", name: "CHWUAZZI", role: "dba", email: "chwuazzi@company.com" },
  { id: "u7", name: "HEHUANGB", role: "dba", email: "hehuangb@company.com" },
  { id: "u8", name: "HMHSIEHC", role: "dba", email: "hmhsiehc@company.com" },
  { id: "admin1", name: "Admin", role: "admin", email: "admin@company.com" },
];

export const mockMigrations: MigrationDB[] = [
  {
    id: "m1", dbid: "ESMK", phase: "BSID", dbType: "ENT Physical PROD (BSID)",
    prodOrTest: "PROD", migrationDate: "2026-01-15", dMinus3M: "2025-10-15", dMinus2M: "2025-11-15", dMinus1M: "2025-12-15",
    dba: "STRUANB", taskOwner: "STRUANB", apSponsor: "STKUO", apManager: "YLLINZY",
    overallStatus: "completed", completionPercent: 100, templateId: "tpl1",
  },
  {
    id: "m2", dbid: "RMANFOC", phase: "PLED", dbType: "ENT DBVM PROD",
    prodOrTest: "PROD", migrationDate: "2026-01-20", dMinus3M: "2025-10-20", dMinus2M: "2025-11-20", dMinus1M: "2025-12-20",
    dba: "DYWUL", taskOwner: "DYWUL", apSponsor: "DYWUL", apManager: "THLINQ",
    overallStatus: "completed", completionPercent: 100, templateId: "tpl2",
  },
  {
    id: "m3", dbid: "IPQRS_PROD", phase: "AAID", dbType: "ENT DBVM PROD",
    prodOrTest: "PROD", migrationDate: "2026-03-10", dMinus3M: "2025-12-10", dMinus2M: "2026-01-10", dMinus1M: "2026-02-10",
    dba: "YHLUZS", taskOwner: "YHLUZS", apSponsor: "YCYANGZU", apManager: "YJTANGA",
    overallStatus: "in_progress", completionPercent: 65, templateId: "tpl2",
  },
  {
    id: "m4", dbid: "EQP_PHY", phase: "BSID", dbType: "ENT Physical PROD (BSID)",
    prodOrTest: "PROD", migrationDate: "2026-04-05", dMinus3M: "2026-01-05", dMinus2M: "2026-02-05", dMinus1M: "2026-03-05",
    dba: "WYCHIANG", taskOwner: "CHWUAZZI", apSponsor: "HYFANGC", apManager: "HUANGSCM",
    overallStatus: "in_progress", completionPercent: 45, templateId: "tpl1",
  },
  {
    id: "m5", dbid: "OP3PRD", phase: "AUDIT", dbType: "ENT DBVM PROD",
    prodOrTest: "PROD", migrationDate: "2026-04-15", dMinus3M: "2026-01-15", dMinus2M: "2026-02-15", dMinus1M: "2026-03-15",
    dba: "RXYEA", taskOwner: "RXYEA", apSponsor: "KYYU -> GHQIU", apManager: "WDKUO",
    overallStatus: "delayed", completionPercent: 30, templateId: "tpl2",
  },
  {
    id: "m6", dbid: "RMPROD", phase: "BSID", dbType: "ENT Physical PROD (BSID)",
    prodOrTest: "PROD", migrationDate: "2026-05-10", dMinus3M: "2026-02-10", dMinus2M: "2026-03-10", dMinus1M: "2026-04-10",
    dba: "JRLULAI", taskOwner: "CHWUAZZI", apSponsor: "TYWANGW", apManager: "HUANGSCM",
    overallStatus: "in_progress", completionPercent: 55, templateId: "tpl1",
  },
  {
    id: "m7", dbid: "JCP_PHY", phase: "BSID", dbType: "ENT Physical PROD (BSID)",
    prodOrTest: "PROD", migrationDate: "2026-05-20", dMinus3M: "2026-02-20", dMinus2M: "2026-03-20", dMinus1M: "2026-04-20",
    dba: "WYCHIANG", taskOwner: "CHWUAZZI", apSponsor: "TYWANGW", apManager: "HUANGSCM",
    overallStatus: "not_started", completionPercent: 0, templateId: "tpl1",
  },
  {
    id: "m8", dbid: "EBOSTG", phase: "TSID", dbType: "ENT Physical PROD (TSID)",
    prodOrTest: "PROD", migrationDate: "2026-05-25", dMinus3M: "2026-02-25", dMinus2M: "2026-03-25", dMinus1M: "2026-04-25",
    dba: "JRLULAI", taskOwner: "HEHUANGB", apSponsor: "CYLAIZB -> LINCWD", apManager: "CHENJCC -> JYLEEN",
    overallStatus: "not_started", completionPercent: 0, templateId: "tpl3",
  },
  {
    id: "m9", dbid: "SCM", phase: "TSID", dbType: "ENT Physical PROD (TSID)",
    prodOrTest: "PROD", migrationDate: "2026-03-15", dMinus3M: "2025-12-15", dMinus2M: "2026-01-15", dMinus1M: "2026-02-15",
    dba: "WYCHIANG", taskOwner: "WYCHIANG", apSponsor: "MTLINB", apManager: "HMCHANGM",
    overallStatus: "in_progress", completionPercent: 80, templateId: "tpl1",
  },
  {
    id: "m10", dbid: "WAFERCAR", phase: "AAID", dbType: "ENT DBVM PROD",
    prodOrTest: "PROD", migrationDate: "2026-06-10", dMinus3M: "2026-03-10", dMinus2M: "2026-04-10", dMinus1M: "2026-05-10",
    dba: "WYCHIANG", taskOwner: "HMHSIEHC", apSponsor: "WTYANGH", apManager: "HUANGCYG",
    overallStatus: "not_started", completionPercent: 0, templateId: "tpl2",
  },
  {
    id: "m11", dbid: "DSAP", phase: "AAID", dbType: "ENT DBVM PROD",
    prodOrTest: "PROD", migrationDate: "2026-05-15", dMinus3M: "2026-02-15", dMinus2M: "2026-03-15", dMinus1M: "2026-04-15",
    dba: "YHLUZS", taskOwner: "YXCHENZG", apSponsor: "PCTU", apManager: "CCSHIHN",
    overallStatus: "delayed", completionPercent: 20, templateId: "tpl2",
  },
  {
    id: "m12", dbid: "EDB01", phase: "TSID", dbType: "ENT Physical PROD (TSID)",
    prodOrTest: "PROD", migrationDate: "2026-05-18", dMinus3M: "2026-02-18", dMinus2M: "2026-03-18", dMinus1M: "2026-04-18",
    dba: "JRLULAI", taskOwner: "JRLULAI", apSponsor: "KRCHEN", apManager: "KRCHEN",
    overallStatus: "in_progress", completionPercent: 40, templateId: "tpl3",
  },
];

export const mockTasks: MigrationTask[] = [
  // Tasks for m3 (IPQRS_PROD)
  { id: "t1", migrationId: "m3", title: "AP testing - confirm migration date", milestone: "D-3M", inputType: "manual", status: "completed", assignee: "YHLUZS", dueDate: "2025-12-10", completedAt: "2025-12-08", notes: [], order: 1 },
  { id: "t2", migrationId: "m3", title: "Release Pre-prod (user will provide on 3/9)", milestone: "D-3M", inputType: "manual", status: "completed", assignee: "YHLUZS", dueDate: "2025-12-20", completedAt: "2025-12-19", notes: [], order: 2 },
  { id: "t3", migrationId: "m3", title: "AP testing validation", milestone: "D-2M", inputType: "api", status: "completed", assignee: "YHLUZS", dueDate: "2026-01-10", completedAt: "2026-01-09", notes: [], order: 3 },
  { id: "t4", migrationId: "m3", title: "Rehearsal & Logship preparation", milestone: "D-1M", inputType: "manual", status: "in_progress", assignee: "YHLUZS", dueDate: "2026-02-10", notes: [{ id: "n1", author: "YHLUZS", content: "Waiting for AP team to confirm schedule", createdAt: "2026-02-05" }], order: 4 },
  { id: "t5", migrationId: "m3", title: "D-Day Migration execution", milestone: "D-Day", inputType: "manual", status: "not_started", assignee: "YHLUZS", dueDate: "2026-03-10", notes: [], order: 5 },
  // Tasks for m4 (EQP_PHY)
  { id: "t6", migrationId: "m4", title: "AP testing - confirm migration date", milestone: "D-3M", inputType: "manual", status: "completed", assignee: "CHWUAZZI", dueDate: "2026-01-05", completedAt: "2026-01-04", notes: [], order: 1 },
  { id: "t7", migrationId: "m4", title: "Release Pre-prod environment setup", milestone: "D-2M", inputType: "api", status: "in_progress", assignee: "WYCHIANG", dueDate: "2026-02-05", notes: [], order: 2 },
  { id: "t8", migrationId: "m4", title: "Data validation script execution", milestone: "D-2M", inputType: "api", status: "not_started", assignee: "WYCHIANG", dueDate: "2026-02-15", notes: [], order: 3 },
  { id: "t9", migrationId: "m4", title: "Rehearsal migration", milestone: "D-1M", inputType: "manual", status: "not_started", assignee: "WYCHIANG", dueDate: "2026-03-05", notes: [], order: 4 },
  { id: "t10", migrationId: "m4", title: "D-Day Migration execution", milestone: "D-Day", inputType: "manual", status: "not_started", assignee: "WYCHIANG", dueDate: "2026-04-05", notes: [], order: 5 },
  // Tasks for m5 (OP3PRD) - delayed
  { id: "t11", migrationId: "m5", title: "AP testing - confirm migration date", milestone: "D-3M", inputType: "manual", status: "completed", assignee: "RXYEA", dueDate: "2026-01-15", completedAt: "2026-01-20", notes: [{ id: "n2", author: "RXYEA", content: "Completed 5 days late", createdAt: "2026-01-20" }], order: 1 },
  { id: "t12", migrationId: "m5", title: "Release Pre-prod", milestone: "D-2M", inputType: "manual", status: "delayed", assignee: "RXYEA", dueDate: "2026-02-15", notes: [{ id: "n3", author: "RXYEA", content: "AP team has not confirmed yet, continuing to follow up", createdAt: "2026-03-01" }], order: 2 },
  { id: "t13", migrationId: "m5", title: "Rehearsal migration", milestone: "D-1M", inputType: "manual", status: "not_started", assignee: "RXYEA", dueDate: "2026-03-15", notes: [], order: 3 },
];

export const mockTemplates: TaskTemplate[] = [
  {
    id: "tpl1",
    name: "Standard PROD Migration",
    description: "Standard migration workflow for ENT Physical PROD",
    tasks: [
      { title: "AP testing - confirm migration date (user confirmation)", inputType: "manual", milestone: "D-3M", assignee: "", order: 1 },
      { title: "Release Pre-prod (environment setup)", inputType: "manual", milestone: "D-3M", assignee: "", order: 2 },
      { title: "AP testing validation (post-restore)", inputType: "api", milestone: "D-2M", assignee: "", order: 3 },
      { title: "Data validation script", inputType: "api", milestone: "D-2M", assignee: "", order: 4 },
      { title: "Rehearsal & Logship", inputType: "manual", milestone: "D-1M", assignee: "", order: 5 },
      { title: "Final backup", inputType: "api", milestone: "D-1M", assignee: "", order: 6 },
      { title: "D-Day Migration execution", inputType: "manual", milestone: "D-Day", assignee: "", order: 7 },
      { title: "Post-migration validation", inputType: "manual", milestone: "Post", assignee: "", order: 8 },
    ],
  },
  {
    id: "tpl2",
    name: "DBVM Migration",
    description: "Migration workflow for ENT DBVM PROD",
    tasks: [
      { title: "Confirm migration date", inputType: "manual", milestone: "D-3M", assignee: "", order: 1 },
      { title: "Pre-prod environment setup", inputType: "api", milestone: "D-3M", assignee: "", order: 2 },
      { title: "AP testing", inputType: "manual", milestone: "D-2M", assignee: "", order: 3 },
      { title: "Rehearsal migration", inputType: "manual", milestone: "D-1M", assignee: "", order: 4 },
      { title: "D-Day Migration", inputType: "manual", milestone: "D-Day", assignee: "", order: 5 },
      { title: "Post validation", inputType: "api", milestone: "Post", assignee: "", order: 6 },
    ],
  },
  {
    id: "tpl3",
    name: "Dev/CAT DB Migration",
    description: "Streamlined migration workflow for Dev/CAT test environments",
    tasks: [
      { title: "Confirm migration date", inputType: "manual", milestone: "D-3M", assignee: "", order: 1 },
      { title: "Dev/CAT environment setup", inputType: "api", milestone: "D-2M", assignee: "", order: 2 },
      { title: "Data copy & restore", inputType: "api", milestone: "D-1M", assignee: "", order: 3 },
      { title: "AP connectivity validation", inputType: "api", milestone: "D-1M", assignee: "", order: 4 },
      { title: "D-Day Migration execution", inputType: "manual", milestone: "D-Day", assignee: "", order: 5 },
      { title: "Post-migration validation", inputType: "api", milestone: "Post", assignee: "", order: 6 },
    ],
  },
];

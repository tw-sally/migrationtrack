export type Phase = "BSID" | "PLED" | "AAID" | "IMC" | "TSID" | "ICSD" | "AUDIT" | "FAC" | "300mm";
export type DBType = "ENT Physical PROD (BSID)" | "ENT DBVM PROD" | "ENT Physical PROD (TSID)" | "300mm Physical PROD (含Provision)";
export type MigrationStrategy = "Migration_After_Release" | "Scheduled_Downtime_Migration" | "TestDB_Full_Copy";
export type TaskStatus = "not_started" | "in_progress" | "completed" | "delayed" | "blocked";
export type TaskInputType = "manual" | "api";
export type MilestonePhase = "D-3M" | "D-2M" | "D-1M" | "D-Day" | "Post";

export interface MigrationDB {
  id: string;
  dbid: string;
  phase: Phase;
  dbType: string;
  prodOrTest: "PROD" | "TEST";
  migrationDate: string; // D-Day
  dMinus3M: string;
  dMinus2M: string;
  dMinus1M: string;
  dba: string;
  taskOwner: string;
  apSponsor: string;
  apManager: string;
  migrationStrategy?: MigrationStrategy;
  sourceDbType?: string;
  overallStatus: TaskStatus;
  completionPercent: number;
  templateId?: string;
}

export interface MigrationTask {
  id: string;
  migrationId: string;
  title: string;
  description?: string;
  milestone: MilestonePhase;
  inputType: TaskInputType;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  completedAt?: string;
  notes: TaskNote[];
  order: number;
}

export interface TaskNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<MigrationTask, "id" | "migrationId" | "status" | "completedAt" | "notes" | "dueDate">[];
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "dba";
  email: string;
}

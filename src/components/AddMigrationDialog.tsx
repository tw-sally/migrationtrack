import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subMonths, parse } from "date-fns";
import { useMigrationData } from "@/contexts/MigrationContext";
import { toast } from "sonner";

const PHASES = ["BSID", "PLED", "AAID", "IMC", "TSID", "ICSD", "AUDIT", "FAC", "300mm"];
const DB_TYPES = ["ENT Physical PROD (BSID)", "ENT DBVM PROD", "ENT DBVM TEST", "ENT Physical PROD (TSID)", "300mm Physical PROD (incl. Provision)"];
const DB_ROLES = ["PROD", "DEV/CAT"] as const;
const DBA_LIST = ["STRUANB", "WYCHIANG", "YHLUZS", "JRLULAI", "RXYEA", "CHWUAZZI", "HEHUANGB", "HMHSIEHC"];
const SOURCE_DB_TYPES = ["Prod schema only", "Test DB full copy", "Null"];
const MIGRATION_STRATEGIES = ["Migration After Release", "Scheduled downtime migration"];

function getDefaultMilestoneDates(dDay: Date, offsets: { milestone: string; offset_months: number }[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const o of offsets) {
    result[o.milestone] = format(subMonths(dDay, -o.offset_months), "yyyy-MM-dd");
  }
  return result;
}

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function AddMigrationDialog({ open, onOpenChange }: Props) {
  const { addMigration, templates } = useMigrationData();
  const [dbid, setDbid] = useState("");
  const [phase, setPhase] = useState("BSID");
  const [dbType, setDbType] = useState(DB_TYPES[0]);
  const [dbRole, setDbRole] = useState<"PROD" | "DEV/CAT">("PROD");
  const [dba, setDba] = useState("");
  const [taskOwner, setTaskOwner] = useState("");
  const [apSponsor, setApSponsor] = useState("");
  const [apManager, setApManager] = useState("");
  const [dDay, setDDay] = useState<Date>();
  const [targetDb, setTargetDb] = useState("");
  const [templateId, setTemplateId] = useState<string>("");
  const [sourceDbType, setSourceDbType] = useState<string>("");
  const [migrationStrategy, setMigrationStrategy] = useState<string>("");
  const [milestoneDates, setMilestoneDates] = useState<Record<string, string>>({});

  const selectedTemplate = templates.find(t => t.id === templateId);

  useEffect(() => {
    if (dDay) setMilestoneDates(getDefaultMilestoneDates(dDay));
  }, [dDay]);

  // Filter templates based on DB Role
  const filteredTemplates = templates.filter(t => {
    if (dbRole === "DEV/CAT") {
      return t.name.toLowerCase().includes("dev") || t.name.toLowerCase().includes("cat");
    }
    // PROD: show all except DEV/CAT specific ones
    return !(t.name.toLowerCase().includes("dev") || t.name.toLowerCase().includes("cat"));
  });

  // Reset template when DB Role changes
  useEffect(() => {
    setTemplateId("");
    setSourceDbType("");
    setMigrationStrategy("");
    setTargetDb("");
  }, [dbRole]);

  const templateMilestones = useMemo(() => {
    if (!selectedTemplate) return [];
    const seen = new Set<MilestonePhase>();
    return selectedTemplate.tasks
      .sort((a, b) => MILESTONE_PHASES.indexOf(a.milestone) - MILESTONE_PHASES.indexOf(b.milestone))
      .reduce<MilestonePhase[]>((acc, t) => {
        if (!seen.has(t.milestone)) { seen.add(t.milestone); acc.push(t.milestone); }
        return acc;
      }, []);
  }, [selectedTemplate]);

  const handleMilestoneDateChange = (milestone: MilestonePhase, date: Date | undefined) => {
    if (date) setMilestoneDates(prev => ({ ...prev, [milestone]: format(date, "yyyy-MM-dd") }));
  };

  const resetForm = () => {
    setDbid(""); setPhase("BSID"); setDbType(DB_TYPES[0]); setDbRole("PROD");
    setDba(""); setTaskOwner(""); setApSponsor(""); setApManager(""); setDDay(undefined); setTargetDb(""); setTemplateId("");
    setSourceDbType(""); setMigrationStrategy("");
    setMilestoneDates({ "D-3M": "", "D-2M": "", "D-1M": "", "D-Day": "", "Post": "" });
  };

  const handleSave = async () => {
    if (!dbid || !dba || !taskOwner || !dDay || !templateId) {
      toast.error("Please fill in required fields: DBID, DB Owner, Task Owner, D-Day, Task Template");
      return;
    }
    if (dbRole === "DEV/CAT" && !sourceDbType) {
      toast.error("Please select Source DB Type");
      return;
    }
    if (dbRole === "DEV/CAT" && !migrationStrategy) {
      toast.error("Please select Migration Strategy");
      return;
    }
    const dDayStr = milestoneDates["D-Day"] || format(dDay, "yyyy-MM-dd");

    const migration = {
      dbid,
      phase,
      db_type: dbType,
      prod_or_test: dbRole === "PROD" ? "PROD" as const : "TEST" as const,
      migration_date: dDayStr,
      d_minus_3m: milestoneDates["D-3M"],
      d_minus_2m: milestoneDates["D-2M"],
      d_minus_1m: milestoneDates["D-1M"],
      dba,
      task_owner: taskOwner,
      ap_sponsor: apSponsor,
      ap_manager: apManager,
      migration_strategy: migrationStrategy || null,
      source_db_type: sourceDbType === "Null" ? null : (sourceDbType || null),
      overall_status: "not_started",
      completion_percent: 0,
      template_id: templateId || null,
      remarks: "",
    };

    const tasks = selectedTemplate
      ? selectedTemplate.tasks.map(t => ({
          migration_id: "", // will be set by context
          title: t.title,
          description: null,
          milestone: t.milestone,
          input_type: t.input_type,
          status: "not_started",
          assignee: t.assignee || dba,
          due_date: milestoneDates[t.milestone] || dDayStr,
          completed_at: null,
          order: t.order,
          remarks: t.remarks || "",
        }))
      : [];

    await addMigration(migration, tasks);
    toast.success(`${dbid} has been added to the migration list`);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Migration DB</DialogTitle>
          <DialogDescription>Fill in DB details and select a task template</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">DBID *</Label>
            <Input className="col-span-3" value={dbid} onChange={e => setDbid(e.target.value.toUpperCase())} placeholder="e.g. ESMK_PROD" />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">Phase</Label>
            <Select value={phase} onValueChange={setPhase}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>{PHASES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">DB Type</Label>
            <Select value={dbType} onValueChange={setDbType}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>{DB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">DB Role</Label>
            <Select value={dbRole} onValueChange={v => setDbRole(v as "PROD" | "DEV/CAT")}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>{DB_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">DB Owner *</Label>
            <Select value={dba} onValueChange={setDba}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select DB Owner" /></SelectTrigger>
              <SelectContent>{DBA_LIST.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">Task Owner *</Label>
            <Select value={taskOwner} onValueChange={setTaskOwner}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Task Owner" /></SelectTrigger>
              <SelectContent>{DBA_LIST.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">AP Sponsor</Label>
            <Input className="col-span-3" value={apSponsor} onChange={e => setApSponsor(e.target.value.toUpperCase())} placeholder="e.g. STKUO" />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">AP Manager</Label>
            <Input className="col-span-3" value={apManager} onChange={e => setApManager(e.target.value.toUpperCase())} placeholder="e.g. YLLINZY" />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <Label className="text-right text-sm">D-Day *</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dDay && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dDay ? format(dDay, "yyyy-MM-dd") : "Select D-Day date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dDay} onSelect={setDDay} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {dbRole === "DEV/CAT" && (
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right text-sm">Target DB *</Label>
              <Select value={targetDb} onValueChange={setTargetDb}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select target DB" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="KVM">KVM</SelectItem>
                  <SelectItem value="Docker DB">Docker DB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-4 items-start gap-3">
            <Label className="text-right text-sm mt-2">Task Template *</Label>
            <div className="col-span-3 space-y-3">
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue placeholder="Select task template" /></SelectTrigger>
                <SelectContent>{filteredTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
              {selectedTemplate && dDay && templateMilestones.length > 0 && (
                <div className="border rounded-lg p-3 space-y-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                  <p className="text-xs font-medium text-foreground">Milestone Start Dates</p>
                  <div className="grid gap-2">
                    {templateMilestones.map(ms => (
                      <div key={ms} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] min-w-[44px] justify-center shrink-0">{ms}</Badge>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className={cn("h-7 text-xs flex-1 justify-start font-normal", !milestoneDates[ms] && "text-muted-foreground")}>
                              <CalendarIcon className="mr-1.5 h-3 w-3" />
                              {milestoneDates[ms] || "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={milestoneDates[ms] ? parse(milestoneDates[ms], "yyyy-MM-dd", new Date()) : undefined} onSelect={d => handleMilestoneDateChange(ms, d)} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {dbRole === "DEV/CAT" && templateId && (
            <>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-sm">Source DB Type *</Label>
                <Select value={sourceDbType} onValueChange={setSourceDbType}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select source DB type" /></SelectTrigger>
                  <SelectContent>{SOURCE_DB_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-sm">Migration Strategy *</Label>
                <Select value={migrationStrategy} onValueChange={setMigrationStrategy}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select migration strategy" /></SelectTrigger>
                  <SelectContent>{MIGRATION_STRATEGIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

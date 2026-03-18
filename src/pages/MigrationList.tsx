import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ArrowUp, ArrowDown, ArrowUpDown, Loader2, Pencil, ChevronsUpDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMigrationData, MigrationDB, MigrationTaskDB } from "@/contexts/MigrationContext";
import { supabase } from "@/integrations/supabase/client";
import { AddMigrationDialog } from "@/components/AddMigrationDialog";
import { EditMigrationDialog } from "@/components/EditMigrationDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type MilestonePhase = "D-3M" | "D-2M" | "D-1M" | "D-Day" | "Post";

function getMigrationStage(m: MigrationDB): MilestonePhase {
  const today = new Date().toISOString().split("T")[0];
  if (today >= m.migration_date) return "Post";
  if (today >= m.d_minus_1m) return "D-Day";
  if (today >= m.d_minus_2m) return "D-1M";
  if (today >= m.d_minus_3m) return "D-2M";
  return "D-3M";
}

type SortDir = "asc" | "desc" | null;
type SortKey = "dbid" | "role" | "phase" | "dbType" | "dDay" | "dba" | "apSponsor" | "stage" | "progress" | "status";

export default function MigrationList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dbaFilter, setDbaFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [dbTypeFilter, setDbTypeFilter] = useState<string>("all");
  const [dbidFilter, setDbidFilter] = useState<string[]>([]);
  const [dbidPopoverOpen, setDbidPopoverOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMigration, setEditMigration] = useState<MigrationDB | null>(null);
  const [prodTestFilter, setProdTestFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { migrations, migrationsLoading, templates, deleteMigration } = useMigrationData();
  const templateMap = useMemo(() => Object.fromEntries(templates.map(t => [t.id, t.name])), [templates]);

  // Fetch all tasks to compute delay status
  const [allTasks, setAllTasks] = useState<MigrationTaskDB[]>([]);
  useEffect(() => {
    if (migrations.length === 0) return;
    supabase.from("migration_tasks").select("*").order("order")
      .then(({ data }) => setAllTasks((data || []) as MigrationTaskDB[]));
  }, [migrations]);

  // Compute which migrations have delayed tasks
  const delayedMigrationIds = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const ids = new Set<string>();
    migrations.forEach(m => {
      if (m.overall_status === "completed") return;
      const phasesDates = [
        { key: "D-3M", date: m.d_minus_3m },
        { key: "D-2M", date: m.d_minus_2m },
        { key: "D-1M", date: m.d_minus_1m },
        { key: "D-Day", date: m.migration_date },
        { key: "Post", date: m.migration_date },
      ];
      phasesDates.forEach(phase => {
        if (!phase.date || today < phase.date) return;
        const tasksInPhase = allTasks.filter(t => t.migration_id === m.id && t.milestone === phase.key && t.status !== "completed");
        if (tasksInPhase.length > 0) ids.add(m.id);
      });
    });
    return ids;
  }, [migrations, allTasks]);

  const taskOwners = [...new Set(migrations.map(m => m.task_owner).filter(Boolean))].sort();
  const phases = [...new Set(migrations.map(m => m.phase).filter(Boolean))].sort();
  const dbids = [...new Set(migrations.map(m => m.dbid).filter(Boolean))].sort();
  const dbTypes = [...new Set(migrations.map(m => m.db_type).filter(Boolean))].sort();
  
  const stages: MilestonePhase[] = ["D-3M", "D-2M", "D-1M", "D-Day", "Post"];

  const migrationsWithStage = useMemo(() =>
    migrations.map(m => ({ ...m, stage: getMigrationStage(m) })),
    [migrations]
  );

  const months = useMemo(() => {
    const set = new Set(migrationsWithStage.map(m => m.migration_date.substring(0, 7)));
    return [...set].sort();
  }, [migrationsWithStage]);

  const filtered = useMemo(() => {
    return migrationsWithStage.filter(m => {
      if (statusFilter !== "all") {
        if (statusFilter === "delayed") {
          if (!delayedMigrationIds.has(m.id)) return false;
        } else {
          if (m.overall_status !== statusFilter) return false;
        }
      }
      if (dbaFilter !== "all" && m.task_owner !== dbaFilter) return false;
      if (phaseFilter !== "all" && m.phase !== phaseFilter) return false;
      if (stageFilter !== "all" && m.stage !== stageFilter) return false;
      if (dbTypeFilter !== "all" && m.db_type !== dbTypeFilter) return false;
      if (dbidFilter.length > 0 && !dbidFilter.includes(m.dbid)) return false;
      if (monthFilter !== "all" && !m.migration_date.startsWith(monthFilter)) return false;
      if (prodTestFilter !== "all" && m.prod_or_test !== prodTestFilter) return false;
      return true;
    });
  }, [migrationsWithStage, statusFilter, dbaFilter, phaseFilter, stageFilter, dbTypeFilter, dbidFilter, monthFilter, prodTestFilter, delayedMigrationIds]);

  const stageOrder: Record<string, number> = { "D-3M": 0, "D-2M": 1, "D-1M": 2, "D-Day": 3, "Post": 4 };

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (!sortKey || !sortDir) {
      // Default sort: PROD first, then DBID alphabetically
      return list.sort((a, b) => {
        const roleOrder = (r: string) => r === "PROD" ? 0 : 1;
        const roleCmp = roleOrder(a.prod_or_test) - roleOrder(b.prod_or_test);
        if (roleCmp !== 0) return roleCmp;
        return a.dbid.localeCompare(b.dbid);
      });
    }
    return list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "dbid": cmp = a.dbid.localeCompare(b.dbid); break;
        case "role": { const ro = (r: string) => r === "PROD" ? 0 : 1; cmp = ro(a.prod_or_test) - ro(b.prod_or_test); break; }
        case "phase": cmp = a.phase.localeCompare(b.phase); break;
        case "dbType": cmp = a.db_type.localeCompare(b.db_type); break;
        case "dDay": cmp = a.migration_date.localeCompare(b.migration_date); break;
        case "dba": cmp = a.task_owner.localeCompare(b.task_owner); break;
        case "apSponsor": cmp = a.ap_sponsor.localeCompare(b.ap_sponsor); break;
        case "stage": cmp = (stageOrder[a.stage] ?? 99) - (stageOrder[b.stage] ?? 99); break;
        case "progress": cmp = a.completion_percent - b.completion_percent; break;
        case "status": cmp = a.overall_status.localeCompare(b.overall_status); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
    } else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const stageColor: Record<string, string> = {
    "D-3M": "bg-muted text-muted-foreground",
    "D-2M": "bg-warning/15 text-warning border-warning/30",
    "D-1M": "bg-in-progress/15 text-in-progress border-in-progress/30",
    "D-Day": "bg-delay/15 text-delay border-delay/30",
    "Post": "bg-success/15 text-success border-success/30",
  };

  if (migrationsLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Migration List</h1>
          <p className="text-muted-foreground">Detailed list of all database migrations</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add DB
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Popover open={dbidPopoverOpen} onOpenChange={setDbidPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-[200px] justify-between font-normal">
                  {dbidFilter.length === 0 ? "All DBID" : `${dbidFilter.length} DBID selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search DBID..." />
                  <CommandList>
                    <CommandEmpty>No DBID found.</CommandEmpty>
                    <CommandGroup>
                      {dbids.map(d => (
                        <CommandItem key={d} onSelect={() => {
                          setDbidFilter(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
                        }}>
                          <Checkbox checked={dbidFilter.includes(d)} className="mr-2" />
                          {d}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {dbidFilter.length > 0 && (
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setDbidFilter([])}>Clear all</Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Select value={prodTestFilter} onValueChange={setProdTestFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="DB Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All DB Role</SelectItem>
                <SelectItem value="PROD">PROD</SelectItem>
                <SelectItem value="TEST">TEST</SelectItem>
              </SelectContent>
            </Select>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Phase" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phase</SelectItem>
                {phases.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dbTypeFilter} onValueChange={setDbTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="DB Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All DB Type</SelectItem>
                {dbTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Migration Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Migration Month</SelectItem>
                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[190px]"><SelectValue placeholder="Migration Phase" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Migration Phase</SelectItem>
                {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dbaFilter} onValueChange={setDbaFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Task Owner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Task Owner</SelectItem>
                {taskOwners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">#</TableHead>
                {([
                  ["DBID", "dbid"], ["Role", "role"], ["Phase", "phase"], ["DB Type", "dbType"], ["D-Day", "dDay"],
                  ["Task Owner", "dba"], ["AP Sponsor", "apSponsor"], ["Migration Phase", "stage"], ["Progress", "progress"], ["Status", "status"],
                ] as [string, SortKey][]).map(([label, key]) => (
                  <TableHead key={key} className="cursor-pointer select-none hover:bg-muted/50" onClick={() => toggleSort(key)}>
                    <span className="flex items-center">{label}<SortIcon col={key} /></span>
                  </TableHead>
                ))}
                <TableHead>Template</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((m, index) => (
                <TableRow key={m.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(`/migrations/${m.id}`)}>
                  <TableCell className="text-center text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell className="font-mono font-medium">{m.dbid}</TableCell>
                  <TableCell><Badge variant={m.prod_or_test === "PROD" ? "default" : "secondary"} className="text-xs">{m.prod_or_test}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{m.phase}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.db_type}</TableCell>
                  <TableCell className="font-mono text-sm">{m.migration_date}</TableCell>
                  <TableCell className="font-medium text-sm">{m.task_owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.ap_sponsor}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${stageColor[m.stage] || ""}`}>{m.stage}</Badge></TableCell>
                  <TableCell className="min-w-[150px]"><ProgressBar value={m.completion_percent} /></TableCell>
                  <TableCell><StatusBadge status={m.overall_status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{templateMap[m.template_id || ""] || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditMigration(m); setEditOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除</AlertDialogTitle>
                            <AlertDialogDescription>
                              確定要刪除 {m.dbid} 嗎？此操作會同時刪除所有相關的任務與備註，且無法復原。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteMigration(m.id)}>刪除</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sorted.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No migrations match the criteria</div>
          )}
        </CardContent>
      </Card>

      <AddMigrationDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditMigrationDialog open={editOpen} onOpenChange={setEditOpen} migration={editMigration} />
    </div>
  );
}

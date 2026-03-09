import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMigrationData, MigrationDB } from "@/contexts/MigrationContext";
import { toast } from "sonner";

interface EditMigrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  migration: MigrationDB | null;
}

const fmtDate = (d: Date) => d.toISOString().split("T")[0];

function calcMilestoneDates(migrationDate: string) {
  const mDate = new Date(migrationDate + "T00:00:00");
  const d3m = new Date(mDate); d3m.setMonth(d3m.getMonth() - 3);
  const d2m = new Date(mDate); d2m.setMonth(d2m.getMonth() - 2);
  const d1m = new Date(mDate); d1m.setMonth(d1m.getMonth() - 1);
  return { d_minus_3m: fmtDate(d3m), d_minus_2m: fmtDate(d2m), d_minus_1m: fmtDate(d1m) };
}

export function EditMigrationDialog({ open, onOpenChange, migration }: EditMigrationDialogProps) {
  const { updateMigration, templates } = useMigrationData();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    dbid: "",
    phase: "",
    db_type: "",
    prod_or_test: "PROD" as "PROD" | "TEST",
    migration_date: "",
    d_minus_3m: "",
    d_minus_2m: "",
    d_minus_1m: "",
    dba: "",
    task_owner: "",
    ap_sponsor: "",
    ap_manager: "",
    migration_strategy: "",
    source_db_type: "",
    overall_status: "not_started",
    remarks: "",
    template_id: "" as string | null,
  });

  useEffect(() => {
    if (migration) {
      setForm({
        dbid: migration.dbid,
        phase: migration.phase,
        db_type: migration.db_type,
        prod_or_test: migration.prod_or_test,
        migration_date: migration.migration_date,
        d_minus_3m: migration.d_minus_3m,
        d_minus_2m: migration.d_minus_2m,
        d_minus_1m: migration.d_minus_1m,
        dba: migration.dba,
        task_owner: migration.task_owner,
        ap_sponsor: migration.ap_sponsor,
        ap_manager: migration.ap_manager,
        migration_strategy: migration.migration_strategy || "",
        source_db_type: migration.source_db_type || "",
        overall_status: migration.overall_status,
        remarks: migration.remarks || "",
        template_id: migration.template_id || "",
      });
    }
  }, [migration]);

  // When D-Day changes, auto-recalculate milestone defaults
  const handleDDayChange = (newDate: string) => {
    const defaults = calcMilestoneDates(newDate);
    setForm(prev => ({
      ...prev,
      migration_date: newDate,
      d_minus_3m: defaults.d_minus_3m,
      d_minus_2m: defaults.d_minus_2m,
      d_minus_1m: defaults.d_minus_1m,
    }));
  };

  const handleSave = async () => {
    if (!migration) return;
    setSaving(true);
    await updateMigration(migration.id, {
      ...form,
      migration_strategy: form.migration_strategy || null,
      source_db_type: form.source_db_type || null,
      template_id: form.template_id || null,
    });
    toast.success("Migration updated");
    setSaving(false);
    onOpenChange(false);
  };

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Migration - {form.dbid}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>DBID</Label>
              <Input value={form.dbid} onChange={e => update("dbid", e.target.value)} />
            </div>
            <div>
              <Label>PROD/TEST</Label>
              <Select value={form.prod_or_test} onValueChange={v => update("prod_or_test", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROD">PROD</SelectItem>
                  <SelectItem value="TEST">TEST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>D-Day (Migration Date)</Label>
              <Input type="date" value={form.migration_date} onChange={e => handleDDayChange(e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.overall_status} onValueChange={v => update("overall_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Milestone dates - editable, auto-filled from D-Day */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>D-3M</Label>
              <Input type="date" value={form.d_minus_3m} onChange={e => update("d_minus_3m", e.target.value)} />
            </div>
            <div>
              <Label>D-2M</Label>
              <Input type="date" value={form.d_minus_2m} onChange={e => update("d_minus_2m", e.target.value)} />
            </div>
            <div>
              <Label>D-1M</Label>
              <Input type="date" value={form.d_minus_1m} onChange={e => update("d_minus_1m", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phase</Label>
              <Input value={form.phase} onChange={e => update("phase", e.target.value)} />
            </div>
            <div>
              <Label>DB Type</Label>
              <Input value={form.db_type} onChange={e => update("db_type", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>DBA</Label>
              <Input value={form.dba} onChange={e => update("dba", e.target.value)} />
            </div>
            <div>
              <Label>Task Owner</Label>
              <Input value={form.task_owner} onChange={e => update("task_owner", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>AP Sponsor</Label>
              <Input value={form.ap_sponsor} onChange={e => update("ap_sponsor", e.target.value)} />
            </div>
            <div>
              <Label>AP Manager</Label>
              <Input value={form.ap_manager} onChange={e => update("ap_manager", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Migration Strategy</Label>
              <Input value={form.migration_strategy} onChange={e => update("migration_strategy", e.target.value)} />
            </div>
            <div>
              <Label>Source DB Type</Label>
              <Input value={form.source_db_type} onChange={e => update("source_db_type", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Template</Label>
              <Select value={form.template_id || ""} onValueChange={v => setForm(prev => ({ ...prev, template_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Remarks</Label>
              <Input value={form.remarks} onChange={e => update("remarks", e.target.value)} placeholder="備註..." />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

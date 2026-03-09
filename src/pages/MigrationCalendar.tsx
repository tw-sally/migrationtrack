import { useState, useMemo } from "react";
import { useMigrationData } from "@/contexts/MigrationContext";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type TaskStatus = "completed" | "in_progress" | "not_started" | "delayed" | "blocked";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const statusOrder: TaskStatus[] = ["completed", "in_progress", "not_started", "delayed", "blocked"];

const statusColors: Record<TaskStatus, string> = {
  completed: "bg-success/15 text-success hover:bg-success/25",
  in_progress: "bg-in-progress/15 text-in-progress hover:bg-in-progress/25",
  not_started: "bg-muted text-muted-foreground hover:bg-muted/80",
  delayed: "bg-delay/15 text-delay hover:bg-delay/25",
  blocked: "bg-warning/15 text-warning hover:bg-warning/25",
};

const statusLabels: Record<TaskStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  not_started: "Not Started",
  delayed: "Delayed",
  blocked: "Blocked",
};

export default function MigrationCalendar() {
  const { migrations } = useMigrationData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const isQ4_2026 = new Date() >= new Date("2026-10-01");
  const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    initial["2027"] = isQ4_2026;
    return initial;
  });

  const toggle = (key: string) => setExpanded(prev => prev === key ? null : key);

  const years = useMemo(() => {
    const yearSet = new Set(migrations.map(m => m.migration_date.substring(0, 4)));
    yearSet.add("2026");
    yearSet.add("2027");
    return [...yearSet].sort();
  }, [migrations]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Migration Calendar</h1>
        <p className="text-muted-foreground">Click a status to see details</p>
      </div>
      {years.map(year => {
        const yearMonths = Array.from({ length: 12 }, (_, i) => {
          const mm = String(i + 1).padStart(2, "0");
          return `${year}-${mm}`;
        });
        const isCurrentYear = year === "2026";
        const defaultOpen = isCurrentYear || (year === "2027" && isQ4_2026);

        const gridContent = (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {yearMonths.map((month, idx) => {
              const monthMigrations = migrations.filter(m => m.migration_date.startsWith(month));
              const total = monthMigrations.length;
              const statusCounts = statusOrder
                .map(s => ({ status: s, count: monthMigrations.filter(m => m.overall_status === s).length }))
                .filter(s => s.count > 0);

              return (
                <div key={month} className={cn("rounded-xl border bg-card p-4 space-y-3 transition-shadow", total > 0 && "shadow-sm")}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-bold bg-primary/10 px-2 py-0.5 rounded">{monthNames[idx]}</h3>
                    <span className={cn("text-2xl font-bold tabular-nums", total === 0 ? "text-muted-foreground/40" : "text-foreground")}>
                      <span className="text-sm font-normal text-muted-foreground mr-1">Migration DB:</span>{total}
                    </span>
                  </div>
                  <div className="border-b border-border" />
                  {total === 0 ? (
                    <p className="text-xs text-muted-foreground">No migrations</p>
                  ) : (
                    <div className="space-y-1.5">
                      {statusCounts.map(({ status, count }) => {
                        const key = `${month}-${status}`;
                        const isOpen = expanded === key;
                        const items = monthMigrations.filter(m => m.overall_status === status);
                        return (
                          <div key={status}>
                            <button onClick={() => toggle(key)} className={cn("w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer", statusColors[status], isOpen && "ring-1 ring-current/20")}>
                              <span>{statusLabels[status]}</span>
                              <span className="font-bold tabular-nums">{count}</span>
                            </button>
                            {isOpen && (
                              <div className="mt-1 ml-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                {items.map(m => (
                                  <div key={m.id} className="flex items-center justify-between rounded border bg-background px-2.5 py-1.5">
                                    <div>
                                      <p className="text-xs font-mono font-semibold">{m.dbid}</p>
                                      <p className="text-[10px] text-muted-foreground">{m.dba} · {m.migration_date}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

        if (isCurrentYear) {
          return (
            <div key={year} className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">{year}</h2>
              {gridContent}
            </div>
          );
        }

        return (
          <Collapsible key={year} defaultOpen={defaultOpen}>
            <div className="space-y-4">
              <CollapsibleTrigger className="flex items-center gap-2 group cursor-pointer">
                <h2 className="text-xl font-bold text-foreground">{year}</h2>
                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {gridContent}
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}

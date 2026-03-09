import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TaskStatus = "completed" | "in_progress" | "not_started" | "delayed" | "blocked";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-success/15 text-success border-success/30" },
  in_progress: { label: "In Progress", className: "bg-in-progress/15 text-in-progress border-in-progress/30" },
  not_started: { label: "Not Started", className: "bg-muted text-muted-foreground border-border" },
  delayed: { label: "Delayed", className: "bg-delay/15 text-delay border-delay/30" },
  blocked: { label: "Blocked", className: "bg-warning/15 text-warning border-warning/30" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as TaskStatus] || statusConfig.not_started;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

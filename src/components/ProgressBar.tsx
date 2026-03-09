import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const getColor = () => {
    if (value >= 80) return "bg-success";
    if (value >= 40) return "bg-in-progress";
    if (value > 0) return "bg-warning";
    return "bg-muted-foreground/30";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-10 text-right">{value}%</span>
    </div>
  );
}

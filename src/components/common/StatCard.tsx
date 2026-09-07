import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
  };

  return (
    <Card className="gap-0 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-lg font-bold text-foreground sm:text-xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
            <Icon className="size-5" />
          </span>
        )}
      </div>
    </Card>
  );
}

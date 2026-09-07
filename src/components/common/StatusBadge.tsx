import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  // positive
  "پرداخت شده": "bg-success/15 text-success border-success/30",
  موفق: "bg-success/15 text-success border-success/30",
  فعال: "bg-success/15 text-success border-success/30",
  "تکمیل شده": "bg-success/15 text-success border-success/30",
  تسویه: "bg-success/15 text-success border-success/30",
  "تسویه شده": "bg-success/15 text-success border-success/30",
  "پذیرفته شده": "bg-success/15 text-success border-success/30",
  سکونت: "bg-success/15 text-success border-success/30",
  // warning
  "پرداخت نشده": "bg-warning/20 text-warning-foreground border-warning/40",
  "در انتظار": "bg-warning/20 text-warning-foreground border-warning/40",
  "در انتظار پرداخت": "bg-warning/20 text-warning-foreground border-warning/40",
  "در انتظار تمدید": "bg-warning/20 text-warning-foreground border-warning/40",
  "در حال بررسی": "bg-warning/20 text-warning-foreground border-warning/40",
  "در حال بازسازی": "bg-warning/20 text-warning-foreground border-warning/40",
  "در حال انجام": "bg-info/15 text-info border-info/30",
  جدید: "bg-info/15 text-info border-info/30",
  // danger
  "سررسید گذشته": "bg-destructive/10 text-destructive border-destructive/30",
  بدهکار: "bg-destructive/10 text-destructive border-destructive/30",
  ناموفق: "bg-destructive/10 text-destructive border-destructive/30",
  منقضی: "bg-destructive/10 text-destructive border-destructive/30",
  "رد شده": "bg-destructive/10 text-destructive border-destructive/30",
  "لغو شده": "bg-destructive/10 text-destructive border-destructive/30",
  غیرفعال: "bg-muted text-muted-foreground border-border",
  خالی: "bg-muted text-muted-foreground border-border",
  زیاد: "bg-destructive/10 text-destructive border-destructive/30",
  متوسط: "bg-warning/20 text-warning-foreground border-warning/40",
  کم: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        MAP[status] ?? "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      {status}
    </span>
  );
}

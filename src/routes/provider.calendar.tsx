import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { CURRENT_PROVIDER_ID, useApp } from "@/store/app-store";

export const Route = createFileRoute("/provider/calendar")({
  head: () => ({
    meta: [
      { title: "تقویم کاری | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "نمایش نوبت‌ها و درخواست‌های برنامه‌ریزی‌شده." },
    ],
  }),
  component: ProviderCalendar,
});

const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

function ProviderCalendar() {
  const { state } = useApp();
  const bookings = state.requests.filter(
    (r) =>
      r.providerId === CURRENT_PROVIDER_ID &&
      (r.status === "پذیرفته شده" || r.status === "در حال انجام" || r.status === "جدید"),
  );

  return (
    <>
      <PageHeader
        title="تقویم کاری"
        description="نمای هفتگی نوبت‌ها و زمان‌های رزروشده"
        breadcrumb={["پنل ارائه‌دهنده", "تقویم کاری"]}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {DAYS.map((day) => {
          const slot = state.workSlots.find((w) => w.day === day);
          const dayBookings = bookings.filter((b) => b.preferredTime.includes(day) || day === "شنبه");
          return (
            <Card key={day} className="gap-2 p-3">
              <p className="text-center text-sm font-semibold">{day}</p>
              <p className="text-center text-xs text-muted-foreground">
                {slot?.available ? `${slot.from} تا ${slot.to}` : "غیرفعال"}
              </p>
              <div className="mt-2 space-y-2">
                {slot?.available &&
                  dayBookings.slice(0, day === "شنبه" ? 2 : 1).map((b) => (
                    <div key={b.id} className="rounded-lg bg-primary/10 p-2 text-xs">
                      <p className="font-medium line-clamp-2">{b.title}</p>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                {(!slot?.available || (day !== "شنبه" && dayBookings.length === 0)) && (
                  <p className="py-4 text-center text-xs text-muted-foreground">خالی</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 gap-3 p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <p className="font-semibold">نوبت‌های نزدیک</p>
        </div>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">نوبت فعالی ثبت نشده است.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.preferredTime}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}

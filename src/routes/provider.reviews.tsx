import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { CURRENT_PROVIDER_ID, useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/provider/reviews")({
  head: () => ({
    meta: [
      { title: "نظرات | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "نظرات و امتیازهای ثبت‌شده توسط ساکنان و مدیران." },
    ],
  }),
  component: ProviderReviews,
});

function ProviderReviews() {
  const { state } = useApp();
  const provider = state.providers.find((p) => p.id === CURRENT_PROVIDER_ID);
  const avg =
    state.reviews.length === 0
      ? 0
      : state.reviews.reduce((a, r) => a + r.rating, 0) / state.reviews.length;

  return (
    <>
      <PageHeader
        title="نظرات کاربران"
        description="بازخورد ساکنان و مدیران ساختمان"
        breadcrumb={["پنل ارائه‌دهنده", "نظرات"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="امتیاز میانگین" value={faDigits(Number(avg.toFixed(1)))} icon={Star} tone="info" />
        <StatCard title="امتیاز پروفایل" value={faDigits(provider?.rating ?? 0)} />
        <StatCard title="تعداد نظرات" value={`${state.reviews.length} مورد`} />
      </div>

      <div className="mt-6">
        {state.reviews.length === 0 ? (
          <EmptyState icon={Star} title="نظری ثبت نشده است" />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {state.reviews.map((r) => (
              <Card key={r.id} className="gap-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{r.author}</p>
                  <span className="text-sm text-warning-foreground">
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground">{"☆".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{r.comment}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

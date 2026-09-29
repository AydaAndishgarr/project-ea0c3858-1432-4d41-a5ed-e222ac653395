import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Star, Wallet, Wrench } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CURRENT_PROVIDER_ID, useApp } from "@/store/app-store";
import { formatCompactToman, formatToman, faDigits } from "@/lib/format";

export const Route = createFileRoute("/provider/")({
  head: () => ({
    meta: [
      { title: "داشبورد ارائه‌دهنده | خانه یار" },
      { name: "description", content: "نمای کلی درخواست‌ها، درآمد و امتیاز ارائه‌دهنده خدمات." },
    ],
  }),
  component: ProviderHome,
});

function ProviderHome() {
  const { state } = useApp();
  const provider = state.providers.find((p) => p.id === CURRENT_PROVIDER_ID);
  const mine = state.requests.filter(
    (r) => r.providerId === CURRENT_PROVIDER_ID || (r.category === provider?.specialty && r.status === "جدید"),
  );
  const fresh = mine.filter((r) => r.status === "جدید");
  const active = mine.filter((r) => r.status === "پذیرفته شده" || r.status === "در حال انجام");
  const done = mine.filter((r) => r.status === "تکمیل شده");
  const monthIncome = done.reduce((a, r) => a + r.amount, 0) + 8600000;
  const todayIncome = fresh.length ? 850000 : 0;

  return (
    <>
      <PageHeader
        title={`سلام، ${provider?.name ?? "ارائه‌دهنده"}`}
        description={`${provider?.specialty ?? "خدمات"} — امتیاز ${faDigits(provider?.rating ?? 0)} از ۵`}
        breadcrumb={["پنل ارائه‌دهنده", "داشبورد"]}
        action={
          <Button asChild>
            <Link to="/provider/requests">
              <Wrench className="size-4" />
              مدیریت درخواست‌ها
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="درخواست‌های جدید" value={`${fresh.length} مورد`} icon={Wrench} tone="warning" />
        <StatCard title="درخواست‌های فعال" value={`${active.length} مورد`} icon={Clock} tone="info" />
        <StatCard title="تکمیل‌شده" value={`${done.length} مورد`} icon={CheckCircle2} tone="success" />
        <StatCard title="درآمد امروز" value={formatCompactToman(todayIncome)} icon={Wallet} />
        <StatCard title="درآمد ماه جاری" value={formatCompactToman(monthIncome)} icon={Wallet} tone="success" />
        <StatCard title="امتیاز کاربران" value={faDigits(provider?.rating ?? 0)} icon={Star} tone="info" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">درخواست‌های نیازمند اقدام</p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/provider/requests">همه</Link>
            </Button>
          </div>
          {fresh.length === 0 && active.length === 0 ? (
            <EmptyState icon={Wrench} title="درخواست فعالی نیست" />
          ) : (
            <div className="space-y-3">
              {[...fresh, ...active].slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.buildingName} — واحد {r.unitNumber}
                    </p>
                  </div>
                  <div className="shrink-0 text-left">
                    <StatusBadge status={r.status} />
                    <p className="mt-1 text-xs text-muted-foreground">{formatToman(r.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">آخرین نظرات</p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/provider/reviews">همه</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {state.reviews.slice(0, 3).map((rv) => (
              <div key={rv.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{rv.author}</p>
                  <span className="text-xs text-warning-foreground">★ {faDigits(rv.rating)}</span>
                </div>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{rv.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

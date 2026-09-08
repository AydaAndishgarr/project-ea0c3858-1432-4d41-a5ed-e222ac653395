import { createFileRoute } from "@tanstack/react-router";
import { Building2, CreditCard, TrendingUp, UserCog, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AreaTrend, DonutChart, LineTrend } from "@/components/common/Charts";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/store/app-store";
import { buildingGrowth, platformRevenue, recentActivity } from "@/data/mock";
import { formatCompactToman, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "داشبورد مدیر کل | سامانه مدیریت ساختمان" },
      { name: "description", content: "نمای کلی ساختمان‌ها، کاربران، درآمد و وضعیت اشتراک‌های سامانه." },
      { property: "og:title", content: "داشبورد مدیر کل" },
      { property: "og:description", content: "آمار کلی سامانه مدیریت ساختمان." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { state } = useApp();
  const active = state.buildings.filter((b) => b.status === "فعال").length;
  const inactive = state.buildings.length - active;
  const revenue = state.subscriptions.reduce((s, x) => s + x.price, 0);

  const subsStatus = [
    { name: "فعال", value: state.subscriptions.filter((s) => s.status === "فعال").length, color: "var(--color-success)" },
    { name: "در انتظار تمدید", value: state.subscriptions.filter((s) => s.status === "در انتظار تمدید").length, color: "var(--color-warning)" },
    { name: "منقضی", value: state.subscriptions.filter((s) => s.status === "منقضی").length, color: "var(--color-destructive)" },
  ];

  return (
    <>
      <PageHeader
        title="داشبورد مدیر کل"
        description="نمای کلی وضعیت سامانه در شهریور ۱۴۰۴"
        breadcrumb={["پنل مدیر کل", "داشبورد"]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="تعداد ساختمان‌ها" value={formatNumber(state.buildings.length)} icon={Building2} hint={`${formatNumber(active)} فعال / ${formatNumber(inactive)} غیرفعال`} />
        <StatCard title="تعداد مدیران" value={formatNumber(state.managers.length)} icon={UserCog} tone="info" />
        <StatCard title="تعداد کاربران" value={formatNumber(state.users.length * 1150)} icon={Users} tone="success" hint="کاربران فعال سامانه" />
        <StatCard title="درآمد سامانه" value={formatCompactToman(revenue)} icon={CreditCard} tone="warning" hint="مجموع اشتراک‌های جاری" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="ساختمان‌های فعال" value={formatNumber(active)} tone="success" icon={TrendingUp} />
        <StatCard title="ساختمان‌های غیرفعال" value={formatNumber(inactive)} tone="danger" icon={Building2} />
        <StatCard title="اشتراک‌های فعال" value={formatNumber(subsStatus[0].value)} tone="success" icon={CreditCard} />
        <StatCard title="اشتراک‌های منقضی" value={formatNumber(subsStatus[2].value)} tone="danger" icon={CreditCard} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 font-semibold">رشد تعداد ساختمان‌ها</p>
          <AreaTrend data={buildingGrowth} keys={[{ key: "ساختمان", color: "var(--color-primary)" }]} />
        </Card>
        <Card className="p-5">
          <p className="mb-4 font-semibold">درآمد سامانه (میلیون تومان)</p>
          <LineTrend data={platformRevenue} dataKey="درآمد" color="var(--color-chart-2)" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="mb-4 font-semibold">وضعیت اشتراک‌ها</p>
          <DonutChart data={subsStatus} />
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="mb-4 font-semibold">فعالیت‌های اخیر</p>
          <ul className="space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <p className="mb-4 font-semibold">آخرین ساختمان‌های ثبت‌شده</p>
        <div className="space-y-2">
          {state.buildings.slice(-4).reverse().map((b) => (
            <div key={b.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{b.name}</p>
                <p className="truncate text-xs text-muted-foreground">{b.address}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

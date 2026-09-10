import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Home, Receipt, Users, Wallet, Wrench } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AreaTrend, DonutChart } from "@/components/common/Charts";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/store/app-store";
import { revenueSeries } from "@/data/mock";
import { formatCompactToman, formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [
      { title: "داشبورد مدیر ساختمان | سامانه مدیریت ساختمان" },
      { name: "description", content: "خلاصه وضعیت مالی، واحدها، ساکنان و درخواست‌های خدماتی ساختمان." },
      { property: "og:title", content: "داشبورد مدیر ساختمان" },
      { property: "og:description", content: "نمای کلی وضعیت ساختمان برای مدیر." },
    ],
  }),
  component: ManagerDashboard,
});

function ManagerDashboard() {
  const { state } = useApp();

  const income = state.payments.filter((p) => p.status === "موفق").reduce((a, p) => a + p.amount, 0);
  const expense = state.expenses.reduce((a, e) => a + e.amount, 0);
  const debt = state.residents.reduce((a, r) => a + r.debt, 0);
  const balance = income - expense + 120000000;
  const activeRequests = state.requests.filter((r) => !["تکمیل شده", "لغو شده"].includes(r.status));

  const chargeStatus = [
    { name: "پرداخت شده", value: state.charges.filter((c) => c.status === "پرداخت شده").length, color: "var(--color-success)" },
    { name: "پرداخت نشده", value: state.charges.filter((c) => c.status === "پرداخت نشده").length, color: "var(--color-warning)" },
    { name: "سررسید گذشته", value: state.charges.filter((c) => c.status === "سررسید گذشته").length, color: "var(--color-destructive)" },
  ];

  const requestStatus = [
    { name: "جدید", value: state.requests.filter((r) => r.status === "جدید").length, color: "var(--color-info)" },
    { name: "در حال انجام", value: state.requests.filter((r) => r.status === "در حال انجام").length, color: "var(--color-chart-1)" },
    { name: "تکمیل شده", value: state.requests.filter((r) => r.status === "تکمیل شده").length, color: "var(--color-success)" },
    { name: "لغو شده", value: state.requests.filter((r) => r.status === "لغو شده").length, color: "var(--color-destructive)" },
  ];

  return (
    <>
      <PageHeader
        title="داشبورد ساختمان"
        description="برج نگین سعادت — شهریور ۱۴۰۴"
        breadcrumb={["پنل مدیر ساختمان", "داشبورد"]}
        action={
          <Button asChild>
            <Link to="/manager/charges">صدور شارژ</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="موجودی ساختمان" value={formatCompactToman(balance)} icon={Wallet} tone="success" />
        <StatCard title="بدهی کل ساکنان" value={formatToman(debt)} icon={AlertTriangle} tone="danger" />
        <StatCard title="درآمد ماه جاری" value={formatCompactToman(income)} icon={Receipt} />
        <StatCard title="هزینه‌های ماه جاری" value={formatCompactToman(expense)} icon={Wallet} tone="warning" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="تعداد واحدها" value={formatNumber(state.units.length)} icon={Home} />
        <StatCard title="تعداد ساکنان" value={formatNumber(state.residents.length)} icon={Users} tone="info" />
        <StatCard title="درخواست‌های فعال" value={formatNumber(activeRequests.length)} icon={Wrench} tone="warning" />
        <StatCard title="واحدهای بدهکار" value={formatNumber(state.units.filter((u) => u.paymentStatus === "بدهکار").length)} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 font-semibold">درآمد و هزینه (میلیون تومان)</p>
          <AreaTrend
            data={revenueSeries}
            keys={[
              { key: "درآمد", color: "var(--color-chart-2)" },
              { key: "هزینه", color: "var(--color-chart-5)" },
            ]}
          />
        </Card>
        <Card className="p-5">
          <p className="mb-4 font-semibold">وضعیت پرداخت شارژ</p>
          <DonutChart data={chargeStatus} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 font-semibold">درخواست‌های خدماتی</p>
          <DonutChart data={requestStatus} />
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold">پرداخت‌های اخیر</p>
            <Button variant="ghost" size="sm" asChild><Link to="/manager/payments">همه</Link></Button>
          </div>
          {state.payments.length === 0 ? (
            <EmptyState title="هنوز پرداختی ثبت نشده است" />
          ) : (
            <div className="space-y-2">
              {state.payments.slice(0, 5).map((p) => (
                <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.residentName} — واحد {p.unitNumber}</p>
                    <p className="text-xs text-muted-foreground">{p.date} — {p.method}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="text-sm font-medium">{formatToman(p.amount)}</p>
                    <StatusBadge status={p.status} className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

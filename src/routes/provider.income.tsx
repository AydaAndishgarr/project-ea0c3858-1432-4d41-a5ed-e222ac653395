import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card } from "@/components/ui/card";
import { CURRENT_PROVIDER_ID, useApp } from "@/store/app-store";
import { formatCompactToman, formatToman, faDigits } from "@/lib/format";

export const Route = createFileRoute("/provider/income")({
  head: () => ({
    meta: [
      { title: "درآمد | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "خلاصه درآمد، کمیسیون و مبلغ قابل تسویه." },
    ],
  }),
  component: ProviderIncome,
});

const series = [
  { month: "فروردین", درآمد: 18 },
  { month: "اردیبهشت", درآمد: 22 },
  { month: "خرداد", درآمد: 19 },
  { month: "تیر", درآمد: 25 },
  { month: "مرداد", درآمد: 28 },
  { month: "شهریور", درآمد: 31 },
];

function ProviderIncome() {
  const { state } = useApp();
  const done = state.requests.filter(
    (r) => r.providerId === CURRENT_PROVIDER_ID && r.status === "تکمیل شده",
  );
  const monthIncome = done.reduce((a, r) => a + r.amount, 0) + 8600000;
  const commission = Math.round(monthIncome * 0.1);
  const pending = state.settlements
    .filter((s) => s.status === "در انتظار")
    .reduce((a, s) => a + (s.amount - s.commission), 0);

  return (
    <>
      <PageHeader
        title="درآمد"
        description="وضعیت مالی خدمات انجام‌شده"
        breadcrumb={["پنل ارائه‌دهنده", "درآمد"]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="درآمد امروز" value={formatCompactToman(850000)} icon={Wallet} />
        <StatCard title="درآمد این ماه" value={formatCompactToman(monthIncome)} tone="success" />
        <StatCard title="کمیسیون سامانه" value={formatCompactToman(commission)} tone="warning" />
        <StatCard title="قابل تسویه" value={formatCompactToman(pending)} tone="info" />
      </div>

      <Card className="mt-6 gap-4 p-5">
        <p className="font-semibold">روند درآمد شش‌ماهه (میلیون تومان)</p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={36} />
              <Tooltip formatter={(v: number) => [`${faDigits(v)} میلیون`, "درآمد"]} />
              <Bar dataKey="درآمد" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-6 gap-3 p-5">
        <p className="font-semibold">آخرین کارهای تکمیل‌شده</p>
        {done.length === 0 ? (
          <p className="text-sm text-muted-foreground">هنوز کار تکمیل‌شده‌ای ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {done.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.buildingName}</p>
                </div>
                <span className="text-sm font-medium">{formatToman(r.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

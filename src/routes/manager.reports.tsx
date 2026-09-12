import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AreaTrend, BarsChart, DonutChart } from "@/components/common/Charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/store/app-store";
import { revenueSeries } from "@/data/mock";
import { formatCompactToman, formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/reports")({
  head: () => ({
    meta: [
      { title: "گزارش‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "گزارش‌های مالی، بدهکاران و عملکرد درخواست‌های خدمات ساختمان." },
      { property: "og:title", content: "گزارش‌های ساختمان" },
      { property: "og:description", content: "تحلیل درآمد، هزینه و بدهی واحدها." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { state } = useApp();
  const [period, setPeriod] = useState("۶ ماه اخیر");

  const income = state.payments.filter((p) => p.status === "موفق").reduce((a, p) => a + p.amount, 0);
  const expenses = state.expenses.reduce((a, e) => a + e.amount, 0);
  const debt = state.residents.reduce((a, r) => a + r.debt, 0);
  const debtors = [...state.residents].filter((r) => r.debt > 0).sort((a, b) => b.debt - a.debt);

  const requestShare = ["جدید", "پذیرفته شده", "در حال انجام", "تکمیل شده", "لغو شده"]
    .map((s, i) => ({
      name: s,
      value: state.requests.filter((r) => r.status === s).length,
      color: `var(--color-chart-${i + 1})`,
    }))
    .filter((d) => d.value > 0);

  return (
    <>
      <PageHeader
        title="گزارش‌ها"
        description="تحلیل مالی و عملکرد ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "گزارش‌ها"]}
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["۱ ماه اخیر", "۳ ماه اخیر", "۶ ماه اخیر", "۱ سال اخیر"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.success("گزارش برای دریافت آماده شد (نمونه آزمایشی).")}>
              دریافت گزارش
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="درآمد وصول‌شده" value={formatCompactToman(income)} icon={FileBarChart} tone="success" />
        <StatCard title="مجموع هزینه‌ها" value={formatCompactToman(expenses)} tone="warning" />
        <StatCard title="مانده صندوق" value={formatCompactToman(income - expenses)} tone="info" />
        <StatCard title="بدهی ساکنان" value={formatCompactToman(debt)} tone="danger" />
      </div>

      <Tabs defaultValue="financial" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="financial">مالی</TabsTrigger>
          <TabsTrigger value="debtors">بدهکاران</TabsTrigger>
          <TabsTrigger value="requests">درخواست‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-4 space-y-4">
          <Card className="p-5">
            <p className="mb-4 font-semibold">روند درآمد و هزینه ({period})</p>
            <AreaTrend
              data={revenueSeries}
              keys={[
                { key: "درآمد", color: "var(--color-primary)" },
                { key: "هزینه", color: "var(--color-chart-4)" },
              ]}
            />
          </Card>
          <Card className="p-5">
            <p className="mb-4 font-semibold">مقایسه ماهانه</p>
            <BarsChart
              data={revenueSeries}
              keys={[
                { key: "درآمد", color: "var(--color-chart-2)" },
                { key: "هزینه", color: "var(--color-chart-5)" },
              ]}
            />
          </Card>
        </TabsContent>

        <TabsContent value="debtors" className="mt-4">
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام ساکن</TableHead>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">نوع</TableHead>
                    <TableHead className="text-right">بدهی</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debtors.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.unitNumber}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell className="text-destructive">{formatToman(r.debt)}</TableCell>
                    </TableRow>
                  ))}
                  {debtors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        همه واحدها تسویه هستند.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <p className="mb-4 font-semibold">وضعیت درخواست‌های خدمات</p>
            <DonutChart data={requestShare} />
          </Card>
          <Card className="gap-3 p-5">
            <p className="font-semibold">خلاصه عملکرد</p>
            {[
              ["کل درخواست‌ها", formatNumber(state.requests.length)],
              ["تکمیل‌شده", formatNumber(state.requests.filter((r) => r.status === "تکمیل شده").length)],
              ["در جریان", formatNumber(state.requests.filter((r) => r.status === "در حال انجام").length)],
              ["لغو‌شده", formatNumber(state.requests.filter((r) => r.status === "لغو شده").length)],
              ["مجموع هزینه خدمات", formatToman(state.requests.reduce((a, r) => a + r.amount, 0))],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border pb-2 text-sm last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

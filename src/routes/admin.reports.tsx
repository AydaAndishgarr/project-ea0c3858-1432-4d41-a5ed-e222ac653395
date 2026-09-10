import { createFileRoute } from "@tanstack/react-router";
import { Building2, CreditCard, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AreaTrend, BarsChart, DonutChart } from "@/components/common/Charts";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildingGrowth, platformRevenue } from "@/data/mock";
import { useApp } from "@/store/app-store";
import { formatCompactToman, formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "گزارش‌ها | پنل مدیر کل" },
      { name: "description", content: "گزارش رشد ساختمان‌ها، درآمد سامانه و وضعیت اشتراک‌ها." },
      { property: "og:title", content: "گزارش‌های سامانه" },
      { property: "og:description", content: "گزارش‌های کلان سامانه مدیریت ساختمان." },
    ],
  }),
  component: AdminReports,
});

function AdminReports() {
  const { state } = useApp();
  const [period, setPeriod] = useState("۱۴۰۴");
  const total = state.subscriptions.reduce((a, s) => a + s.price, 0);

  const planShare = [
    { name: "پایه", value: state.subscriptions.filter((s) => s.plan === "پایه").length, color: "var(--color-chart-1)" },
    { name: "حرفه‌ای", value: state.subscriptions.filter((s) => s.plan === "حرفه‌ای").length, color: "var(--color-chart-2)" },
    { name: "سازمانی", value: state.subscriptions.filter((s) => s.plan === "سازمانی").length, color: "var(--color-chart-4)" },
  ];

  return (
    <>
      <PageHeader
        title="گزارش‌ها"
        description="تحلیل عملکرد سامانه در بازه انتخابی"
        breadcrumb={["پنل مدیر کل", "گزارش‌ها"]}
        action={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="۱۴۰۴">سال ۱۴۰۴</SelectItem>
              <SelectItem value="۱۴۰۳">سال ۱۴۰۳</SelectItem>
              <SelectItem value="شش‌ماهه">شش ماه اخیر</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="درآمد کل" value={formatCompactToman(total)} icon={CreditCard} />
        <StatCard title="ساختمان‌ها" value={formatNumber(state.buildings.length)} icon={Building2} tone="info" />
        <StatCard title="مدیران فعال" value={formatNumber(state.managers.filter((m) => m.status === "فعال").length)} icon={Users} tone="success" />
        <StatCard title="نرخ رشد ماهانه" value="۲۱٪" icon={TrendingUp} tone="warning" />
      </div>

      <Tabs defaultValue="revenue" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="revenue">گزارش درآمد</TabsTrigger>
          <TabsTrigger value="growth">رشد ساختمان‌ها</TabsTrigger>
          <TabsTrigger value="subs">اشتراک‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4 space-y-4">
          <Card className="p-5">
            <p className="mb-4 font-semibold">روند درآمد ({period}) — میلیون تومان</p>
            <BarsChart data={platformRevenue} keys={[{ key: "درآمد", color: "var(--color-primary)" }]} />
          </Card>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ساختمان</TableHead>
                    <TableHead className="text-right">پلن</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.subscriptions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.buildingName}</TableCell>
                      <TableCell>{s.plan}</TableCell>
                      <TableCell>{formatToman(s.price)}</TableCell>
                      <TableCell>{s.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="mt-4">
          <Card className="p-5">
            <p className="mb-4 font-semibold">رشد تعداد ساختمان‌ها</p>
            <AreaTrend data={buildingGrowth} keys={[{ key: "ساختمان", color: "var(--color-chart-2)" }]} />
          </Card>
        </TabsContent>

        <TabsContent value="subs" className="mt-4">
          <Card className="p-5">
            <p className="mb-4 font-semibold">سهم پلن‌های اشتراک</p>
            <DonutChart data={planShare} />
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/store/app-store";
import { formatCompactToman, formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({
    meta: [
      { title: "اشتراک‌ها | پنل مدیر کل" },
      { name: "description", content: "وضعیت اشتراک ساختمان‌ها، مبلغ و تاریخ انقضای هر پلن." },
      { property: "og:title", content: "اشتراک‌های سامانه" },
      { property: "og:description", content: "مدیریت اشتراک ساختمان‌ها." },
    ],
  }),
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("all");

  const rows = useMemo(
    () =>
      state.subscriptions.filter(
        (s) => (plan === "all" || s.plan === plan) && s.buildingName.includes(search),
      ),
    [state.subscriptions, search, plan],
  );

  const total = state.subscriptions.reduce((a, s) => a + s.price, 0);
  const activeCount = state.subscriptions.filter((s) => s.status === "فعال").length;
  const expiring = state.subscriptions.filter((s) => s.status === "در انتظار تمدید").length;

  return (
    <>
      <PageHeader
        title="اشتراک‌ها"
        description="وضعیت اشتراک ساختمان‌های سامانه"
        breadcrumb={["پنل مدیر کل", "اشتراک‌ها"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="درآمد اشتراک‌ها" value={formatCompactToman(total)} icon={CreditCard} />
        <StatCard title="اشتراک فعال" value={formatNumber(activeCount)} tone="success" />
        <StatCard title="در انتظار تمدید" value={formatNumber(expiring)} tone="warning" />
      </div>

      <div className="mt-6">
        <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی نام ساختمان...">
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه پلن‌ها</SelectItem>
              <SelectItem value="پایه">پایه</SelectItem>
              <SelectItem value="حرفه‌ای">حرفه‌ای</SelectItem>
              <SelectItem value="سازمانی">سازمانی</SelectItem>
            </SelectContent>
          </Select>
        </Toolbar>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={CreditCard} title="اشتراکی یافت نشد" description="فیلترها را تغییر دهید." />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ساختمان</TableHead>
                    <TableHead className="text-right">پلن</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">شروع</TableHead>
                    <TableHead className="text-right">انقضا</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.buildingName}</TableCell>
                      <TableCell>{s.plan}</TableCell>
                      <TableCell>{formatToman(s.price)}</TableCell>
                      <TableCell>{s.startedAt}</TableCell>
                      <TableCell>{s.expiresAt}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {rows.map((s) => (
              <Card key={s.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-medium">{s.buildingName}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-muted-foreground">پلن {s.plan} — {formatToman(s.price)}</p>
                <p className="text-xs text-muted-foreground">اعتبار تا {s.expiresAt}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}

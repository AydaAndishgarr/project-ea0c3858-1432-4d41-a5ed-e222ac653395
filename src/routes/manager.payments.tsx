import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Receipt } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { SimplePagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/store/app-store";
import { formatCompactToman, formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/payments")({
  head: () => ({
    meta: [
      { title: "پرداخت‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "تاریخچه پرداخت‌های ساکنان با شماره رسید و روش پرداخت." },
      { property: "og:title", content: "تاریخچه پرداخت‌ها" },
      { property: "og:description", content: "پرداخت‌های ثبت‌شده ساکنان ساختمان." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(
    () =>
      state.payments.filter(
        (p) =>
          (status === "all" || p.status === status) &&
          (method === "all" || p.method === method) &&
          (p.residentName.includes(search) || p.unitNumber.includes(search) || p.receipt.includes(search)),
      ),
    [state.payments, search, status, method],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);
  const success = state.payments.filter((p) => p.status === "موفق");
  const total = success.reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <PageHeader
        title="پرداخت‌ها"
        description="تاریخچه پرداخت‌های ساکنان"
        breadcrumb={["پنل مدیر ساختمان", "پرداخت‌ها"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="مبلغ وصول‌شده" value={formatCompactToman(total)} icon={CreditCard} tone="success" />
        <StatCard title="تعداد پرداخت موفق" value={formatNumber(success.length)} icon={Receipt} />
        <StatCard title="پرداخت‌های ناموفق" value={formatNumber(state.payments.filter((p) => p.status === "ناموفق").length)} tone="danger" />
      </div>

      <div className="mt-6">
        <Toolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="جست‌وجوی نام، واحد یا شماره رسید...">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="موفق">موفق</SelectItem>
              <SelectItem value="ناموفق">ناموفق</SelectItem>
              <SelectItem value="در انتظار">در انتظار</SelectItem>
            </SelectContent>
          </Select>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه روش‌ها</SelectItem>
              <SelectItem value="کارت بانکی">کارت بانکی</SelectItem>
              <SelectItem value="انتقال وجه">انتقال وجه</SelectItem>
              <SelectItem value="نقدی">نقدی</SelectItem>
            </SelectContent>
          </Select>
        </Toolbar>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="پرداختی یافت نشد" description="فیلترها را تغییر دهید." />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام ساکن</TableHead>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">بابت</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">روش</TableHead>
                    <TableHead className="text-right">شماره رسید</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.residentName}</TableCell>
                      <TableCell>{p.unitNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{p.chargeTitle}</TableCell>
                      <TableCell>{formatToman(p.amount)}</TableCell>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>{p.receipt}</TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {rows.map((p) => (
              <Card key={p.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-medium">{p.residentName} — واحد {p.unitNumber}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-muted-foreground">{p.chargeTitle}</p>
                <p className="text-sm font-medium">{formatToman(p.amount)}</p>
                <p className="text-xs text-muted-foreground">{p.date} — {p.method} — رسید {p.receipt}</p>
              </Card>
            ))}
          </div>

          <SimplePagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CURRENT_UNIT, useApp } from "@/store/app-store";
import type { Payment } from "@/data/types";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/resident/payments")({
  head: () => ({
    meta: [
      { title: "پرداخت‌های من | پنل ساکن" },
      { name: "description", content: "تاریخچه پرداخت‌های شارژ واحد همراه با رسید پرداخت." },
      { property: "og:title", content: "تاریخچه پرداخت‌های من" },
      { property: "og:description", content: "مشاهده رسیدهای پرداخت شارژ." },
    ],
  }),
  component: ResidentPayments,
});

function ResidentPayments() {
  const { state } = useApp();
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const mine = state.payments.filter((p) => p.unitNumber === CURRENT_UNIT);
  const total = mine.filter((p) => p.status === "موفق").reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <PageHeader
        title="پرداخت‌های من"
        description="تاریخچه پرداخت‌ها و رسیدها"
        breadcrumb={["پنل ساکن", "پرداخت‌ها"]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="مجموع پرداخت‌شده" value={formatCompactToman(total)} icon={CreditCard} tone="success" />
        <StatCard title="تعداد پرداخت‌ها" value={`${mine.length} فقره`} tone="info" />
      </div>

      <div className="mt-6">
        {mine.length === 0 ? (
          <EmptyState icon={CreditCard} title="پرداختی ثبت نشده است" description="پس از پرداخت شارژ، رسیدها اینجا نمایش داده می‌شود." />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {mine.map((p) => (
              <Card key={p.id} className="gap-3 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.chargeTitle}</p>
                    <p className="text-sm text-muted-foreground">{p.date} — {p.method}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-bold">{formatToman(p.amount)}</span>
                  <span className="text-muted-foreground">رسید {p.receipt}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setReceipt(p)}>مشاهده رسید</Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent dir="rtl" className="text-right sm:max-w-md">
          <DialogHeader>
            <DialogTitle>رسید پرداخت</DialogTitle>
            <DialogDescription>رسید نمایشی پرداخت شارژ</DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-2 rounded-xl border border-dashed border-border p-4 text-sm">
              {[
                ["شماره رسید", receipt.receipt],
                ["بابت", receipt.chargeTitle],
                ["پرداخت‌کننده", receipt.residentName],
                ["واحد", receipt.unitNumber],
                ["مبلغ", formatToman(receipt.amount)],
                ["روش پرداخت", receipt.method],
                ["تاریخ", receipt.date],
                ["وضعیت", receipt.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={() => toast.success("رسید برای دریافت آماده شد (نمونه آزمایشی).")}>
              <Download className="size-4" />
              دریافت رسید
            </Button>
            <Button variant="outline" onClick={() => setReceipt(null)}>بستن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

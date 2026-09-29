import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActions, useApp } from "@/store/app-store";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/provider/settlements")({
  head: () => ({
    meta: [
      { title: "تسویه حساب | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "درخواست تسویه و مشاهده تاریخچه پرداخت‌ها." },
    ],
  }),
  component: ProviderSettlements,
});

function ProviderSettlements() {
  const { state } = useApp();
  const { requestSettlement } = useActions();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("5000000");

  const pending = state.settlements.filter((s) => s.status === "در انتظار");
  const settled = state.settlements.filter((s) => s.status === "تسویه شده");
  const pendingSum = pending.reduce((a, s) => a + (s.amount - s.commission), 0);

  return (
    <>
      <PageHeader
        title="تسویه حساب"
        description="درخواست واریز درآمد به حساب شما"
        breadcrumb={["پنل ارائه‌دهنده", "تسویه حساب"]}
        action={
          <Button onClick={() => setOpen(true)}>
            <CreditCard className="size-4" />
            درخواست تسویه
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="قابل تسویه" value={formatCompactToman(pendingSum)} tone="info" />
        <StatCard title="در انتظار" value={`${pending.length} مورد`} tone="warning" />
        <StatCard title="تسویه‌شده" value={`${settled.length} مورد`} tone="success" />
      </div>

      <div className="mt-6">
        {state.settlements.length === 0 ? (
          <EmptyState icon={CreditCard} title="تسویه‌ای ثبت نشده است" />
        ) : (
          <div className="space-y-3">
            {state.settlements.map((s) => (
              <Card key={s.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{formatToman(s.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      کمیسیون {formatToman(s.commission)} — خالص {formatToman(s.amount - s.commission)}
                    </p>
                  </div>
                  <div className="shrink-0 text-left">
                    <StatusBadge status={s.status} />
                    <p className="mt-1 text-xs text-muted-foreground">{s.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="text-right sm:max-w-md">
          <DialogHeader>
            <DialogTitle>درخواست تسویه جدید</DialogTitle>
            <DialogDescription>مبلغ درخواستی پس از کسر کمیسیون واریز می‌شود.</DialogDescription>
          </DialogHeader>
          <div>
            <Label className="mb-2 block">مبلغ (تومان)</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} />
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                const n = Number(amount);
                if (!n || n < 100000) {
                  toast.error("مبلغ معتبر وارد کنید.");
                  return;
                }
                requestSettlement(n);
                setOpen(false);
                toast.success("درخواست تسویه ثبت شد.");
              }}
            >
              ثبت درخواست
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

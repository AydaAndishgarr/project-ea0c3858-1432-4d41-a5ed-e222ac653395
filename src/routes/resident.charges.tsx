import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Receipt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CURRENT_RESIDENT, CURRENT_UNIT, useActions, useApp } from "@/store/app-store";
import type { Charge } from "@/data/types";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/resident/charges")({
  head: () => ({
    meta: [
      { title: "شارژ و بدهی | پنل ساکن" },
      { name: "description", content: "مشاهده شارژهای صادرشده واحد و پرداخت آنلاین آزمایشی." },
      { property: "og:title", content: "شارژ و بدهی من" },
      { property: "og:description", content: "پرداخت شارژ واحد و مشاهده سررسیدها." },
    ],
  }),
  component: ResidentCharges,
});

function ResidentCharges() {
  const { state } = useApp();
  const { payCharge } = useActions();
  const [tab, setTab] = useState("all");
  const [paying, setPaying] = useState<Charge | null>(null);
  const [method, setMethod] = useState("کارت بانکی");
  const [loading, setLoading] = useState(false);

  const mine = state.charges.filter((c) => c.unitNumber === CURRENT_UNIT);
  const rows = mine.filter((c) => (tab === "all" ? true : c.status === tab));
  const debt = state.residents.find((r) => r.name === CURRENT_RESIDENT)?.debt ?? 0;
  const paid = mine.filter((c) => c.status === "پرداخت شده").reduce((a, c) => a + c.amount, 0);

  return (
    <>
      <PageHeader
        title="شارژ و بدهی"
        description={`شارژهای صادرشده برای واحد ${CURRENT_UNIT}`}
        breadcrumb={["پنل ساکن", "شارژ و بدهی"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="بدهی جاری" value={formatCompactToman(debt)} icon={Receipt} tone={debt > 0 ? "danger" : "success"} />
        <StatCard title="مجموع پرداخت‌شده" value={formatCompactToman(paid)} icon={CreditCard} tone="success" />
        <StatCard title="تعداد شارژها" value={`${mine.length} مورد`} tone="info" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6 mb-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="پرداخت نشده">پرداخت‌نشده</TabsTrigger>
          <TabsTrigger value="سررسید گذشته">سررسید گذشته</TabsTrigger>
          <TabsTrigger value="پرداخت شده">پرداخت‌شده</TabsTrigger>
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState icon={Receipt} title="شارژی در این بخش نیست" description="فیلتر دیگری را انتخاب کنید." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((c) => (
            <Card key={c.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.type}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-bold">{formatToman(c.amount)}</span>
                <span className="text-muted-foreground">سررسید {c.dueDate}</span>
              </div>
              {c.status !== "پرداخت شده" && (
                <Button onClick={() => { setPaying(c); setMethod("کارت بانکی"); }}>
                  <CreditCard className="size-4" />
                  پرداخت آنلاین
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!paying} onOpenChange={(o) => !o && setPaying(null)}>
        <DialogContent dir="rtl" className="text-right sm:max-w-md">
          <DialogHeader>
            <DialogTitle>پرداخت شارژ</DialogTitle>
            <DialogDescription>
              {paying?.title} — {paying ? formatToman(paying.amount) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">روش پرداخت</Label>
              <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
                {["کارت بانکی", "انتقال وجه", "نقدی"].map((m) => (
                  <div key={m} className="flex items-center gap-2 rounded-lg border border-border p-3">
                    <RadioGroupItem value={m} id={m} />
                    <Label htmlFor={m} className="cursor-pointer">{m}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <p className="rounded-lg bg-muted p-3 text-xs leading-6 text-muted-foreground">
              این پرداخت شبیه‌سازی‌شده است و هیچ تراکنش واقعی انجام نمی‌شود.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              disabled={loading}
              onClick={() => {
                if (!paying) return;
                setLoading(true);
                setTimeout(() => {
                  payCharge(paying);
                  setLoading(false);
                  setPaying(null);
                  toast.success("پرداخت با موفقیت انجام شد و رسید صادر شد.");
                }, 900);
              }}
            >
              {loading ? "در حال پرداخت..." : "تأیید و پرداخت"}
            </Button>
            <Button variant="outline" onClick={() => setPaying(null)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

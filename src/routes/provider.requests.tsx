import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CURRENT_PROVIDER_ID, useActions, useApp } from "@/store/app-store";
import type { ServiceRequest } from "@/data/types";
import { formatToman } from "@/lib/format";

export const Route = createFileRoute("/provider/requests")({
  head: () => ({
    meta: [
      { title: "درخواست‌ها | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "پذیرش، رد و پیگیری درخواست‌های خدماتی." },
    ],
  }),
  component: ProviderRequests,
});

const ACTIONS: Record<
  string,
  { status: ServiceRequest["status"]; label: string; toast: string; assign?: boolean }[]
> = {
  جدید: [
    { status: "پذیرفته شده", label: "پذیرش توسط ارائه‌دهنده", toast: "درخواست پذیرفته شد.", assign: true },
    { status: "لغو شده", label: "رد درخواست توسط ارائه‌دهنده", toast: "درخواست رد شد." },
  ],
  "پذیرفته شده": [
    { status: "در حال انجام", label: "شروع کار", toast: "کار آغاز شد." },
    { status: "لغو شده", label: "لغو توسط ارائه‌دهنده", toast: "درخواست لغو شد." },
  ],
  "در حال انجام": [
    { status: "تکمیل شده", label: "تکمیل کار و تحویل", toast: "کار با موفقیت تکمیل شد." },
    { status: "لغو شده", label: "لغو در حین انجام", toast: "درخواست لغو شد." },
  ],
  "تکمیل شده": [],
  "لغو شده": [],
};

function ProviderRequests() {
  const { state } = useApp();
  const { setRequestStatus } = useActions();
  const [tab, setTab] = useState("all");
  const [detail, setDetail] = useState<ServiceRequest | null>(null);

  const provider = state.providers.find((p) => p.id === CURRENT_PROVIDER_ID);
  const mine = useMemo(
    () =>
      state.requests.filter(
        (r) =>
          r.providerId === CURRENT_PROVIDER_ID ||
          (r.status === "جدید" && (r.providerId === CURRENT_PROVIDER_ID || r.category === provider?.specialty)),
      ),
    [state.requests, provider?.specialty],
  );

  const rows = mine.filter((r) => (tab === "all" ? true : r.status === tab));
  const current = detail ? state.requests.find((r) => r.id === detail.id) ?? detail : null;

  return (
    <>
      <PageHeader
        title="درخواست‌ها"
        description="پذیرش، شروع و تکمیل کارهای محول‌شده"
        breadcrumb={["پنل ارائه‌دهنده", "درخواست‌ها"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="کل" value={`${mine.length} مورد`} icon={Wrench} />
        <StatCard
          title="نیازمند اقدام"
          value={`${mine.filter((r) => r.status === "جدید" || r.status === "پذیرفته شده" || r.status === "در حال انجام").length} مورد`}
          tone="warning"
        />
        <StatCard
          title="تکمیل‌شده"
          value={`${mine.filter((r) => r.status === "تکمیل شده").length} مورد`}
          tone="success"
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6 mb-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">همه</TabsTrigger>
          {["جدید", "پذیرفته شده", "در حال انجام", "تکمیل شده", "لغو شده"].map((s) => (
            <TabsTrigger key={s} value={s}>
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <EmptyState icon={Wrench} title="درخواستی در این بخش نیست" />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.buildingName} — واحد {r.unitNumber} — {r.requesterName}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="line-clamp-2 text-sm leading-7 text-muted-foreground">{r.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <StatusBadge status={r.priority} />
                <span className="font-medium">{formatToman(r.amount)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(ACTIONS[r.status] ?? []).map((a) => (
                  <Button
                    key={a.status + a.label}
                    size="sm"
                    variant={a.status === "لغو شده" ? "outline" : "default"}
                    onClick={() => {
                      setRequestStatus(r.id, a.status, a.label, a.assign
                        ? { providerId: CURRENT_PROVIDER_ID, providerName: provider?.name ?? "برق‌کاری نوین" }
                        : undefined);
                      toast.success(a.toast);
                    }}
                  >
                    {a.status === "پذیرفته شده"
                      ? "قبول"
                      : a.status === "لغو شده"
                        ? r.status === "جدید"
                          ? "رد"
                          : "لغو"
                        : a.status === "در حال انجام"
                          ? "شروع کار"
                          : "تکمیل کار"}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => setDetail(r)}>
                  جزئیات
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
            <DialogDescription>جزئیات و روند پیگیری</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="space-y-4 text-sm">
              <p className="leading-7 text-muted-foreground">{current.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">وضعیت</span>
                <StatusBadge status={current.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">مبلغ</span>
                <span className="font-medium">{formatToman(current.amount)}</span>
              </div>
              <ol className="space-y-3 border-r border-border pr-4">
                {current.timeline.map((t, i) => (
                  <li key={`${t.at}-${i}`} className="relative">
                    <span className="absolute top-1.5 -right-[21px] size-2.5 rounded-full bg-primary" />
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.at}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => setDetail(null)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

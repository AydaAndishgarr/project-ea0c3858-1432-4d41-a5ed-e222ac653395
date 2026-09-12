import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CreditCard, Home, Megaphone, Receipt, Wrench } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CURRENT_BUILDING, CURRENT_RESIDENT, CURRENT_UNIT, useApp } from "@/store/app-store";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/resident/")({
  head: () => ({
    meta: [
      { title: "داشبورد ساکن | سامانه مدیریت ساختمان" },
      { name: "description", content: "نمای کلی بدهی، شارژ جاری، درخواست‌ها و اطلاعیه‌های واحد شما." },
      { property: "og:title", content: "داشبورد ساکن" },
      { property: "og:description", content: "وضعیت شارژ و خدمات واحد شما در یک نگاه." },
    ],
  }),
  component: ResidentHome,
});

function ResidentHome() {
  const { state } = useApp();
  const resident = state.residents.find((r) => r.name === CURRENT_RESIDENT);
  const charges = state.charges.filter((c) => c.unitNumber === CURRENT_UNIT);
  const unpaid = charges.filter((c) => c.status !== "پرداخت شده");
  const payments = state.payments.filter((p) => p.unitNumber === CURRENT_UNIT);
  const requests = state.requests.filter((r) => r.unitNumber === CURRENT_UNIT);
  const openRequests = requests.filter((r) => r.status !== "تکمیل شده" && r.status !== "لغو شده");
  const unread = state.notifications.filter((n) => (n.audience === "all" || n.audience === "resident") && !n.read).length;
  const announcements = state.announcements.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`سلام ${CURRENT_RESIDENT} 👋`}
        description={`واحد ${CURRENT_UNIT} — ${CURRENT_BUILDING}`}
        breadcrumb={["پنل ساکن", "داشبورد"]}
        action={
          <Button asChild>
            <Link to="/resident/charges">
              <CreditCard className="size-4" />
              پرداخت شارژ
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="بدهی جاری"
          value={formatCompactToman(resident?.debt ?? 0)}
          hint={unpaid.length ? `${unpaid.length} شارژ پرداخت‌نشده` : "همه شارژها تسویه است"}
          icon={Receipt}
          tone={(resident?.debt ?? 0) > 0 ? "danger" : "success"}
        />
        <StatCard title="پرداخت‌های من" value={`${payments.length} فقره`} icon={CreditCard} tone="info" />
        <StatCard title="درخواست‌های باز" value={`${openRequests.length} مورد`} icon={Wrench} tone="warning" />
        <StatCard title="اعلان خوانده‌نشده" value={`${unread} مورد`} icon={Bell} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">شارژهای پرداخت‌نشده</p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/resident/charges">مشاهده همه</Link>
            </Button>
          </div>
          {unpaid.length === 0 ? (
            <EmptyState icon={Receipt} title="شارژ پرداخت‌نشده‌ای ندارید" />
          ) : (
            <div className="space-y-3">
              {unpaid.slice(0, 4).map((c) => (
                <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">سررسید {c.dueDate}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="text-sm font-medium">{formatToman(c.amount)}</p>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">آخرین اطلاعیه‌ها</p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/resident/announcements">مشاهده همه</Link>
            </Button>
          </div>
          {announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="اطلاعیه‌ای وجود ندارد" />
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="border-b border-border pb-3 last:border-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="line-clamp-2 text-xs leading-6 text-muted-foreground">{a.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.date}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="gap-3 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">درخواست‌های خدمات من</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/resident/requests">
                <Wrench className="size-4" />
                درخواست جدید
              </Link>
            </Button>
          </div>
          {requests.length === 0 ? (
            <EmptyState icon={Home} title="درخواستی ثبت نکرده‌اید" />
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 4).map((r) => (
                <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.category} — {r.createdAt}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

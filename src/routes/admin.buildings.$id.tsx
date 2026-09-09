import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight, Building2, CalendarDays, MapPin, Power, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActions, useApp } from "@/store/app-store";
import { formatNumber, formatToman } from "@/lib/format";

export const Route = createFileRoute("/admin/buildings/$id")({
  head: () => ({
    meta: [
      { title: "جزئیات ساختمان | پنل مدیر کل" },
      { name: "description", content: "اطلاعات کامل ساختمان، مدیر، اشتراک و وضعیت فعالیت." },
      { property: "og:title", content: "جزئیات ساختمان" },
      { property: "og:description", content: "مشاهده اطلاعات یک ساختمان در سامانه." },
    ],
  }),
  component: BuildingDetail,
});

function BuildingDetail() {
  const { id } = useParams({ from: "/admin/buildings/$id" });
  const { state } = useApp();
  const { updateBuilding } = useActions();
  const building = state.buildings.find((b) => b.id === id);

  if (!building) {
    return (
      <EmptyState
        icon={Building2}
        title="ساختمان پیدا نشد"
        description="این ساختمان حذف شده یا شناسه آن اشتباه است."
        action={
          <Button asChild variant="outline">
            <Link to="/admin/buildings">بازگشت به فهرست</Link>
          </Button>
        }
      />
    );
  }

  const manager = state.managers.find((m) => m.id === building.managerId);
  const subscription = state.subscriptions.find((s) => s.buildingName === building.name);

  return (
    <>
      <PageHeader
        title={building.name}
        description={building.address}
        breadcrumb={["پنل مدیر کل", "ساختمان‌ها", building.name]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/buildings">
                <ArrowRight className="size-4" />
                بازگشت
              </Link>
            </Button>
            <Button
              variant={building.status === "فعال" ? "destructive" : "default"}
              onClick={() => {
                updateBuilding(building.id, { status: building.status === "فعال" ? "غیرفعال" : "فعال" });
                toast.success("وضعیت ساختمان تغییر کرد.");
              }}
            >
              <Power className="size-4" />
              {building.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="تعداد واحدها" value={formatNumber(building.units)} icon={Building2} />
        <StatCard title="تعداد ساکنان" value={formatNumber(building.residents)} icon={Users} tone="info" />
        <StatCard title="تاریخ ایجاد" value={building.createdAt} icon={CalendarDays} tone="success" />
        <StatCard title="نوع ساختمان" value={building.type} icon={MapPin} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3 p-5">
          <p className="font-semibold">اطلاعات ساختمان</p>
          {[
            ["نام ساختمان", building.name],
            ["آدرس", building.address],
            ["وضعیت", building.status],
            ["نوع اشتراک", building.plan],
            ["تاریخ ایجاد", building.createdAt],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 border-b border-border pb-2 text-sm last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-left font-medium">{v}</span>
            </div>
          ))}
        </Card>

        <Card className="gap-3 p-5">
          <p className="font-semibold">مدیر ساختمان</p>
          {manager ? (
            <>
              {[
                ["نام", manager.name],
                ["شماره تماس", manager.phone],
                ["ایمیل", manager.email],
                ["تاریخ همکاری", manager.joinedAt],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 border-b border-border pb-2 text-sm last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-left font-medium">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 text-sm">
                <span className="text-muted-foreground">وضعیت</span>
                <StatusBadge status={manager.status} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">مدیری برای این ساختمان ثبت نشده است.</p>
          )}
        </Card>
      </div>

      <Card className="mt-4 gap-3 p-5">
        <p className="font-semibold">اشتراک</p>
        {subscription ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <div><p className="text-xs text-muted-foreground">پلن</p><p className="mt-1 font-medium">{subscription.plan}</p></div>
            <div><p className="text-xs text-muted-foreground">مبلغ سالانه</p><p className="mt-1 font-medium">{formatToman(subscription.price)}</p></div>
            <div><p className="text-xs text-muted-foreground">تاریخ انقضا</p><p className="mt-1 font-medium">{subscription.expiresAt}</p></div>
            <div><p className="text-xs text-muted-foreground">وضعیت</p><div className="mt-1"><StatusBadge status={subscription.status} /></div></div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">اشتراکی برای این ساختمان ثبت نشده است.</p>
        )}
      </Card>
    </>
  );
}

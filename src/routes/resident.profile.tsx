import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENT_BUILDING, CURRENT_RESIDENT, CURRENT_UNIT, useApp } from "@/store/app-store";
import { formatToman } from "@/lib/format";

export const Route = createFileRoute("/resident/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل | پنل ساکن | خانه یار" },
      { name: "description", content: "مشاهده و ویرایش اطلاعات پروفایل ساکن." },
    ],
  }),
  component: ResidentProfile,
});

function ResidentProfile() {
  const { state } = useApp();
  const resident = state.residents.find((r) => r.name === CURRENT_RESIDENT);
  const unit = state.units.find((u) => u.number === CURRENT_UNIT);

  return (
    <>
      <PageHeader
        title="پروفایل من"
        description="اطلاعات شخصی و واحد شما"
        breadcrumb={["پنل ساکن", "پروفایل"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="size-6" />
            </span>
            <div>
              <p className="font-semibold">{resident?.name ?? CURRENT_RESIDENT}</p>
              <p className="text-sm text-muted-foreground">{resident?.type}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block">نام</Label>
              <Input defaultValue={resident?.name} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">شماره تماس</Label>
              <Input defaultValue={resident?.phone} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">ایمیل</Label>
              <Input defaultValue={resident?.email ?? "—"} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">وضعیت</Label>
              <div className="pt-2">{resident && <StatusBadge status={resident.status} />}</div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => toast.success("در نسخه نمایشی، ویرایش پروفایل شبیه‌سازی می‌شود.")}
          >
            ذخیره تغییرات
          </Button>
        </Card>

        <Card className="gap-4 p-5">
          <p className="font-semibold">اطلاعات واحد</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">ساختمان</dt>
              <dd className="font-medium">{CURRENT_BUILDING}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">شماره واحد</dt>
              <dd className="font-medium">{CURRENT_UNIT}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">طبقه</dt>
              <dd className="font-medium">{unit?.floor ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">متراژ</dt>
              <dd className="font-medium">{unit ? `${unit.area} متر` : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">وضعیت پرداخت</dt>
              <dd>{unit && <StatusBadge status={unit.paymentStatus} />}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">بدهی جاری</dt>
              <dd className="font-medium">{formatToman(resident?.debt ?? 0)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}

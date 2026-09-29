import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENT_PROVIDER_ID, useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/provider/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "اطلاعات کسب‌وکار و تخصص ارائه‌دهنده خدمات." },
    ],
  }),
  component: ProviderProfile,
});

function ProviderProfile() {
  const { state } = useApp();
  const provider = state.providers.find((p) => p.id === CURRENT_PROVIDER_ID);

  return (
    <>
      <PageHeader
        title="پروفایل کسب‌وکار"
        description="اطلاعات نمایش داده‌شده به ساکنان و مدیران"
        breadcrumb={["پنل ارائه‌دهنده", "پروفایل"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-6" />
            </span>
            <div>
              <p className="font-semibold">{provider?.name}</p>
              <p className="text-sm text-muted-foreground">{provider?.specialty}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block">نام کسب‌وکار</Label>
              <Input defaultValue={provider?.name} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">تخصص</Label>
              <Input defaultValue={provider?.specialty} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">تلفن</Label>
              <Input defaultValue={provider?.phone} readOnly />
            </div>
            <div>
              <Label className="mb-2 block">وضعیت</Label>
              <div className="pt-2">{provider && <StatusBadge status={provider.status} />}</div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => toast.success("در نسخه نمایشی، ذخیره پروفایل شبیه‌سازی می‌شود.")}
          >
            ذخیره تغییرات
          </Button>
        </Card>

        <Card className="gap-4 p-5">
          <p className="font-semibold">آمار عملکرد</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">امتیاز</dt>
              <dd className="font-medium">{faDigits(provider?.rating ?? 0)} از ۵</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">تعداد کارهای انجام‌شده</dt>
              <dd className="font-medium">{faDigits(provider?.jobs ?? 0)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">نظرات ثبت‌شده</dt>
              <dd className="font-medium">{faDigits(state.reviews.length)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}

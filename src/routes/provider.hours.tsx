import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useActions, useApp } from "@/store/app-store";

export const Route = createFileRoute("/provider/hours")({
  head: () => ({
    meta: [
      { title: "زمان‌های کاری | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "تنظیم ساعات کاری و مسدود کردن روزهای غیرفعال." },
    ],
  }),
  component: ProviderHours,
});

function ProviderHours() {
  const { state } = useApp();
  const { toggleSlot } = useActions();

  return (
    <>
      <PageHeader
        title="زمان‌های کاری"
        description="روزها و ساعات در دسترس بودن خود را مشخص کنید"
        breadcrumb={["پنل ارائه‌دهنده", "زمان‌های کاری"]}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {state.workSlots.map((w) => (
          <Card key={w.id} className="flex flex-row items-center justify-between gap-4 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{w.day}</p>
                <p className="text-sm text-muted-foreground">
                  {w.available ? `${w.from} تا ${w.to}` : "غیرفعال — رزرو نمی‌شود"}
                </p>
              </div>
            </div>
            <Switch
              checked={w.available}
              onCheckedChange={() => {
                toggleSlot(w.id);
                toast.success("عملیات با موفقیت انجام شد.");
              }}
              aria-label={`وضعیت ${w.day}`}
            />
          </Card>
        ))}
      </div>

      <Card className="mt-6 gap-3 p-5">
        <p className="text-sm leading-7 text-muted-foreground">
          در نسخه نمایشی، تغییر ساعات دقیق نیازی به ذخیره سرور ندارد. با روشن/خاموش کردن هر روز،
          وضعیت همان لحظه در رابط کاربری به‌روز می‌شود.
        </p>
        <Button
          variant="outline"
          onClick={() => toast.success("ساعات کاری ذخیره شد.")}
        >
          ذخیره تغییرات
        </Button>
      </Card>
    </>
  );
}

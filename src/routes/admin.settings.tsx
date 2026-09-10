import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "تنظیمات | پنل مدیر کل" },
      { name: "description", content: "تنظیمات عمومی سامانه، اعلان‌ها و بازنشانی داده‌های نمایشی." },
      { property: "og:title", content: "تنظیمات سامانه" },
      { property: "og:description", content: "پیکربندی عمومی سامانه مدیریت ساختمان." },
    ],
  }),
  component: AdminSettings,
});

function AdminSettings() {
  const { reset } = useApp();
  const [form, setForm] = useState({
    name: "سامانه مدیریت ساختمان",
    support: "۰۲۱-۹۱۰۰۲۲۳۳",
    email: "info@bms-demo.ir",
    currency: "تومان",
  });
  const [toggles, setToggles] = useState({ email: true, sms: false, autoRenew: true });

  return (
    <>
      <PageHeader
        title="تنظیمات"
        description="پیکربندی عمومی سامانه"
        breadcrumb={["پنل مدیر کل", "تنظیمات"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-4 p-5">
          <p className="font-semibold">اطلاعات سامانه</p>
          <div>
            <Label className="mb-2 block">نام سامانه</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">تلفن پشتیبانی</Label>
            <Input value={form.support} onChange={(e) => setForm({ ...form, support: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">ایمیل پشتیبانی</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">واحد پول</Label>
            <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="تومان">تومان</SelectItem>
                <SelectItem value="ریال">ریال</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-fit" onClick={() => toast.success("تنظیمات با موفقیت ذخیره شد.")}>
            ذخیره تنظیمات
          </Button>
        </Card>

        <div className="space-y-4">
          <Card className="gap-4 p-5">
            <p className="font-semibold">اعلان‌ها</p>
            {[
              { key: "email" as const, label: "ارسال اعلان از طریق ایمیل" },
              { key: "sms" as const, label: "ارسال پیامک به مدیران" },
              { key: "autoRenew" as const, label: "یادآوری خودکار تمدید اشتراک" },
            ].map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="text-sm">{t.label}</span>
                <Switch
                  checked={toggles[t.key]}
                  onCheckedChange={(v) => {
                    setToggles({ ...toggles, [t.key]: v });
                    toast.success("تنظیم اعلان به‌روزرسانی شد.");
                  }}
                />
              </div>
            ))}
          </Card>

          <Card className="gap-3 p-5">
            <p className="font-semibold">داده‌های نمایشی</p>
            <p className="text-sm leading-7 text-muted-foreground">
              با بازنشانی، همه تغییرات شما پاک می‌شود و داده‌های اولیه نمایشی بازمی‌گردد.
            </p>
            <ConfirmDialog
              trigger={<Button variant="destructive" className="w-fit">بازنشانی داده‌ها</Button>}
              title="بازنشانی داده‌های نمایشی؟"
              description="همه ساختمان‌ها، شارژها و تغییرات ثبت‌شده به حالت اولیه بازمی‌گردد."
              confirmLabel="بله، بازنشانی کن"
              onConfirm={() => {
                reset();
                toast.success("داده‌های نمایشی بازنشانی شد.");
              }}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

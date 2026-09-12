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

export const Route = createFileRoute("/manager/settings")({
  head: () => ({
    meta: [
      { title: "تنظیمات | پنل مدیر ساختمان" },
      { name: "description", content: "تنظیمات شارژ، یادآوری پرداخت و اعلان‌های ساختمان." },
      { property: "og:title", content: "تنظیمات مدیر ساختمان" },
      { property: "og:description", content: "پیکربندی شارژ و اعلان‌های ساختمان." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { reset } = useApp();
  const [form, setForm] = useState({
    baseCharge: "1450000",
    dueDay: "۱۵",
    penalty: "2",
    currency: "تومان",
  });
  const [toggles, setToggles] = useState({
    smsReminder: true,
    pushReminder: true,
    autoIssue: false,
    debtAlert: true,
  });

  return (
    <>
      <PageHeader
        title="تنظیمات"
        description="پیکربندی شارژ و اعلان‌های ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "تنظیمات"]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-4 p-5">
          <p className="font-semibold">تنظیمات شارژ</p>
          <div>
            <Label className="mb-2 block">مبلغ پایه شارژ (تومان)</Label>
            <Input value={form.baseCharge} onChange={(e) => setForm({ ...form, baseCharge: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">روز سررسید هر ماه</Label>
            <Input value={form.dueDay} onChange={(e) => setForm({ ...form, dueDay: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2 block">درصد جریمه تأخیر</Label>
            <Input value={form.penalty} onChange={(e) => setForm({ ...form, penalty: e.target.value })} />
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
          <Button className="self-start" onClick={() => toast.success("تنظیمات شارژ ذخیره شد.")}>ذخیره تغییرات</Button>
        </Card>

        <Card className="gap-4 p-5">
          <p className="font-semibold">اعلان‌ها و یادآوری‌ها</p>
          {[
            ["smsReminder", "یادآوری پیامکی شارژ", "ارسال پیامک یادآوری پیش از سررسید"],
            ["pushReminder", "اعلان درون‌برنامه‌ای", "نمایش اعلان به ساکنان در برنامه"],
            ["autoIssue", "صدور خودکار شارژ ماهانه", "شارژ ماهانه به‌صورت خودکار صادر شود"],
            ["debtAlert", "هشدار بدهی معوق", "اطلاع‌رسانی درباره واحدهای بدهکار"],
          ].map(([key, title, desc]) => (
            <div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={toggles[key as keyof typeof toggles]}
                onCheckedChange={(v) => {
                  setToggles({ ...toggles, [key]: v });
                  toast.success("تنظیم اعلان به‌روزرسانی شد.");
                }}
              />
            </div>
          ))}
        </Card>

        <Card className="gap-3 p-5 lg:col-span-2">
          <p className="font-semibold text-destructive">بازنشانی داده‌های نمایشی</p>
          <p className="text-sm text-muted-foreground">
            همه تغییرات شما در این نسخه نمایشی به حالت اولیه بازمی‌گردد.
          </p>
          <ConfirmDialog
            trigger={<Button variant="outline" className="self-start text-destructive">بازنشانی داده‌ها</Button>}
            title="بازنشانی همه داده‌های نمایشی؟"
            onConfirm={() => { reset(); toast.success("داده‌های نمایشی بازنشانی شد."); }}
          />
        </Card>
      </div>
    </>
  );
}

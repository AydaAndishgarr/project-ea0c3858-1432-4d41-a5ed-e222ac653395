import { createFileRoute } from "@tanstack/react-router";
import { Plus, Wrench } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CURRENT_BUILDING,
  CURRENT_RESIDENT,
  CURRENT_UNIT,
  useActions,
  useApp,
} from "@/store/app-store";
import type { RequestCategory, ServiceRequest } from "@/data/types";

export const Route = createFileRoute("/resident/requests")({
  head: () => ({
    meta: [
      { title: "درخواست خدمات | پنل ساکن" },
      { name: "description", content: "ثبت درخواست تعمیر و خدمات برای واحد و پیگیری وضعیت آن." },
      { property: "og:title", content: "درخواست خدمات ساکن" },
      { property: "og:description", content: "ثبت و پیگیری درخواست‌های تعمیر واحد." },
    ],
  }),
  component: ResidentRequests,
});

const CATEGORIES: RequestCategory[] = ["برق", "لوله‌کشی", "آسانسور", "نظافت", "تأسیسات", "اینترنت", "سایر"];

function ResidentRequests() {
  const { state } = useApp();
  const { addRequest } = useActions();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<ServiceRequest | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "برق" as RequestCategory,
    description: "",
    priority: "متوسط" as ServiceRequest["priority"],
    preferredTime: "",
  });

  const mine = state.requests.filter((r) => r.unitNumber === CURRENT_UNIT);
  const current = detail ? state.requests.find((r) => r.id === detail.id) ?? detail : null;

  return (
    <>
      <PageHeader
        title="درخواست خدمات"
        description="درخواست تعمیر یا خدمات برای واحد خود ثبت کنید"
        breadcrumb={["پنل ساکن", "درخواست خدمات"]}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            درخواست جدید
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="کل درخواست‌ها" value={`${mine.length} مورد`} icon={Wrench} />
        <StatCard title="در جریان" value={`${mine.filter((r) => r.status === "در حال انجام" || r.status === "پذیرفته شده" || r.status === "جدید").length} مورد`} tone="warning" />
        <StatCard title="تکمیل‌شده" value={`${mine.filter((r) => r.status === "تکمیل شده").length} مورد`} tone="success" />
      </div>

      <div className="mt-6">
        {mine.length === 0 ? (
          <EmptyState icon={Wrench} title="درخواستی ثبت نکرده‌اید" action={<Button onClick={() => setOpen(true)}>ثبت درخواست</Button>} />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {mine.map((r) => (
              <Card key={r.id} className="gap-3 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.category} — {r.createdAt}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="line-clamp-2 text-sm leading-7 text-muted-foreground">{r.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <StatusBadge status={r.priority} />
                  <span>ارائه‌دهنده: {r.providerName || "تعیین نشده"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDetail(r)}>پیگیری درخواست</Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ثبت درخواست خدمات</DialogTitle>
            <DialogDescription>درخواست شما برای مدیر ساختمان ارسال می‌شود.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-2 block">عنوان درخواست</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="خرابی کلید برق آشپزخانه" />
            </div>
            <div>
              <Label className="mb-2 block">دسته خدمات</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as RequestCategory })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">اولویت</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as ServiceRequest["priority"] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["کم", "متوسط", "زیاد"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">زمان پیشنهادی</Label>
              <Input value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} placeholder="پنجشنبه ۱۴۰۴/۰۶/۲۰ — عصر" />
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">توضیحات</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.title.trim() || !form.description.trim()) {
                  toast.error("عنوان و توضیحات الزامی است.");
                  return;
                }
                addRequest({
                  ...form,
                  providerId: null,
                  providerName: "",
                  requesterName: CURRENT_RESIDENT,
                  unitNumber: CURRENT_UNIT,
                  buildingName: CURRENT_BUILDING,
                  createdAt: "۱۴۰۴/۰۶/۱۶",
                  status: "جدید",
                  amount: 0,
                  timeline: [{ at: "۱۴۰۴/۰۶/۱۶", label: "درخواست توسط ساکن ثبت شد" }],
                });
                setOpen(false);
                setForm({ title: "", category: "برق", description: "", priority: "متوسط", preferredTime: "" });
                toast.success("درخواست شما ثبت شد و برای مدیر ارسال گردید.");
              }}
            >
              ثبت درخواست
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
            <DialogDescription>روند پیگیری درخواست</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="space-y-4 text-sm">
              <p className="leading-7 text-muted-foreground">{current.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">وضعیت فعلی</span>
                <StatusBadge status={current.status} />
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
            <Button variant="outline" onClick={() => setDetail(null)}>بستن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

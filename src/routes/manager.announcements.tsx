import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActions, useApp } from "@/store/app-store";

export const Route = createFileRoute("/manager/announcements")({
  head: () => ({
    meta: [
      { title: "اطلاعیه‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "انتشار اطلاعیه‌های ساختمان برای همه ساکنان." },
      { property: "og:title", content: "اطلاعیه‌های ساختمان" },
      { property: "og:description", content: "ایجاد و مدیریت اطلاعیه‌های ساکنان." },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { state } = useApp();
  const { addAnnouncement, removeAnnouncement } = useActions();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", pinned: false });

  const list = [...state.announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <PageHeader
        title="اطلاعیه‌ها"
        description="اطلاع‌رسانی به ساکنان ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "اطلاعیه‌ها"]}
        action={
          <Button onClick={() => { setForm({ title: "", body: "", pinned: false }); setOpen(true); }}>
            <Plus className="size-4" />
            اطلاعیه جدید
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState icon={Megaphone} title="اطلاعیه‌ای ثبت نشده است" action={<Button onClick={() => setOpen(true)}>اطلاعیه جدید</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((a) => (
            <Card key={a.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate font-semibold">{a.title}</p>
                {a.pinned && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    <Pin className="size-3" /> سنجاق‌شده
                  </span>
                )}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{a.body}</p>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <p className="truncate text-xs text-muted-foreground">{a.author} — {a.date}</p>
                <ConfirmDialog
                  trigger={<Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive"><Trash2 className="size-4" /></Button>}
                  title={`حذف اطلاعیه «${a.title}»؟`}
                  onConfirm={() => { removeAnnouncement(a.id); toast.success("اطلاعیه حذف شد."); }}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>انتشار اطلاعیه جدید</DialogTitle>
            <DialogDescription>اطلاعیه برای همه ساکنان ساختمان نمایش داده می‌شود.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">عنوان</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="قطعی آب در روز پنجشنبه" />
            </div>
            <div>
              <Label className="mb-2 block">متن اطلاعیه</Label>
              <Textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">سنجاق کردن در بالای فهرست</p>
                <p className="text-xs text-muted-foreground">اطلاعیه‌های مهم را سنجاق کنید.</p>
              </div>
              <Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.title.trim() || !form.body.trim()) { toast.error("عنوان و متن اطلاعیه الزامی است."); return; }
                addAnnouncement({ ...form, date: "۱۴۰۴/۰۶/۱۶", author: "رضا موسوی" });
                setOpen(false);
                toast.success("اطلاعیه منتشر شد.");
              }}
            >
              انتشار
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

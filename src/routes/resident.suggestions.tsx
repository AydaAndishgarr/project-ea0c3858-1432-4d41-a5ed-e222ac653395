import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Plus, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CURRENT_RESIDENT, useActions, useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/resident/suggestions")({
  head: () => ({
    meta: [
      { title: "پیشنهادات | پنل ساکن | خانه یار" },
      { name: "description", content: "ثبت پیشنهاد برای بهبود ساختمان و حمایت از پیشنهاد دیگران." },
    ],
  }),
  component: ResidentSuggestions,
});

function ResidentSuggestions() {
  const { state } = useApp();
  const { addSuggestion, likeSuggestion } = useActions();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <>
      <PageHeader
        title="پیشنهادات"
        description="ایده‌های خود را با مدیر و ساکنان به اشتراک بگذارید"
        breadcrumb={["پنل ساکن", "پیشنهادات"]}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            پیشنهاد جدید
          </Button>
        }
      />

      {state.suggestions.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="پیشنهادی ثبت نشده است"
          action={<Button onClick={() => setOpen(true)}>ثبت پیشنهاد</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.suggestions.map((s) => (
            <Card key={s.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="font-semibold">{s.title}</p>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{s.body}</p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {s.author} — {s.date}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    likeSuggestion(s.id);
                    toast.success("حمایت شما ثبت شد.");
                  }}
                >
                  <ThumbsUp className="size-4" />
                  {faDigits(s.likes)}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ثبت پیشنهاد جدید</DialogTitle>
            <DialogDescription>پیشنهاد شما برای مدیر ساختمان ارسال می‌شود.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">عنوان</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً نصب نیمکت در محوطه" />
            </div>
            <div>
              <Label className="mb-2 block">توضیحات</Label>
              <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!title.trim() || !body.trim()) {
                  toast.error("عنوان و توضیحات الزامی است.");
                  return;
                }
                addSuggestion({
                  title: title.trim(),
                  body: body.trim(),
                  author: CURRENT_RESIDENT,
                  date: "۱۴۰۴/۰۶/۱۶",
                  status: "در حال بررسی",
                  likes: 0,
                });
                setOpen(false);
                setTitle("");
                setBody("");
                toast.success("پیشنهاد شما ثبت شد.");
              }}
            >
              ثبت پیشنهاد
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

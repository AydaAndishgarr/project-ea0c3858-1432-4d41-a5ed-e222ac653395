import { createFileRoute } from "@tanstack/react-router";
import { Plus, Vote, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { faDigits, uid } from "@/lib/format";

export const Route = createFileRoute("/manager/polls")({
  head: () => ({
    meta: [
      { title: "نظرسنجی‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "ایجاد نظرسنجی برای ساکنان و مشاهده نتایج آرا." },
      { property: "og:title", content: "نظرسنجی ساکنان" },
      { property: "og:description", content: "ایجاد و بستن نظرسنجی‌های ساختمان." },
    ],
  }),
  component: PollsPage,
});

function PollsPage() {
  const { state } = useApp();
  const { addPoll, closePoll } = useActions();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);

  return (
    <>
      <PageHeader
        title="نظرسنجی‌ها"
        description="نظر ساکنان را درباره تصمیم‌های ساختمان بپرسید"
        breadcrumb={["پنل مدیر ساختمان", "نظرسنجی‌ها"]}
        action={
          <Button onClick={() => { setQuestion(""); setDescription(""); setOptions(["", ""]); setOpen(true); }}>
            <Plus className="size-4" />
            نظرسنجی جدید
          </Button>
        }
      />

      {state.polls.length === 0 ? (
        <EmptyState icon={Vote} title="نظرسنجی‌ای وجود ندارد" action={<Button onClick={() => setOpen(true)}>نظرسنجی جدید</Button>} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.polls.map((p) => {
            const total = p.options.reduce((a, o) => a + o.votes, 0) || 1;
            return (
              <Card key={p.id} className="gap-3 p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="font-semibold">{p.question}</p>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${p.closed ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
                    {p.closed ? "بسته شده" : "در حال اجرا"}
                  </span>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{p.description}</p>
                <div className="space-y-3">
                  {p.options.map((o) => (
                    <div key={o.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{o.label}</span>
                        <span className="text-muted-foreground">{faDigits(Math.round((o.votes / total) * 100))}٪ ({faDigits(o.votes)} رأی)</span>
                      </div>
                      <Progress value={(o.votes / total) * 100} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate text-xs text-muted-foreground">ایجاد: {p.createdAt} — مجموع {faDigits(total)} رأی</p>
                  {!p.closed && (
                    <Button variant="outline" size="sm" onClick={() => { closePoll(p.id); toast.success("نظرسنجی بسته شد."); }}>
                      بستن نظرسنجی
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ایجاد نظرسنجی جدید</DialogTitle>
            <DialogDescription>حداقل دو گزینه برای رأی‌گیری وارد کنید.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">پرسش</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="آیا با نصب دوربین در پارکینگ موافقید؟" />
            </div>
            <div>
              <Label className="mb-2 block">توضیحات</Label>
              <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>گزینه‌ها</Label>
              {options.map((o, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={o}
                    onChange={(e) => setOptions(options.map((x, j) => (i === j ? e.target.value : x)))}
                    placeholder={`گزینه ${faDigits(i + 1)}`}
                  />
                  {options.length > 2 && (
                    <Button variant="outline" size="icon" aria-label="حذف گزینه" onClick={() => setOptions(options.filter((_, j) => j !== i))}>
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setOptions([...options, ""])}>افزودن گزینه</Button>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                const clean = options.map((o) => o.trim()).filter(Boolean);
                if (!question.trim() || clean.length < 2) { toast.error("پرسش و حداقل دو گزینه الزامی است."); return; }
                addPoll({
                  question,
                  description,
                  createdAt: "۱۴۰۴/۰۶/۱۶",
                  options: clean.map((label) => ({ id: uid("o"), label, votes: 0 })),
                  votedOption: null,
                  closed: false,
                });
                setOpen(false);
                toast.success("نظرسنجی ایجاد شد.");
              }}
            >
              ایجاد نظرسنجی
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

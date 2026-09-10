import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DonutChart } from "@/components/common/Charts";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActions, useApp } from "@/store/app-store";
import type { Expense } from "@/data/types";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/expenses")({
  head: () => ({
    meta: [
      { title: "هزینه‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "ثبت و پیگیری هزینه‌های ساختمان بر اساس دسته‌بندی و وضعیت پرداخت." },
      { property: "og:title", content: "مدیریت هزینه‌ها" },
      { property: "og:description", content: "هزینه‌های جاری ساختمان." },
    ],
  }),
  component: ExpensesPage,
});

const CATEGORIES: Expense["category"][] = ["تعمیرات", "نظافت", "قبوض", "حقوق", "تأسیسات", "سایر"];
const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-muted-foreground)",
];

const blank = {
  title: "",
  category: "تعمیرات" as Expense["category"],
  amount: "",
  date: "۱۴۰۴/۰۶/۱۶",
  description: "",
  status: "پرداخت شده" as Expense["status"],
};

function ExpensesPage() {
  const { state } = useApp();
  const { addExpense, removeExpense } = useActions();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const rows = useMemo(
    () =>
      state.expenses.filter(
        (e) => (category === "all" || e.category === category) && (e.title.includes(search) || e.description.includes(search)),
      ),
    [state.expenses, search, category],
  );

  const total = state.expenses.reduce((a, e) => a + e.amount, 0);
  const pending = state.expenses.filter((e) => e.status === "در انتظار پرداخت").reduce((a, e) => a + e.amount, 0);

  const byCategory = CATEGORIES.map((c, i) => ({
    name: c,
    value: state.expenses.filter((e) => e.category === c).reduce((a, e) => a + e.amount, 0) / 1000000,
    color: COLORS[i],
  })).filter((c) => c.value > 0);

  return (
    <>
      <PageHeader
        title="هزینه‌ها"
        description="هزینه‌های جاری ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "هزینه‌ها"]}
        action={
          <Button onClick={() => { setForm(blank); setOpen(true); }}>
            <Plus className="size-4" />
            ثبت هزینه
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="مجموع هزینه‌ها" value={formatCompactToman(total)} icon={Wallet} />
        <StatCard title="در انتظار پرداخت" value={formatCompactToman(pending)} tone="warning" />
        <StatCard title="تعداد اقلام" value={`${state.expenses.length} مورد`} tone="info" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="mb-4 font-semibold">سهم دسته‌بندی‌ها (میلیون تومان)</p>
          {byCategory.length === 0 ? <EmptyState title="هزینه‌ای ثبت نشده است" /> : <DonutChart data={byCategory} />}
        </Card>

        <div className="lg:col-span-2">
          <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی عنوان هزینه...">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar>

          {rows.length === 0 ? (
            <EmptyState icon={Wallet} title="هزینه‌ای یافت نشد" action={<Button onClick={() => setOpen(true)}>ثبت هزینه</Button>} />
          ) : (
            <>
              <Card className="hidden overflow-hidden p-0 md:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">عنوان</TableHead>
                        <TableHead className="text-right">دسته</TableHead>
                        <TableHead className="text-right">مبلغ</TableHead>
                        <TableHead className="text-right">تاریخ</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-right">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.title}</TableCell>
                          <TableCell>{e.category}</TableCell>
                          <TableCell>{formatToman(e.amount)}</TableCell>
                          <TableCell>{e.date}</TableCell>
                          <TableCell><StatusBadge status={e.status} /></TableCell>
                          <TableCell>
                            <ConfirmDialog
                              trigger={<Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive"><Trash2 className="size-4" /></Button>}
                              title={`حذف هزینه «${e.title}»؟`}
                              onConfirm={() => { removeExpense(e.id); toast.success("هزینه حذف شد."); }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              <div className="space-y-3 md:hidden">
                {rows.map((e) => (
                  <Card key={e.id} className="gap-2 p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                      <p className="truncate font-medium">{e.title}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{e.category} — {e.date}</p>
                    <p className="text-sm font-medium">{formatToman(e.amount)}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{e.description}</p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ثبت هزینه جدید</DialogTitle>
            <DialogDescription>هزینه‌های ساختمان را برای گزارش‌های مالی ثبت کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="mb-2 block">عنوان هزینه</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="تعمیر پمپ آب" />
            </div>
            <div>
              <Label className="mb-2 block">دسته‌بندی</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Expense["category"] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">مبلغ (تومان)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2 block">تاریخ</Label>
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2 block">وضعیت</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Expense["status"] })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="پرداخت شده">پرداخت شده</SelectItem>
                  <SelectItem value="در انتظار پرداخت">در انتظار پرداخت</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-2 block">توضیحات</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.title.trim() || !form.amount) { toast.error("عنوان و مبلغ الزامی است."); return; }
                addExpense({ ...form, amount: Number(form.amount) });
                setOpen(false);
                toast.success("هزینه با موفقیت ثبت شد.");
              }}
            >
              ثبت هزینه
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

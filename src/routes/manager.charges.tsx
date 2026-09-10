import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Receipt, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActions, useApp } from "@/store/app-store";
import type { Charge } from "@/data/types";
import { formatCompactToman, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/charges")({
  head: () => ({
    meta: [
      { title: "شارژ ساختمان | پنل مدیر ساختمان" },
      { name: "description", content: "صدور و مدیریت شارژ واحدها با وضعیت پرداخت و سررسید." },
      { property: "og:title", content: "شارژ ساختمان" },
      { property: "og:description", content: "مدیریت شارژهای صادرشده برای واحدها." },
    ],
  }),
  component: ChargesPage,
});

const blank = {
  title: "",
  type: "شارژ ثابت" as Charge["type"],
  unitNumber: "",
  amount: "",
  dueDate: "۱۴۰۴/۰۶/۳۰",
  status: "پرداخت نشده" as Charge["status"],
};

function ChargesPage() {
  const { state } = useApp();
  const { addCharge, updateCharge, removeCharge } = useActions();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [type, setType] = useState("all");
  const [form, setForm] = useState(blank);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Charge | null>(null);
  const [detail, setDetail] = useState<Charge | null>(null);

  const rows = useMemo(
    () =>
      state.charges.filter(
        (c) =>
          (tab === "all" || c.status === tab) &&
          (type === "all" || c.type === type) &&
          (c.title.includes(search) || c.unitNumber.includes(search) || c.residentName.includes(search)),
      ),
    [state.charges, search, tab, type],
  );

  const total = state.charges.reduce((a, c) => a + c.amount, 0);
  const unpaid = state.charges.filter((c) => c.status !== "پرداخت شده").reduce((a, c) => a + c.amount, 0);
  const overdue = state.charges.filter((c) => c.status === "سررسید گذشته").length;

  const ChargeForm = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label className="mb-2 block">عنوان شارژ</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="شارژ ماهانه مهر" />
      </div>
      <div>
        <Label className="mb-2 block">نوع</Label>
        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Charge["type"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["شارژ ثابت", "شارژ متغیر", "هزینه تعمیرات", "هزینه خدمات", "سایر هزینه‌ها"].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">واحد</Label>
        <Select value={form.unitNumber} onValueChange={(v) => setForm({ ...form, unitNumber: v })}>
          <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب واحد" /></SelectTrigger>
          <SelectContent>
            {state.units.map((u) => (
              <SelectItem key={u.id} value={u.number}>واحد {u.number}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">مبلغ (تومان)</Label>
        <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1450000" />
      </div>
      <div>
        <Label className="mb-2 block">سررسید</Label>
        <Input value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} placeholder="۱۴۰۴/۰۷/۱۵" />
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block">وضعیت</Label>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Charge["status"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["پرداخت نشده", "پرداخت شده", "سررسید گذشته"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const residentOfUnit = (unit: string) =>
    state.residents.find((r) => r.unitNumber === unit)?.name ?? "ساکن واحد";

  return (
    <>
      <PageHeader
        title="شارژ ساختمان"
        description="صدور و پیگیری شارژ واحدها"
        breadcrumb={["پنل مدیر ساختمان", "شارژ ساختمان"]}
        action={
          <Button onClick={() => { setForm(blank); setAddOpen(true); }}>
            <Plus className="size-4" />
            ایجاد شارژ
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="مجموع شارژ صادرشده" value={formatCompactToman(total)} icon={Receipt} />
        <StatCard title="مبلغ وصول‌نشده" value={formatCompactToman(unpaid)} tone="warning" />
        <StatCard title="سررسید گذشته" value={`${overdue} مورد`} tone="danger" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6 mb-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="پرداخت شده">پرداخت شده</TabsTrigger>
          <TabsTrigger value="پرداخت نشده">پرداخت نشده</TabsTrigger>
          <TabsTrigger value="سررسید گذشته">سررسید گذشته</TabsTrigger>
        </TabsList>
      </Tabs>

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی عنوان، واحد یا ساکن...">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع شارژ</SelectItem>
            {["شارژ ثابت", "شارژ متغیر", "هزینه تعمیرات", "هزینه خدمات", "سایر هزینه‌ها"].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Receipt} title="شارژی یافت نشد" description="برای شروع یک شارژ جدید ایجاد کنید." action={<Button onClick={() => setAddOpen(true)}>ایجاد شارژ</Button>} />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">عنوان</TableHead>
                    <TableHead className="text-right">نوع</TableHead>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">ساکن</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">سررسید</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell>{c.type}</TableCell>
                      <TableCell>{c.unitNumber}</TableCell>
                      <TableCell>{c.residentName}</TableCell>
                      <TableCell>{formatToman(c.amount)}</TableCell>
                      <TableCell>{c.dueDate}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" aria-label="جزئیات" onClick={() => setDetail(c)}><Eye className="size-4" /></Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ویرایش"
                            onClick={() => {
                              setEditing(c);
                              setForm({ title: c.title, type: c.type, unitNumber: c.unitNumber, amount: String(c.amount), dueDate: c.dueDate, status: c.status });
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={<Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive"><Trash2 className="size-4" /></Button>}
                            title={`حذف شارژ «${c.title}»؟`}
                            onConfirm={() => { removeCharge(c.id); toast.success("شارژ حذف شد."); }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {rows.map((c) => (
              <Card key={c.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-medium">{c.title}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm text-muted-foreground">واحد {c.unitNumber} — {c.residentName}</p>
                <p className="text-sm font-medium">{formatToman(c.amount)}</p>
                <p className="text-xs text-muted-foreground">سررسید: {c.dueDate}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetail(c)}>جزئیات</Button>
                  <ConfirmDialog
                    trigger={<Button variant="outline" size="sm" className="text-destructive">حذف</Button>}
                    title={`حذف شارژ «${c.title}»؟`}
                    onConfirm={() => { removeCharge(c.id); toast.success("شارژ حذف شد."); }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ایجاد شارژ جدید</DialogTitle>
            <DialogDescription>شارژ برای واحد انتخابی صادر می‌شود.</DialogDescription>
          </DialogHeader>
          {ChargeForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.title.trim() || !form.unitNumber || !form.amount) {
                  toast.error("عنوان، واحد و مبلغ الزامی است.");
                  return;
                }
                addCharge({
                  title: form.title,
                  type: form.type,
                  unitNumber: form.unitNumber,
                  residentName: residentOfUnit(form.unitNumber),
                  amount: Number(form.amount),
                  createdAt: "۱۴۰۴/۰۶/۱۶",
                  dueDate: form.dueDate,
                  status: form.status,
                });
                setAddOpen(false);
                toast.success("شارژ جدید با موفقیت صادر شد.");
              }}
            >
              صدور شارژ
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ویرایش شارژ</DialogTitle>
            <DialogDescription>اطلاعات شارژ را تغییر دهید.</DialogDescription>
          </DialogHeader>
          {ChargeForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editing)
                  updateCharge(editing.id, {
                    title: form.title,
                    type: form.type,
                    unitNumber: form.unitNumber,
                    amount: Number(form.amount) || editing.amount,
                    dueDate: form.dueDate,
                    status: form.status,
                  });
                setEditing(null);
                toast.success("تغییرات شارژ ذخیره شد.");
              }}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>جزئیات شارژ</DialogTitle>
            <DialogDescription>{detail?.title}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              {[
                ["نوع", detail.type],
                ["واحد", detail.unitNumber],
                ["ساکن", detail.residentName],
                ["مبلغ", formatToman(detail.amount)],
                ["تاریخ ایجاد", detail.createdAt],
                ["سررسید", detail.dueDate],
                ["وضعیت", detail.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

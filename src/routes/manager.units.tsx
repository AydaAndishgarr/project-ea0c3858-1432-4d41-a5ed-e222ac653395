import { createFileRoute } from "@tanstack/react-router";
import { Home, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActions, useApp } from "@/store/app-store";
import type { Unit } from "@/data/types";
import { faDigits, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/manager/units")({
  head: () => ({
    meta: [
      { title: "واحدها | پنل مدیر ساختمان" },
      { name: "description", content: "مدیریت واحدهای ساختمان، مالک، مستأجر و وضعیت پرداخت هر واحد." },
      { property: "og:title", content: "مدیریت واحدها" },
      { property: "og:description", content: "فهرست واحدهای ساختمان." },
    ],
  }),
  component: UnitsPage,
});

const blank = {
  number: "",
  floor: "",
  area: "",
  peopleCount: "",
  ownerId: "none",
  tenantId: "none",
  status: "سکونت" as Unit["status"],
  paymentStatus: "تسویه" as Unit["paymentStatus"],
};

function UnitsPage() {
  const { state } = useApp();
  const { addUnit, updateUnit, removeUnit } = useActions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("floor");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [detail, setDetail] = useState<Unit | null>(null);

  const nameOf = (id: string | null) => state.residents.find((r) => r.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    const list = state.units.filter(
      (u) =>
        (filter === "all" || u.paymentStatus === filter || u.status === filter) &&
        (u.number.includes(search) || nameOf(u.ownerId).includes(search) || nameOf(u.tenantId).includes(search)),
    );
    return [...list].sort((a, b) => (sort === "floor" ? a.floor - b.floor : b.area - a.area));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.units, state.residents, search, filter, sort]);

  const openEdit = (u: Unit) => {
    setEditing(u);
    setForm({
      number: u.number,
      floor: String(u.floor),
      area: String(u.area),
      peopleCount: String(u.peopleCount),
      ownerId: u.ownerId ?? "none",
      tenantId: u.tenantId ?? "none",
      status: u.status,
      paymentStatus: u.paymentStatus,
    });
  };

  const payload = () => ({
    number: form.number,
    floor: Number(form.floor) || 0,
    area: Number(form.area) || 0,
    peopleCount: Number(form.peopleCount) || 0,
    ownerId: form.ownerId === "none" ? null : form.ownerId,
    tenantId: form.tenantId === "none" ? null : form.tenantId,
    status: form.status,
    paymentStatus: form.paymentStatus,
  });

  const UnitForm = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label className="mb-2 block">شماره واحد</Label>
        <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="۶۰۲" />
      </div>
      <div>
        <Label className="mb-2 block">طبقه</Label>
        <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
      </div>
      <div>
        <Label className="mb-2 block">متراژ (متر مربع)</Label>
        <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
      </div>
      <div>
        <Label className="mb-2 block">تعداد ساکنان</Label>
        <Input type="number" value={form.peopleCount} onChange={(e) => setForm({ ...form, peopleCount: e.target.value })} />
      </div>
      <div>
        <Label className="mb-2 block">مالک</Label>
        <Select value={form.ownerId} onValueChange={(v) => setForm({ ...form, ownerId: v })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">تعیین نشده</SelectItem>
            {state.residents.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">مستأجر</Label>
        <Select value={form.tenantId} onValueChange={(v) => setForm({ ...form, tenantId: v })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">ندارد</SelectItem>
            {state.residents.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">وضعیت واحد</Label>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Unit["status"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["سکونت", "خالی", "در حال بازسازی"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">وضعیت پرداخت</Label>
        <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as Unit["paymentStatus"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="تسویه">تسویه</SelectItem>
            <SelectItem value="بدهکار">بدهکار</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="واحدها"
        description="مدیریت واحدهای ساختمان و اطلاعات ساکنان هر واحد"
        breadcrumb={["پنل مدیر ساختمان", "واحدها"]}
        action={
          <Button onClick={() => { setForm(blank); setAddOpen(true); }}>
            <Plus className="size-4" />
            افزودن واحد
          </Button>
        }
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی شماره واحد یا نام ساکن...">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه واحدها</SelectItem>
            <SelectItem value="بدهکار">بدهکار</SelectItem>
            <SelectItem value="تسویه">تسویه‌شده</SelectItem>
            <SelectItem value="خالی">خالی</SelectItem>
            <SelectItem value="در حال بازسازی">در حال بازسازی</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="floor">مرتب‌سازی بر اساس طبقه</SelectItem>
            <SelectItem value="area">مرتب‌سازی بر اساس متراژ</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Home} title="واحدی یافت نشد" description="می‌توانید واحد جدیدی اضافه کنید." action={<Button onClick={() => setAddOpen(true)}>افزودن واحد</Button>} />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">طبقه</TableHead>
                    <TableHead className="text-right">متراژ</TableHead>
                    <TableHead className="text-right">مالک</TableHead>
                    <TableHead className="text-right">مستأجر</TableHead>
                    <TableHead className="text-right">ساکنان</TableHead>
                    <TableHead className="text-right">پرداخت</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.number}</TableCell>
                      <TableCell>{faDigits(u.floor)}</TableCell>
                      <TableCell>{formatNumber(u.area)} م²</TableCell>
                      <TableCell>{nameOf(u.ownerId)}</TableCell>
                      <TableCell>{nameOf(u.tenantId)}</TableCell>
                      <TableCell>{faDigits(u.peopleCount)}</TableCell>
                      <TableCell><StatusBadge status={u.paymentStatus} /></TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setDetail(u)}>جزئیات</Button>
                          <Button variant="ghost" size="icon" aria-label="ویرایش" onClick={() => openEdit(u)}>
                            <Pencil className="size-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={<Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive"><Trash2 className="size-4" /></Button>}
                            title={`حذف واحد ${u.number}؟`}
                            onConfirm={() => { removeUnit(u.id); toast.success("واحد حذف شد."); }}
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
            {rows.map((u) => (
              <Card key={u.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="font-medium">واحد {u.number} — طبقه {faDigits(u.floor)}</p>
                  <StatusBadge status={u.paymentStatus} />
                </div>
                <p className="text-sm text-muted-foreground">مالک: {nameOf(u.ownerId)}</p>
                <p className="text-sm text-muted-foreground">مستأجر: {nameOf(u.tenantId)}</p>
                <p className="text-sm text-muted-foreground">{formatNumber(u.area)} متر مربع — {faDigits(u.peopleCount)} ساکن</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetail(u)}>جزئیات</Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(u)}>ویرایش</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>افزودن واحد</DialogTitle>
            <DialogDescription>اطلاعات واحد جدید را وارد کنید.</DialogDescription>
          </DialogHeader>
          {UnitForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.number.trim()) { toast.error("شماره واحد الزامی است."); return; }
                addUnit(payload());
                setAddOpen(false);
                toast.success("واحد جدید اضافه شد.");
              }}
            >
              ثبت واحد
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ویرایش واحد {editing?.number}</DialogTitle>
            <DialogDescription>اطلاعات واحد و اختصاص مالک یا مستأجر</DialogDescription>
          </DialogHeader>
          {UnitForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editing) updateUnit(editing.id, payload());
                setEditing(null);
                toast.success("تغییرات واحد ذخیره شد.");
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
            <DialogTitle>جزئیات واحد {detail?.number}</DialogTitle>
            <DialogDescription>اطلاعات کامل واحد</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              {[
                ["شماره واحد", detail.number],
                ["طبقه", faDigits(detail.floor)],
                ["متراژ", `${formatNumber(detail.area)} متر مربع`],
                ["مالک", nameOf(detail.ownerId)],
                ["مستأجر", nameOf(detail.tenantId)],
                ["تعداد ساکنان", faDigits(detail.peopleCount)],
                ["وضعیت پرداخت", detail.paymentStatus],
                ["وضعیت واحد", detail.status],
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

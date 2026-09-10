import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { SimplePagination } from "@/components/common/Pagination";
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
import type { Resident } from "@/data/types";
import { faDigits, formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/residents")({
  head: () => ({
    meta: [
      { title: "ساکنان | پنل مدیر ساختمان" },
      { name: "description", content: "فهرست ساکنان ساختمان با شماره تماس، واحد و میزان بدهی." },
      { property: "og:title", content: "مدیریت ساکنان" },
      { property: "og:description", content: "ثبت و ویرایش ساکنان ساختمان." },
    ],
  }),
  component: ResidentsPage,
});

const blank = {
  name: "",
  phone: "",
  type: "مالک ساکن" as Resident["type"],
  unitNumber: "",
  status: "فعال" as Resident["status"],
  debt: "",
};

function ResidentsPage() {
  const { state } = useApp();
  const { addResident, updateResident, removeResident } = useActions();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(blank);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Resident | null>(null);

  const perPage = 6;
  const filtered = useMemo(() => {
    const list = state.residents.filter(
      (r) =>
        (type === "all" || r.type === type) &&
        (r.name.includes(search) || r.phone.includes(search) || r.unitNumber.includes(search)),
    );
    return [...list].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name, "fa") : b.debt - a.debt));
  }, [state.residents, search, type, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const ResidentForm = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label className="mb-2 block">نام و نام خانوادگی</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <Label className="mb-2 block">شماره تماس</Label>
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="۰۹۱۲..." />
      </div>
      <div>
        <Label className="mb-2 block">نوع کاربر</Label>
        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Resident["type"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["مالک", "مستأجر", "مالک ساکن"].map((t) => (
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
        <Label className="mb-2 block">بدهی (تومان)</Label>
        <Input type="number" value={form.debt} onChange={(e) => setForm({ ...form, debt: e.target.value })} placeholder="0" />
      </div>
      <div>
        <Label className="mb-2 block">وضعیت</Label>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Resident["status"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="فعال">فعال</SelectItem>
            <SelectItem value="غیرفعال">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        title="ساکنان"
        description="فهرست ساکنان و بدهی هر نفر"
        breadcrumb={["پنل مدیر ساختمان", "ساکنان"]}
        action={
          <Button onClick={() => { setForm(blank); setAddOpen(true); }}>
            <Plus className="size-4" />
            افزودن ساکن
          </Button>
        }
      />

      <Toolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="جست‌وجوی نام، تلفن یا واحد...">
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="مالک">مالک</SelectItem>
            <SelectItem value="مستأجر">مستأجر</SelectItem>
            <SelectItem value="مالک ساکن">مالک ساکن</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">مرتب‌سازی بر اساس نام</SelectItem>
            <SelectItem value="debt">مرتب‌سازی بر اساس بدهی</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="ساکنی یافت نشد" description="می‌توانید ساکن جدیدی ثبت کنید." action={<Button onClick={() => setAddOpen(true)}>افزودن ساکن</Button>} />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام</TableHead>
                    <TableHead className="text-right">شماره تماس</TableHead>
                    <TableHead className="text-right">نوع کاربر</TableHead>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">بدهی</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.phone}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.unitNumber}</TableCell>
                      <TableCell className={r.debt > 0 ? "text-destructive" : "text-success"}>
                        {r.debt > 0 ? formatToman(r.debt) : "بدون بدهی"}
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ویرایش"
                            onClick={() => {
                              setEditing(r);
                              setForm({
                                name: r.name,
                                phone: r.phone,
                                type: r.type,
                                unitNumber: r.unitNumber,
                                status: r.status,
                                debt: String(r.debt),
                              });
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={<Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive"><Trash2 className="size-4" /></Button>}
                            title={`حذف ${r.name}؟`}
                            onConfirm={() => { removeResident(r.id); toast.success("ساکن حذف شد."); }}
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
            {rows.map((r) => (
              <Card key={r.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-medium">{r.name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-sm text-muted-foreground">{r.type} — واحد {r.unitNumber}</p>
                <p className="text-sm text-muted-foreground">{r.phone}</p>
                <p className={`text-sm ${r.debt > 0 ? "text-destructive" : "text-success"}`}>
                  {r.debt > 0 ? `بدهی: ${formatToman(r.debt)}` : "بدون بدهی"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(r);
                    setForm({ name: r.name, phone: r.phone, type: r.type, unitNumber: r.unitNumber, status: r.status, debt: String(r.debt) });
                  }}
                >
                  ویرایش
                </Button>
              </Card>
            ))}
          </div>

          <SimplePagination page={page} pageCount={pageCount} onChange={setPage} />
          <p className="mt-3 text-center text-xs text-muted-foreground">مجموع {faDigits(filtered.length)} ساکن</p>
        </>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>افزودن ساکن</DialogTitle>
            <DialogDescription>اطلاعات ساکن جدید را وارد کنید.</DialogDescription>
          </DialogHeader>
          {ResidentForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.unitNumber) { toast.error("نام و واحد الزامی است."); return; }
                addResident({ ...form, debt: Number(form.debt) || 0 });
                setAddOpen(false);
                toast.success("ساکن جدید ثبت شد.");
              }}
            >
              ثبت ساکن
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ویرایش ساکن</DialogTitle>
            <DialogDescription>اطلاعات ساکن را به‌روزرسانی کنید.</DialogDescription>
          </DialogHeader>
          {ResidentForm}
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (editing) updateResident(editing.id, { ...form, debt: Number(form.debt) || 0 });
                setEditing(null);
                toast.success("اطلاعات ساکن ذخیره شد.");
              }}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

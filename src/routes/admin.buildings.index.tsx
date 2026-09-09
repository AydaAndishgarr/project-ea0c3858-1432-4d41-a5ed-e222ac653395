import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Eye, Pencil, Plus, Trash2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActions, useApp } from "@/store/app-store";
import type { Building } from "@/data/types";
import { faDigits, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/admin/buildings/")({
  head: () => ({
    meta: [
      { title: "ساختمان‌ها | پنل مدیر کل" },
      { name: "description", content: "فهرست ساختمان‌های ثبت‌شده در سامانه با امکان افزودن و ویرایش." },
      { property: "og:title", content: "مدیریت ساختمان‌ها" },
      { property: "og:description", content: "فهرست و مدیریت ساختمان‌های سامانه." },
    ],
  }),
  component: BuildingsPage,
});

const emptyForm = {
  name: "",
  address: "",
  units: "",
  residents: "",
  type: "مسکونی" as Building["type"],
  status: "فعال" as Building["status"],
  plan: "پایه" as Building["plan"],
};

function BuildingForm({
  value,
  onChange,
}: {
  value: typeof emptyForm;
  onChange: (v: typeof emptyForm) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label className="mb-2 block">نام ساختمان</Label>
        <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="مثلاً برج نگین سعادت" />
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block">آدرس</Label>
        <Input value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} placeholder="شهر، خیابان، پلاک" />
      </div>
      <div>
        <Label className="mb-2 block">تعداد واحدها</Label>
        <Input type="number" value={value.units} onChange={(e) => onChange({ ...value, units: e.target.value })} placeholder="۲۴" />
      </div>
      <div>
        <Label className="mb-2 block">تعداد ساکنان</Label>
        <Input type="number" value={value.residents} onChange={(e) => onChange({ ...value, residents: e.target.value })} placeholder="۶۰" />
      </div>
      <div>
        <Label className="mb-2 block">نوع ساختمان</Label>
        <Select value={value.type} onValueChange={(v) => onChange({ ...value, type: v as Building["type"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["مسکونی", "اداری", "تجاری", "مسکونی-تجاری"].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-2 block">وضعیت</Label>
        <Select value={value.status} onValueChange={(v) => onChange({ ...value, status: v as Building["status"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="فعال">فعال</SelectItem>
            <SelectItem value="غیرفعال">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Label className="mb-2 block">نوع اشتراک</Label>
        <Select value={value.plan} onValueChange={(v) => onChange({ ...value, plan: v as Building["plan"] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["پایه", "حرفه‌ای", "سازمانی"].map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function BuildingsPage() {
  const { state } = useApp();
  const { addBuilding, updateBuilding, removeBuilding } = useActions();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Building | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const perPage = 5;
  const filtered = useMemo(
    () =>
      state.buildings.filter(
        (b) =>
          (status === "all" || b.status === status) &&
          (b.name.includes(search) || b.address.includes(search)),
      ),
    [state.buildings, search, status],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const managerName = (id: string) => state.managers.find((m) => m.id === id)?.name ?? "تعیین نشده";

  const submitAdd = () => {
    if (!form.name.trim() || !form.address.trim()) {
      toast.error("نام و آدرس ساختمان الزامی است.");
      return;
    }
    addBuilding({
      name: form.name,
      address: form.address,
      units: Number(form.units) || 0,
      residents: Number(form.residents) || 0,
      managerId: "m1",
      status: form.status,
      createdAt: "۱۴۰۴/۰۶/۱۶",
      type: form.type,
      plan: form.plan,
    });
    setForm(emptyForm);
    setAddOpen(false);
    toast.success("ساختمان جدید با موفقیت ثبت شد.");
  };

  const submitEdit = () => {
    if (!editing) return;
    updateBuilding(editing.id, {
      name: editForm.name,
      address: editForm.address,
      units: Number(editForm.units) || 0,
      residents: Number(editForm.residents) || 0,
      status: editForm.status,
      type: editForm.type,
      plan: editForm.plan,
    });
    setEditing(null);
    toast.success("تغییرات ساختمان ذخیره شد.");
  };

  return (
    <>
      <PageHeader
        title="ساختمان‌ها"
        description="فهرست ساختمان‌های ثبت‌شده در سامانه"
        breadcrumb={["پنل مدیر کل", "ساختمان‌ها"]}
        action={
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                افزودن ساختمان
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>افزودن ساختمان جدید</DialogTitle>
                <DialogDescription>اطلاعات پایه ساختمان را وارد کنید.</DialogDescription>
              </DialogHeader>
              <BuildingForm value={form} onChange={setForm} />
              <DialogFooter className="gap-2 sm:justify-start">
                <Button onClick={submitAdd}>ثبت ساختمان</Button>
                <Button variant="outline" onClick={() => setAddOpen(false)}>انصراف</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Toolbar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="جست‌وجوی نام یا آدرس ساختمان...">
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="وضعیت" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="فعال">فعال</SelectItem>
            <SelectItem value="غیرفعال">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="ساختمانی یافت نشد" description="عبارت جست‌وجو یا فیلترها را تغییر دهید." />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام ساختمان</TableHead>
                    <TableHead className="text-right">آدرس</TableHead>
                    <TableHead className="text-right">واحد</TableHead>
                    <TableHead className="text-right">ساکن</TableHead>
                    <TableHead className="text-right">مدیر</TableHead>
                    <TableHead className="text-right">نوع</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="max-w-56 truncate text-muted-foreground">{b.address}</TableCell>
                      <TableCell>{formatNumber(b.units)}</TableCell>
                      <TableCell>{formatNumber(b.residents)}</TableCell>
                      <TableCell>{managerName(b.managerId)}</TableCell>
                      <TableCell>{b.type}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild aria-label="مشاهده">
                            <Link to="/admin/buildings/$id" params={{ id: b.id }}><Eye className="size-4" /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="ویرایش"
                            onClick={() => {
                              setEditing(b);
                              setEditForm({
                                name: b.name,
                                address: b.address,
                                units: String(b.units),
                                residents: String(b.residents),
                                type: b.type,
                                status: b.status,
                                plan: b.plan,
                              });
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon" aria-label="حذف" className="text-destructive">
                                <Trash2 className="size-4" />
                              </Button>
                            }
                            title={`حذف ${b.name}؟`}
                            description="با حذف ساختمان، اطلاعات آن از فهرست نمایشی حذف می‌شود."
                            onConfirm={() => {
                              removeBuilding(b.id);
                              toast.success("ساختمان حذف شد.");
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((b) => (
              <Card key={b.id} className="gap-3 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate font-medium">{b.name}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-muted-foreground">{b.address}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">واحد: {formatNumber(b.units)}</span>
                  <span className="text-muted-foreground">ساکن: {formatNumber(b.residents)}</span>
                  <span className="text-muted-foreground">نوع: {b.type}</span>
                  <span className="text-muted-foreground">مدیر: {managerName(b.managerId)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link to="/admin/buildings/$id" params={{ id: b.id }}>جزئیات</Link>
                  </Button>
                  <ConfirmDialog
                    trigger={<Button variant="outline" size="sm" className="text-destructive">حذف</Button>}
                    title={`حذف ${b.name}؟`}
                    onConfirm={() => {
                      removeBuilding(b.id);
                      toast.success("ساختمان حذف شد.");
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>

          <SimplePagination page={page} pageCount={pageCount} onChange={setPage} />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            مجموع {faDigits(filtered.length)} ساختمان
          </p>
        </>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ویرایش ساختمان</DialogTitle>
            <DialogDescription>اطلاعات ساختمان را به‌روزرسانی کنید.</DialogDescription>
          </DialogHeader>
          <BuildingForm value={editForm} onChange={setEditForm} />
          <DialogFooter className="gap-2 sm:justify-start">
            <Button onClick={submitEdit}>ذخیره تغییرات</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

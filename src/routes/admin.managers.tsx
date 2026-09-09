import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Power, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
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
import { useActions, useApp } from "@/store/app-store";
import type { Manager } from "@/data/types";

export const Route = createFileRoute("/admin/managers")({
  head: () => ({
    meta: [
      { title: "مدیران ساختمان | پنل مدیر کل" },
      { name: "description", content: "فهرست مدیران ساختمان، اطلاعات تماس و وضعیت فعالیت آن‌ها." },
      { property: "og:title", content: "مدیران ساختمان" },
      { property: "og:description", content: "مدیریت مدیران ساختمان در سامانه." },
    ],
  }),
  component: ManagersPage,
});

function ManagersPage() {
  const { state } = useApp();
  const { updateManager } = useActions();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<Manager | null>(null);
  const [edit, setEdit] = useState<Manager | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const buildingName = (id: string) => state.buildings.find((b) => b.id === id)?.name ?? "بدون ساختمان";

  const list = useMemo(
    () =>
      state.managers.filter(
        (m) =>
          (status === "all" || m.status === status) &&
          (m.name.includes(search) || m.phone.includes(search) || buildingName(m.buildingId).includes(search)),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.managers, state.buildings, search, status],
  );

  return (
    <>
      <PageHeader
        title="مدیران ساختمان"
        description="مشاهده و مدیریت مدیران ثبت‌شده در سامانه"
        breadcrumb={["پنل مدیر کل", "مدیران ساختمان"]}
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی نام، تلفن یا ساختمان...">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="فعال">فعال</SelectItem>
            <SelectItem value="غیرفعال">غیرفعال</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {list.length === 0 ? (
        <EmptyState icon={UserCog} title="مدیری یافت نشد" description="جست‌وجو یا فیلتر را تغییر دهید." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <Card key={m.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                    {m.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{buildingName(m.buildingId)}</p>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="size-4" />{m.phone}</p>
                <p className="flex items-center gap-2"><Mail className="size-4" />{m.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setView(m)}>مشاهده</Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEdit(m);
                    setForm({ name: m.name, phone: m.phone, email: m.email });
                  }}
                >
                  ویرایش
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateManager(m.id, { status: m.status === "فعال" ? "غیرفعال" : "فعال" });
                    toast.success("وضعیت مدیر تغییر کرد.");
                  }}
                >
                  <Power className="size-4" />
                  {m.status === "فعال" ? "غیرفعال" : "فعال"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>پروفایل مدیر</DialogTitle>
            <DialogDescription>اطلاعات کامل مدیر ساختمان</DialogDescription>
          </DialogHeader>
          {view && (
            <div className="space-y-2 text-sm">
              {[
                ["نام", view.name],
                ["شماره تماس", view.phone],
                ["ایمیل", view.email],
                ["ساختمان", buildingName(view.buildingId)],
                ["تاریخ همکاری", view.joinedAt],
                ["وضعیت", view.status],
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

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>ویرایش مدیر</DialogTitle>
            <DialogDescription>اطلاعات تماس مدیر را به‌روز کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label className="mb-2 block">نام</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2 block">شماره تماس</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label className="mb-2 block">ایمیل</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              onClick={() => {
                if (edit) updateManager(edit.id, form);
                setEdit(null);
                toast.success("اطلاعات مدیر ذخیره شد.");
              }}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={() => setEdit(null)}>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

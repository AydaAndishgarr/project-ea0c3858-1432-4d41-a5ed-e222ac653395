import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useActions, useApp } from "@/store/app-store";
import type { ServiceRequest } from "@/data/types";
import { formatToman } from "@/lib/format";

export const Route = createFileRoute("/manager/requests")({
  head: () => ({
    meta: [
      { title: "درخواست‌های خدمات | پنل مدیر ساختمان" },
      { name: "description", content: "پیگیری درخواست‌های تعمیر و خدمات ساکنان و تخصیص به ارائه‌دهنده." },
      { property: "og:title", content: "درخواست‌های خدمات" },
      { property: "og:description", content: "مدیریت درخواست‌های خدمات ساختمان." },
    ],
  }),
  component: RequestsPage,
});

const NEXT: Record<string, { status: ServiceRequest["status"]; label: string }[]> = {
  "جدید": [
    { status: "پذیرفته شده", label: "درخواست توسط مدیر پذیرفته شد" },
    { status: "لغو شده", label: "درخواست لغو شد" },
  ],
  "پذیرفته شده": [
    { status: "در حال انجام", label: "کار توسط ارائه‌دهنده آغاز شد" },
    { status: "لغو شده", label: "درخواست لغو شد" },
  ],
  "در حال انجام": [{ status: "تکمیل شده", label: "کار با موفقیت انجام شد" }],
  "تکمیل شده": [],
  "لغو شده": [],
};

function RequestsPage() {
  const { state } = useApp();
  const { setRequestStatus } = useActions();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [priority, setPriority] = useState("all");
  const [detail, setDetail] = useState<ServiceRequest | null>(null);

  const rows = useMemo(
    () =>
      state.requests.filter(
        (r) =>
          (tab === "all" || r.status === tab) &&
          (priority === "all" || r.priority === priority) &&
          (r.title.includes(search) || r.unitNumber.includes(search) || r.requesterName.includes(search)),
      ),
    [state.requests, search, tab, priority],
  );

  const open = state.requests.filter((r) => r.status !== "تکمیل شده" && r.status !== "لغو شده").length;
  const done = state.requests.filter((r) => r.status === "تکمیل شده").length;
  const current = detail ? state.requests.find((r) => r.id === detail.id) ?? detail : null;

  return (
    <>
      <PageHeader
        title="درخواست‌های خدمات"
        description="پیگیری و مدیریت درخواست‌های ساکنان"
        breadcrumb={["پنل مدیر ساختمان", "درخواست‌های خدمات"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="کل درخواست‌ها" value={`${state.requests.length} مورد`} icon={Wrench} />
        <StatCard title="در جریان" value={`${open} مورد`} tone="warning" />
        <StatCard title="تکمیل‌شده" value={`${done} مورد`} tone="success" />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6 mb-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">همه</TabsTrigger>
          {["جدید", "پذیرفته شده", "در حال انجام", "تکمیل شده", "لغو شده"].map((s) => (
            <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی عنوان، واحد یا ساکن...">
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اولویت‌ها</SelectItem>
            <SelectItem value="زیاد">زیاد</SelectItem>
            <SelectItem value="متوسط">متوسط</SelectItem>
            <SelectItem value="کم">کم</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Wrench} title="درخواستی یافت نشد" description="فیلترها را تغییر دهید." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id} className="gap-3 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    واحد {r.unitNumber} — {r.requesterName} — {r.category}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="line-clamp-2 text-sm leading-7 text-muted-foreground">{r.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={r.priority} />
                <span>ارائه‌دهنده: {r.providerName || "تعیین نشده"}</span>
                <span>{r.createdAt}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setDetail(r)}>مشاهده جزئیات</Button>
                {NEXT[r.status].map((n) => (
                  <Button
                    key={n.status}
                    size="sm"
                    variant={n.status === "لغو شده" ? "outline" : "default"}
                    className={n.status === "لغو شده" ? "text-destructive" : ""}
                    onClick={() => {
                      setRequestStatus(r.id, n.status, n.label);
                      toast.success(`وضعیت درخواست به «${n.status}» تغییر کرد.`);
                    }}
                  >
                    {n.status === "لغو شده" ? "لغو درخواست" : `تغییر به ${n.status}`}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto text-right sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{current?.title}</DialogTitle>
            <DialogDescription>جزئیات و روند پیگیری درخواست</DialogDescription>
          </DialogHeader>
          {current && (
            <div className="space-y-4 text-sm">
              <p className="leading-7 text-muted-foreground">{current.description}</p>
              <div className="space-y-2">
                {[
                  ["دسته", current.category],
                  ["اولویت", current.priority],
                  ["واحد", current.unitNumber],
                  ["درخواست‌دهنده", current.requesterName],
                  ["زمان پیشنهادی", current.preferredTime],
                  ["ارائه‌دهنده", current.providerName || "تعیین نشده"],
                  ["هزینه", formatToman(current.amount)],
                  ["وضعیت", current.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-3 font-semibold">روند پیگیری</p>
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

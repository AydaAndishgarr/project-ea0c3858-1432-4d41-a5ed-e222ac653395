import { createFileRoute } from "@tanstack/react-router";
import { Phone, Star, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActions, useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/manager/providers")({
  head: () => ({
    meta: [
      { title: "ارائه‌دهندگان خدمات | پنل مدیر ساختمان" },
      { name: "description", content: "فهرست ارائه‌دهندگان خدمات ساختمان با امتیاز و وضعیت همکاری." },
      { property: "og:title", content: "ارائه‌دهندگان خدمات" },
      { property: "og:description", content: "مدیریت همکاری با ارائه‌دهندگان خدمات." },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const { state } = useApp();
  const { updateProvider } = useActions();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const rows = useMemo(
    () =>
      state.providers.filter(
        (p) => (specialty === "all" || p.specialty === specialty) && (p.name.includes(search) || p.phone.includes(search)),
      ),
    [state.providers, search, specialty],
  );

  return (
    <>
      <PageHeader
        title="ارائه‌دهندگان خدمات"
        description="همکاران خدماتی ساختمان"
        breadcrumb={["پنل مدیر ساختمان", "ارائه‌دهندگان خدمات"]}
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی نام یا شماره تماس...">
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه تخصص‌ها</SelectItem>
            {["برق", "لوله‌کشی", "آسانسور", "نظافت", "تأسیسات", "اینترنت", "سایر"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Wrench} title="ارائه‌دهنده‌ای یافت نشد" description="عبارت جست‌وجو را تغییر دهید." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <Card key={p.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.specialty}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="size-4 fill-warning text-warning" />
                <span>{faDigits(p.rating)} از ۵</span>
                <span>—</span>
                <span>{faDigits(p.jobs)} کار انجام‌شده</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                <span>{p.phone}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success(`درخواست همکاری برای ${p.name} ارسال شد.`)}>
                  ارجاع کار
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateProvider(p.id, { status: p.status === "فعال" ? "غیرفعال" : "فعال" });
                    toast.success("وضعیت همکاری تغییر کرد.");
                  }}
                >
                  {p.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

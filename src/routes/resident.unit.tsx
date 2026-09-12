import { createFileRoute } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { CURRENT_BUILDING, CURRENT_RESIDENT, CURRENT_UNIT, useApp } from "@/store/app-store";
import { faDigits, formatToman } from "@/lib/format";

export const Route = createFileRoute("/resident/unit")({
  head: () => ({
    meta: [
      { title: "واحد من | پنل ساکن" },
      { name: "description", content: "اطلاعات واحد، ساکنان و وضعیت پرداخت شارژ واحد شما." },
      { property: "og:title", content: "اطلاعات واحد من" },
      { property: "og:description", content: "مشخصات واحد و ساختمان محل سکونت." },
    ],
  }),
  component: UnitPage,
});

function UnitPage() {
  const { state } = useApp();
  const unit = state.units.find((u) => u.number === CURRENT_UNIT);
  const resident = state.residents.find((r) => r.name === CURRENT_RESIDENT);
  const building = state.buildings.find((b) => b.name === CURRENT_BUILDING);
  const unitResidents = state.residents.filter((r) => r.unitNumber === CURRENT_UNIT);

  return (
    <>
      <PageHeader
        title="واحد من"
        description={`واحد ${CURRENT_UNIT} — ${CURRENT_BUILDING}`}
        breadcrumb={["پنل ساکن", "واحد من"]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="متراژ" value={`${faDigits(unit?.area ?? 0)} متر مربع`} icon={Home} />
        <StatCard title="طبقه" value={faDigits(unit?.floor ?? 0)} tone="info" />
        <StatCard
          title="وضعیت پرداخت"
          value={unit?.paymentStatus ?? "-"}
          tone={unit?.paymentStatus === "تسویه" ? "success" : "danger"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3 p-5">
          <p className="font-semibold">مشخصات واحد</p>
          {[
            ["شماره واحد", CURRENT_UNIT],
            ["طبقه", faDigits(unit?.floor ?? 0)],
            ["متراژ", `${faDigits(unit?.area ?? 0)} متر مربع`],
            ["تعداد نفرات", faDigits(unit?.peopleCount ?? 0)],
            ["وضعیت واحد", unit?.status ?? "-"],
            ["بدهی جاری", formatToman(resident?.debt ?? 0)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border pb-2 text-sm last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </Card>

        <Card className="gap-3 p-5">
          <p className="font-semibold">اطلاعات ساختمان</p>
          {[
            ["نام ساختمان", building?.name ?? CURRENT_BUILDING],
            ["آدرس", building?.address ?? "-"],
            ["نوع ساختمان", building?.type ?? "-"],
            ["تعداد واحدها", faDigits(building?.units ?? 0)],
            ["تعداد ساکنان", faDigits(building?.residents ?? 0)],
            ["مدیر ساختمان", state.managers.find((m) => m.buildingId === building?.id)?.name ?? "-"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 border-b border-border pb-2 text-sm last:border-0">
              <span className="shrink-0 text-muted-foreground">{k}</span>
              <span className="text-left font-medium">{v}</span>
            </div>
          ))}
        </Card>

        <Card className="gap-3 p-5 lg:col-span-2">
          <p className="font-semibold">ساکنان واحد</p>
          <div className="space-y-3">
            {unitResidents.map((r) => (
              <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} — {r.phone}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

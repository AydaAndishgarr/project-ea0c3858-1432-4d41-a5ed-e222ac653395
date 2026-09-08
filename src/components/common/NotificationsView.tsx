import { useState } from "react";
import { BellOff, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";
import { StatusBadge } from "./StatusBadge";
import { useActions, useApp } from "@/store/app-store";
import type { Role } from "@/data/types";
import { cn } from "@/lib/utils";

export function NotificationsView({ role, panel }: { role: Role; panel: string }) {
  const { state } = useApp();
  const { markRead, markAllRead } = useActions();
  const [tab, setTab] = useState("all");

  const list = state.notifications.filter((n) => n.audience === "all" || n.audience === role);
  const filtered = list.filter((n) => (tab === "all" ? true : tab === "unread" ? !n.read : n.read));

  return (
    <>
      <PageHeader
        title="اعلان‌ها"
        description="پیام‌های سامانه درباره پرداخت، شارژ، تعمیرات و اطلاعیه‌ها"
        breadcrumb={[panel, "اعلان‌ها"]}
        action={
          <Button
            variant="outline"
            onClick={() => {
              markAllRead();
              toast.success("همه اعلان‌ها خوانده شد.");
            }}
          >
            <CheckCheck className="size-4" />
            علامت‌گذاری همه
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="unread">خوانده‌نشده</TabsTrigger>
          <TabsTrigger value="read">خوانده‌شده</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={BellOff} title="اعلانی وجود ندارد" description="در این بخش پیامی برای نمایش نیست." />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={cn("gap-2 p-4", !n.read && "border-primary/40 bg-primary/5")}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    <StatusBadge status={n.type} />
                  </div>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{n.body}</p>
                </div>
                <div className="shrink-0 text-left">
                  <p className="text-xs text-muted-foreground">{n.date}</p>
                  {!n.read && <span className="mt-2 block text-xs text-primary">خوانده نشده</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

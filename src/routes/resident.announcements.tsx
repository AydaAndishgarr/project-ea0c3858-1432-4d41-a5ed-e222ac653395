import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/resident/announcements")({
  head: () => ({
    meta: [
      { title: "اطلاعیه‌ها | پنل ساکن | خانه یار" },
      { name: "description", content: "اطلاعیه‌های منتشرشده توسط مدیر ساختمان." },
    ],
  }),
  component: ResidentAnnouncements,
});

function ResidentAnnouncements() {
  const { state } = useApp();
  const list = [...state.announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <PageHeader
        title="اطلاعیه‌ها"
        description="اطلاع‌رسانی‌های مدیر ساختمان"
        breadcrumb={["پنل ساکن", "اطلاعیه‌ها"]}
      />

      {list.length === 0 ? (
        <EmptyState icon={Megaphone} title="اطلاعیه‌ای وجود ندارد" description="هنوز اطلاعیه‌ای منتشر نشده است." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((a) => (
            <Card key={a.id} className="gap-3 p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="font-semibold">{a.title}</p>
                {a.pinned && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    <Pin className="size-3" /> سنجاق‌شده
                  </span>
                )}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{a.body}</p>
              <p className="text-xs text-muted-foreground">
                {a.author} — {a.date}
              </p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

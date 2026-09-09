import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { rolePermissions } from "@/data/mock";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "نقش‌ها و دسترسی‌ها | پنل مدیر کل" },
      { name: "description", content: "تعریف نقش‌های کاربری سامانه و دسترسی‌های هر نقش." },
      { property: "og:title", content: "نقش‌ها و دسترسی‌ها" },
      { property: "og:description", content: "دسترسی‌های هر نقش در سامانه مدیریت ساختمان." },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  return (
    <>
      <PageHeader
        title="نقش‌ها و دسترسی‌ها"
        description="دامنه اختیارات هر نقش در سامانه"
        breadcrumb={["پنل مدیر کل", "نقش‌ها و دسترسی‌ها"]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {rolePermissions.map((r) => (
          <Card key={r.role} className="gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{r.role}</p>
                <p className="text-xs text-muted-foreground">دامنه: {r.scope}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {r.permissions.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}

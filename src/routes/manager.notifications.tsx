import { createFileRoute } from "@tanstack/react-router";
import { NotificationsView } from "@/components/common/NotificationsView";

export const Route = createFileRoute("/manager/notifications")({
  head: () => ({
    meta: [
      { title: "اعلان‌ها | پنل مدیر ساختمان" },
      { name: "description", content: "اعلان‌های مربوط به پرداخت‌ها، درخواست‌ها و رویدادهای ساختمان." },
      { property: "og:title", content: "اعلان‌های مدیر ساختمان" },
      { property: "og:description", content: "مرکز پیام‌های ساختمان." },
    ],
  }),
  component: () => <NotificationsView role="manager" panel="پنل مدیر ساختمان" />,
});

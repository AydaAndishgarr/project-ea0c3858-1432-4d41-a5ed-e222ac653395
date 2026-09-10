import { createFileRoute } from "@tanstack/react-router";
import { NotificationsView } from "@/components/common/NotificationsView";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "اعلان‌ها | پنل مدیر کل" },
      { name: "description", content: "اعلان‌های سامانه برای مدیر کل شامل وضعیت اشتراک‌ها و ساختمان‌ها." },
      { property: "og:title", content: "اعلان‌های مدیر کل" },
      { property: "og:description", content: "پیام‌های سامانه برای مدیر کل." },
    ],
  }),
  component: () => <NotificationsView role="admin" panel="پنل مدیر کل" />,
});

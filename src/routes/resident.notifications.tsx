import { createFileRoute } from "@tanstack/react-router";
import { NotificationsView } from "@/components/common/NotificationsView";

export const Route = createFileRoute("/resident/notifications")({
  head: () => ({
    meta: [
      { title: "اعلان‌ها | پنل ساکن | خانه یار" },
      { name: "description", content: "اعلان‌های مربوط به شارژ، پرداخت، تعمیرات و اطلاعیه‌های ساختمان." },
    ],
  }),
  component: () => <NotificationsView role="resident" panel="پنل ساکن" />,
});

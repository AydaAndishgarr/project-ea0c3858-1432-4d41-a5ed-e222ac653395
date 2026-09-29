import { createFileRoute } from "@tanstack/react-router";
import { NotificationsView } from "@/components/common/NotificationsView";

export const Route = createFileRoute("/provider/notifications")({
  head: () => ({
    meta: [
      { title: "اعلان‌ها | پنل ارائه‌دهنده | خانه یار" },
      { name: "description", content: "اعلان‌های مربوط به درخواست‌های خدماتی." },
    ],
  }),
  component: () => <NotificationsView role="provider" panel="پنل ارائه‌دهنده" />,
});

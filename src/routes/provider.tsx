import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/provider")({
  component: () => (
    <AppShell role="provider">
      <Outlet />
    </AppShell>
  ),
});

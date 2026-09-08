import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/resident")({
  component: () => (
    <AppShell role="resident">
      <Outlet />
    </AppShell>
  ),
});

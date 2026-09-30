import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

export const Route = createFileRoute("/resident")({
  component: () => (
    <RoleGuard role="resident">
      <AppShell role="resident">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});

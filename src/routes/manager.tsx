import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

export const Route = createFileRoute("/manager")({
  component: () => (
    <RoleGuard role="manager">
      <AppShell role="manager">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

export const Route = createFileRoute("/admin")({
  component: () => (
    <RoleGuard role="admin">
      <AppShell role="admin">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

export const Route = createFileRoute("/provider")({
  component: () => (
    <RoleGuard role="provider">
      <AppShell role="provider">
        <Outlet />
      </AppShell>
    </RoleGuard>
  ),
});

import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ROLE_HOME } from "@/lib/auth-paths";
import { useApp } from "@/store/app-store";
import type { Role } from "@/data/types";

function GateMessage({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { authReady, authUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady) return;
    if (!authUser) {
      navigate({ to: "/login" });
      return;
    }
    if (authUser.role !== role) {
      navigate({ to: ROLE_HOME[authUser.role] });
    }
  }, [authReady, authUser, navigate, role]);

  if (!authReady) {
    return <GateMessage text="در حال بررسی نشست..." />;
  }
  if (!authUser || authUser.role !== role) {
    return <GateMessage text="در حال انتقال..." />;
  }
  return children;
}

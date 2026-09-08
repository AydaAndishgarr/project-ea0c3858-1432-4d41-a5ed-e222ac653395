import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Building2, LogOut, Menu, Repeat } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminNav, managerNav, providerNav, residentNav, roleMeta } from "./nav-config";
import { useApp } from "@/store/app-store";
import type { Role } from "@/data/types";
import { cn } from "@/lib/utils";
import { faDigits } from "@/lib/format";

type NavItem = { to: string; label: string; icon: React.ElementType; exact?: boolean };

const NAVS: Record<Role, readonly NavItem[]> = {
  admin: adminNav,
  manager: managerNav,
  resident: residentNav,
  provider: providerNav,
};

function NavList({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAVS[role].map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ role }: { role: Role }) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-1">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Building2 className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-sidebar-foreground">{roleMeta[role].title}</p>
        <p className="truncate text-xs text-sidebar-foreground/70">{roleMeta[role].subtitle}</p>
      </div>
    </div>
  );
}

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const { state, setRole } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const unread = state.notifications.filter(
    (n) => !n.read && (n.audience === "all" || n.audience === role),
  ).length;

  const notifPath =
    role === "admin"
      ? "/admin/notifications"
      : role === "manager"
        ? "/manager/notifications"
        : role === "resident"
          ? "/resident/notifications"
          : "/provider";

  const exit = () => {
    setRole(null);
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 right-0 hidden w-64 flex-col border-l border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand role={role} />
        <div className="scrollbar-thin mt-6 flex-1 overflow-y-auto">
          <NavList role={role} />
        </div>
        <Button
          variant="ghost"
          onClick={exit}
          className="mt-4 justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" />
          خروج و تغییر نقش
        </Button>
      </aside>

      <div className="lg:mr-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden" aria-label="منو">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 border-sidebar-border bg-sidebar p-4">
                  <SheetHeader className="p-0">
                    <SheetTitle className="sr-only">منوی اصلی</SheetTitle>
                  </SheetHeader>
                  <Brand role={role} />
                  <div className="scrollbar-thin mt-6 flex-1 overflow-y-auto">
                    <NavList role={role} onNavigate={() => setOpen(false)} />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={exit}
                    className="justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent"
                  >
                    <LogOut className="size-4" />
                    خروج و تغییر نقش
                  </Button>
                </SheetContent>
              </Sheet>
            </div>

            <p className="min-w-0 truncate text-sm font-medium text-foreground">
              {roleMeta[role].user}
            </p>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/login">
                  <Repeat className="size-4" />
                  تغییر نقش
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild aria-label="اعلان‌ها" className="relative">
                <Link to={notifPath}>
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {faDigits(unread)}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-16">{children}</main>
      </div>
    </div>
  );
}

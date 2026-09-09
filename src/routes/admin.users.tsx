import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Toolbar } from "@/components/common/Toolbar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/store/app-store";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "کاربران | پنل مدیر کل" },
      { name: "description", content: "فهرست کاربران سامانه شامل مدیران، ساکنان و ارائه‌دهندگان خدمات." },
      { property: "og:title", content: "کاربران سامانه" },
      { property: "og:description", content: "مدیریت کاربران سامانه مدیریت ساختمان." },
    ],
  }),
  component: UsersPage,
});

const roleLabel: Record<string, string> = {
  admin: "مدیر کل",
  manager: "مدیر ساختمان",
  resident: "ساکن",
  provider: "ارائه‌دهنده خدمات",
};

function UsersPage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("name");

  const rows = useMemo(() => {
    const list = state.users.filter(
      (u) => (role === "all" || u.role === role) && (u.name.includes(search) || u.phone.includes(search)),
    );
    return [...list].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name, "fa") : a.building.localeCompare(b.building, "fa"),
    );
  }, [state.users, search, role, sort]);

  return (
    <>
      <PageHeader
        title="کاربران"
        description="همه کاربران ثبت‌شده در سامانه"
        breadcrumb={["پنل مدیر کل", "کاربران"]}
      />

      <Toolbar search={search} onSearch={setSearch} placeholder="جست‌وجوی نام یا شماره تماس...">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="نقش" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه نقش‌ها</SelectItem>
            {Object.entries(roleLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="مرتب‌سازی" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">مرتب‌سازی بر اساس نام</SelectItem>
            <SelectItem value="building">مرتب‌سازی بر اساس ساختمان</SelectItem>
          </SelectContent>
        </Select>
      </Toolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title="کاربری یافت نشد" description="فیلترها را تغییر دهید." />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">نام</TableHead>
                    <TableHead className="text-right">شماره تماس</TableHead>
                    <TableHead className="text-right">نقش</TableHead>
                    <TableHead className="text-right">ساختمان</TableHead>
                    <TableHead className="text-right">آخرین فعالیت</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{roleLabel[u.role]}</TableCell>
                      <TableCell className="text-muted-foreground">{u.building}</TableCell>
                      <TableCell>{u.lastSeen}</TableCell>
                      <TableCell><StatusBadge status={u.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="space-y-3 md:hidden">
            {rows.map((u) => (
              <Card key={u.id} className="gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-medium">{u.name}</p>
                  <StatusBadge status={u.status} />
                </div>
                <p className="text-sm text-muted-foreground">{roleLabel[u.role]} — {u.building}</p>
                <p className="text-sm text-muted-foreground">{u.phone}</p>
                <p className="text-xs text-muted-foreground">آخرین فعالیت: {u.lastSeen}</p>
              </Card>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            نمایش {faDigits(rows.length)} کاربر
          </p>
        </>
      )}
    </>
  );
}

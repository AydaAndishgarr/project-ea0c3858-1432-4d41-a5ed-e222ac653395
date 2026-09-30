import type { Role } from "@/data/types";

export const ROLE_HOME: Record<Role, "/admin" | "/manager" | "/resident" | "/provider"> = {
  admin: "/admin",
  manager: "/manager",
  resident: "/resident",
  provider: "/provider",
};

const ROLES: Role[] = ["admin", "manager", "resident", "provider"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

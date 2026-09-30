import type { Role } from "@/data/types";
import { isRole } from "@/lib/auth-paths";
import { apiSend } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: Role;
}

function asAuthUser(value: unknown): AuthUser {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid user payload");
  }
  const user = value as Record<string, unknown>;
  if (
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    typeof user.fullName !== "string" ||
    !isRole(user.role)
  ) {
    throw new Error("Invalid user payload");
  }
  return {
    id: user.id,
    email: user.email,
    phone: typeof user.phone === "string" ? user.phone : "",
    fullName: user.fullName,
    role: user.role,
  };
}

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  const user = await apiSend<unknown>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return asAuthUser(user);
}

export async function meRequest(): Promise<AuthUser> {
  const user = await apiSend<unknown>("/auth/me");
  return asAuthUser(user);
}

export async function logoutRequest(): Promise<void> {
  await apiSend("/auth/logout", { method: "POST" });
}

import type { AdminRole } from "./auth.js";

export type Permission =
  | "dashboard.view"
  | "content.read"
  | "content.write"
  | "submissions.read"
  | "submissions.write"
  | "users.read"
  | "users.write"
  | "settings.read"
  | "settings.write"
  | "audit.read"
  | "media.write";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    "dashboard.view",
    "content.read",
    "content.write",
    "submissions.read",
    "submissions.write",
    "users.read",
    "users.write",
    "settings.read",
    "settings.write",
    "audit.read",
    "media.write",
  ],
  administrator: [
    "dashboard.view",
    "content.read",
    "content.write",
    "submissions.read",
    "submissions.write",
    "settings.read",
    "settings.write",
    "audit.read",
    "media.write",
  ],
  content_editor: [
    "dashboard.view",
    "content.read",
    "content.write",
    "media.write",
  ],
};

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: AdminRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Insufficient permissions: ${permission}`);
  }
}
